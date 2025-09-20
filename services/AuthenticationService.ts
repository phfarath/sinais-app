import { AuditService } from './AuditService';
import * as LocalAuthentication from 'expo-local-authentication';

export interface AuthResult {
  success: boolean;
  method?: 'password' | 'biometric' | 'mfa';
  token?: string;
  expiresAt?: Date;
  error?: string;
}

export interface MFASetup {
  enabled: boolean;
  methods: ('sms' | 'email' | 'authenticator')[];
  backupCodes: string[];
}

export class AuthenticationService {
  private static authTokens: Map<string, { token: string; expiresAt: Date }> = new Map();
  private static loginAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

  /**
   * Autentica usuário com verificação de segurança
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Resultado da autenticação
   */
  static async authenticateUser(email: string, password: string): Promise<AuthResult> {
    try {
      // Verificar se o usuário está bloqueado
      if (this.isUserLockedOut(email)) {
        AuditService.logAction('LOGIN_BLOCKED', 'AUTHENTICATION', email, 
          { reason: 'User locked out' }, 'HIGH');
        return { 
          success: false, 
          error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' 
        };
      }

      // Simular verificação de credenciais (em produção, usar hash seguro)
      const isValidCredentials = await this.validateCredentials(email, password);
      
      if (!isValidCredentials) {
        this.recordFailedAttempt(email);
        AuditService.logAction('LOGIN_FAILED', 'AUTHENTICATION', email, 
          { reason: 'Invalid credentials' }, 'MEDIUM');
        return { 
          success: false, 
          error: 'Credenciais inválidas.' 
        };
      }

      // Reset tentativas de login após sucesso
      this.loginAttempts.delete(email);

      // Gerar token de sessão
      const token = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
      
      this.authTokens.set(email, { token, expiresAt });

      AuditService.logAction('LOGIN_SUCCESS', 'AUTHENTICATION', email, 
        { method: 'password' }, 'LOW');

      return {
        success: true,
        method: 'password',
        token,
        expiresAt
      };

    } catch (error) {
      AuditService.logAction('LOGIN_ERROR', 'AUTHENTICATION', email, 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
      return { 
        success: false, 
        error: 'Erro interno de autenticação.' 
      };
    }
  }

  /**
   * Autentica usando biometria
   * @param userId ID do usuário
   * @returns Resultado da autenticação biométrica
   */
  static async authenticateWithBiometrics(userId: string): Promise<AuthResult> {
    try {
      // Verificar se biometria está disponível
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return { 
          success: false, 
          error: 'Biometria não está configurada neste dispositivo.' 
        };
      }

      // Solicitar autenticação biométrica
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para acessar o SINAIS',
        fallbackLabel: 'Usar senha',
        cancelLabel: 'Cancelar'
      });

      if (result.success) {
        const token = this.generateSessionToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        this.authTokens.set(userId, { token, expiresAt });

        AuditService.logAction('LOGIN_SUCCESS', 'AUTHENTICATION', userId, 
          { method: 'biometric' }, 'LOW');

        return {
          success: true,
          method: 'biometric',
          token,
          expiresAt
        };
      } else {
        AuditService.logAction('BIOMETRIC_AUTH_FAILED', 'AUTHENTICATION', userId, 
          { reason: result.error }, 'MEDIUM');
        return { 
          success: false, 
          error: 'Autenticação biométrica falhou.' 
        };
      }

    } catch (error) {
      AuditService.logAction('BIOMETRIC_AUTH_ERROR', 'AUTHENTICATION', userId, 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
      return { 
        success: false, 
        error: 'Erro na autenticação biométrica.' 
      };
    }
  }

  /**
   * Verifica código MFA
   * @param userId ID do usuário
   * @param code Código MFA fornecido
   * @param method Método MFA usado
   * @returns Resultado da verificação MFA
   */
  static async verifyMFA(userId: string, code: string, method: 'sms' | 'email' | 'authenticator'): Promise<AuthResult> {
    try {
      // Simular verificação do código MFA
      const isValidCode = await this.validateMFACode(userId, code, method);
      
      if (!isValidCode) {
        AuditService.logAction('MFA_FAILED', 'AUTHENTICATION', userId, 
          { method, code: '***' }, 'MEDIUM');
        return { 
          success: false, 
          error: 'Código MFA inválido.' 
        };
      }

      const token = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      this.authTokens.set(userId, { token, expiresAt });

      AuditService.logAction('MFA_SUCCESS', 'AUTHENTICATION', userId, 
        { method }, 'LOW');

      return {
        success: true,
        method: 'mfa',
        token,
        expiresAt
      };

    } catch (error) {
      AuditService.logAction('MFA_ERROR', 'AUTHENTICATION', userId, 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
      return { 
        success: false, 
        error: 'Erro na verificação MFA.' 
      };
    }
  }

  /**
   * Valida token de sessão
   * @param token Token a ser validado
   * @returns true se o token é válido
   */
  static validateToken(token: string): boolean {
    const now = new Date();
    
    for (const [userId, session] of this.authTokens.entries()) {
      if (session.token === token) {
        if (session.expiresAt > now) {
          return true;
        } else {
          // Token expirado, remover
          this.authTokens.delete(userId);
          AuditService.logAction('TOKEN_EXPIRED', 'AUTHENTICATION', userId, {}, 'LOW');
          return false;
        }
      }
    }
    
    return false;
  }

  /**
   * Faz logout do usuário
   * @param userId ID do usuário
   */
  static logout(userId: string): void {
    this.authTokens.delete(userId);
    AuditService.logAction('LOGOUT', 'AUTHENTICATION', userId, {}, 'LOW');
  }

  /**
   * Configura MFA para um usuário
   * @param userId ID do usuário
   * @param methods Métodos MFA a serem habilitados
   * @returns Setup do MFA
   */
  static async setupMFA(userId: string, methods: ('sms' | 'email' | 'authenticator')[]): Promise<MFASetup> {
    // Gerar códigos de backup
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );

    const setup: MFASetup = {
      enabled: true,
      methods,
      backupCodes
    };

    AuditService.logAction('MFA_SETUP', 'SECURITY', userId, 
      { methods, backupCodesGenerated: backupCodes.length }, 'MEDIUM');

    return setup;
  }

  /**
   * Verifica se usuário está bloqueado por tentativas excessivas
   * @param email Email do usuário
   * @returns true se está bloqueado
   */
  private static isUserLockedOut(email: string): boolean {
    const attempts = this.loginAttempts.get(email);
    if (!attempts) return false;

    const now = new Date();
    const timeSinceLastAttempt = now.getTime() - attempts.lastAttempt.getTime();

    if (timeSinceLastAttempt > this.LOCKOUT_DURATION) {
      // Lockout expirou, remover registro
      this.loginAttempts.delete(email);
      return false;
    }

    return attempts.count >= this.MAX_LOGIN_ATTEMPTS;
  }

  /**
   * Registra tentativa de login falhada
   * @param email Email do usuário
   */
  private static recordFailedAttempt(email: string): void {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: new Date() };
    attempts.count++;
    attempts.lastAttempt = new Date();
    this.loginAttempts.set(email, attempts);
  }

  /**
   * Valida credenciais do usuário
   * @param email Email
   * @param password Senha
   * @returns true se válidas
   */
  private static async validateCredentials(email: string, password: string): Promise<boolean> {
    // Em produção, comparar com hash armazenado de forma segura
    // Simulação para demo
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular latência de verificação
    return email === 'usuario@exemplo.com' && password === 'senha123';
  }

  /**
   * Valida código MFA
   * @param userId ID do usuário
   * @param code Código fornecido
   * @param method Método MFA
   * @returns true se válido
   */
  private static async validateMFACode(userId: string, code: string, method: string): Promise<boolean> {
    // Simulação para demo - em produção, verificar com serviço MFA
    await new Promise(resolve => setTimeout(resolve, 500));
    return code === '123456'; // Código de teste
  }

  /**
   * Gera token de sessão seguro
   * @returns Token único
   */
  private static generateSessionToken(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Força logout de todas as sessões de um usuário
   * @param userId ID do usuário
   */
  static forceLogoutAllSessions(userId: string): void {
    this.authTokens.delete(userId);
    AuditService.logAction('FORCE_LOGOUT_ALL', 'SECURITY', userId, 
      { reason: 'Security measure' }, 'HIGH');
  }

  /**
   * Obtém informações de sessão ativa
   * @param userId ID do usuário
   * @returns Informações da sessão ou null
   */
  static getActiveSession(userId: string): { token: string; expiresAt: Date } | null {
    const session = this.authTokens.get(userId);
    if (session && session.expiresAt > new Date()) {
      return session;
    }
    return null;
  }
}
