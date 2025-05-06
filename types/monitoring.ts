// Tipos de eventos monitorados
export type EventType = 'bet' | 'deposit' | 'withdrawal' | 'pattern';

// Níveis de risco
export type RiskLevel = 'low' | 'medium' | 'high';

// Interface para eventos de atividade no feed
export interface ActivityEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: Date;
  value?: number;
  riskLevel: RiskLevel;
}

// Interface para configurações de filtro
export interface ActivityFilter {
  riskLevel?: RiskLevel;
  eventType?: EventType;
  startDate?: Date;
  endDate?: Date;
}

// Interface para estatísticas gerais
export interface MonitoringStats {
  totalBets: number;
  totalSpent: number;
  highRiskEvents: number;
  averageBetAmount: number;
  mostActiveTime: string;
  weeklyTrend: 'increasing' | 'decreasing' | 'stable';
}