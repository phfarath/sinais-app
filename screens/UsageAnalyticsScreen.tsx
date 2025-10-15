import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { SupabaseService } from '../services/SupabaseService';
import { UserContext } from '../services/UserContext';

const screenWidth = Dimensions.get('window').width;

interface UserActivity {
   id: string;
   activity_type: string;
   description: string;
   created_at: string;
   metadata?: any;
}

interface UsageStats {
   totalScreenTime: number;
   averageDaily: number;
   productiveTime: number;
   distractingTime: number;
}

interface AppUsageData {
   appName: string;
   icon: string;
   category: string;
   todayMinutes: number;
   yesterdayMinutes: number;
   weeklyData: number[];
}

export default function UsageAnalyticsScreen() {
   const insets = useSafeAreaInsets();
   const [usageData, setUsageData] = useState<AppUsageData[]>([]);
   const [stats, setStats] = useState<UsageStats | null>(null);
   const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('📊 UsageAnalyticsScreen - Loading usage data...');

      const currentUser = UserContext.getUser();
      if (!currentUser) {
        console.log('❌ No user found for usage analytics');
        loadDemoData();
        return;
      }

      console.log('✅ Found user:', currentUser.id);

      // Load user activities from database
      const activities = await SupabaseService.getUserActivities(currentUser.id, 50);
      console.log('✅ User activities loaded:', activities.length);

      // Process activities into usage data
      const processedData = processActivitiesIntoUsageData(activities);
      const statistics = calculateUsageStats(activities);

      setUsageData(processedData);
      setStats(statistics);

    } catch (error) {
      console.error('❌ Error loading usage data:', error);
      loadDemoData();
    } finally {
      setIsLoading(false);
    }
  };

  const processActivitiesIntoUsageData = (activities: UserActivity[]): AppUsageData[] => {
    // Group activities by type and calculate usage times
    const activityGroups: { [key: string]: UserActivity[] } = {};

    activities.forEach(activity => {
      if (!activityGroups[activity.activity_type]) {
        activityGroups[activity.activity_type] = [];
      }
      activityGroups[activity.activity_type].push(activity);
    });

    // Convert to AppUsageData format
    return Object.entries(activityGroups).slice(0, 5).map(([type, activities]) => {
      const todayActivities = activities.filter(a =>
        new Date(a.created_at).toDateString() === new Date().toDateString()
      );
      const yesterdayActivities = activities.filter(a =>
        new Date(a.created_at).toDateString() === new Date(Date.now() - 86400000).toDateString()
      );

      const todayMinutes = todayActivities.reduce((sum, a) => sum + (a.metadata?.duration || 5), 0);
      const yesterdayMinutes = yesterdayActivities.reduce((sum, a) => sum + (a.metadata?.duration || 5), 0);

      return {
        appName: getActivityDisplayName(type),
        icon: getActivityIcon(type),
        category: getActivityCategory(type),
        todayMinutes,
        yesterdayMinutes,
        weeklyData: generateWeeklyData(activities)
      };
    });
  };

  const calculateUsageStats = (activities: UserActivity[]): UsageStats => {
    const today = new Date();
    const todayActivities = activities.filter(a =>
      new Date(a.created_at).toDateString() === today.toDateString()
    );

    const totalScreenTime = todayActivities.reduce((sum, a) => sum + (a.metadata?.duration || 5), 0);

    // Calculate average from last 7 days
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyActivities = activities.filter(a => new Date(a.created_at) >= weekAgo);
    const averageDaily = weeklyActivities.length > 0 ?
      weeklyActivities.reduce((sum, a) => sum + (a.metadata?.duration || 5), 0) / 7 : 0;

    // Categorize time (simplified logic)
    const productiveTime = todayActivities
      .filter(a => ['goal_achieved', 'mood_improvement'].includes(a.activity_type))
      .reduce((sum, a) => sum + (a.metadata?.duration || 5), 0);

    const distractingTime = todayActivities
      .filter(a => ['alert'].includes(a.activity_type))
      .reduce((sum, a) => sum + (a.metadata?.duration || 5), 0);

    return {
      totalScreenTime,
      averageDaily,
      productiveTime,
      distractingTime
    };
  };

  const getActivityDisplayName = (type: string): string => {
    const names: { [key: string]: string } = {
      'alert': 'Alertas',
      'mood_improvement': 'Bem-estar',
      'goal_achieved': 'Metas',
      'crisis_avoided': 'Prevenção',
      'default': 'Atividades'
    };
    return names[type] || names.default;
  };

  const getActivityIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      'alert': '⚠️',
      'mood_improvement': '😊',
      'goal_achieved': '🎯',
      'crisis_avoided': '🛡️',
      'default': '📱'
    };
    return icons[type] || icons.default;
  };

  const getActivityCategory = (type: string): string => {
    const categories: { [key: string]: string } = {
      'alert': 'segurança',
      'mood_improvement': 'bem-estar',
      'goal_achieved': 'produtividade',
      'crisis_avoided': 'segurança',
      'default': 'geral'
    };
    return categories[type] || categories.default;
  };

  const generateWeeklyData = (activities: UserActivity[]): number[] => {
    const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat

    activities.forEach(activity => {
      const date = new Date(activity.created_at);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      weeklyData[dayOfWeek] += activity.metadata?.duration || 5;
    });

    return weeklyData;
  };

  const loadDemoData = () => {
    console.log('📋 Loading demo usage data...');

    const demoData: AppUsageData[] = [
      {
        appName: 'Alertas',
        icon: '⚠️',
        category: 'segurança',
        todayMinutes: 45,
        yesterdayMinutes: 30,
        weeklyData: [20, 35, 40, 25, 45, 50, 30]
      },
      {
        appName: 'Bem-estar',
        icon: '😊',
        category: 'bem-estar',
        todayMinutes: 30,
        yesterdayMinutes: 25,
        weeklyData: [15, 20, 25, 30, 35, 30, 25]
      },
      {
        appName: 'Metas',
        icon: '🎯',
        category: 'produtividade',
        todayMinutes: 25,
        yesterdayMinutes: 40,
        weeklyData: [10, 15, 20, 25, 30, 35, 25]
      }
    ];

    const demoStats: UsageStats = {
      totalScreenTime: 100,
      averageDaily: 85,
      productiveTime: 55,
      distractingTime: 25
    };

    setUsageData(demoData);
    setStats(demoStats);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    return `${hours}h ${mins}min`;
  };

  // Prepare chart data
  const weeklyData = {
    labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    datasets: [{
      data: usageData.length > 0 ? usageData[0].weeklyData : [0, 0, 0, 0, 0, 0, 0],
    }]
  };

  const topAppsData = {
    labels: usageData.slice(0, 5).map(app => app.appName.substring(0, 8)), // Truncate long names
    datasets: [{
      data: usageData.slice(0, 5).map(app => app.todayMinutes),
    }]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#f8fafc',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4A90E2',
    },
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <MaterialCommunityIcons name="chart-line" size={48} color="white" />
        <Text style={styles.headerTitle}>Análise de Uso</Text>
        <Text style={styles.headerSubtitle}>
          Monitore seu tempo de tela
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Stats Overview */}
        {stats && (
          <View style={styles.statsGrid}>
            <LinearGradient
              colors={['#FFFFFF', '#F0F7FF']}
              style={styles.statCard}
            >
              <MaterialCommunityIcons name="clock-outline" size={28} color="#4A90E2" />
              <Text style={styles.statValue}>{formatTime(stats.totalScreenTime)}</Text>
              <Text style={styles.statLabel}>Hoje</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#FFFFFF', '#FFF0F0']}
              style={styles.statCard}
            >
              <MaterialCommunityIcons name="trending-up" size={28} color="#EF4444" />
              <Text style={styles.statValue}>{formatTime(stats.averageDaily)}</Text>
              <Text style={styles.statLabel}>Média Diária</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#FFFFFF', '#F0FDF4']}
              style={styles.statCard}
            >
              <MaterialCommunityIcons name="briefcase" size={28} color="#10B981" />
              <Text style={styles.statValue}>{formatTime(stats.productiveTime)}</Text>
              <Text style={styles.statLabel}>Produtivo</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#FFFFFF', '#FEF3C7']}
              style={styles.statCard}
            >
              <MaterialCommunityIcons name="alert" size={28} color="#F59E0B" />
              <Text style={styles.statValue}>{formatTime(stats.distractingTime)}</Text>
              <Text style={styles.statLabel}>Distrações</Text>
            </LinearGradient>
          </View>
        )}

        {/* Weekly Trend Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Tendência Semanal</Text>
          <Text style={styles.sectionSubtitle}>
            Tempo de uso nos últimos 7 dias
          </Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={weeklyData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Top Apps Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Apps Mais Usados Hoje</Text>
          <Text style={styles.sectionSubtitle}>
            Tempo em minutos por aplicativo
          </Text>
          <View style={styles.chartContainer}>
            <BarChart
               data={topAppsData}
               width={screenWidth - 48}
               height={220}
               chartConfig={chartConfig}
               style={styles.chart}
               showValuesOnTopOfBars
               fromZero
               yAxisLabel=""
               yAxisSuffix="min"
             />
          </View>
        </View>

        {/* App Usage Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Detalhes de Uso</Text>
          {usageData.map((app, index) => (
            <LinearGradient
              key={index}
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.appDetailCard}
            >
              <View style={styles.appDetailHeader}>
                <Text style={styles.appDetailIcon}>{app.icon}</Text>
                <View style={styles.appDetailInfo}>
                  <Text style={styles.appDetailName}>{app.appName}</Text>
                  <Text style={styles.appDetailCategory}>
                    {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.appDetailStats}>
                <View style={styles.appDetailStat}>
                  <Text style={styles.appDetailStatLabel}>Hoje</Text>
                  <Text style={styles.appDetailStatValue}>
                    {formatTime(app.todayMinutes)}
                  </Text>
                </View>
                
                <View style={styles.appDetailStat}>
                  <Text style={styles.appDetailStatLabel}>Ontem</Text>
                  <Text style={styles.appDetailStatValue}>
                    {formatTime(app.yesterdayMinutes)}
                  </Text>
                </View>
                
                <View style={styles.appDetailStat}>
                  <Text style={styles.appDetailStatLabel}>Variação</Text>
                  <Text style={[
                    styles.appDetailStatValue,
                    { color: app.todayMinutes < app.yesterdayMinutes ? '#10B981' : '#EF4444' }
                  ]}>
                    {app.todayMinutes < app.yesterdayMinutes ? '↓' : '↑'}
                    {Math.abs(app.todayMinutes - app.yesterdayMinutes)}min
                  </Text>
                </View>
              </View>
            </LinearGradient>
          ))}
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsSection}>
          <LinearGradient
            colors={['#EFF6FF', '#DBEAFE']}
            style={styles.recommendationCard}
          >
            <MaterialCommunityIcons name="lightbulb-on" size={32} color="#4A90E2" />
            <Text style={styles.recommendationTitle}>Sugestão IA</Text>
            <Text style={styles.recommendationText}>
              {stats && stats.distractingTime > 120
                ? 'Você passou mais de 2 horas em apps de distração. Considere ativar o modo foco.'
                : 'Ótimo trabalho! Seu tempo produtivo está acima da média.'}
            </Text>
          </LinearGradient>
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
    alignItems: 'center',
    padding: 24,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (screenWidth - 48) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chart: {
    borderRadius: 16,
  },
  detailsSection: {
    marginBottom: 24,
  },
  appDetailCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  appDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  appDetailIcon: {
    fontSize: 32,
  },
  appDetailInfo: {
    flex: 1,
  },
  appDetailName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  appDetailCategory: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  appDetailStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appDetailStat: {
    alignItems: 'center',
  },
  appDetailStatLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  appDetailStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  recommendationsSection: {
    marginBottom: 30,
  },
  recommendationCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
