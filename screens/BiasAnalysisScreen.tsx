import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BiasAnalyzer, BiasReport, UserData } from '../services/BiasAnalyzer';
import { AuditService } from '../services/AuditService';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  BiasAnalysis: undefined;
  Settings: undefined;
  ExplanationAudit: undefined;
};

type BiasAnalysisScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BiasAnalysis'>;
};

export default function BiasAnalysisScreen({ navigation }: BiasAnalysisScreenProps) {
  const insets = useSafeAreaInsets();
  const [biasReport, setBiasReport] = useState<BiasReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);

  useEffect(() => {
    loadLastAnalysis();
  }, []);

  const loadLastAnalysis = async () => {
    try {
      // Carregar última análise dos logs de auditoria
      const logs = AuditService.getLogs('system', 'BIAS_ANALYSIS_COMPLETED');
      if (logs.length > 0) {
        const lastLog = logs[logs.length - 1];
        setLastAnalysisTime(lastLog.timestamp);
        // Em um app real, carregaria o relatório completo
        await runBiasAnalysis();
      }
    } catch (error) {
      console.error('Erro ao carregar análise anterior:', error);
    }
  };

  const runBiasAnalysis = async () => {
    setIsLoading(true);
    try {
      // Simular dados de usuários para análise
      const sampleUserData: UserData[] = generateSampleUserData();
      
      const report = BiasAnalyzer.analyzeBias(sampleUserData);
      setBiasReport(report);
      setLastAnalysisTime(new Date());
    } catch (error) {
      console.error('Erro na análise de viés:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleUserData = (): UserData[] => {
    // Gerar dados simulados para demonstração
    const userData: UserData[] = [];
    const genders = ['male', 'female', 'other'];
    const locations = ['SP', 'RJ', 'MG', 'RS', 'PR'];

    for (let i = 0; i < 200; i++) {
      userData.push({
        id: `user_${i}`,
        age: Math.floor(Math.random() * 60) + 18,
        gender: genders[Math.floor(Math.random() * genders.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        riskScore: Math.random(),
        bettingBehavior: {},
        decisions: []
      });
    }

    return userData;
  };

  const getBiasLevelColor = (score: number): string => {
    if (score < 0.3) return '#10B981'; // Verde - baixo viés
    if (score < 0.6) return '#F59E0B'; // Amarelo - médio viés
    return '#EF4444'; // Vermelho - alto viés
  };

  const getBiasLevelText = (score: number): string => {
    if (score < 0.3) return 'Baixo';
    if (score < 0.6) return 'Médio';
    return 'Alto';
  };

  const renderDemographicChart = () => {
    if (!biasReport) return null;

    const { ageGroups, genderDistribution } = biasReport.demographicBias;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribuição Demográfica</Text>
        
        <View style={styles.chartSection}>
          <Text style={styles.chartSubtitle}>Por Faixa Etária</Text>
          {Object.entries(ageGroups).map(([ageGroup, count]) => (
            <View key={ageGroup} style={styles.chartBar}>
              <Text style={styles.chartLabel}>{ageGroup}</Text>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      width: `${(count / Math.max(...Object.values(ageGroups))) * 100}%`,
                      backgroundColor: '#4A90E2'
                    }
                  ]} 
                />
                <Text style={styles.barValue}>{count}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.chartSubtitle}>Por Gênero</Text>
          {Object.entries(genderDistribution).map(([gender, count]) => (
            <View key={gender} style={styles.chartBar}>
              <Text style={styles.chartLabel}>{gender}</Text>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      width: `${(count / Math.max(...Object.values(genderDistribution))) * 100}%`,
                      backgroundColor: '#10B981'
                    }
                  ]} 
                />
                <Text style={styles.barValue}>{count}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFairnessMetrics = () => {
    if (!biasReport) return null;

    const { fairnessMetrics } = biasReport.behaviorBias;

    return (
      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>Métricas de Equidade</Text>
        
        <View style={styles.metricCard}>
          <MaterialCommunityIcons name="scale-balance" size={24} color="#4A90E2" />
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Paridade Demográfica</Text>
            <Text style={styles.metricValue}>
              {(fairnessMetrics.demographicParity * 100).toFixed(1)}%
            </Text>
          </View>
          <View style={[
            styles.metricIndicator,
            { backgroundColor: fairnessMetrics.demographicParity > 0.8 ? '#10B981' : '#F59E0B' }
          ]} />
        </View>

        <View style={styles.metricCard}>
          <MaterialCommunityIcons name="equal-box" size={24} color="#4A90E2" />
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Odds Equalizadas</Text>
            <Text style={styles.metricValue}>
              {(fairnessMetrics.equalizedOdds * 100).toFixed(1)}%
            </Text>
          </View>
          <View style={[
            styles.metricIndicator,
            { backgroundColor: fairnessMetrics.equalizedOdds > 0.8 ? '#10B981' : '#F59E0B' }
          ]} />
        </View>

        <View style={styles.metricCard}>
          <MaterialCommunityIcons name="account-group" size={24} color="#4A90E2" />
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Score de Equidade</Text>
            <Text style={styles.metricValue}>
              {(fairnessMetrics.equityScore * 100).toFixed(1)}%
            </Text>
          </View>
          <View style={[
            styles.metricIndicator,
            { backgroundColor: fairnessMetrics.equityScore > 0.8 ? '#10B981' : '#F59E0B' }
          ]} />
        </View>
      </View>
    );
  };

  const renderRecommendations = () => {
    if (!biasReport || biasReport.recommendations.length === 0) return null;

    return (
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>Recomendações</Text>
        {biasReport.recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationCard}>
            <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#F59E0B" />
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Análise de Viés</Text>
        <TouchableOpacity onPress={runBiasAnalysis} disabled={isLoading}>
          <MaterialCommunityIcons 
            name="refresh" 
            size={24} 
            color={isLoading ? "#9CA3AF" : "#4A90E2"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {biasReport && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <MaterialCommunityIcons name="chart-line" size={32} color="#4A90E2" />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryTitle}>Score Geral de Viés</Text>
                <Text style={[
                  styles.summaryScore,
                  { color: getBiasLevelColor(biasReport.overallBiasScore) }
                ]}>
                  {getBiasLevelText(biasReport.overallBiasScore)} ({(biasReport.overallBiasScore * 100).toFixed(1)}%)
                </Text>
              </View>
            </View>
            {lastAnalysisTime && (
              <Text style={styles.summaryDate}>
                Última análise: {lastAnalysisTime.toLocaleDateString('pt-BR')} às {lastAnalysisTime.toLocaleTimeString('pt-BR')}
              </Text>
            )}
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <MaterialCommunityIcons name="loading" size={48} color="#4A90E2" />
            <Text style={styles.loadingText}>Analisando dados...</Text>
          </View>
        ) : (
          <>
            {renderDemographicChart()}
            {renderFairnessMetrics()}
            {renderRecommendations()}
          </>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={runBiasAnalysis}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="play" size={20} color="white" />
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Analisando...' : 'Nova Análise'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('ExplanationAudit')}
          >
            <MaterialCommunityIcons name="file-document-outline" size={20} color="#4A90E2" />
            <Text style={styles.secondaryButtonText}>Ver Auditoria de IA</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryInfo: {
    marginLeft: 16,
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryScore: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  chartSection: {
    marginBottom: 20,
  },
  chartSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 12,
  },
  chartBar: {
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  barValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
  metricsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
  },
  metricInfo: {
    flex: 1,
    marginLeft: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  metricIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  recommendationsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    marginLeft: 8,
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 20,
    paddingBottom: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  secondaryButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
