import { View, Text, StyleSheet, Animated, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type BreathingScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function BreathingScreen({ navigation }: BreathingScreenProps) {
  const insets = useSafeAreaInsets();
  const [isExercising, setIsExercising] = useState(false);
  const breathAnim = useRef(new Animated.Value(0)).current;

  // Cleanup animation when component unmounts
  useEffect(() => {
    return () => {
      breathAnim.stopAnimation();
    };
  }, []);

  const startBreathing = () => {
    setIsExercising(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopBreathing = () => {
    setIsExercising(false);
    breathAnim.stopAnimation();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Exercício de Respiração</Text>
      
      <View style={styles.exerciseContainer}>
        <Animated.View
          style={[
            styles.breathCircle,
            {
              transform: [
                {
                  scale: breathAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                  }),
                },
              ],
            },
          ]}
        >
          <MaterialCommunityIcons 
            name="weather-windy" 
            size={40} 
            color="#4A90E2" 
          />
        </Animated.View>
        
        <Text style={styles.instruction}>
          {isExercising ? 'Inspire... Expire...' : 'Pressione para começar'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={isExercising ? stopBreathing : startBreathing}
      >
        <Text style={styles.buttonText}>
          {isExercising ? 'Parar' : 'Começar'}
        </Text>
      </TouchableOpacity>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Dicas:</Text>
        <Text style={styles.tipText}>• Respire lentamente e profundamente</Text>
        <Text style={styles.tipText}>• Mantenha uma postura relaxada</Text>
        <Text style={styles.tipText}>• Concentre-se na sua respiração</Text>
      </View>
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  exerciseContainer: ViewStyle;
  breathCircle: ViewStyle;
  instruction: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  tipsContainer: ViewStyle;
  tipsTitle: TextStyle;
  tipText: TextStyle;
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
    marginBottom: 40,
  },
  exerciseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  instruction: {
    fontSize: 18,
    color: '#4B5563',
    marginTop: 24,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
});