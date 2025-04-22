import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Article {
  id: number;
  title: string;
  type: string;
  duration: string;
  icon: "file-document-outline" | "play-circle-outline" | "chart-line";
}

type RootStackParamList = {
  Educational: undefined;
  ArticleDetail: { articleId: number };
};

type EducationalScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Educational'>;
};

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  card: ViewStyle;
  cardContent: ViewStyle;
  cardTitle: TextStyle;
  cardMeta: ViewStyle;
  cardType: TextStyle;
  cardDuration: TextStyle;
}

const articles: Article[] = [
  {
    id: 1,
    title: '5 Sinais de Comportamento de Risco',
    type: 'Artigo',
    duration: '5 min',
    icon: 'file-document-outline'
  },
  {
    id: 2,
    title: 'Como o Vício em Apostas Afeta o Cérebro',
    type: 'Vídeo',
    duration: '3 min',
    icon: 'play-circle-outline'
  },
  {
    id: 3,
    title: 'Simulador de Investimentos',
    type: 'Ferramenta',
    duration: '2 min',
    icon: 'chart-line'
  }
];

export default function EducationalScreen({ navigation }: EducationalScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Central Educativa</Text>
      
      <ScrollView>
        {articles.map(article => (
          <TouchableOpacity key={article.id} style={styles.card}>
            <MaterialCommunityIcons name={article.icon} size={32} color="#4A90E2" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{article.title}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.cardType}>{article.type}</Text>
                <Text style={styles.cardDuration}>{article.duration}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
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
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  cardType: {
    fontSize: 14,
    color: '#4A90E2',
  },
  cardDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
});