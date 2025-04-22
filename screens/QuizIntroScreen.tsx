import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  QuizIntro: undefined;
  Quiz: undefined;
  Dashboard: undefined;
};

type QuizIntroScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'QuizIntro'>;
};

interface Styles {
  container: ViewStyle;
  scrollContent: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  infoContainer: ViewStyle;
  infoItem: ViewStyle;
  infoText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  skipButton: ViewStyle;
  skipText: TextStyle;
}

export default function QuizIntroScreen({ navigation }: QuizIntroScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="clipboard-check-outline" size={60} color="#4A90E2" />
          <Text style={styles.title}>Avaliação Inicial</Text>
          <Text style={styles.subtitle}>
            Vamos fazer algumas perguntas para entender melhor seu perfil
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#4A90E2" />
            <Text style={styles.infoText}>Leva apenas 2 minutos</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="shield-check-outline" size={24} color="#4A90E2" />
            <Text style={styles.infoText}>Totalmente confidencial</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="chart-box-outline" size={24} color="#4A90E2" />
            <Text style={styles.infoText}>Resultado personalizado</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Quiz')}
        >
          <Text style={styles.buttonText}>Começar Avaliação</Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.skipText}>Pular por enquanto</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: '80%',
  },
  infoContainer: {
    marginBottom: 40,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  skipButton: {
    alignItems: 'center',
    padding: 16,
  },
  skipText: {
    color: '#64748B',
    fontSize: 16,
  },
});