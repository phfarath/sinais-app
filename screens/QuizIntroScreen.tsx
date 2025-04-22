import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
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
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: '80%',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    gap: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#4B5563',
  },
  button: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
  },
});