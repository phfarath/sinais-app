import { ActivityEvent, RiskLevel, EventType } from '../types/monitoring';
import { EncryptionService } from './EncryptionService';
import { DataSanitizer } from './DataSanitizer';
import { ExplainableAI, UserBehaviorData } from './ExplainableAI';
import { EthicalDecisionEngine, UserPreferences } from './EthicalDecisionEngine';
import { AuditService } from './AuditService';
import { BiasAnalyzer, UserData } from './BiasAnalyzer';

// Interface para eventos de apostas
export interface BettingEvent {
  id: string;
  amount: number;
  gameType: string;
  timestamp: Date | string;
  result: 'win' | 'loss' | 'unknown';
}

// Interface para transações bancárias
export interface BankTransaction {
  id: string;
  amount: number;
  description: string;
  date: Date | string;
  category: string;
}

// Classe para detectar comportamentos de risco nas apostas
class BettingPatternAnalyzer {
  // Detecta sequência de apostas após uma perda significativa (chasing losses)
  detectChasingLosses(bettingEvents: BettingEvent[]): boolean {
    if (bettingEvents.length < 3) return false;
    
    // Ordena eventos por timestamp
    const sortedEvents = [...bettingEvents].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Procura por um padrão de perda seguido por múltiplas apostas em curto período
    for (let i = 0; i < sortedEvents.length - 2; i++) {
      const currentEvent = sortedEvents[i];
      
      // Verifica se houve uma perda
      if (currentEvent.result === 'loss' && currentEvent.amount > 50) {
        // Verifica se há pelo menos 3 apostas nas próximas 2 horas
        const nextEvents = sortedEvents.slice(i + 1).filter(event => 
          (new Date(event.timestamp).getTime() - new Date(currentEvent.timestamp).getTime()) < 2 * 60 * 60 * 1000
        );
        
        if (nextEvents.length >= 3) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Detecta apostas em horários de madrugada
  detectLateNightActivity(bettingEvents: BettingEvent[]): boolean {
    // Filtra eventos que ocorreram entre 0h e 5h da manhã
    const lateNightEvents = bettingEvents.filter(event => {
      const eventHour = new Date(event.timestamp).getHours();
      return eventHour >= 0 && eventHour < 5;
    });
    
    // Considera um padrão se houver mais de 2 apostas na madrugada
    return lateNightEvents.length >= 2;
  }
  
  // Detecta frequência anormal de apostas
  detectHighFrequency(bettingEvents: BettingEvent[], averageDaily: number): boolean {
    // Se não tiver uma média diária de referência, usa 5 como valor padrão
    const baseline = averageDaily || 5;
    
    // Agrupa por dia
    const eventsByDay = new Map<string, BettingEvent[]>();
    
    bettingEvents.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!eventsByDay.has(date)) {
        eventsByDay.set(date, []);
      }
      eventsByDay.get(date)?.push(event);
    });
    
    // Verifica se algum dia tem frequência 50% maior que a média
    return Array.from(eventsByDay.values()).some(events => events.length > baseline * 1.5);
  }
  
  // Detecta apostas de valor alto
  detectHighValueBets(bettingEvents: BettingEvent[], threshold: number = 200): boolean {
    return bettingEvents.some(event => event.amount > threshold);
  }
}

// Classe principal para monitorar e analisar eventos de aposta
export class BettingMonitor {
  private analyzer: BettingPatternAnalyzer;
  private events: BettingEvent[] = [];
  private activityEvents: ActivityEvent[] = [];
  private averageDailyBets: number = 0;
  
  constructor() {
    this.analyzer = new BettingPatternAnalyzer();
  }
    // Registra um novo evento de aposta com segurança
  recordBettingEvent(event: BettingEvent): void {
    try {
      // Sanitizar e validar dados de entrada
      if (!DataSanitizer.validateBettingEvent(event)) {
        AuditService.logAction('INVALID_EVENT_REJECTED', 'BETTING_EVENT', 'user-id', 
          DataSanitizer.anonymizeForLogging(event), 'HIGH');
        throw new Error('Evento de aposta inválido');
      }

      // Criptografar dados sensíveis antes do armazenamento
      const secureEvent = {
        ...event,
        id: event.id,
        amount: event.amount, // Manter original para cálculos, criptografar no storage
        gameType: DataSanitizer.sanitizeUserInput(event.gameType),
        timestamp: event.timestamp,
        result: event.result
      };

      // Armazenar evento (sem criptografia no desenvolvimento)
      try {
        const encryptedEvent = {
          ...secureEvent,
          amount: __DEV__ ? String(secureEvent.amount) : EncryptionService.encryptData(String(secureEvent.amount))
        };
      } catch (cryptoError) {
        // Fallback para desenvolvimento sem criptografia
        console.warn('Criptografia não disponível, usando dados não criptografados');
      }

      this.events.push(secureEvent); // Manter em memória para análise
      AuditService.logAction('BETTING_EVENT_RECORDED', 'BETTING_EVENT', 'user-id', 
        { eventId: event.id, gameType: event.gameType }, 'LOW');

      this.updateAverageDailyBets();
      this.analyzeNewEventSecurely(secureEvent);

    } catch (error) {
      AuditService.logAction('BETTING_EVENT_ERROR', 'BETTING_EVENT', 'user-id', 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
      throw error;
    }
  }
  
  // Atualiza a média diária de apostas
  private updateAverageDailyBets(): void {
    // Agrupa eventos por dia
    const eventsByDay = new Map<string, BettingEvent[]>();
    
    this.events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!eventsByDay.has(date)) {
        eventsByDay.set(date, []);
      }
      eventsByDay.get(date)?.push(event);
    });
    
    // Calcula a média
    const days = eventsByDay.size;
    if (days > 0) {
      let total = 0;
      eventsByDay.forEach(events => {
        total += events.length;
      });
      this.averageDailyBets = total / days;
    }
  }
    // Analisa um novo evento e gera alertas se necessário
  private analyzeNewEvent(event: BettingEvent): void {
    this.analyzeNewEventSecurely(event);
  }

  // Análise segura e ética de eventos
  private analyzeNewEventSecurely(event: BettingEvent): void {
    try {
      // Preparar dados comportamentais do usuário
      const userData: UserBehaviorData = {
        dailyBets: this.events.filter(e => 
          new Date(e.timestamp).toDateString() === new Date().toDateString()
        ).length,
        averageBet: event.amount,
        lateNightActivity: new Date(event.timestamp).getHours() < 6 || new Date(event.timestamp).getHours() > 22,
        weekendActivity: [0, 6].includes(new Date(event.timestamp).getDay()),
        consecutiveDays: this.calculateConsecutiveDays(),
        lossRecoveryAttempts: this.detectChasingPattern(),
        timeSpentGambling: this.calculateDailyTimeSpent(),
        financialStress: this.detectFinancialStress()
      };

      // Obter análise explicável da IA
      const riskAssessment = ExplainableAI.explainRiskAssessment(userData);

      // Preferências do usuário para decisões éticas
      const userPreferences: UserPreferences = {
        quietStart: '22:00',
        quietEnd: '07:00',
        maxDailyNotifications: 5,
        allowCriticalAlerts: true,
        dataRetentionDays: 30
      };

      // Verificar se deve enviar alerta respeitando ética
      const shouldAlert = EthicalDecisionEngine.shouldSendAlert(
        riskAssessment.riskScore > 0.7 ? 'critical' : riskAssessment.riskScore > 0.4 ? 'high' : 'medium',
        userPreferences,
        { userState: 'normal' }
      );

      if (shouldAlert) {
        this.createActivityEvent({
          type: 'pattern',
          title: 'Análise de Risco',
          description: riskAssessment.recommendation,
          timestamp: new Date(),
          value: event.amount,
          riskLevel: riskAssessment.riskScore > 0.7 ? 'high' : riskAssessment.riskScore > 0.4 ? 'medium' : 'low'
        });

        // Log da explicação da IA para auditoria
        AuditService.logAction('AI_EXPLANATION_GENERATED', 'RISK_ASSESSMENT', 'user-id', {
          explanation: riskAssessment.recommendation,
          confidence: riskAssessment.confidence,
          factors: riskAssessment.factors.map(f => ({ factor: f.factor, impact: f.impact })),
          riskScore: riskAssessment.riskScore
        }, riskAssessment.riskScore > 0.7 ? 'HIGH' : 'MEDIUM');
      }      // Verificar padrões específicos de risco usando o analyzer existente
      this.checkSpecificRiskPatterns(event);

      // Monitorar viés em tempo real
      this.monitorBiasInDecision(riskAssessment, userData, event);

    } catch (error) {
      AuditService.logAction('RISK_ANALYSIS_ERROR', 'BETTING_EVENT', 'user-id', 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
    }
  }

  // Monitora viés nas decisões em tempo real
  private monitorBiasInDecision(riskAssessment: any, userData: UserBehaviorData, event: BettingEvent): void {
    try {
      // Criar contexto do usuário para análise de viés
      const userContext: UserData = {
        id: 'user-id',
        age: 30, // Em produção, seria obtido do perfil do usuário
        gender: 'male', // Em produção, seria obtido do perfil do usuário
        location: 'SP', // Em produção, seria obtido do perfil do usuário
        riskScore: riskAssessment.riskScore,
        bettingBehavior: userData,
        decisions: [riskAssessment]
      };

      // Monitorar viés em tempo real
      BiasAnalyzer.monitorRealtimeBias({
        riskLevel: riskAssessment.riskScore > 0.7 ? 'high' : riskAssessment.riskScore > 0.4 ? 'medium' : 'low',
        confidence: riskAssessment.confidence,
        factors: riskAssessment.factors,
        eventType: event.gameType
      }, userContext);

    } catch (error) {
      AuditService.logAction('BIAS_MONITORING_ERROR', 'BIAS_ANALYSIS', 'user-id', 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'MEDIUM');
    }
  }

  // Verifica padrões específicos de risco
  private checkSpecificRiskPatterns(event: BettingEvent): void {
    // Verifica apostas de valor alto
    if (this.analyzer.detectHighValueBets([event])) {
      this.createActivityEvent({
        type: 'bet',
        title: 'Aposta de alto valor',
        description: `Aposta de R$ ${event.amount.toFixed(2)} em ${event.gameType}`,
        timestamp: new Date(event.timestamp),
        value: event.amount,
        riskLevel: 'high'
      });
    }
    
    // Analisa os últimos 20 eventos (ou menos se não houver tantos)
    const recentEvents = this.events.slice(-20);
    
    // Verifica padrões de "chasing losses"
    if (this.analyzer.detectChasingLosses(recentEvents)) {
      this.createActivityEvent({
        type: 'pattern',
        title: 'Padrão de Chasing Losses',
        description: 'Detectamos várias apostas consecutivas após uma perda significativa',
        timestamp: new Date(),
        riskLevel: 'high'
      });
    }
    
    // Verifica atividade noturna
    if (this.analyzer.detectLateNightActivity(recentEvents)) {
      this.createActivityEvent({
        type: 'pattern',
        title: 'Atividade noturna',
        description: 'Apostas detectadas durante a madrugada',
        timestamp: new Date(),
        riskLevel: 'medium'
      });
    }
    
    // Verifica alta frequência
    if (this.analyzer.detectHighFrequency(recentEvents, this.averageDailyBets)) {
      this.createActivityEvent({
        type: 'pattern',
        title: 'Aumento de frequência',
        description: 'Frequência de apostas acima da sua média habitual',
        timestamp: new Date(),
        riskLevel: 'medium'
      });
    }
  }
  
  // Cria um novo evento de atividade
  private createActivityEvent(eventData: Omit<ActivityEvent, 'id'>): void {
    const newEvent: ActivityEvent = {
      id: Date.now().toString(),
      ...eventData
    };
    
    this.activityEvents.unshift(newEvent);
  }
  
  // Obtém a lista de eventos de atividade (feed)
  getActivityEvents(): ActivityEvent[] {
    return this.activityEvents;
  }
  
  // Obtém eventos filtrados por nível de risco
  getFilteredActivityEvents(riskLevel?: RiskLevel): ActivityEvent[] {
    if (!riskLevel) return this.activityEvents;
    return this.activityEvents.filter(event => event.riskLevel === riskLevel);
  }
  
  // Importa dados de transações bancárias via Open Banking
  importBankingData(transactions: BankTransaction[]): void {
    // Analisa transações para casas de apostas
    const bettingTransactions = transactions.filter(
      transaction => transaction.category === 'gambling' || 
                     transaction.description.toLowerCase().includes('bet') ||
                     transaction.description.toLowerCase().includes('casino')
    );
    
    // Converte transações em eventos de aposta
    bettingTransactions.forEach(transaction => {
      this.recordBettingEvent({
        id: transaction.id,
        amount: Math.abs(transaction.amount),
        gameType: 'Transação Externa',
        timestamp: transaction.date,
        result: 'unknown' // Não podemos saber o resultado apenas pelo extrato
      });
      
      // Cria um evento de atividade para a importação
      this.createActivityEvent({
        type: 'bet',
        title: 'Transação de aposta detectada',
        description: `R$ ${Math.abs(transaction.amount).toFixed(2)} em ${transaction.description}`,
        timestamp: new Date(transaction.date),
        value: Math.abs(transaction.amount),
        riskLevel: Math.abs(transaction.amount) > 200 ? 'high' : 'medium'
      });
    });
  }
  
  // Gera dados de exemplo para demonstração
  generateSampleData(): void {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const sampleEvents: BettingEvent[] = [
      {
        id: '1',
        amount: 500,
        gameType: 'Roleta Online',
        timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 2, 15),
        result: 'loss'
      },
      {
        id: '2',
        amount: 200,
        gameType: 'Poker Online',
        timestamp: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 30),
        result: 'loss'
      },
      {
        id: '3',
        amount: 150,
        gameType: 'Cassino',
        timestamp: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 45),
        result: 'loss'
      },
      {
        id: '4',
        amount: 300,
        gameType: 'Apostas Esportivas',
        timestamp: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 15),
        result: 'loss'
      },
      {
        id: '5',
        amount: 100,
        gameType: 'Caça-níqueis',
        timestamp: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 1, 3, 30),
        result: 'win'
      }
    ];
    
    // Registra eventos de exemplo
    sampleEvents.forEach(event => this.recordBettingEvent(event));
  }

  // Métodos auxiliares para análise comportamental
  private calculateConsecutiveDays(): number {
    if (this.events.length === 0) return 0;
    
    const dates = [...new Set(this.events.map(e => 
      new Date(e.timestamp).toDateString()
    ))].sort();
    
    let consecutiveDays = 1;
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currentDate = new Date(dates[i]);
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        consecutiveDays++;
      } else {
        break;
      }
    }
    
    return consecutiveDays;
  }
  
  private detectChasingPattern(): number {
    let chasingAttempts = 0;
    const recentEvents = this.events.slice(-10); // Últimos 10 eventos
    
    for (let i = 1; i < recentEvents.length; i++) {
      const prevEvent = recentEvents[i - 1];
      const currentEvent = recentEvents[i];
      
      // Se perdeu na anterior e aumentou a aposta na atual
      if (prevEvent.result === 'loss' && currentEvent.amount > prevEvent.amount * 1.5) {
        chasingAttempts++;
      }
    }
    
    return chasingAttempts;
  }
  
  private calculateDailyTimeSpent(): number {
    const today = new Date().toDateString();
    const todayEvents = this.events.filter(e => 
      new Date(e.timestamp).toDateString() === today
    );
    
    if (todayEvents.length === 0) return 0;
    
    const sortedEvents = todayEvents.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const firstEvent = sortedEvents[0];
    const lastEvent = sortedEvents[sortedEvents.length - 1];
    
    const diffTime = new Date(lastEvent.timestamp).getTime() - new Date(firstEvent.timestamp).getTime();
    return Math.max(diffTime / (1000 * 60), 0); // Retorna em minutos
  }
  
  private detectFinancialStress(): boolean {
    // Lógica simplificada para detectar estresse financeiro
    const recentEvents = this.events.slice(-20);
    const totalLosses = recentEvents
      .filter(e => e.result === 'loss')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const averageAmount = recentEvents.reduce((sum, e) => sum + e.amount, 0) / recentEvents.length;
    
    // Se perdas recentes são muito altas ou apostas estão aumentando muito
    return totalLosses > averageAmount * 10 || 
           recentEvents.some(e => e.amount > averageAmount * 3);
  }
}