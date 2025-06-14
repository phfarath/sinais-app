import { AuditService } from './AuditService';

export class DataSanitizer {
  /**
   * Sanitiza entrada do usuário removendo scripts maliciosos
   * @param input String de entrada
   * @returns String sanitizada
   */
  static sanitizeUserInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      // Remove scripts e tags HTML perigosas
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      // Remove caracteres perigosos
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      // Remove espaços em excesso
      .trim()
      // Limita tamanho
      .substring(0, 10000);
  }

  /**
   * Valida estrutura de evento de aposta
   * @param event Evento a ser validado
   * @returns true se válido
   */
  static validateBettingEvent(event: any): boolean {
    try {
      const required = ['amount', 'gameType', 'timestamp'];
      
      // Verificar campos obrigatórios
      const hasRequired = required.every(field => event.hasOwnProperty(field));
      if (!hasRequired) {
        AuditService.logAction('VALIDATION_FAILED', 'BETTING_EVENT', 'system', 
          { reason: 'Missing required fields', event }, 'MEDIUM');
        return false;
      }
      
      // Validar tipos e valores
      if (typeof event.amount !== 'number' || event.amount < 0 || event.amount > 100000) {
        AuditService.logAction('VALIDATION_FAILED', 'BETTING_EVENT', 'system', 
          { reason: 'Invalid amount', amount: event.amount }, 'HIGH');
        return false;
      }
      
      if (typeof event.gameType !== 'string' || event.gameType.length === 0 || event.gameType.length > 100) {
        AuditService.logAction('VALIDATION_FAILED', 'BETTING_EVENT', 'system', 
          { reason: 'Invalid gameType', gameType: event.gameType }, 'MEDIUM');
        return false;
      }
      
      // Validar timestamp
      const timestamp = new Date(event.timestamp);
      if (isNaN(timestamp.getTime()) || timestamp > new Date()) {
        AuditService.logAction('VALIDATION_FAILED', 'BETTING_EVENT', 'system', 
          { reason: 'Invalid timestamp', timestamp: event.timestamp }, 'MEDIUM');
        return false;
      }
      
      return true;    } catch (error) {
      AuditService.logAction('VALIDATION_ERROR', 'BETTING_EVENT', 'system', 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
      return false;
    }
  }

  /**
   * Sanitiza transação bancária
   * @param transaction Transação a ser sanitizada
   * @returns Transação sanitizada
   */
  static sanitizeBankTransaction(transaction: any): any {
    try {
      return {
        id: this.sanitizeUserInput(transaction.id || ''),
        amount: Math.abs(Number(transaction.amount)) || 0,
        description: this.sanitizeUserInput(transaction.description || ''),
        date: new Date(transaction.date || new Date()),
        category: this.sanitizeUserInput(transaction.category || 'other')
      };    } catch (error) {
      AuditService.logAction('SANITIZATION_ERROR', 'BANK_TRANSACTION', 'system', 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
      throw new Error('Falha na sanitização da transação');
    }
  }

  /**
   * Valida dados de entrada do usuário
   * @param data Dados a serem validados
   * @param schema Schema de validação
   * @returns true se válido
   */
  static validateUserData(data: any, schema: ValidationSchema): ValidationResult {
    const errors: string[] = [];
    
    try {
      for (const [field, rules] of Object.entries(schema)) {
        const value = data[field];
        
        // Campo obrigatório
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`Campo ${field} é obrigatório`);
          continue;
        }
        
        // Validar tipo
        if (value !== undefined && rules.type && typeof value !== rules.type) {
          errors.push(`Campo ${field} deve ser do tipo ${rules.type}`);
        }
        
        // Validar tamanho mínimo
        if (value && rules.minLength && value.length < rules.minLength) {
          errors.push(`Campo ${field} deve ter pelo menos ${rules.minLength} caracteres`);
        }
        
        // Validar tamanho máximo
        if (value && rules.maxLength && value.length > rules.maxLength) {
          errors.push(`Campo ${field} deve ter no máximo ${rules.maxLength} caracteres`);
        }
        
        // Validar valor mínimo
        if (value !== undefined && rules.min && value < rules.min) {
          errors.push(`Campo ${field} deve ser maior que ${rules.min}`);
        }
        
        // Validar valor máximo
        if (value !== undefined && rules.max && value > rules.max) {
          errors.push(`Campo ${field} deve ser menor que ${rules.max}`);
        }
        
        // Validar padrão regex
        if (value && rules.pattern && !rules.pattern.test(value)) {
          errors.push(`Campo ${field} não atende ao padrão exigido`);
        }
      }
      
      const isValid = errors.length === 0;
      
      if (!isValid) {
        AuditService.logAction('DATA_VALIDATION_FAILED', 'USER_INPUT', 'system', 
          { errors, fieldCount: Object.keys(schema).length }, 'MEDIUM');
      }
      
      return { isValid, errors };
        } catch (error) {
      AuditService.logAction('VALIDATION_ERROR', 'USER_INPUT', 'system', 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
      return { isValid: false, errors: ['Erro interno de validação'] };
    }
  }

  /**
   * Remove dados pessoais sensíveis para logs
   * @param data Dados a serem anonimizados
   * @returns Dados anonimizados
   */
  static anonymizeForLogging(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    const sensitiveFields = ['password', 'email', 'phone', 'cpf', 'credit_card', 'token'];
    const anonymized = { ...data };
    
    for (const field of sensitiveFields) {
      if (anonymized[field]) {
        anonymized[field] = '***REDACTED***';
      }
    }
    
    return anonymized;
  }
}

export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
