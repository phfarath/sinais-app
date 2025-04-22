import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

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
        <View style={styles.header}>
          <Text style={styles.welcome}>Olá, Visitante</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </View>        <View style={styles.riskCard}>
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
        </View>

        <View style={styles.predictionCard}>
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
        </View>        <TouchableOpacity 
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
    backgroundColor: '#F5F8FF',
  },
  header: {
    padding: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  date: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  riskCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  riskTitle: {
    fontSize: 18,
    color: '#4B5563',
    marginTop: 12,
  },
  riskLevel: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A90E2',
    marginTop: 8,
  },
  riskDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
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
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  predictionBadge: {
    backgroundColor: '#FFFBEB',
    color: '#F59E0B',
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  predictionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  predictionDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  alertButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  alertButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});