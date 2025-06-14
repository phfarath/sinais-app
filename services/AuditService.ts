import { EncryptionService } from './EncryptionService';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class AuditService {
  private static logs: AuditLog[] = [];
  private static readonly MAX_LOGS = 10000; // Limitar logs em memória

  /**
   * Registra uma ação para auditoria
   * @param action Ação realizada
   * @param resourceType Tipo de recurso afetado
   * @param userId ID do usuário
   * @param metadata Dados adicionais
   * @param riskLevel Nível de risco da ação
   */
  static logAction(
    action: string, 
    resourceType: string, 
    userId: string, 
    metadata?: any,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
  ): void {
    const log: AuditLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userId,
      action,
      resourceType,
      timestamp: new Date(),
      metadata,
      riskLevel
    };
    
    this.logs.push(log);
    
    // Manter apenas os logs mais recentes
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }
    
    this.persistLog(log);
    
    // Log crítico para ações de alto risco
    if (riskLevel === 'HIGH') {
      console.warn('AÇÃO DE ALTO RISCO DETECTADA:', log);
    }
  }

  /**
   * Persiste o log de forma segura
   * @param log Log a ser persistido
   */
  private static async persistLog(log: AuditLog): Promise<void> {
    try {      // Criptografar dados sensíveis do log
      const encryptedLog = {
        ...log,
        metadata: log.metadata ? EncryptionService.encryptData(JSON.stringify(log.metadata)) : undefined
      };
      
      // Em produção, enviaria para servidor seguro
      console.log('Audit Log:', {
        id: log.id,
        action: log.action,
        timestamp: log.timestamp,
        riskLevel: log.riskLevel
      });
      
      // Armazenar localmente de forma segura
      const existingLogs = await EncryptionService.secureRetrieve('audit_logs') || '[]';
      const logs = JSON.parse(existingLogs);
      logs.push(encryptedLog);
      
      // Manter apenas os últimos 1000 logs localmente
      const recentLogs = logs.slice(-1000);
      await EncryptionService.secureStore('audit_logs', JSON.stringify(recentLogs));
      
    } catch (error) {
      console.error('Erro ao persistir log de auditoria:', error);
    }
  }

  /**
   * Recupera logs filtrados
   * @param userId ID do usuário (opcional)
   * @param action Ação específica (opcional)
   * @param riskLevel Nível de risco (opcional)
   * @returns Lista de logs filtrados
   */
  static getLogs(
    userId?: string, 
    action?: string, 
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
  ): AuditLog[] {
    let filteredLogs = [...this.logs];
    
    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === userId);
    }
    
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }
    
    if (riskLevel) {
      filteredLogs = filteredLogs.filter(log => log.riskLevel === riskLevel);
    }
    
    return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Recupera logs armazenados localmente
   * @returns Logs persistidos
   */
  static async getPersistedLogs(): Promise<AuditLog[]> {
    try {
      const encryptedLogs = await EncryptionService.secureRetrieve('audit_logs');
      if (!encryptedLogs) return [];
      
      const logs = JSON.parse(encryptedLogs);
      return logs.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp),
        metadata: log.metadata ? EncryptionService.decryptData(log.metadata) : undefined
      }));
    } catch (error) {
      console.error('Erro ao recuperar logs persistidos:', error);
      return [];
    }
  }

  /**
   * Gera relatório de auditoria
   * @param startDate Data inicial
   * @param endDate Data final
   * @returns Relatório de auditoria
   */
  static generateAuditReport(startDate: Date, endDate: Date) {
    const logs = this.logs.filter(log => 
      log.timestamp >= startDate && log.timestamp <= endDate
    );
    
    const totalActions = logs.length;
    const highRiskActions = logs.filter(log => log.riskLevel === 'HIGH').length;
    const actionsByType = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      period: { startDate, endDate },
      totalActions,
      highRiskActions,
      riskPercentage: totalActions > 0 ? (highRiskActions / totalActions) * 100 : 0,
      actionsByType,
      logs: logs.slice(0, 100) // Primeiros 100 logs para análise
    };
  }

  /**
   * Limpa logs antigos (manutenção)
   * @param daysToKeep Dias para manter os logs
   */
  static cleanupOldLogs(daysToKeep: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    this.logs = this.logs.filter(log => log.timestamp > cutoffDate);
    
    console.log(`Limpeza de logs concluída. Logs mantidos: ${this.logs.length}`);
  }
}
