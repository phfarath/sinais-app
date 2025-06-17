import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../App';
import { FontAwesome } from '@expo/vector-icons';
import AIChatScreen from './AIChatScreen'; // Import the new screen
import { useState } from 'react';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>;
  route: any;
};

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  welcome: TextStyle;
  date: TextStyle;
  riskCard: ViewStyle;
  riskTitle: TextStyle;
  riskLevel: TextStyle;
  riskDescription: TextStyle;
  predictionCard: ViewStyle;
  predictionHeader: ViewStyle;
  predictionBadge: TextStyle;
  predictionTitle: TextStyle;
  predictionDescription: TextStyle;
  crisisButton: ViewStyle;
  crisisButtonText: TextStyle;
  whyButton: ViewStyle;
  whyButtonText: TextStyle;
  aiChatButton: ViewStyle;
}

export default function HomeScreen({ navigation, route }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [riskProfile, setRiskProfile] = useState(route.params?.riskProfile || 'Moderado');
  const [isAIChatVisible, setIsAIChatVisible] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.header}
        >
          <Text style={styles.welcome}>Olá, Visitante</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </LinearGradient>

        <LinearGradient
          colors={['#FFFFFF', '#F0F7FF']}
          style={styles.riskCard}
        >
          <MaterialCommunityIcons 
            name="shield-alert-outline" 
            size={32} 
            color="#4A90E2" 
          />
          <Text style={styles.riskTitle}>Seu perfil atual</Text>
          <Text style={styles.riskLevel}>{riskProfile}</Text>
          <Text style={styles.riskDescription}>
            Baseado nas suas respostas, identificamos seu perfil de risco
          </Text>
        </LinearGradient>

        <LinearGradient
          colors={['#FFFFFF', '#FFF7ED']}
          style={styles.predictionCard}
        >
          <View style={styles.predictionHeader}>
            <MaterialCommunityIcons 
              name="trending-up" 
              size={32} 
              color="#F59E0B" 
            />
            <Text style={styles.predictionBadge}>
              <MaterialCommunityIcons name="triangle" size={12} color="#F59E0B" />
              {` Tendência Crescente`} {/* MODIFICADO AQUI */}
            </Text>
          </View>
          <Text style={styles.predictionTitle}>Previsão para esta semana</Text>
          <Text style={styles.predictionDescription}>
            Com base no seu histórico, sua tendência para esta semana é de risco médio crescente.
          </Text>
        </LinearGradient>

        {/* Demonstração de Cybersecurity */}
        <LinearGradient
          colors={['#F0FDF4', '#ECFDF5']}
          style={styles.predictionCard}
        >
          <View style={styles.predictionHeader}>
            <MaterialCommunityIcons 
              name="security" 
              size={32} 
              color="#059669" 
            />
            <Text style={[styles.predictionBadge, { color: '#059669' }]}>
              <MaterialCommunityIcons name="shield-check" size={12} color="#059669" />
              {` Protegido`} {/* MODIFICADO AQUI */}
            </Text>
          </View>
          <Text style={[styles.predictionTitle, { color: '#059669' }]}>
            Cybersecurity Ativo
          </Text>
          <Text style={[styles.predictionDescription, { color: '#065F46' }]}>
            🔐 Criptografia AES protegendo seus dados{'\n'}
            📝 Auditoria completa registrando todas as ações{'\n'}
            🤖 IA explicável tomando decisões transparentes{'\n'}
            ⚖️ Análise de viés garantindo equidade{'\n'}
            🛡️ MFA protegendo seu acesso
          </Text>
        </LinearGradient>

        <TouchableOpacity 
          style={styles.crisisButton}
          onPress={() => navigation.navigate('CrisisMode')}
        >
          <MaterialCommunityIcons name="shield-alert" size={24} color="white" />
          <Text style={styles.crisisButtonText}>Ativar Modo Controle</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.whyButton}
          onPress={() => navigation.navigate('WhyItMatters')}
        >
          <MaterialCommunityIcons name="heart-pulse" size={24} color="#4A90E2" />
          <Text style={styles.whyButtonText}>Por que isso importa?</Text>
        </TouchableOpacity>
      </ScrollView>

      <AIChatScreen
        visible={isAIChatVisible}
        onClose={() => setIsAIChatVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#6B7280',
  },
  riskCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  riskTitle: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 12,
  },
  riskLevel: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginVertical: 8,
  },
  riskDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  predictionCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionBadge: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  predictionDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  crisisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    padding: 16,
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  crisisButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  whyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  whyButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  aiChatButton: {
    position: 'absolute',
    bottom: 80, // Adjust as needed
    right: 20,
    backgroundColor: '#4A90E2', // Or your app's theme color
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});