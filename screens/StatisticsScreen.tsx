import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
      <Text style={styles.title}>Estatísticas</Text>
      <ScrollView>
        <View style={styles.card}>
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
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tempo Semanal</Text>
          <View style={styles.statRow}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#4A90E2" />
            <Text style={styles.statValue}>3h 45min</Text>
            <Text style={styles.statChange}>-15% esta semana</Text>
          </View>
        </View>

        <View style={styles.card}>
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
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progresso</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65% do caminho para seu objetivo</Text>
        </View>

        <View style={styles.card}>
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
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Conquistas</Text>
          <View style={styles.achievementsGrid}>
            {( ['compass', 'meditation', 'run', 'heart'] as const).map((icon, index) => (
              <View key={index} style={styles.achievement}>
                <MaterialCommunityIcons name={icon} size={32} color="#4A90E2" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  timelineContainer: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  timelineDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A90E2',
  },
  statChange: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: 'auto',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
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
    color: '#6B7280',
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