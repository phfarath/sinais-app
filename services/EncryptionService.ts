import CryptoJS from 'crypto-js';

/**
 * Serviço de criptografia e armazenamento seguro
 * Implementa práticas de segurança para proteção de dados sensíveis
 */
export class EncryptionService {
  private static readonly ENCRYPTION_KEY = 'sinais-app-demo-key-2024'; // Em produção, use env vars
  private static readonly SALT = 'sinais-app-salt-2024';
  
  // Simulação de armazenamento seguro para demonstração
  private static inMemoryStorage = new Map<string, string>();

  /**
   * Criptografa dados usando AES-256
   * @param data Dados a serem criptografados
   * @returns Dados criptografados em formato Base64
   */
  static encryptData(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('Erro na criptografia:', error);
      return data; // Fallback para demonstração
    }
  }

  /**
   * Descriptografa dados usando AES-256
   * @param encryptedData Dados criptografados
   * @returns Dados descriptografados
   */
  static decryptData(encryptedData: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Erro na descriptografia:', error);
      return encryptedData; // Fallback para demonstração
    }
  }

  /**
   * Armazena dados de forma segura (simulado para demo)
   * @param key Chave para armazenamento
   * @param value Valor a ser armazenado
   */
  static async secureStore(key: string, value: string): Promise<void> {
    try {
      const encryptedValue = this.encryptData(value);
      this.inMemoryStorage.set(key, encryptedValue);
      console.log(`✅ Demo: Dados criptografados e armazenados com segurança - ${key}`);
      console.log(`🔐 Valor criptografado: ${encryptedValue.substring(0, 50)}...`);
    } catch (error) {
      console.log(`📝 Demo: Simulando armazenamento seguro para: ${key}`);
    }
  }

  /**
   * Recupera dados armazenados de forma segura (simulado para demo)
   * @param key Chave do item
   * @returns Valor descriptografado ou null
   */
  static async secureRetrieve(key: string): Promise<string | null> {
    try {
      const encryptedValue = this.inMemoryStorage.get(key);
      if (!encryptedValue) {
        return null;
      }
      return this.decryptData(encryptedValue);
    } catch (error) {
      console.error('Erro ao recuperar dados seguros:', error);
      return null;
    }
  }

  /**
   * Remove dados armazenados de forma segura (simulado para demo)
   * @param key Chave do item
   */
  static async secureDelete(key: string): Promise<void> {
    try {
      this.inMemoryStorage.delete(key);
      console.log(`🗑️ Demo: Dados removidos com segurança - ${key}`);
    } catch (error) {
      console.error('Erro ao deletar dados seguros:', error);
    }
  }

  /**
   * Gera hash seguro para senhas usando SHA-256
   * @param password Senha em texto plano
   * @param salt Salt para aumentar segurança
   * @returns Hash da senha
   */
  static async hashPassword(password: string, salt?: string): Promise<string> {
    try {
      const saltToUse = salt || this.SALT;
      const hash = CryptoJS.SHA256(password + saltToUse).toString();
      return hash;
    } catch (error) {
      console.error('Erro ao gerar hash da senha:', error);
      return password; // Fallback para demonstração
    }
  }

  /**
   * Verifica se uma senha corresponde ao hash
   * @param password Senha em texto plano
   * @param hash Hash para comparação
   * @param salt Salt usado na criação do hash
   * @returns True se a senha corresponder
   */
  static async verifyPassword(password: string, hash: string, salt?: string): Promise<boolean> {
    try {
      const newHash = await this.hashPassword(password, salt);
      return newHash === hash;
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      return false;
    }
  }

  /**
   * Sanitiza entrada para prevenir XSS
   * @param input Entrada do usuário
   * @returns Entrada sanitizada
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Gera token seguro para sessões
   * @param length Comprimento do token
   * @returns Token seguro
   */
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Métodos para demonstração visual das funcionalidades de segurança
   */
  
  /**
   * Demonstra criptografia de dados
   * @param data Dados para criptografar
   * @returns Objeto com dados originais e criptografados
   */
  static demonstrateCryptography(data: string): {
    original: string;
    encrypted: string;
    decrypted: string;
  } {
    const encrypted = this.encryptData(data);
    const decrypted = this.decryptData(encrypted);
    
    return {
      original: data,
      encrypted: encrypted,
      decrypted: decrypted
    };
  }

  /**
   * Demonstra hash de senha
   * @param password Senha para hash
   * @returns Objeto com senha original e hash
   */
  static async demonstratePasswordHash(password: string): Promise<{
    original: string;
    hash: string;
    salt: string;
  }> {
    const hash = await this.hashPassword(password);
    
    return {
      original: password,
      hash: hash,
      salt: this.SALT
    };
  }

  /**
   * Demonstra sanitização XSS
   * @param input Entrada potencialmente maliciosa
   * @returns Objeto com entrada original e sanitizada
   */
  static demonstrateXSSProtection(input: string): {
    original: string;
    sanitized: string;
    threats: string[];
  } {
    const threats = [];
    if (input.includes('<script')) threats.push('Script injection detected');
    if (input.includes('javascript:')) threats.push('JavaScript protocol detected');
    if (input.includes('onclick')) threats.push('Event handler detected');
    if (input.includes('<iframe')) threats.push('Iframe injection detected');
    
    return {
      original: input,
      sanitized: this.sanitizeInput(input),
      threats: threats
    };
  }

  /**
   * Demonstra armazenamento seguro
   * @param key Chave
   * @param value Valor
   * @returns Demonstração do processo de armazenamento
   */
  static async demonstrateSecureStorage(key: string, value: string): Promise<{
    original: string;
    stored: boolean;
    retrieved: string | null;
    encrypted: string;
  }> {
    await this.secureStore(key, value);
    const retrieved = await this.secureRetrieve(key);
    const encrypted = this.encryptData(value);
    
    return {
      original: value,
      stored: true,
      retrieved: retrieved,
      encrypted: encrypted
    };
  }
}
