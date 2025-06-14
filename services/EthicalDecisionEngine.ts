import { AuditService } from './AuditService';

export interface UserConsent {
  basicProfile: boolean;
  bettingBehavior: boolean;
  financialData: boolean;
  location: boolean;
  deviceInfo: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: Date;
}

export interface UserPreferences {
  quietStart: string; // HH:MM format
  quietEnd: string;   // HH:MM format
  maxDailyNotifications: number;
  allowCriticalAlerts: boolean;
  dataRetentionDays: number;
}

export class EthicalDecisionEngine {
  /**
   * Verifica se é ético coletar determinado tipo de dado
   * @param dataType Tipo de dado a ser coletado
   * @param userConsent Consentimentos do usuário
   * @returns true se a coleta é permitida
   */
  static shouldCollectData(dataType: string, userConsent: UserConsent): boolean {
    // Verificar consentimento específico
    if (!userConsent[dataType as keyof UserConsent]) {
      AuditService.logAction('DATA_COLLECTION_DENIED', 'PRIVACY', 'user-id', 
        { dataType, reason: 'No user consent' }, 'LOW');
      return false;
    }

    // Verificar se é realmente necessário para a funcionalidade core
    const necessaryData = ['basicProfile', 'bettingBehavior'];
    const optionalData = ['financialData', 'location', 'deviceInfo', 'analytics', 'marketing'];

    if (necessaryData.includes(dataType)) {
      AuditService.logAction('DATA_COLLECTION_APPROVED', 'PRIVACY', 'user-id', 
        { dataType, category: 'necessary' }, 'LOW');
      return true;
    }

    if (optionalData.includes(dataType)) {
      // Para dados opcionais, verificar benefício vs. privacidade
      const benefit = this.assessDataBenefit(dataType);
      const privacyImpact = this.assessPrivacyImpact(dataType);
      
      const shouldCollect = benefit > privacyImpact;
      
      AuditService.logAction(
        shouldCollect ? 'DATA_COLLECTION_APPROVED' : 'DATA_COLLECTION_DENIED', 
        'PRIVACY', 
        'user-id', 
        { dataType, benefit, privacyImpact, category: 'optional' }, 
        'MEDIUM'
      );
      
      return shouldCollect;
    }

    // Tipo de dado desconhecido - negar por precaução
    AuditService.logAction('DATA_COLLECTION_DENIED', 'PRIVACY', 'user-id', 
      { dataType, reason: 'Unknown data type' }, 'HIGH');
    return false;
  }

  /**
   * Verifica se é apropriado enviar um alerta respeitando preferências do usuário
   * @param riskLevel Nível de risco do alerta
   * @param userPreferences Preferências do usuário
   * @param context Contexto adicional
   * @returns true se deve enviar o alerta
   */
  static shouldSendAlert(
    riskLevel: string, 
    userPreferences: UserPreferences,
    context?: any
  ): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    // Parsejar horário silencioso
    const [quietStartHour, quietStartMin] = userPreferences.quietStart.split(':').map(Number);
    const [quietEndHour, quietEndMin] = userPreferences.quietEnd.split(':').map(Number);
    const quietStart = quietStartHour * 60 + quietStartMin;
    const quietEnd = quietEndHour * 60 + quietEndMin;

    // Verificar se estamos no período silencioso
    const isQuietTime = quietStart > quietEnd 
      ? (currentTime >= quietStart || currentTime <= quietEnd) // Atravessa meia-noite
      : (currentTime >= quietStart && currentTime <= quietEnd); // Mesmo dia

    if (isQuietTime) {
      // Durante período silencioso, só alertas críticos
      if (riskLevel === 'critical' && userPreferences.allowCriticalAlerts) {
        AuditService.logAction('ALERT_SENT_QUIET_TIME', 'NOTIFICATION', 'user-id', 
          { riskLevel, reason: 'Critical alert during quiet time' }, 'MEDIUM');
        return true;
      } else {
        AuditService.logAction('ALERT_SUPPRESSED_QUIET_TIME', 'NOTIFICATION', 'user-id', 
          { riskLevel, quietStart: userPreferences.quietStart, quietEnd: userPreferences.quietEnd }, 'LOW');
        return false;
      }
    }

    // Verificar limite diário de notificações (apenas para alertas não-críticos)
    if (riskLevel !== 'critical') {
      const todayAlerts = this.getTodayAlertCount('user-id');
      if (todayAlerts >= userPreferences.maxDailyNotifications) {
        AuditService.logAction('ALERT_SUPPRESSED_DAILY_LIMIT', 'NOTIFICATION', 'user-id', 
          { riskLevel, todayAlerts, limit: userPreferences.maxDailyNotifications }, 'LOW');
        return false;
      }
    }

    // Verificar se o usuário está em estado vulnerável
    if (context?.userState === 'stressed' && riskLevel === 'low') {
      AuditService.logAction('ALERT_SUPPRESSED_USER_STATE', 'NOTIFICATION', 'user-id', 
        { riskLevel, userState: context.userState }, 'MEDIUM');
      return false;
    }

    AuditService.logAction('ALERT_APPROVED', 'NOTIFICATION', 'user-id', 
      { riskLevel, time: now.toISOString() }, 'LOW');
    return true;
  }

  /**
   * Verifica se uma intervenção é apropriada do ponto de vista ético
   * @param interventionType Tipo de intervenção
   * @param userContext Contexto do usuário
   * @returns true se a intervenção é apropriada
   */
  static shouldIntervene(interventionType: string, userContext: any): boolean {
    switch (interventionType) {
      case 'force_break':
        // Só forçar pausa em casos de alto risco
        if (userContext.riskScore > 0.8) {
          AuditService.logAction('INTERVENTION_APPROVED', 'ETHICAL_DECISION', 'user-id', 
            { type: interventionType, riskScore: userContext.riskScore }, 'HIGH');
          return true;
        }
        break;

      case 'limit_suggestion':
        // Sugerir limites é sempre apropriado
        AuditService.logAction('INTERVENTION_APPROVED', 'ETHICAL_DECISION', 'user-id', 
          { type: interventionType }, 'LOW');
        return true;

      case 'professional_help':
        // Sugerir ajuda profissional para risco moderado-alto
        if (userContext.riskScore > 0.6) {
          AuditService.logAction('INTERVENTION_APPROVED', 'ETHICAL_DECISION', 'user-id', 
            { type: interventionType, riskScore: userContext.riskScore }, 'MEDIUM');
          return true;
        }
        break;

      case 'social_sharing':
        // Nunca compartilhar dados sem consentimento explícito
        if (userContext.explicitConsent) {
          AuditService.logAction('INTERVENTION_APPROVED', 'ETHICAL_DECISION', 'user-id', 
            { type: interventionType }, 'MEDIUM');
          return true;
        }
        break;
    }

    AuditService.logAction('INTERVENTION_DENIED', 'ETHICAL_DECISION', 'user-id', 
      { type: interventionType, reason: 'Ethical guidelines' }, 'MEDIUM');
    return false;
  }

  /**
   * Avalia o benefício de coletar determinado tipo de dado
   * @param dataType Tipo de dado
   * @returns Score de benefício (0-1)
   */
  private static assessDataBenefit(dataType: string): number {
    const benefits: Record<string, number> = {
      'basicProfile': 0.8,      // Essencial para personalização
      'bettingBehavior': 0.9,   // Core da funcionalidade
      'financialData': 0.7,     // Útil para análise de risco
      'location': 0.3,          // Baixo benefício para nossa função
      'deviceInfo': 0.4,        // Útil para segurança
      'analytics': 0.5,         // Melhoria do produto
      'marketing': 0.2          // Baixo benefício para o usuário
    };
    
    return benefits[dataType] || 0.1;
  }

  /**
   * Avalia o impacto na privacidade de coletar determinado tipo de dado
   * @param dataType Tipo de dado
   * @returns Score de impacto na privacidade (0-1)
   */
  private static assessPrivacyImpact(dataType: string): number {
    const impacts: Record<string, number> = {
      'basicProfile': 0.3,      // Baixo impacto
      'bettingBehavior': 0.5,   // Médio impacto
      'financialData': 0.8,     // Alto impacto
      'location': 0.9,          // Muito alto impacto
      'deviceInfo': 0.4,        // Baixo-médio impacto
      'analytics': 0.6,         // Médio impacto
      'marketing': 0.7          // Médio-alto impacto
    };
    
    return impacts[dataType] || 0.8; // Default para alto impacto
  }

  /**
   * Conta alertas enviados hoje para um usuário
   * @param userId ID do usuário
   * @returns Número de alertas enviados hoje
   */
  private static getTodayAlertCount(userId: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = AuditService.getLogs(userId, 'ALERT_SENT')
      .filter(log => log.timestamp >= today);
    
    return todayLogs.length;
  }

  /**
   * Valida decisões éticas tomadas pelo sistema
   * @param decision Decisão tomada
   * @param context Contexto da decisão
   * @returns Avaliação ética da decisão
   */
  static validateEthicalDecision(decision: string, context: any): EthicalEvaluation {
    const violations: string[] = [];
    let ethicalScore = 1.0;

    // Verificar transparência
    if (!context.explanation) {
      violations.push('TRANSPARÊNCIA: Decisão tomada sem explicação adequada ao usuário');
      ethicalScore -= 0.3;
    }

    // Verificar consentimento
    if (context.requiresConsent && !context.hasConsent) {
      violations.push('CONSENTIMENTO: Ação realizada sem consentimento do usuário');
      ethicalScore -= 0.4;
    }

    // Verificar benefício vs. dano
    if (context.potentialHarm && !context.benefitAnalysis) {
      violations.push('BENEFICÊNCIA: Análise de benefício vs. dano insuficiente');
      ethicalScore -= 0.2;
    }

    // Verificar equidade
    if (context.affectsSpecificGroup && !context.equityAnalysis) {
      violations.push('EQUIDADE: Impacto desproporcional em grupos específicos não analisado');
      ethicalScore -= 0.2;
    }

    const evaluation: EthicalEvaluation = {
      decision,
      violations,
      ethicalScore: Math.max(0, ethicalScore),
      timestamp: new Date(),
      recommendations: this.generateEthicalRecommendations(violations)
    };

    // Log da avaliação ética
    AuditService.logAction('ETHICAL_EVALUATION', 'ETHICAL_DECISION', 'system', 
      { decision, score: evaluation.ethicalScore, violationCount: violations.length }, 
      violations.length > 0 ? 'HIGH' : 'LOW');

    return evaluation;
  }

  /**
   * Gera recomendações para melhorar decisões éticas
   * @param violations Violações identificadas
   * @returns Lista de recomendações
   */
  private static generateEthicalRecommendations(violations: string[]): string[] {
    const recommendations: string[] = [];

    if (violations.some(v => v.includes('TRANSPARÊNCIA'))) {
      recommendations.push('Fornecer explicações claras sobre como e por que decisões são tomadas');
    }

    if (violations.some(v => v.includes('CONSENTIMENTO'))) {
      recommendations.push('Obter consentimento explícito antes de ações que afetem a privacidade');
    }

    if (violations.some(v => v.includes('BENEFICÊNCIA'))) {
      recommendations.push('Realizar análise de custo-benefício considerando bem-estar do usuário');
    }

    if (violations.some(v => v.includes('EQUIDADE'))) {
      recommendations.push('Avaliar impacto em diferentes grupos demográficos');
    }

    return recommendations;
  }
}

export interface EthicalEvaluation {
  decision: string;
  violations: string[];
  ethicalScore: number;
  timestamp: Date;
  recommendations: string[];
}
