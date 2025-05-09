import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ViewStyle, 
  TextStyle,
  Modal,
  ScrollView,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  QuizIntro: undefined;
  MainTabs: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

interface Styles {
  container: ViewStyle;
  scrollContainer: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  buttonContainer: ViewStyle;
  button: ViewStyle;
  emailButton: ViewStyle;
  googleButton: ViewStyle;
  appleButton: ViewStyle;
  xpButton: ViewStyle;
  guestButton: ViewStyle;
  buttonText: TextStyle;
  footer: ViewStyle;
  privacyText: TextStyle;
  privacyLink: TextStyle;
  modalContainer: ViewStyle;
  modalContent: ViewStyle;
  modalHeader: ViewStyle;
  modalTitle: TextStyle;
  modalSubtitle: TextStyle;
  modalScroll: ViewStyle;
  inputContainer: ViewStyle;
  input: ViewStyle;
  forgotPassword: TextStyle;
  sectionTitle: TextStyle;
  consentItem: ViewStyle;
  consentText: TextStyle;
  switchContainer: ViewStyle;
  separator: ViewStyle;
  submitButton: ViewStyle;
  submitButtonText: TextStyle;
  closeButton: ViewStyle;
  closeButtonText: TextStyle;
  consentContainer: ViewStyle;
  consentModalContent: ViewStyle;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  
  // Consentimentos LGPD
  const [consents, setConsents] = useState({
    transactionData: true,
    notifications: true,
    dataSharing: false,
  });

  const toggleConsent = (key: keyof typeof consents) => {
    setConsents({ ...consents, [key]: !consents[key] });
  };

  const handleLoginOption = (type: 'email' | 'google' | 'apple' | 'xp' | 'guest') => {
    if (type === 'email') {
      setShowLoginModal(true);
    } else if (type === 'guest') {
      navigation.navigate('MainTabs');
    } else {
      // Para métodos OAuth, mostramos a tela de consentimentos antes de prosseguir
      setShowConsentModal(true);
    }
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    setShowValidation(true);
  };

  const handleVerificationComplete = () => {
    setShowValidation(false);
    // Após verificação em duas etapas, mostramos os consentimentos LGPD
    setShowConsentModal(true);
  };

  const handleConsentComplete = () => {
    setShowConsentModal(false);
    navigation.navigate('MainTabs');
  };

  const renderLoginModal = () => {
    return (
      <Modal
        visible={showLoginModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Entrar com e-mail</Text>
                <Text style={styles.modalSubtitle}>Preencha seus dados para continuar</Text>
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleLogin}
              >
                <Text style={styles.submitButtonText}>Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowLoginModal(false)}
              >
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const renderVerificationModal = () => {
    return (
      <Modal
        visible={showValidation}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowValidation(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verificação em duas etapas</Text>
              <Text style={styles.modalSubtitle}>Enviamos um código para seu e-mail</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Digite o código"
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleVerificationComplete}
            >
              <Text style={styles.submitButtonText}>Verificar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowValidation(false)}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderConsentModal = () => {
    return (
      <Modal
        visible={showConsentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConsentModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.consentModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Consentimento de Dados</Text>
              <Text style={styles.modalSubtitle}>
                Precisamos de algumas permissões para oferecer uma experiência personalizada
              </Text>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.sectionTitle}>Permissões necessárias (LGPD)</Text>
              
              <View style={styles.consentContainer}>
                <View style={styles.consentItem}>
                  <View style={styles.switchContainer}>
                    <Switch 
                      value={consents.transactionData}
                      onValueChange={() => toggleConsent('transactionData')}
                      trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                      thumbColor={consents.transactionData ? '#4A90E2' : '#F4F4F5'}
                    />
                  </View>
                  <View>
                    <Text style={styles.consentText}>
                      Coleta de dados transacionais
                    </Text>
                    <Text style={[styles.consentText, { color: '#6B7280', fontSize: 12 }]}>
                      Permitir a análise de transações para identificar comportamentos de risco
                    </Text>
                  </View>
                </View>
                
                <View style={styles.separator} />
                
                <View style={styles.consentItem}>
                  <View style={styles.switchContainer}>
                    <Switch 
                      value={consents.notifications}
                      onValueChange={() => toggleConsent('notifications')}
                      trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                      thumbColor={consents.notifications ? '#4A90E2' : '#F4F4F5'}
                    />
                  </View>
                  <View>
                    <Text style={styles.consentText}>
                      Notificações e alertas
                    </Text>
                    <Text style={[styles.consentText, { color: '#6B7280', fontSize: 12 }]}>
                      Receber alertas e recomendações sobre seus hábitos
                    </Text>
                  </View>
                </View>
                
                <View style={styles.separator} />
                
                <View style={styles.consentItem}>
                  <View style={styles.switchContainer}>
                    <Switch 
                      value={consents.dataSharing}
                      onValueChange={() => toggleConsent('dataSharing')}
                      trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                      thumbColor={consents.dataSharing ? '#4A90E2' : '#F4F4F5'}
                    />
                  </View>
                  <View>
                    <Text style={styles.consentText}>
                      Compartilhamento de dados
                    </Text>
                    <Text style={[styles.consentText, { color: '#6B7280', fontSize: 12 }]}>
                      Compartilhar dados anonimizados para pesquisa e melhoria do serviço
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity>
                <Text style={[styles.privacyLink, { textAlign: 'center', marginVertical: 16 }]}>
                  Ver política de privacidade completa
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleConsentComplete}
            >
              <Text style={styles.submitButtonText}>Confirmar e continuar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowConsentModal(false)}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="brain" size={60} color="#4A90E2" />
          <Text style={styles.title}>SINAIS</Text>
          <Text style={styles.subtitle}>Bem-vindo(a) ao SINAIS</Text>
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
            style={[styles.button, styles.appleButton]} 
            onPress={() => handleLoginOption('apple')}
          >
            <MaterialCommunityIcons name="apple" size={24} color="#000000" />
            <Text style={styles.buttonText}>Entrar com Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.xpButton]} 
            onPress={() => handleLoginOption('xp')}
          >
            <MaterialCommunityIcons name="bank" size={24} color="#1E293B" />
            <Text style={styles.buttonText}>Entrar com Conta XP</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.guestButton]} 
            onPress={() => handleLoginOption('guest')}
          >
            <MaterialCommunityIcons name="account-outline" size={24} color="#6B7280" />
            <Text style={[styles.buttonText, { color: '#6B7280' }]}>Continuar como convidado</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.privacyText}>
          Ao continuar, você concorda com nossos <Text style={styles.privacyLink}>Termos de Uso</Text> e <Text style={styles.privacyLink}>Política de Privacidade</Text>
        </Text>
      </View>

      {/* Renderizar modais */}
      {renderLoginModal()}
      {renderVerificationModal()}
      {renderConsentModal()}
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  scrollContainer: {
    flex: 1,
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
  appleButton: {
    backgroundColor: 'white',
  },
  xpButton: {
    backgroundColor: 'white',
  },
  guestButton: {
    backgroundColor: '#F3F4F6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#F5F8FF',
  },
  privacyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
  },
  privacyLink: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#4A90E2',
    textAlign: 'right',
    marginBottom: 24,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  modalScroll: {
    maxHeight: 400,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  consentContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  consentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  consentText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  switchContainer: {
    marginRight: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  consentModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
});