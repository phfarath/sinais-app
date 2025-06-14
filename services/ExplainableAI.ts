import { AuditService } from './AuditService';

export interface RiskFactor {
  factor: string;
  impact: number;
  explanation: string;
  confidence: number;
}

export interface RiskExplanation {
  riskScore: number;
  factors: RiskFactor[];
  recommendation: string;
  confidence: number;
  timestamp: Date;
  reasoning: string[];
}

export interface UserBehaviorData {
  dailyBets: number;
  averageBet: number;
  lateNightActivity: boolean;
  weekendActivity: boolean;
  consecutiveDays: number;
  lossRecoveryAttempts: number;
  timeSpentGambling: number; // em minutos
  financialStress: boolean;
}

export class ExplainableAI {
  /**
   * Analisa o perfil de risco do usuário com explicações detalhadas
   * @param userData Dados comportamentais do usuário
   * @returns Explicação detalhada do risco
   */
  static explainRiskAssessment(userData: UserBehaviorData): RiskExplanation {
    const factors: RiskFactor[] = [];
    const reasoning: string[] = [];
    let totalScore = 0;

    // Analisar frequência de apostas
    if (userData.dailyBets > 10) {
      const impact = Math.min(0.3, userData.dailyBets * 0.02);
      factors.push({
        factor: 'Alta frequência de apostas',
        impact,
        explanation: `Você fez ${userData.dailyBets} apostas hoje. Frequência alta (>10/dia) está associada a comportamento compulsivo.`,
        confidence: 0.9
      });
      reasoning.push(`Frequência diária elevada detectada: ${userData.dailyBets} apostas`);
      totalScore += impact;
    }

    // Analisar horários de atividade
    if (userData.lateNightActivity) {
      const impact = 0.25;
      factors.push({
        factor: 'Atividade noturna',
        impact,
        explanation: 'Apostas durante a madrugada (22h-6h) podem indicar perda de controle e comprometimento do sono.',
        confidence: 0.8
      });
      reasoning.push('Padrão de apostas noturnas identificado');
      totalScore += impact;
    }

    // Analisar valores das apostas
    if (userData.averageBet > 200) {
      const impact = Math.min(0.3, (userData.averageBet - 200) / 1000);
      factors.push({
        factor: 'Valores altos por aposta',
        impact,
        explanation: `Apostas com média de R$ ${userData.averageBet.toFixed(2)} representam risco financeiro elevado.`,
        confidence: 0.95
      });
      reasoning.push(`Valor médio por aposta: R$ ${userData.averageBet.toFixed(2)}`);
      totalScore += impact;
    }

    // Analisar tentativas de recuperação de perdas
    if (userData.lossRecoveryAttempts > 3) {
      const impact = 0.35;
      factors.push({
        factor: 'Tentativas de recuperação',
        impact,
        explanation: `${userData.lossRecoveryAttempts} tentativas de recuperar perdas indicam padrão de "chasing losses".`,
        confidence: 0.92
      });
      reasoning.push('Comportamento de perseguição de perdas detectado');
      totalScore += impact;
    }

    // Analisar tempo gasto apostando
    if (userData.timeSpentGambling > 180) { // > 3 horas
      const impact = Math.min(0.25, userData.timeSpentGambling / 1000);
      factors.push({
        factor: 'Tempo excessivo',
        impact,
        explanation: `${Math.round(userData.timeSpentGambling / 60)} horas gastas apostando hoje excede o recomendado.`,
        confidence: 0.85
      });
      reasoning.push(`Tempo total de apostas: ${Math.round(userData.timeSpentGambling / 60)}h`);
      totalScore += impact;
    }

    // Analisar dias consecutivos
    if (userData.consecutiveDays > 7) {
      const impact = Math.min(0.2, userData.consecutiveDays * 0.02);
      factors.push({
        factor: 'Atividade contínua',
        impact,
        explanation: `${userData.consecutiveDays} dias consecutivos apostando pode indicar dependência.`,
        confidence: 0.75
      });
      reasoning.push(`Sequência de ${userData.consecutiveDays} dias consecutivos`);
      totalScore += impact;
    }

    // Analisar estresse financeiro
    if (userData.financialStress) {
      const impact = 0.4;
      factors.push({
        factor: 'Estresse financeiro',
        impact,
        explanation: 'Apostas durante períodos de dificuldades financeiras aumentam significativamente o risco.',
        confidence: 0.88
      });
      reasoning.push('Indicadores de estresse financeiro detectados');
      totalScore += impact;
    }

    // Calcular confiança geral
    const overallConfidence = factors.length > 0 
      ? factors.reduce((sum, f) => sum + f.confidence, 0) / factors.length
      : 0.5;

    // Limitar score máximo
    const finalScore = Math.min(totalScore, 1);

    const explanation: RiskExplanation = {
      riskScore: finalScore,
      factors,
      recommendation: this.generateRecommendation(finalScore, factors),
      confidence: overallConfidence,
      timestamp: new Date(),
      reasoning
    };

    // Log da análise para auditoria
    AuditService.logAction('AI_RISK_ANALYSIS', 'RISK_ASSESSMENT', 'user-id', {
      riskScore: finalScore,
      factorCount: factors.length,
      confidence: overallConfidence
    }, finalScore > 0.7 ? 'HIGH' : finalScore > 0.4 ? 'MEDIUM' : 'LOW');

    return explanation;
  }

  /**
   * Gera recomendação baseada no score de risco
   * @param score Score de risco (0-1)
   * @param factors Fatores de risco identificados
   * @returns Recomendação personalizada
   */
  private static generateRecommendation(score: number, factors: RiskFactor[]): string {
    if (score > 0.8) {
      return 'ATENÇÃO: Comportamento de alto risco detectado. Recomendamos parar imediatamente e buscar apoio profissional. Entre em contato com o CVV: 188.';
    }
    
    if (score > 0.6) {
      return 'Comportamento de risco moderado-alto. Considere definir limites mais rigorosos e fazer uma pausa. Procure atividades alternativas.';
    }
    
    if (score > 0.4) {
      const mainFactors = factors.filter(f => f.impact > 0.2).map(f => f.factor);
      return `Alguns sinais de atenção identificados (${mainFactors.join(', ')}). Defina limites diários e monitore seu comportamento.`;
    }
    
    if (score > 0.2) {
      return 'Comportamento dentro da normalidade, mas continue monitorando. Mantenha limites saudáveis.';
    }
    
    return 'Comportamento de baixo risco. Continue praticando jogos responsáveis.';
  }

  /**
   * Explica por que determinado alerta foi gerado
   * @param alertType Tipo do alerta
   * @param context Contexto do alerta
   * @returns Explicação do alerta
   */
  static explainAlert(alertType: string, context: any): string {
    switch (alertType) {
      case 'HIGH_FREQUENCY':
        return `Este alerta foi gerado porque você fez ${context.count} apostas em ${context.timeframe}. Nosso algoritmo identifica isso como frequência anormalmente alta, que pode indicar perda de controle.`;
      
      case 'HIGH_VALUE':
        return `Detectamos uma aposta de R$ ${context.amount}, que é ${context.percentageAboveNormal}% acima da sua média. Valores muito altos podem indicar tentativa de recuperação de perdas.`;
      
      case 'LATE_NIGHT':
        return `Você está apostando às ${context.time}. Atividade durante a madrugada frequentemente está associada a estados emocionais alterados e decisões impulsivas.`;
      
      case 'CHASING_LOSSES':
        return `Identificamos um padrão onde você aumentou suas apostas após perdas. Isso é conhecido como "chasing losses" e é um comportamento de risco significativo.`;
      
      default:
        return 'Alerta gerado com base na análise comportamental de padrões de risco.';
    }
  }

  /**
   * Fornece transparência sobre como o algoritmo funciona
   * @returns Explicação do funcionamento do sistema
   */
  static explainAlgorithm(): string {
    return `
    Nossa IA analisa seu comportamento usando os seguintes critérios:
    
    1. **Frequência**: Número de apostas por dia/hora
    2. **Valores**: Montante apostado vs. sua média histórica  
    3. **Horários**: Padrões de atividade noturna ou incomuns
    4. **Sequências**: Dias consecutivos apostando
    5. **Recuperação**: Tentativas de recuperar perdas aumentando apostas
    6. **Contexto**: Indicadores de estresse financeiro
    
    O sistema NÃO usa: dados pessoais como idade, gênero ou localização.
    
    Todos os cálculos são transparentes e você pode questionar qualquer avaliação.
    `;
  }
}
