import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  Alert: undefined;
  Statistics: undefined;
  Educational: undefined;
  Breathing: undefined;
  Goals: undefined;
  Help: undefined;
  Insights: undefined;
  OpenFinance: undefined;
  WhyItMatters: undefined;
  Profile: undefined;
  CrisisMode: undefined;
  Dashboard: { riskProfile?: string };
  Monitoring: undefined;
};

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
  route: RouteProp<RootStackParamList, 'Dashboard'>;
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
  actionsGrid: ViewStyle;
  actionCard: ViewStyle;
  actionTitle: TextStyle;
  crisisButton: ViewStyle;
  crisisButtonText: TextStyle;
  predictionCard: ViewStyle;
  predictionHeader: ViewStyle;
  predictionBadge: TextStyle;
  predictionTitle: TextStyle;
  predictionDescription: TextStyle;
  alertButton: ViewStyle;
  alertButtonText: TextStyle;
}

export default function DashboardScreen({ navigation, route }: DashboardScreenProps) {
  const insets = useSafeAreaInsets();
  const riskProfile = route.params?.riskProfile || 'Moderado';

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
              {" "}Tendência Crescente
            </Text>
          </View>
          <Text style={styles.predictionTitle}>Previsão para esta semana</Text>
          <Text style={styles.predictionDescription}>
            Com base no seu histórico, sua tendência para esta semana é de risco médio crescente.
          </Text>
          <TouchableOpacity 
            style={styles.alertButton}
            onPress={() => navigation.navigate('Alert')}
          >
            <Text style={styles.alertButtonText}>Receber mais alertas</Text>
            <MaterialCommunityIcons name="bell-plus" size={20} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity 
          style={styles.crisisButton}
          onPress={() => navigation.navigate('CrisisMode')}
        >
          <MaterialCommunityIcons name="shield-alert" size={24} color="white" />
          <Text style={styles.crisisButtonText}>Ativar Modo Controle</Text>
        </TouchableOpacity>

        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Alert')}
          >
            <MaterialCommunityIcons name="bell-outline" size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>Alertas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Statistics')}
          >
            <MaterialCommunityIcons name="chart-line" size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>Estatísticas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Monitoring')}
          >
            <MaterialCommunityIcons name="eye-outline" size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>Monitoramento</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Educational')}
          >
            <MaterialCommunityIcons name="school-outline" size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>Aprender</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Breathing')}
          >
            <MaterialCommunityIcons name="meditation" size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>Respiração</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Goals')}
          >
            <MaterialCommunityIcons name="target" size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>Metas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Help')}
          >
            <MaterialCommunityIcons name="hand-heart-outline" size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>Ajuda</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Insights')}
          >
            <MaterialCommunityIcons name="brain" size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>Insights IA</Text>
          </TouchableOpacity>          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('OpenFinance')}
          >
            <MaterialCommunityIcons name="bank" size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>Open Finance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('WhyItMatters')}
          >
            <MaterialCommunityIcons name="heart-pulse" size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>Por que isso importa?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <MaterialCommunityIcons name="account-outline" size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  crisisButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  crisisButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#64748B',
  },
  riskCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  riskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 12,
  },
  riskLevel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginVertical: 8,
  },
  riskDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  actionCard: {
    backgroundColor: 'white',
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 12,
    fontWeight: '500',  },
  predictionCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
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
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
  },
  alertButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});