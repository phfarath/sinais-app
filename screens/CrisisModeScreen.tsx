import { View, Text, StyleSheet, TouchableOpacity, Animated, ViewStyle, TextStyle, ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type CrisisModeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface Styles {
  container: ViewStyle;
  scrollContent: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  timerContainer: ViewStyle;
  timerText: TextStyle;
  timerLabel: TextStyle;
  breathContainer: ViewStyle;
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="shield-alert" size={60} color="#4A90E2" />
          <Text style={styles.title}>Modo Controle Ativado</Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}</Text>
          <Text style={styles.timerLabel}>segundos para respirar</Text>
        </View>

        <View style={styles.breathContainer}>
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
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Você se comprometeu a reduzir esse hábito. Estamos com você.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  timerLabel: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
  },
  breathContainer: {
    alignItems: 'center',
    marginBottom: 40,
    minHeight: 200,
  },
  breathCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breathText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  messageContainer: {
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  message: {
    fontSize: 16,
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
  },
  secondaryButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
});