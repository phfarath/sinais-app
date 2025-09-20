import { AuditService } from './AuditService';
import { EncryptionService } from './EncryptionService';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export interface RateLimitInfo {
  attempts: number;
  lastAttempt: Date;
  blocked: boolean;
}

export class ApiService {
  private static readonly API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://api.sinais-app.com';
  private static authToken: string | null = null;
  private static rateLimits: Map<string, RateLimitInfo> = new Map();
  private static readonly MAX_REQUESTS_PER_MINUTE = 60;
  private static readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto

  /**
   * Define o token de autenticação
   * @param token Token JWT
   */
  static setAuthToken(token: string): void {
    this.authToken = token;
    AuditService.logAction('API_TOKEN_SET', 'AUTHENTICATION', 'user-id', {}, 'LOW');
  }

  /**
   * Remove o token de autenticação
   */
  static clearAuthToken(): void {
    this.authToken = null;
    AuditService.logAction('API_TOKEN_CLEARED', 'AUTHENTICATION', 'user-id', {}, 'LOW');
  }

  /**
   * Verifica rate limiting
   * @param identifier Identificador único (IP, user ID, etc.)
   * @returns true se a requisição é permitida
   */
  private static checkRateLimit(identifier: string): boolean {
    const now = new Date();
    const rateLimitInfo = this.rateLimits.get(identifier);

    if (!rateLimitInfo) {
      this.rateLimits.set(identifier, {
        attempts: 1,
        lastAttempt: now,
        blocked: false
      });
      return true;
    }

    // Reset counter se passou da janela de tempo
    if (now.getTime() - rateLimitInfo.lastAttempt.getTime() > this.RATE_LIMIT_WINDOW) {
      rateLimitInfo.attempts = 1;
      rateLimitInfo.lastAttempt = now;
      rateLimitInfo.blocked = false;
      return true;
    }

    // Incrementar tentativas
    rateLimitInfo.attempts++;
    rateLimitInfo.lastAttempt = now;

    // Verificar se excedeu o limite
    if (rateLimitInfo.attempts > this.MAX_REQUESTS_PER_MINUTE) {
      rateLimitInfo.blocked = true;
      AuditService.logAction('API_RATE_LIMIT_EXCEEDED', 'SECURITY', identifier, {
        attempts: rateLimitInfo.attempts,
        window: this.RATE_LIMIT_WINDOW
      }, 'HIGH');
      return false;
    }

    return true;
  }

  /**
   * Executa requisição segura
   * @param endpoint Endpoint da API
   * @param options Opções da requisição
   * @param userIdentifier Identificador do usuário para rate limiting
   * @returns Resposta da API
   */
  static async secureRequest<T = any>(
    endpoint: string, 
    options: RequestInit = {},
    userIdentifier: string = 'anonymous'
  ): Promise<ApiResponse<T>> {
    const requestId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const startTime = Date.now();

    try {
      // Verificar rate limiting
      if (!this.checkRateLimit(userIdentifier)) {
        return {
          success: false,
          error: 'Rate limit exceeded. Tente novamente em alguns minutos.',
          status: 429
        };
      }

      // Preparar headers seguros
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Version': '1.0',
        'X-Request-ID': requestId,
        'X-Client-Version': '1.0.0',
        'User-Agent': 'SinaisApp/1.0.0',
        ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
        ...options.headers
      };

      // Criptografar dados sensíveis se necessário
      let body = options.body;
      if (body && typeof body === 'string') {
        try {
          const jsonBody = JSON.parse(body);
          if (this.containsSensitiveData(jsonBody)) {
            // Criptografar campos sensíveis
            jsonBody.encrypted = true;
            jsonBody.data = EncryptionService.encryptData(jsonBody.data);
            body = JSON.stringify(jsonBody);
          }
        } catch {
          // Body não é JSON, manter como está
        }
      }

      // Log da requisição
      AuditService.logAction('API_REQUEST_STARTED', 'HTTP_REQUEST', userIdentifier, {
        endpoint,
        method: options.method || 'GET',
        requestId,
        hasAuth: !!this.authToken
      }, 'LOW');      // Implementar timeout manual
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${this.API_BASE}${endpoint}`, {
        ...options,
        headers,
        body,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseTime = Date.now() - startTime;
      let responseData: T;

      try {
        const textResponse = await response.text();
        responseData = textResponse ? JSON.parse(textResponse) : null;

        // Descriptografar resposta se necessário
        if (responseData && 
            (responseData as any).encrypted === true && 
            typeof (responseData as any).data === 'string') {
          // Assuming EncryptionService.decryptData returns a JSON string representation of T
          const decryptedJsonString: string = EncryptionService.decryptData((responseData as any).data);
          responseData = JSON.parse(decryptedJsonString) as T;
        }
        // If the structure doesn't match the expected encrypted envelope 
        // (e.g., .data is not a string, or not encrypted true),
        // responseData keeps its value from JSON.parse(textResponse). 
        // This implies that value is already T or needs to be handled by the existing T typing.
      } catch (parseError) {
        AuditService.logAction('API_RESPONSE_PARSE_ERROR', 'HTTP_REQUEST', userIdentifier, {
          endpoint,
          requestId,
          error: parseError instanceof Error ? parseError.message : 'Parse error'
        }, 'MEDIUM');
        
        return {
          success: false,
          error: 'Erro ao processar resposta do servidor',
          status: response.status
        };
      }

      // Log da resposta
      AuditService.logAction('API_REQUEST_COMPLETED', 'HTTP_REQUEST', userIdentifier, {
        endpoint,
        method: options.method || 'GET',
        status: response.status,
        responseTime,
        requestId
      }, response.ok ? 'LOW' : 'MEDIUM');

      if (!response.ok) {
        // Log de erro HTTP
        AuditService.logAction('API_HTTP_ERROR', 'HTTP_REQUEST', userIdentifier, {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          requestId
        }, 'HIGH');

        return {
          success: false,
          error: this.getErrorMessage(response.status),
          status: response.status,
          data: responseData
        };
      }

      return {
        success: true,
        data: responseData,
        status: response.status
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      AuditService.logAction('API_REQUEST_ERROR', 'HTTP_REQUEST', userIdentifier, {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
        requestId
      }, 'HIGH');

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
        status: 0
      };
    }
  }

  /**
   * Verifica se os dados contêm informações sensíveis
   * @param data Dados a serem verificados
   * @returns true se contém dados sensíveis
   */
  private static containsSensitiveData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;

    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'credit_card', 
      'ssn', 'cpf', 'bank_account', 'pin', 'cvv'
    ];

    const dataString = JSON.stringify(data).toLowerCase();
    return sensitiveFields.some(field => dataString.includes(field));
  }

  /**
   * Retorna mensagem de erro amigável baseada no status HTTP
   * @param status Status HTTP
   * @returns Mensagem de erro
   */
  private static getErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Dados inválidos enviados para o servidor';
      case 401:
        return 'Não autorizado. Faça login novamente';
      case 403:
        return 'Acesso negado para este recurso';
      case 404:
        return 'Recurso não encontrado';
      case 429:
        return 'Muitas requisições. Tente novamente em alguns minutos';
      case 500:
        return 'Erro interno do servidor';
      case 502:
        return 'Servidor temporariamente indisponível';
      case 503:
        return 'Serviço em manutenção';
      default:
        return `Erro HTTP ${status}`;
    }
  }

  /**
   * Métodos de conveniência para requisições comuns
   */
  static async get<T = any>(endpoint: string, userIdentifier?: string): Promise<ApiResponse<T>> {
    return this.secureRequest<T>(endpoint, { method: 'GET' }, userIdentifier);
  }

  static async post<T = any>(endpoint: string, data: any, userIdentifier?: string): Promise<ApiResponse<T>> {
    return this.secureRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }, userIdentifier);
  }

  static async put<T = any>(endpoint: string, data: any, userIdentifier?: string): Promise<ApiResponse<T>> {
    return this.secureRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, userIdentifier);
  }

  static async delete<T = any>(endpoint: string, userIdentifier?: string): Promise<ApiResponse<T>> {
    return this.secureRequest<T>(endpoint, { method: 'DELETE' }, userIdentifier);
  }

  /**
   * Limpa cache de rate limiting
   */
  static clearRateLimitCache(): void {
    this.rateLimits.clear();
    AuditService.logAction('API_RATE_LIMIT_CACHE_CLEARED', 'MAINTENANCE', 'system', {}, 'LOW');
  }

  /**
   * Obtém estatísticas de uso da API
   */
  static getApiUsageStats(): {
    totalRequests: number;
    blockedRequests: number;
    averageResponseTime: number;
  } {
    const logs = AuditService.getLogs(undefined, 'API_REQUEST_COMPLETED');
    const blockedLogs = AuditService.getLogs(undefined, 'API_RATE_LIMIT_EXCEEDED');
    
    const responseTimes = logs
      .map(log => log.metadata?.responseTime)
      .filter(time => typeof time === 'number');
    
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;

    return {
      totalRequests: logs.length,
      blockedRequests: blockedLogs.length,
      averageResponseTime
    };
  }
}
