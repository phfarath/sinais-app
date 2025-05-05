import { View, Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
};

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  appName: TextStyle;
  tagline: TextStyle;
}

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
    ]);

    animation.start(() => {
      navigation.replace('Onboarding');
    });

    return () => {
      animation.stop();
    };
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <MaterialCommunityIcons name="brain" size={80} color="#4A90E2" />
        <Text style={styles.appName}>SINAIS</Text>
        <Text style={styles.tagline}>Tecnologia para um jogo mais consciente</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: '#4A90E2',
    marginTop: 20,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: '80%',
  },
});