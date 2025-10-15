import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { SupabaseService } from '../services/SupabaseService';
import { UserContext } from '../services/UserContext';

type RootStackParamList = {
  Statistics: undefined;
  // Add other routes as needed
};

type StatisticsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Statistics'>;
};

interface UserActivity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  metadata?: any;
}

interface RiskAssessment {
  id: string;
  risk_level: string;
  score: number;
  assessment_type: string;
  created_at: string;
  notes?: string;
}

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
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
}

export default function StatisticsScreen({ navigation }: StatisticsScreenProps) {
  const insets = useSafeAreaInsets();
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyTime, setWeeklyTime] = useState('0h 0min');
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Load statistics on component mount
  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      console.log('📊 StatisticsScreen - Loading user statistics...');
      
      // Get current user from UserContext
      const currentUser = UserContext.getUser();
      if (!currentUser) {
        console.log('❌ No user found in UserContext');
        setLoading(false);
        return;
      }

      console.log('✅ Found user:', currentUser.id);

      // Load user activities
      const activities = await SupabaseService.getUserActivities(currentUser.id, 10);
      console.log('✅ User activities loaded:', activities.length);
      setUserActivities(activities);

      // Load risk assessments
      const assessments = await SupabaseService.getRiskAssessments(currentUser.id, 5);
      console.log('✅ Risk assessments loaded:', assessments.length);
      setRiskAssessments(assessments);

      // Calculate weekly time from activities
      const weeklyMinutes = calculateWeeklyTime(activities);
      const hours = Math.floor(weeklyMinutes / 60);
      const minutes = weeklyMinutes % 60;
      setWeeklyTime(`${hours}h ${minutes}min`);

      // Calculate progress based on latest risk assessment
      if (assessments.length > 0) {
        const latestAssessment = assessments[0];
        const progress = calculateProgress(latestAssessment.score);
        setProgressPercentage(progress);
      }

    } catch (error) {
      console.error('❌ Error loading statistics:', error);
      // Load demo data as fallback
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyTime = (activities: UserActivity[]): number => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyActivities = activities.filter(activity =>
      new Date(activity.created_at) >= oneWeekAgo
    );

    // Sum time from activities (assuming time is stored in metadata)
    return weeklyActivities.reduce((total, activity) => {
      const duration = activity.metadata?.duration || 0; // minutes
      return total + duration;
    }, 0);
  };

  const calculateProgress = (riskScore: number): number => {
    // Convert risk score to progress percentage (inverse relationship)
    // Lower risk score = higher progress
    return Math.max(0, Math.min(100, 100 - riskScore));
  };

  const loadDemoData = () => {
    console.log('📋 Loading demo statistics...');
    
    const demoActivities: UserActivity[] = [
      {
        id: 'demo-1',
        activity_type: 'alert',
        description: 'Alerta de Tempo',
        created_at: new Date().toISOString(),
        metadata: { duration: 30 }
      },
      {
        id: 'demo-2',
        activity_type: 'mood_improvement',
        description: 'Humor Melhorou',
        created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        metadata: { duration: 15 }
      }
    ];

    const demoAssessments: RiskAssessment[] = [
      {
        id: 'demo-1',
        risk_level: 'Moderado',
        score: 35,
        assessment_type: 'weekly',
        created_at: new Date().toISOString(),
        notes: 'Progresso estável'
      }
    ];

    setUserActivities(demoActivities);
    setRiskAssessments(demoAssessments);
    setWeeklyTime('3h 45min');
    setProgressPercentage(65);
  };

  const getActivityIcon = (activityType: string): any => {
    switch (activityType) {
      case 'alert': return 'alert-circle' as any;
      case 'mood_improvement': return 'emoticon' as any;
      case 'goal_achieved': return 'trophy' as any;
      case 'crisis_avoided': return 'shield-check' as any;
      default: return 'information' as any;
    }
  };

  const getActivityColor = (activityType: string): string => {
    switch (activityType) {
      case 'alert': return '#F59E0B';
      case 'mood_improvement': return '#10B981';
      case 'goal_achieved': return '#4A90E2';
      case 'crisis_avoided': return '#8B5CF6';
      default: return '#64748B';
    }
  };

  const formatActivityDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays <= 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="loading" size={48} color="#4A90E2" />
          <Text style={styles.loadingText}>Carregando estatísticas...</Text>
        </View>
      </View>
    );
  }

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
            {userActivities.slice(0, 5).map((activity) => (
              <View key={activity.id} style={styles.timelineItem}>
                <MaterialCommunityIcons
                  name={getActivityIcon(activity.activity_type)}
                  size={24}
                  color={getActivityColor(activity.activity_type)}
                />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{activity.description}</Text>
                  <Text style={styles.timelineDate}>{formatActivityDate(activity.created_at)}</Text>
                </View>
              </View>
            ))}
            {userActivities.length === 0 && (
              <View style={styles.timelineItem}>
                <MaterialCommunityIcons name="information" size={24} color="#64748B" />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Nenhuma atividade registrada</Text>
                  <Text style={styles.timelineDate}>Comece a usar o app para ver seu histórico</Text>
                </View>
              </View>
            )}
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['#FFFFFF', '#F0F7FF']}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Tempo Semanal</Text>
          <View style={styles.statRow}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#4A90E2" />
            <Text style={styles.statValue}>{weeklyTime}</Text>
            <Text style={styles.statChange}>Últimos 7 dias</Text>
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
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.progressText}>{progressPercentage}% do caminho para seu objetivo</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#FFFFFF', '#F0F7FF']}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Avaliações de Risco</Text>
          <View style={styles.timelineContainer}>
            {riskAssessments.slice(0, 3).map((assessment) => (
              <View key={assessment.id} style={styles.timelineItem}>
                <MaterialCommunityIcons
                  name={assessment.risk_level === 'Alto' ? 'alert' : assessment.risk_level === 'Moderado' ? 'alert-circle' : 'shield-check'}
                  size={24}
                  color={assessment.risk_level === 'Alto' ? '#EF4444' : assessment.risk_level === 'Moderado' ? '#F59E0B' : '#10B981'}
                />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Risco: {assessment.risk_level} (Score: {assessment.score})</Text>
                  <Text style={styles.timelineDate}>{formatActivityDate(assessment.created_at)}</Text>
                </View>
              </View>
            ))}
            {riskAssessments.length === 0 && (
              <View style={styles.timelineItem}>
                <MaterialCommunityIcons name="information" size={24} color="#64748B" />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Nenhuma avaliação de risco</Text>
                  <Text style={styles.timelineDate}>Complete avaliações para acompanhar seu progresso</Text>
                </View>
              </View>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748B',
    marginTop: 16,
    fontWeight: '500',
  },
});