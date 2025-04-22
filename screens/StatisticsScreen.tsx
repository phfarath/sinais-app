import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  Statistics: undefined;
  // Add other routes as needed
};

type StatisticsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Statistics'>;
};

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  card: ViewStyle;
  cardTitle: TextStyle;
  timelineContainer: ViewStyle;
  timelineItem: ViewStyle;
  timelineContent: ViewStyle;
  timelineTitle: TextStyle;
  timelineDate: TextStyle;
  statRow: ViewStyle;
  statValue: TextStyle;
  statChange: TextStyle;
  progressBar: ViewStyle;
  progressFill: ViewStyle;
  progressText: TextStyle;
  achievementsGrid: ViewStyle;
  achievement: ViewStyle;
}

export default function StatisticsScreen({ navigation }: StatisticsScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={{ paddingBottom: 16 }}
      >
        <Text style={styles.title}>Estatísticas</Text>
      </LinearGradient>
      
      <ScrollView>
        <LinearGradient
          colors={['#FFFFFF', '#F0F7FF']}
          style={styles.card}
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

        <LinearGradient
          colors={['#FFFFFF', '#F0F7FF']}
          style={styles.card}
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
          style={styles.card}
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
          style={styles.card}
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

        <LinearGradient
          colors={['#FFFFFF', '#F0F7FF']}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Conquistas</Text>
          <View style={styles.achievementsGrid}>
            {( ['compass', 'meditation', 'run', 'heart'] as const).map((icon, index) => (
              <View key={index} style={styles.achievement}>
                <MaterialCommunityIcons name={icon} size={32} color="#4A90E2" />
              </View>
            ))}
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    padding: 20,
    marginBottom: 8,
  },
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  timelineContainer: {
    gap: 16,
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
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 12,
    marginRight: 'auto',
  },
  statChange: {
    fontSize: 14,
    color: '#64748B',
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
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  achievement: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});