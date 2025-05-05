import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

type RootStackParamList = {
  Profile: undefined;
  Login: undefined;
  Settings: undefined;
  // Add other routes as needed
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
  settingButton: ViewStyle;
  settingText: TextStyle;
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
                <View key={index} style={styles.graphBar}>
                  <View 
                    style={[
                      styles.barFill, 
                      { 
                        height: `${item.score}%`,
                        backgroundColor: item.score > 70 ? '#EF4444' : item.score > 50 ? '#F59E0B' : '#10B981'
                      }
                    ]} 
                  />
                  <Text style={styles.barValue}>{item.score}</Text>
                  <Text style={styles.weekLabel}>{item.week}</Text>
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
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
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

          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.settingButton}
          >
            <MaterialCommunityIcons name="shield-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Privacidade</Text>
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
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 16,
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