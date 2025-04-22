import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  QuizIntro: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  buttonContainer: ViewStyle;
  button: ViewStyle;
  emailButton: ViewStyle;
  googleButton: ViewStyle;
  guestButton: ViewStyle;
  buttonText: TextStyle;
  privacyText: TextStyle;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();

  const handleLoginOption = (type: 'email' | 'google' | 'guest') => {
    navigation.navigate('QuizIntro');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="brain" size={60} color="#4A90E2" />
        <Text style={styles.title}>SINAIS</Text>
        <Text style={styles.subtitle}>Bem-vindo(a) de volta</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.emailButton]} 
          onPress={() => handleLoginOption('email')}
        >
          <MaterialCommunityIcons name="email-outline" size={24} color="#4A90E2" />
          <Text style={[styles.buttonText, { color: '#4A90E2' }]}>Entrar com e-mail</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.googleButton]} 
          onPress={() => handleLoginOption('google')}
        >
          <MaterialCommunityIcons name="google" size={24} color="#4285F4" />
          <Text style={styles.buttonText}>Entrar com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.guestButton]} 
          onPress={() => handleLoginOption('guest')}
        >
          <MaterialCommunityIcons name="account-outline" size={24} color="#6B7280" />
          <Text style={[styles.buttonText, { color: '#6B7280' }]}>Continuar como convidado</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.privacyText}>
        Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
      </Text>
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
    fontSize: 32,
    fontWeight: '700',
    color: '#4A90E2',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 8,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  emailButton: {
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  googleButton: {
    backgroundColor: 'white',
  },
  guestButton: {
    backgroundColor: '#F3F4F6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  privacyText: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
  },
});