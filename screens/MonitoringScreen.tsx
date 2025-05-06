import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { ActivityEvent, RiskLevel } from '../types/monitoring';
import { BettingMonitor } from '../services/BettingMonitorService';

// Obtém a largura da tela para cálculos de layout responsivo
const { width: screenWidth } = Dimensions.get('window');

type MonitoringScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Monitoring'>;
};

export default function MonitoringScreen({ navigation }: MonitoringScreenProps) {
  const insets = useSafeAreaInsets();
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [monitorService] = useState<BettingMonitor>(() => {
    const service = new BettingMonitor();
    service.generateSampleData(); // Gera dados de exemplo para demonstração
    return service;
  });

  // Carrega todos os dados ao iniciar
  useEffect(() => {
    setActivities(monitorService.getActivityEvents());
  }, [monitorService]);

  // Filtra as atividades com base no nível de risco selecionado
  const filteredActivities = activities;

  // Função para formatar a data de um evento
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Hoje, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getDate()}/${date.getMonth() + 1}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  };

  // Função para obter o ícone com base no tipo de evento
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'bet': return 'dice-multiple';
      case 'deposit': return 'bank-transfer-in';
      case 'withdrawal': return 'bank-transfer-out';
      case 'pattern': return 'chart-line';
      default: return 'alert-circle';
    }
  };

  // Função para obter a cor com base no nível de risco
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  // Renderiza um item do feed de atividades
  const renderActivityItem = ({ item }: { item: ActivityEvent }) => (
    <TouchableOpacity 
      style={[styles.activityItem, { borderLeftColor: getRiskColor(item.riskLevel) }]}
      onPress={() => {/* Navegar para detalhes do evento */}}
    >
      <View style={styles.activityHeader}>
        <View style={styles.activityIcon}>
          <MaterialCommunityIcons 
            name={getEventIcon(item.type)} 
            size={28} 
            color={getRiskColor(item.riskLevel)} 
          />
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activityTime}>{formatDate(item.timestamp)}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
      </View>
      <Text style={styles.activityDescription}>{item.description}</Text>
      {item.value && (
        <Text style={[styles.activityValue, { color: getRiskColor(item.riskLevel) }]}>
          R$ {item.value.toFixed(2)}
        </Text>
      )}
      
      {/* Indicador de nível de risco */}
      <View style={styles.riskIndicator}>
        <View style={[styles.riskDot, { backgroundColor: getRiskColor(item.riskLevel) }]} />
        <Text style={[styles.riskText, { color: getRiskColor(item.riskLevel) }]}>
          {item.riskLevel === 'high' ? 'Alto Risco' : 
           item.riskLevel === 'medium' ? 'Risco Médio' : 'Baixo Risco'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.headerGradient}
        >
          <Text style={styles.title}>Monitoramento</Text>
          <Text style={styles.subtitle}>Análise em tempo real das suas atividades</Text>
        </LinearGradient>
        
        {/* Botão de Respiração */}
        <TouchableOpacity 
          style={styles.breathingButton}
          onPress={() => navigation.navigate('Breathing')}
        >
          <MaterialCommunityIcons name="meditation" size={24} color="white" />
          <Text style={styles.breathingButtonText}>Exercício de Respiração</Text>
        </TouchableOpacity>
        
        {/* Botão Conectar com o banco */}
        <TouchableOpacity 
          style={styles.connectBankButton}
          onPress={() => navigation.navigate('OpenFinance')}
        >
          <MaterialCommunityIcons name="bank" size={24} color="white" />
          <Text style={styles.connectBankText}>Conectar com o banco</Text>
        </TouchableOpacity>
        
        {/* Seção de Estatísticas */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estatísticas de Uso</Text>
          
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.statsCard}
          >
            <Text style={styles.cardTitle}>Tempo Semanal</Text>
            <View style={styles.statRow}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#4A90E2" />
              <Text style={styles.statValue}>3h 45min</Text>
              <Text style={styles.statChange}>-15% esta semana</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.statsCard}
          >
            <Text style={styles.cardTitle}>Progresso</Text>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#4A90E2', '#60A5FA']}
                style={[styles.progressFill, { width: '65%' }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={styles.progressText}>65% do caminho para seu objetivo</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.statsCard}
          >
            <Text style={styles.cardTitle}>Histórico de Comportamento</Text>
            <View style={styles.timelineContainer}>
              <View style={styles.timelineItem}>
                <MaterialCommunityIcons name="alert-circle" size={24} color="#F59E0B" />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Alerta de Tempo</Text>
                  <Text style={styles.timelineDate}>Hoje, 14:30</Text>
                </View>
              </View>
              <View style={styles.timelineItem}>
                <MaterialCommunityIcons name="emoticon" size={24} color="#10B981" />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Humor Melhorou</Text>
                  <Text style={styles.timelineDate}>Ontem</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Feed de Atividades */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Feed de Atividades</Text>
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.mainCard}
          >
            <FlatList
              data={filteredActivities}
              renderItem={renderActivityItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.activityList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              nestedScrollEnabled={true}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="check-circle" size={48} color="#10B981" />
                  <Text style={styles.emptyStateText}>Nenhuma atividade com este filtro</Text>
                </View>
              }
            />
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  breathingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  breathingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  connectBankButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectBankText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    marginLeft: 4,
  },
  statsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 12,
    marginRight: 'auto',
  },
  statChange: {
    fontSize: 14,
    color: '#10B981',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  timelineContainer: {
    gap: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  timelineContent: {
    marginLeft: 12,
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    color: '#64748B',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  mainCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  activityList: {
    paddingBottom: 12,
  },
  activityItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 18,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  activityDescription: {
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 22,
  },
  activityValue: {
    fontSize: 18,
    fontWeight: '700',
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  riskText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  openBankingButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  openBankingText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
});