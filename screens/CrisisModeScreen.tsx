import { View, Text, StyleSheet, TouchableOpacity, Animated, ViewStyle, TextStyle } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type CrisisModeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  timerContainer: ViewStyle;
  timerText: TextStyle;
  timerLabel: TextStyle;
  breathCircle: ViewStyle;
  breathText: TextStyle;
  messageContainer: ViewStyle;
  message: TextStyle;
  buttonContainer: ViewStyle;
  button: ViewStyle;
  primaryButton: ViewStyle;
  primaryButtonText: TextStyle;
  secondaryButton: ViewStyle;
  secondaryButtonText: TextStyle;
}

export default function CrisisModeScreen({ navigation }: CrisisModeScreenProps) {
  const insets = useSafeAreaInsets();
  const [timeLeft, setTimeLeft] = useState(10);
  const breathAnimation = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnimation, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    
    animationRef.current.start();

    return () => {
      animationRef.current?.stop();
    };
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="shield-alert" size={60} color="#4A90E2" />
        <Text style={styles.title}>Modo Controle Ativado</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}</Text>
        <Text style={styles.timerLabel}>segundos para respirar</Text>
      </View>

      <Animated.View
        style={[
          styles.breathCircle,
          {
            transform: [
              {
                scale: breathAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.breathText}>Respire</Text>
      </Animated.View>

      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Você se comprometeu a reduzir esse hábito. Estamos com você.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Breathing')}
        >
          <Text style={styles.primaryButtonText}>Continuar Respirando</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.secondaryButtonText}>Voltar para Dashboard</Text>
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4A90E2',
  },
  timerLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  breathCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  breathText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  messageContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  message: {
    fontSize: 18,
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
});