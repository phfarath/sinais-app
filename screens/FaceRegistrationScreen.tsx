import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FaceCamera from '../components/FaceCamera';
import { FaceRecognitionService } from '../services/FaceRecognitionService';
import { AuditService } from '../services/AuditService';

type RootStackParamList = {
  FaceRegistration: {
    userId: string;
    riskProfile?: 'Conservador' | 'Moderado' | 'Impulsivo';
    score?: number;
  };
  MainTabs: undefined;
};

type FaceRegistrationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FaceRegistration'>;
  route: {
    params: {
      userId: string;
      riskProfile?: 'Conservador' | 'Moderado' | 'Impulsivo';
      score?: number;
    };
  };
};

export default function FaceRegistrationScreen({ navigation, route }: FaceRegistrationScreenProps) {
  const insets = useSafeAreaInsets();
  const { userId, riskProfile, score } = route.params;
  
  const [showCamera, setShowCamera] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'intro' | 'capturing' | 'processing' | 'success'>('intro');

  const handleStartRegistration = async () => {
    // Test backend connection first
    console.log('Testing backend connection...');
    try {
      const healthCheck = await FaceRecognitionService.checkServiceHealth();
      console.log('Backend health check result:', healthCheck);
      
      if (!healthCheck.healthy) {
        Alert.alert(
          'Erro de Conexão',
          `Não foi possível conectar ao servidor de reconhecimento facial: ${healthCheck.error || 'Erro desconhecido'}. Verifique se o backend está rodando e se seu dispositivo está na mesma rede.`,
          [
            { text: 'Cancelar', onPress: () => navigation.replace('MainTabs') },
            { text: 'Tentar Novamente', onPress: handleStartRegistration }
          ]
        );
        return;
      }
      
      console.log('Backend connection successful, starting camera...');
      setShowCamera(true);
      setRegistrationStep('capturing');
    } catch (error) {
      console.error('Health check failed:', error);
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://192.168.15.10:8000',
        [
          { text: 'Cancelar', onPress: () => navigation.replace('MainTabs') },
          { text: 'Tentar Novamente', onPress: handleStartRegistration }
        ]
      );
    }
  };

  const handleCapture = async (imageUri: string) => {
    setShowCamera(false);
    setRegistrationStep('processing');
    setIsRegistering(true);

    try {
      // Prepare profile data
      const profileData = {
        risk_profile: riskProfile,
        risk_score: score,
        registered_at: new Date().toISOString(),
      };

      // Register face
      const result = await FaceRecognitionService.registerFace(userId, imageUri, profileData);

      if (result.success) {
        AuditService.logAction('FACE_REGISTRATION_COMPLETED', 'FACE_RECOGNITION', userId, 
          { riskProfile, score }, 'LOW');
        
        setRegistrationStep('success');
        
        // Auto-navigate to main tabs after success
        setTimeout(() => {
          navigation.replace('MainTabs');
        }, 2000);
      } else {
        AuditService.logAction('FACE_REGISTRATION_FAILED', 'FACE_RECOGNITION', userId, 
          { error: result.message, riskProfile, score }, 'HIGH');
        
        Alert.alert(
          'Falha no Registro',
          result.message || 'Não foi possível registrar seu rosto. Tente novamente.',
          [
            { text: 'Cancelar', onPress: () => navigation.replace('MainTabs') },
            { text: 'Tentar Novamente', onPress: () => setRegistrationStep('intro') }
          ]
        );
      }
    } catch (error) {
      AuditService.logAction('FACE_REGISTRATION_ERROR', 'FACE_RECOGNITION', userId, 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
      
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao registrar seu rosto. Tente novamente.',
        [
          { text: 'Cancelar', onPress: () => navigation.replace('MainTabs') },
          { text: 'Tentar Novamente', onPress: () => setRegistrationStep('intro') }
        ]
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSkipRegistration = () => {
    AuditService.logAction('FACE_REGISTRATION_SKIPPED', 'FACE_RECOGNITION', userId, 
      { riskProfile, score }, 'MEDIUM');
    
    Alert.alert(
      'Pular Registro Facial',
      'Você poderá registrar seu rosto mais tarde nas configurações do perfil. Deseja continuar?',
      [
        { text: 'Registrar Agora', style: 'cancel' },
        { 
          text: 'Pular', 
          onPress: () => navigation.replace('MainTabs') 
        }
      ]
    );
  };

  const handleCameraClose = () => {
    setShowCamera(false);
    setRegistrationStep('intro');
  };

  const renderIntroScreen = () => (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="face-recognition" size={80} color="#4A90E2" />
        </View>

        <Text style={styles.title}>Registro Facial</Text>
        <Text style={styles.subtitle}>
          Adicione uma camada extra de segurança ao seu perfil com reconhecimento facial
        </Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#10B981" />
            <Text style={styles.benefitText}>Login mais rápido e seguro</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <MaterialCommunityIcons name="fingerprint" size={24} color="#10B981" />
            <Text style={styles.benefitText}>Autenticação biométrica avançada</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <MaterialCommunityIcons name="lock" size={24} color="#10B981" />
            <Text style={styles.benefitText}>Proteção adicional para seus dados</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information" size={20} color="#4A90E2" />
          <Text style={styles.infoText}>
            Seus dados faciais serão criptografados e armazenados com segurança. 
            Você poderá desativar esta função a qualquer momento.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleStartRegistration}
        >
          <Text style={styles.primaryButtonText}>Registrar Rosto</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleSkipRegistration}
        >
          <Text style={styles.secondaryButtonText}>Agora Não</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProcessingScreen = () => (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.processingText}>Processando seu rosto...</Text>
        <Text style={styles.processingSubtext}>
          Estamos criando seu perfil facial de forma segura
        </Text>
      </View>
    </View>
  );

  const renderSuccessScreen = () => (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <MaterialCommunityIcons name="check-circle" size={80} color="#10B981" />
        </View>
        
        <Text style={styles.title}>Registro Concluído!</Text>
        <Text style={styles.subtitle}>
          Seu rosto foi registrado com sucesso. Você já pode usar o reconhecimento facial para acessar o aplicativo.
        </Text>
        
        <View style={styles.successInfo}>
          <MaterialCommunityIcons name="lightbulb" size={20} color="#4A90E2" />
          <Text style={styles.successInfoText}>
            Na próxima vez que fizer login, você poderá escolher entre senha, biometria ou reconhecimento facial.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {registrationStep === 'intro' && renderIntroScreen()}
      {registrationStep === 'processing' && renderProcessingScreen()}
      {registrationStep === 'success' && renderSuccessScreen()}

      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <FaceCamera
          onCapture={handleCapture}
          onClose={handleCameraClose}
          title="Posicione seu rosto"
          subtitle="Centralize seu rosto no círculo e mantenha uma expressão neutra"
          showFaceDetection={true}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitItem: {
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
  benefitText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: '#4A90E2',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  processingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  processingSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    alignSelf: 'center',
  },
  successInfo: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    marginTop: 24,
  },
  successInfoText: {
    fontSize: 14,
    color: '#4A90E2',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});