import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuditService, AuditLog } from '../services/AuditService';
import { ExplainableAI } from '../services/ExplainableAI';

type RootStackParamList = {
  ExplanationAudit: undefined;
  Settings: undefined;
};

type ExplanationAuditScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ExplanationAudit'>;
};

interface ExplanationWithAudit extends AuditLog {
  explanation?: string;
  confidence?: number;
  factors?: any[];
  riskScore?: number;
}

export default function ExplanationAuditScreen({ navigation }: ExplanationAuditScreenProps) {
  const insets = useSafeAreaInsets();
  const [explanations, setExplanations] = useState<ExplanationWithAudit[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);

  useEffect(() => {
    loadExplanations();
  }, []);

  const loadExplanations = async () => {
    try {
      // Carregar explicações de IA dos logs de auditoria
      const auditLogs = AuditService.getLogs('user-id', 'AI_EXPLANATION_GENERATED');
      const explanationsWithDetails = auditLogs.map(log => ({
        ...log,
        explanation: log.metadata?.explanation,
        confidence: log.metadata?.confidence,
        factors: log.metadata?.factors,
        riskScore: log.metadata?.riskScore
      }));
      
      setExplanations(explanationsWithDetails);
    } catch (error) {
      console.error('Erro ao carregar explicações:', error);
    }
  };

  const filteredExplanations = explanations.filter(explanation => {
    if (selectedFilter === 'all') return true;
    
    const riskScore = explanation.riskScore || 0;
    switch (selectedFilter) {
      case 'high': return riskScore > 0.7;
      case 'medium': return riskScore > 0.4 && riskScore <= 0.7;
      case 'low': return riskScore <= 0.4;
      default: return true;
    }
  });

  const reportBias = (explanationId: string) => {
    Alert.alert(
      'Reportar Viés',
      'Você acredita que esta explicação contém viés ou é injusta?',
      [
        { text: 'Cancelar' },
        {
          text: 'Reportar',
          onPress: () => {
            AuditService.logAction('BIAS_REPORTED', 'AI_EXPLANATION', 'user-id', {
              explanationId,
              reportedAt: new Date(),
              userFeedback: 'User reported potential bias'
            }, 'MEDIUM');
            
            Alert.alert('Obrigado', 'Seu feedback foi registrado e será analisado pela nossa equipe.');
          }
        }
      ]
    );
  };

  const requestExplanation = (explanationId: string) => {
    Alert.alert(
      'Solicitar Explicação Detalhada',
      'Você gostaria de uma explicação mais detalhada sobre como chegamos a esta conclusão?',
      [
        { text: 'Cancelar' },
        {
          text: 'Sim',
          onPress: () => {
            AuditService.logAction('DETAILED_EXPLANATION_REQUESTED', 'AI_EXPLANATION', 'user-id', {
              explanationId,
              requestedAt: new Date()
            }, 'LOW');
            
            Alert.alert('Solicitação Registrada', 'Uma explicação mais detalhada será fornecida em breve.');
          }
        }
      ]
    );
  };

  const getRiskColor = (riskScore: number = 0) => {
    if (riskScore > 0.7) return '#DC2626';
    if (riskScore > 0.4) return '#F59E0B';
    return '#10B981';
  };

  const getRiskLabel = (riskScore: number = 0) => {
    if (riskScore > 0.7) return 'Alto Risco';
    if (riskScore > 0.4) return 'Risco Moderado';
    return 'Baixo Risco';
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Auditoria de Explicações da IA</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="brain" size={32} color="#4A90E2" />
          <Text style={styles.infoTitle}>Transparência da IA</Text>
          <Text style={styles.infoText}>
            Aqui você pode revisar todas as explicações fornecidas pela nossa IA, 
            reportar possíveis vieses e solicitar esclarecimentos.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.algorithmButton}
          onPress={() => setShowAlgorithmInfo(!showAlgorithmInfo)}
        >
          <MaterialCommunityIcons name="cog" size={20} color="#4A90E2" />
          <Text style={styles.algorithmButtonText}>Como Funciona Nosso Algoritmo</Text>
          <MaterialCommunityIcons 
            name={showAlgorithmInfo ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#6B7280" 
          />
        </TouchableOpacity>

        {showAlgorithmInfo && (
          <View style={styles.algorithmInfo}>
            <Text style={styles.algorithmText}>
              {ExplainableAI.explainAlgorithm()}
            </Text>
          </View>
        )}

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filtrar por risco:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'all', label: 'Todos' },
              { key: 'high', label: 'Alto' },
              { key: 'medium', label: 'Médio' },
              { key: 'low', label: 'Baixo' }
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter(filter.key as any)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === filter.key && styles.filterButtonTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>
          Explicações Registradas ({filteredExplanations.length})
        </Text>

        {filteredExplanations.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="message-text-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Nenhuma explicação encontrada</Text>
            <Text style={styles.emptyText}>
              As explicações da IA aparecerão aqui conforme você usar o app.
            </Text>
          </View>
        ) : (
          filteredExplanations.map((explanation, index) => (
            <View key={explanation.id} style={styles.explanationCard}>
              <View style={styles.explanationHeader}>
                <View style={styles.riskIndicator}>
                  <View style={[
                    styles.riskDot, 
                    { backgroundColor: getRiskColor(explanation.riskScore) }
                  ]} />
                  <Text style={styles.riskText}>
                    {getRiskLabel(explanation.riskScore || 0)}
                  </Text>
                </View>
                <Text style={styles.timestamp}>
                  {formatTimestamp(explanation.timestamp)}
                </Text>
              </View>

              <Text style={styles.explanationText}>
                {explanation.explanation || 'Explicação não disponível'}
              </Text>

              {explanation.confidence && (
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>Confiança:</Text>
                  <View style={styles.confidenceBar}>
                    <View style={[
                      styles.confidenceFill,
                      { width: `${explanation.confidence * 100}%` }
                    ]} />
                  </View>
                  <Text style={styles.confidenceText}>
                    {(explanation.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
              )}

              {explanation.factors && explanation.factors.length > 0 && (
                <View style={styles.factorsContainer}>
                  <Text style={styles.factorsTitle}>Fatores Considerados:</Text>
                  {explanation.factors.slice(0, 3).map((factor, idx) => (
                    <Text key={idx} style={styles.factorText}>
                      • {factor.factor} (impacto: {(factor.impact * 100).toFixed(0)}%)
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => requestExplanation(explanation.id)}
                >
                  <MaterialCommunityIcons name="help-circle-outline" size={16} color="#4A90E2" />
                  <Text style={styles.actionButtonText}>Mais Detalhes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.biasButton]}
                  onPress={() => reportBias(explanation.id)}
                >
                  <MaterialCommunityIcons name="flag-outline" size={16} color="#F59E0B" />
                  <Text style={[styles.actionButtonText, styles.biasButtonText]}>
                    Reportar Viés
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 16,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  algorithmButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  algorithmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    marginLeft: 8,
  },
  algorithmInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  algorithmText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  explanationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  explanationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  explanationText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 12,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  confidenceBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginRight: 8,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A90E2',
  },
  factorsContainer: {
    marginBottom: 16,
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  factorText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.48,
  },
  biasButton: {
    backgroundColor: '#FEF3C7',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#4A90E2',
    marginLeft: 4,
    fontWeight: '500',
  },
  biasButtonText: {
    color: '#92400E',
  },
});
