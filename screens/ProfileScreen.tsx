import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle, TextStyle, Alert, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { FaceRecognitionService } from '../services/FaceRecognitionService';

type RootStackParamList = {
  Profile: undefined;
  Login: undefined;
  Settings: undefined;
  OpenFinance: undefined;
  DataControl: undefined;
  ExplanationAudit: undefined;
  BiasAnalysis: undefined;
  CrisisMode: undefined;
  FaceRegistration: {
    userId: string;
    riskProfile?: 'Conservador' | 'Moderado' | 'Impulsivo';
    score?: number;
  };
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  name: TextStyle;
  subtitle: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  alertCard: ViewStyle;
  alertInfo: ViewStyle;
  alertTitle: TextStyle;
  alertDate: TextStyle;
  alertBadge: TextStyle; // Added this line
  settingButton: ViewStyle;
  settingText: TextStyle;
  settingTextContainer: ViewStyle;
  settingSubtext: TextStyle;
  deleteButton: ViewStyle;
  deleteButtonText: TextStyle;
  riskIndicator: ViewStyle;
  riskIndicatorText: TextStyle;
  scoreCard: ViewStyle;
  scoreTitle: TextStyle;
  graphContainer: ViewStyle;
  graphBar: ViewStyle;
  barFill: ViewStyle;
  barLabel: TextStyle;
  barValue: TextStyle;
  weekLabel: TextStyle;
  scoreCardHeader: ViewStyle;
  scoreValue: TextStyle;
}

// Mock data for the score graph
const scoreData = [
  { week: 'Sem 1', score: 65 },
  { week: 'Sem 2', score: 72 },
  { week: 'Sem 3', score: 58 },
  { week: 'Sem 4', score: 45 }
];

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  // Current risk level state (low, medium, high)
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Face recognition states
  const [faceRecognitionEnabled, setFaceRecognitionEnabled] = useState(false);
  const [faceRegistered, setFaceRegistered] = useState(false);
  const [userId] = useState('user_' + Date.now()); // Mock user ID

  // Function to get color based on risk level
  const getRiskColor = () => {
    switch(riskLevel) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  // Function to get icon based on risk level
  const getRiskIcon = () => {
    switch(riskLevel) {
      case 'low': return 'shield-check';
      case 'medium': return 'shield-alert';
      case 'high': return 'shield-off';
      default: return 'shield-alert';
    }
  };

  // Function to get risk level text
  const getRiskText = () => {
    switch(riskLevel) {
      case 'low': return 'Baixo';
      case 'medium': return 'Médio';
      case 'high': return 'Alto';
      default: return 'Médio';
    }
  };

  // Check face registration status on component mount
  useEffect(() => {
    const checkFaceRegistration = async () => {
      try {
        const status = await FaceRecognitionService.getFaceRegistrationStatus(userId);
        setFaceRegistered(status.face_registered);
        setFaceRecognitionEnabled(status.face_registered);
      } catch (error) {
        console.error('Error checking face registration status:', error);
      }
    };
    
    checkFaceRegistration();
  }, [userId]);

  const handleFaceRecognitionToggle = async (value: boolean) => {
    if (!faceRegistered && value) {
      // Navigate to face registration
      navigation.navigate('FaceRegistration', {
        userId,
        riskProfile: 'Moderado', // Mock data
        score: 45 // Mock data
      });
      return;
    }

    if (faceRegistered && !value) {
      Alert.alert(
        'Desativar Reconhecimento Facial',
        'Tem certeza que deseja desativar o reconhecimento facial? Você poderá reativá-lo a qualquer momento.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Desativar',
            style: 'destructive',
            onPress: () => {
              setFaceRecognitionEnabled(false);
            }
          }
        ]
      );
      return;
    }

    setFaceRecognitionEnabled(value);
  };

  const handleDeleteFaceData = async () => {
    Alert.alert(
      'Excluir Dados Faciais',
      'Tem certeza que deseja excluir permanentemente seus dados faciais? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await FaceRecognitionService.deleteFaceRegistration(userId);
              if (result.success) {
                setFaceRegistered(false);
                setFaceRecognitionEnabled(false);
                Alert.alert('Sucesso', 'Seus dados faciais foram excluídos com sucesso.');
              } else {
                Alert.alert('Erro', result.message || 'Não foi possível excluir seus dados faciais.');
              }
            } catch (error) {
              Alert.alert('Erro', 'Ocorreu um erro ao excluir seus dados faciais.');
            }
          }
        }
      ]
    );
  };

  const handleReregisterFace = () => {
    navigation.navigate('FaceRegistration', {
      userId,
      riskProfile: 'Moderado', // Mock data
      score: 45 // Mock data
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView>
        <LinearGradient
          colors={['#FFFFFF', '#F0F7FF']}
          style={styles.header}
        >
          <MaterialCommunityIcons name="account-circle" size={80} color="#4A90E2" />
          <Text style={styles.name}>Visitante</Text>
          <Text style={styles.subtitle}>Perfil Anônimo</Text>
          
          <View style={[styles.riskIndicator, { backgroundColor: getRiskColor() }]}>
            <MaterialCommunityIcons name={getRiskIcon()} size={24} color="white" />
            <Text style={styles.riskIndicatorText}>Nível de Risco: {getRiskText()}</Text>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score de Comportamento</Text>
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.scoreCard}
          >
            <View style={styles.scoreCardHeader}>
              <MaterialCommunityIcons name="trending-down" size={24} color="#10B981" />
              <Text style={styles.scoreTitle}>Seu Score</Text>
              <Text style={styles.scoreValue}>45</Text>
            </View>
            
            <View style={styles.graphContainer}>
              {scoreData.map((item, index) => (
                <View key={`score-${index}-${item.week}`} style={styles.graphBar}>
                  <View 
                    style={[
                      styles.barFill, 
                      { 
                        height: `${item.score}%`,
                        backgroundColor: item.score > 70 ? '#EF4444' : item.score > 50 ? '#F59E0B' : '#10B981'
                      }
                    ]} 
                  />
                  <Text style={styles.barValue}>{String(item.score)}</Text>
                  <Text style={styles.weekLabel}>{String(item.week)}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Alertas</Text>
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.alertCard}
          >
            <MaterialCommunityIcons name="clock-outline" size={24} color="#4A90E2" />
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>Alerta de Tempo</Text>
              <Text style={styles.alertDate}>Hoje, 14:30</Text>
            </View>
            <Text style={styles.alertBadge}>
              <MaterialCommunityIcons name="clock-fast" size={12} color="#F59E0B" />
              {` Resolvido`} {/* CORRIGIDO: template string */}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <View style={styles.settingButton}>
            <MaterialCommunityIcons name="face-recognition" size={24} color="#4A90E2" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Reconhecimento Facial</Text>
              <Text style={styles.settingSubtext}>
                {faceRegistered ? 'Rosto registrado' : 'Rosto não registrado'}
              </Text>
            </View>
            <Switch
              value={faceRecognitionEnabled}
              onValueChange={handleFaceRecognitionToggle}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={faceRecognitionEnabled ? '#4A90E2' : '#F4F4F5'}
            />
          </View>

          {faceRegistered && (
            <>
              <TouchableOpacity
                style={styles.settingButton}
                onPress={handleReregisterFace}
              >
                <MaterialCommunityIcons name="face-recognition" size={24} color="#10B981" />
                <Text style={styles.settingText}>Atualizar Rosto Registrado</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingButton}
                onPress={handleDeleteFaceData}
              >
                <MaterialCommunityIcons name="delete-outline" size={24} color="#DC2626" />
                <Text style={[styles.settingText, { color: '#DC2626' }]}>Excluir Dados Faciais</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#DC2626" />
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialCommunityIcons name="cog-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Configurações do Perfil</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </TouchableOpacity>
          
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.settingButton}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Notificações</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </LinearGradient>

          <TouchableOpacity 
            style={[styles.settingButton]}
            onPress={() => navigation.navigate('DataControl')}
          >
            <MaterialCommunityIcons name="shield-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Controle de Dados (LGPD)</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingButton, { marginTop: 8 }]}
            onPress={() => navigation.navigate('OpenFinance')}
          >
            <MaterialCommunityIcons name="bank-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Conectar com meu banco</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transparência e Segurança</Text>
          
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={() => navigation.navigate('ExplanationAudit')}
          >
            <MaterialCommunityIcons name="file-document-outline" size={24} color="#10B981" />
            <Text style={styles.settingText}>Auditoria de Decisões da IA</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={() => navigation.navigate('BiasAnalysis')}
          >
            <MaterialCommunityIcons name="chart-line" size={24} color="#F59E0B" />
            <Text style={styles.settingText}>Análise de Viés e Equidade</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </TouchableOpacity>

          <LinearGradient
            colors={['#F0FDF4', '#ECFDF5']}
            style={styles.settingButton}
          >
            <MaterialCommunityIcons name="security" size={24} color="#059669" />
            <Text style={styles.settingText}>Relatório de Segurança</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </LinearGradient>
        </View>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => navigation.navigate('Login')}
        >
          <MaterialCommunityIcons name="delete-outline" size={24} color="#DC2626" />
          <Text style={styles.deleteButtonText}>Excluir meus dados</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  riskIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginLeft: 12,
  },
  scoreCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 160,
    alignItems: 'flex-end',
  },
  graphBar: {
    width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '60%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
  },
  weekLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertInfo: {
    marginLeft: 16,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  alertDate: {
    fontSize: 14,
    color: '#64748B',
  },
  alertBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B', // Example color, adjust as needed
    marginLeft: 'auto', // Pushes the badge to the right
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFFBEB', // Example background, adjust as needed
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 16,
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    margin: 20,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
});