import { ActivityEvent, RiskLevel, EventType } from '../types/monitoring';

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
  
  // Registra um novo evento de aposta
  recordBettingEvent(event: BettingEvent): void {
    this.events.push(event);
    this.updateAverageDailyBets();
    this.analyzeNewEvent(event);
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
}