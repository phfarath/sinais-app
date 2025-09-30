import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Question {
  id: number;
  question: string;
  options: string[];
}

type RootStackParamList = {
  Quiz: undefined;
  MainTabs: {
    riskProfile: 'Conservador' | 'Moderado' | 'Impulsivo';
    score: number;
  };
  Dashboard: {
    riskProfile: 'Conservador' | 'Moderado' | 'Impulsivo';
    score: number;
  };
};

type QuizScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
};

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  progress: TextStyle;
  progressBar: ViewStyle;
  progressFill: ViewStyle;
  content: ViewStyle;
  question: TextStyle;
  options: ViewStyle;
  optionButton: ViewStyle;
  selectedOption: ViewStyle;
  optionText: TextStyle;
  selectedOptionText: TextStyle;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Você costuma apostar quando está triste ou ansioso?',
    options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente']
  },
  {
    id: 2,
    question: 'Já gastou mais do que planejava em apostas?',
    options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente']
  },
  {
    id: 3,
    question: 'Esconde de amigos ou familiares que faz apostas?',
    options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente']
  },
  {
    id: 4,
    question: 'Sente necessidade de recuperar perdas apostando mais?',
    options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente']
  },
  {
    id: 5,
    question: 'As apostas afetam suas atividades diárias?',
    options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente']
  }
];

export default function QuizScreen({ navigation }: QuizScreenProps) {
  const insets = useSafeAreaInsets();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateAndNavigate(newAnswers);
    }
  };

  const calculateAndNavigate = (finalAnswers: Record<number, string>) => {
    const scores: Record<string, number> = { 
      'Nunca': 0, 
      'Raramente': 1, 
      'Às vezes': 2, 
      'Frequentemente': 3 
    };

    const riskScore = Object.values(finalAnswers).reduce((acc, val) => 
      acc + scores[val], 0);

    const maxScore = questions.length * 3;
    const riskLevel = riskScore / maxScore;
    
    navigation.navigate('MainTabs', {
      riskProfile: riskLevel < 0.3 ? 'Conservador' : riskLevel < 0.6 ? 'Moderado' : 'Impulsivo',
      score: riskScore
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.progress}>
          Questão {currentQuestion + 1} de {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.question}>
          {questions[currentQuestion].question}
        </Text>

        <View style={styles.options}>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                answers[currentQuestion] === option && styles.selectedOption
              ]}
              onPress={() => handleAnswer(option)}
            >
              <Text style={[
                styles.optionText,
                answers[currentQuestion] === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  progress: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 32,
    lineHeight: 32,
  },
  options: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  optionText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
  },
});