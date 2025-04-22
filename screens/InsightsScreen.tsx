import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Insight {
  id: number;
  type: 'explanation' | 'alert' | 'warning' | 'info' | 'positive';
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  description: string;
  action: string;
}

type RootStackParamList = {
  Insights: undefined;
  // Add other routes as needed
};

type InsightsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Insights'>;
};

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  scrollView: ViewStyle;
  insightCard: ViewStyle;
  insightContent: ViewStyle;
  insightTitle: TextStyle;
  insightDescription: TextStyle;
  actionButton: ViewStyle;
  actionText: TextStyle;
}

const insights: Insight[] = [
  {
    id: 1,
    type: 'explanation',
    icon: 'brain',
    title: 'Análise do Seu Perfil',
    description: 'Você foi classificado como moderado porque respondeu "Às vezes" em 3 perguntas sobre comportamento de risco.',
    action: 'Ver detalhes'
  },
  {
    id: 2,
    type: 'alert',
    icon: 'alert-circle-outline',
    title: 'Aumento de Atividade Noturna',
    description: 'Detectamos um aumento de 35% no tempo de navegação após 22h nos últimos 3 dias.',
    action: 'Ver detalhes'
  },
  {
    id: 2,
    type: 'warning',
    icon: 'chart-line',
    title: 'Comparativo de Perfil',
    description: 'Sua média de uso está 20% acima de perfis semelhantes ao seu.',
    action: 'Entender mais'
  },
  {
    id: 3,
    type: 'info',
    icon: 'clock-time-four-outline',
    title: 'Padrão de Horários',
    description: 'Você tende a jogar mais nos fins de semana, especialmente após 21h.',
    action: 'Ver padrões'
  },
  {
    id: 4,
    type: 'positive',
    icon: 'thumb-up-outline',
    title: 'Progresso Detectado',
    description: 'Houve redução de 15% no tempo total de apostas esta semana.',
    action: 'Ver progresso'
  }
];

export default function InsightsScreen({ navigation }: InsightsScreenProps) {
  const insets = useSafeAreaInsets();

  const getInsightColor = (type: Insight['type']): string => {
    switch (type) {
      case 'alert':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#4A90E2';
      case 'positive':
        return '#10B981';
      default:
        return '#4A90E2';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Insights da IA</Text>
      <Text style={styles.subtitle}>
        Análise personalizada baseada nos seus padrões de uso
      </Text>

      <ScrollView style={styles.scrollView}>
        {insights.map((insight) => (
          <View 
            key={insight.id} 
            style={[
              styles.insightCard,
              { borderLeftColor: getInsightColor(insight.type) }
            ]}
          >
            <MaterialCommunityIcons 
              name={insight.icon} 
              size={24} 
              color={getInsightColor(insight.type)} 
            />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>
                {insight.description}
              </Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={[
                  styles.actionText,
                  { color: getInsightColor(insight.type) }
                ]}>
                  {insight.action}
                </Text>
                <MaterialCommunityIcons 
                  name="chevron-right" 
                  size={20} 
                  color={getInsightColor(insight.type)} 
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});