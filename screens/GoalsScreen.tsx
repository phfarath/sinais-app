import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Goal {
  id: number;
  title: string;
  target: string;
  progress: number;
  icon: 'clock-outline' | 'piggy-bank-outline' | 'star-outline';
}

type RootStackParamList = {
  Goals: undefined;
  // Add other routes as needed
};

type GoalsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Goals'>;
};

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  goalCard: ViewStyle;
  goalHeader: ViewStyle;
  goalTitle: TextStyle;
  goalTarget: TextStyle;
  progressContainer: ViewStyle;
  progressBar: ViewStyle;
  progressFill: ViewStyle;
  progressText: TextStyle;
  addButton: ViewStyle;
  addButtonText: TextStyle;
  achievementCard: ViewStyle;
  achievementText: ViewStyle;
  achievementTitle: TextStyle;
  achievementDesc: TextStyle;
}

const goals: Goal[] = [
  {
    id: 1,
    title: 'Reduzir Tempo',
    target: 'Máximo 30min/dia',
    progress: 0.7,
    icon: 'clock-outline',
  },
  {
    id: 2,
    title: 'Economia',
    target: 'Guardar R$100/semana',
    progress: 0.4,
    icon: 'piggy-bank-outline',
  },
  {
    id: 3,
    title: 'Atividades Alternativas',
    target: '3 novas atividades',
    progress: 0.3,
    icon: 'star-outline',
  },
];

export default function GoalsScreen({ navigation }: GoalsScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Minhas Metas</Text>
      
      <ScrollView>
        {goals.map(goal => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <MaterialCommunityIcons name={goal.icon} size={24} color="#4A90E2" />
              <Text style={styles.goalTitle}>{goal.title}</Text>
            </View>
            
            <Text style={styles.goalTarget}>{goal.target}</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${goal.progress * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(goal.progress * 100)}%
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
          <Text style={styles.addButtonText}>Nova Meta</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.achievementCard}>
        <MaterialCommunityIcons name="trophy-outline" size={32} color="#4A90E2" />
        <View style={styles.achievementText}>
          <Text style={styles.achievementTitle}>Próxima Conquista</Text>
          <Text style={styles.achievementDesc}>
            1 semana mantendo todas as metas
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
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
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  goalTarget: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  achievementText: {
    marginLeft: 16,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});