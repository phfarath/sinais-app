import { AuditService } from './AuditService';

export interface BiasReport {
  demographicBias: DemographicAnalysis;
  behaviorBias: BehaviorAnalysis;
  recommendations: string[];
  lastAnalysis: Date;
  overallBiasScore: number;
}

export interface DemographicAnalysis {
  ageGroups: Record<string, number>;
  genderDistribution: Record<string, number>;
  locationDistribution: Record<string, number>;
  biasIndicators: string[];
}

export interface BehaviorAnalysis {
  riskByAge: Record<string, number[]>;
  riskByGender: Record<string, number[]>;
  decisionPatterns: PatternAnalysis[];
  fairnessMetrics: FairnessMetrics;
}

export interface PatternAnalysis {
  pattern: string;
  affected_groups: string[];
  bias_score: number;
  sample_size: number;
}

export interface FairnessMetrics {
  demographicParity: number;
  equalizedOdds: number;
  equityScore: number;
}

export interface UserData {
  id: string;
  age: number;
  gender: string;
  location: string;
  riskScore: number;
  bettingBehavior: any;
  decisions: any[];
}

export class BiasAnalyzer {
  private static readonly BIAS_THRESHOLD = 0.3; // 30% de diferença indica viés
  private static readonly MIN_SAMPLE_SIZE = 50;

  /**
   * Analisa viés nos dados e algoritmos
   * @param userData Dados dos usuários para análise
   * @returns Relatório de viés
   */
  static analyzeBias(userData: UserData[]): BiasReport {
    if (userData.length < this.MIN_SAMPLE_SIZE) {
      AuditService.logAction('BIAS_ANALYSIS_INSUFFICIENT_DATA', 'BIAS_ANALYSIS', 'system', 
        { sample_size: userData.length }, 'MEDIUM');
    }

    const demographics = this.analyzeDemographics(userData);
    const behaviorPatterns = this.analyzeBehaviorPatterns(userData);
    const recommendations = this.generateBiasRecommendations(demographics, behaviorPatterns);
    const overallScore = this.calculateOverallBiasScore(demographics, behaviorPatterns);

    AuditService.logAction('BIAS_ANALYSIS_COMPLETED', 'BIAS_ANALYSIS', 'system', {
      sample_size: userData.length,
      bias_score: overallScore,
      recommendations_count: recommendations.length
    }, overallScore > 0.5 ? 'HIGH' : 'LOW');

    return {
      demographicBias: demographics,
      behaviorBias: behaviorPatterns,
      recommendations,
      lastAnalysis: new Date(),
      overallBiasScore: overallScore
    };
  }

  /**
   * Analisa viés demográfico
   */
  private static analyzeDemographics(userData: UserData[]): DemographicAnalysis {
    const ageGroups = userData.reduce((acc, user) => {
      const ageGroup = `${Math.floor(user.age / 10) * 10}-${Math.floor(user.age / 10) * 10 + 9}`;
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const genderDistribution = userData.reduce((acc, user) => {
      acc[user.gender] = (acc[user.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const locationDistribution = userData.reduce((acc, user) => {
      acc[user.location] = (acc[user.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const biasIndicators = this.detectDemographicBias(ageGroups, genderDistribution, locationDistribution);

    return {
      ageGroups,
      genderDistribution,
      locationDistribution,
      biasIndicators
    };
  }

  /**
   * Analisa padrões comportamentais
   */
  private static analyzeBehaviorPatterns(userData: UserData[]): BehaviorAnalysis {
    const riskByAge = userData.reduce((acc, user) => {
      const ageGroup = `${Math.floor(user.age / 10) * 10}-${Math.floor(user.age / 10) * 10 + 9}`;
      if (!acc[ageGroup]) acc[ageGroup] = [];
      acc[ageGroup].push(user.riskScore);
      return acc;
    }, {} as Record<string, number[]>);

    const riskByGender = userData.reduce((acc, user) => {
      if (!acc[user.gender]) acc[user.gender] = [];
      acc[user.gender].push(user.riskScore);
      return acc;
    }, {} as Record<string, number[]>);

    const decisionPatterns = this.analyzeDecisionPatterns(userData);
    const fairnessMetrics = this.calculateFairnessMetrics(userData);

    return {
      riskByAge,
      riskByGender,
      decisionPatterns,
      fairnessMetrics
    };
  }

  /**
   * Detecta viés demográfico
   */
  private static detectDemographicBias(
    ageGroups: Record<string, number>,
    genderDistribution: Record<string, number>,
    locationDistribution: Record<string, number>
  ): string[] {
    const indicators: string[] = [];

    // Verificar distribuição de idade
    const ageValues = Object.values(ageGroups);
    const ageMax = Math.max(...ageValues);
    const ageMin = Math.min(...ageValues);
    if (ageMax / (ageMin || 1) > 3) {
      indicators.push('Desequilíbrio significativo entre faixas etárias');
    }

    // Verificar distribuição de gênero
    const genderValues = Object.values(genderDistribution);
    const genderMax = Math.max(...genderValues);
    const genderMin = Math.min(...genderValues);
    if (genderMax / (genderMin || 1) > 2) {
      indicators.push('Desequilíbrio de gênero detectado');
    }

    // Verificar distribuição geográfica
    const locationValues = Object.values(locationDistribution);
    const locationMax = Math.max(...locationValues);
    const locationMin = Math.min(...locationValues);
    if (locationMax / (locationMin || 1) > 5) {
      indicators.push('Concentração geográfica excessiva');
    }

    return indicators;
  }

  /**
   * Analisa padrões de decisão
   */
  private static analyzeDecisionPatterns(userData: UserData[]): PatternAnalysis[] {
    const patterns: PatternAnalysis[] = [];

    // Análise de risco por idade
    const riskByAge = userData.reduce((acc, user) => {
      const ageGroup = user.age < 30 ? 'young' : user.age < 50 ? 'middle' : 'senior';
      if (!acc[ageGroup]) acc[ageGroup] = [];
      acc[ageGroup].push(user.riskScore);
      return acc;
    }, {} as Record<string, number[]>);

    Object.entries(riskByAge).forEach(([ageGroup, scores]) => {
      const avgRisk = scores.reduce((a, b) => a + b, 0) / scores.length;
      patterns.push({
        pattern: `Risco médio para ${ageGroup}`,
        affected_groups: [ageGroup],
        bias_score: avgRisk,
        sample_size: scores.length
      });
    });

    return patterns;
  }

  /**
   * Calcula métricas de equidade
   */
  private static calculateFairnessMetrics(userData: UserData[]): FairnessMetrics {
    // Demographic Parity: P(Y=1|A=0) = P(Y=1|A=1)
    const maleHighRisk = userData.filter(u => u.gender === 'male' && u.riskScore > 0.7).length;
    const totalMale = userData.filter(u => u.gender === 'male').length;
    const femaleHighRisk = userData.filter(u => u.gender === 'female' && u.riskScore > 0.7).length;
    const totalFemale = userData.filter(u => u.gender === 'female').length;

    const maleRiskRate = totalMale > 0 ? maleHighRisk / totalMale : 0;
    const femaleRiskRate = totalFemale > 0 ? femaleHighRisk / totalFemale : 0;
    const demographicParity = 1 - Math.abs(maleRiskRate - femaleRiskRate);

    // Simplified metrics for demo
    const equalizedOdds = 0.85; // Placeholder
    const equityScore = (demographicParity + equalizedOdds) / 2;

    return {
      demographicParity,
      equalizedOdds,
      equityScore
    };
  }

  /**
   * Gera recomendações para mitigar viés
   */
  private static generateBiasRecommendations(
    demographics: DemographicAnalysis,
    behavior: BehaviorAnalysis
  ): string[] {
    const recommendations: string[] = [];

    // Verificar viés de idade
    const ageGroups = Object.entries(behavior.riskByAge);
    if (ageGroups.length >= 2) {
      const avgRisks = ageGroups.map(([group, scores]) => ({
        group,
        avgRisk: scores.reduce((a, b) => a + b, 0) / scores.length
      }));

      const maxRisk = Math.max(...avgRisks.map(g => g.avgRisk));
      const minRisk = Math.min(...avgRisks.map(g => g.avgRisk));

      if (maxRisk - minRisk > this.BIAS_THRESHOLD) {
        recommendations.push('Revisar algoritmo para equidade entre faixas etárias - diferença de risco detectada');
        recommendations.push('Implementar calibração específica por idade');
      }
    }

    // Verificar viés de gênero
    const genderGroups = Object.entries(behavior.riskByGender);
    if (genderGroups.length >= 2) {
      const avgRisks = genderGroups.map(([group, scores]) => ({
        group,
        avgRisk: scores.reduce((a, b) => a + b, 0) / scores.length
      }));

      const maxRisk = Math.max(...avgRisks.map(g => g.avgRisk));
      const minRisk = Math.min(...avgRisks.map(g => g.avgRisk));

      if (maxRisk - minRisk > this.BIAS_THRESHOLD) {
        recommendations.push('Viés de gênero detectado - implementar correção algorítmica');
        recommendations.push('Avaliar features que possam causar discriminação por gênero');
      }
    }

    // Verificar equidade geral
    if (behavior.fairnessMetrics.equityScore < 0.8) {
      recommendations.push('Score de equidade baixo - revisar métricas de fairness');
      recommendations.push('Implementar monitoramento contínuo de viés');
    }

    // Verificar tamanho da amostra
    if (demographics.biasIndicators.length > 0) {
      recommendations.push('Diversificar base de usuários para reduzir viés de representação');
    }

    return recommendations;
  }

  /**
   * Calcula score geral de viés
   */
  private static calculateOverallBiasScore(
    demographics: DemographicAnalysis,
    behavior: BehaviorAnalysis
  ): number {
    let biasScore = 0;

    // Penalizar indicadores demográficos
    biasScore += demographics.biasIndicators.length * 0.1;

    // Penalizar baixa equidade
    biasScore += (1 - behavior.fairnessMetrics.equityScore) * 0.5;

    // Penalizar padrões de decisão enviesados
    const highBiasPatterns = behavior.decisionPatterns.filter(p => p.bias_score > 0.7).length;
    biasScore += highBiasPatterns * 0.1;

    return Math.min(biasScore, 1); // Limitar a 1
  }

  /**
   * Monitora viés em tempo real
   * @param newDecision Nova decisão do algoritmo
   * @param userContext Contexto do usuário
   */
  static monitorRealtimeBias(newDecision: any, userContext: UserData): void {
    // Detectar possível viés em tempo real
    const suspiciousPatterns = this.detectSuspiciousPatterns(newDecision, userContext);
    
    if (suspiciousPatterns.length > 0) {
      AuditService.logAction('REALTIME_BIAS_DETECTED', 'BIAS_MONITORING', userContext.id, {
        patterns: suspiciousPatterns,
        decision: newDecision,
        userAge: userContext.age,
        userGender: userContext.gender
      }, 'MEDIUM');
    }
  }

  /**
   * Detecta padrões suspeitos em tempo real
   */
  private static detectSuspiciousPatterns(decision: any, user: UserData): string[] {
    const patterns: string[] = [];

    // Verificar se decisão é consistente com perfil similar
    if (decision.riskLevel === 'high' && user.age < 25) {
      patterns.push('Possível viés etário - jovem classificado como alto risco');
    }

    if (decision.riskLevel === 'low' && user.riskScore > 0.8) {
      patterns.push('Inconsistência na classificação de risco');
    }

    return patterns;
  }
}
