import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FaceCamera from '../components/FaceCamera';
import { FaceRecognitionService } from '../services/FaceRecognitionService';
import { AuthenticationService } from '../services/AuthenticationService';
import { AuditService } from '../services/AuditService';

type RootStackParamList = {
  FaceAuthentication: {
    email?: string;
  };
  MainTabs: undefined;
  Login: undefined;
};

type FaceAuthenticationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FaceAuthentication'>;
  route: {
    params: {
      email?: string;
    };
  };
};

export default function FaceAuthenticationScreen({ navigation, route }: FaceAuthenticationScreenProps) {
  const insets = useSafeAreaInsets();
  const { email } = route.params;
  
  const [showCamera, setShowCamera] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<'intro' | 'capturing' | 'processing' | 'success' | 'failed'>('intro');
  const [attempts, setAttempts] = useState(3);
  const [lastError, setLastError] = useState<string | null>(null);

  const handleStartAuthentication = () => {
    setShowCamera(true);
    setAuthStep('capturing');
    setLastError(null);
  };

  const handleCapture = async (imageUri: string) => {
    setShowCamera(false);
    setAuthStep('processing');
    setIsAuthenticating(true);

    try {
      // Authenticate with face
      const result = await FaceRecognitionService.authenticateWithFace(imageUri);

      if (result.recognized && result.user_id) {
        AuditService.logAction('FACE_AUTH_SUCCESS', 'FACE_RECOGNITION', result.user_id, 
          { confidence: result.confidence, email }, 'LOW');
        
        // Create authentication result similar to password authentication
        const authResult = {
          success: true,
          method: 'face_recognition' as const,
          token: 'face_auth_token_' + Date.now(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };
        
        setAuthStep('success');
        
        // Auto-navigate to main tabs after success
        setTimeout(() => {
          navigation.replace('MainTabs');
        }, 1500);
      } else {
        const newAttempts = attempts - 1;
        setAttempts(newAttempts);
        
        AuditService.logAction('FACE_AUTH_FAILED', 'FACE_RECOGNITION', 'anonymous', 
          { 
            message: result.message, 
            distance: result.distance,
            email,
            attemptsLeft: newAttempts 
          }, 'MEDIUM');
        
        if (newAttempts <= 0) {
          setAuthStep('failed');
          Alert.alert(
            'Autenticação Bloqueada',
            'Muitas tentativas falhadas. Tente novamente mais tarde ou use outro método de login.',
            [
              { 
                text: 'Voltar ao Login', 
                onPress: () => navigation.replace('Login') 
              }
            ]
          );
        } else {
          setLastError(result.message || 'Rosto não reconhecido');
          setAuthStep('intro');
          
          Alert.alert(
            'Autenticação Falhou',
            `${result.message || 'Rosto não reconhecido'}. Você tem ${newAttempts} tentativa(s) restante(s).`,
            [
              { text: 'Tentar Novamente', onPress: handleStartAuthentication },
              { text: 'Usar Senha', onPress: () => navigation.replace('Login') }
            ]
          );
        }
      }
    } catch (error) {
      AuditService.logAction('FACE_AUTH_ERROR', 'FACE_RECOGNITION', 'anonymous', 
        { error: error instanceof Error ? error.message : 'Unknown error', email }, 'HIGH');
      
      setLastError('Ocorreu um erro durante a autenticação');
      setAuthStep('intro');
      
      Alert.alert(
        'Erro',
        'Ocorreu um erro durante a autenticação facial. Tente novamente.',
        [
          { text: 'Tentar Novamente', onPress: handleStartAuthentication },
          { text: 'Usar Senha', onPress: () => navigation.replace('Login') }
        ]
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCameraClose = () => {
    setShowCamera(false);
    setAuthStep('intro');
  };

  const handleUsePassword = () => {
    AuditService.logAction('FACE_AUTH_SWITCH_TO_PASSWORD', 'FACE_RECOGNITION', 'anonymous', 
      { email, attempts }, 'LOW');
    navigation.replace('Login');
  };

  const renderIntroScreen = () => (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="face-recognition" size={80} color="#4A90E2" />
        </View>

        <Text style={styles.title}>Autenticação Facial</Text>
        <Text style={styles.subtitle}>
          Posicione seu rosto para acessar sua conta de forma rápida e segura
        </Text>

        {lastError && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#DC2626" />
            <Text style={styles.errorText}>{lastError}</Text>
          </View>
        )}

        <View style={styles.attemptsContainer}>
          <Text style={styles.attemptsText}>
            Tentativas restantes: {attempts}
          </Text>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Dicas para melhor reconhecimento:</Text>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="lightbulb" size={16} color="#4A90E2" />
            <Text style={styles.tipText}>Mantenha boa iluminação no ambiente</Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="lightbulb" size={16} color="#4A90E2" />
            <Text style={styles.tipText}>Posicione o rosto frontalmente à câmera</Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="lightbulb" size={16} color="#4A90E2" />
            <Text style={styles.tipText}>Evite acessórios que cubram o rosto</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.primaryButton, attempts <= 0 && styles.disabledButton]}
          onPress={handleStartAuthentication}
          disabled={attempts <= 0}
        >
          <Text style={styles.primaryButtonText}>
            {attempts <= 0 ? 'Tentativas Esgotadas' : 'Iniciar Autenticação'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleUsePassword}
        >
          <Text style={styles.secondaryButtonText}>Usar Senha</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProcessingScreen = () => (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.processingText}>Reconhecendo seu rosto...</Text>
        <Text style={styles.processingSubtext}>
          Estamos verificando sua identidade de forma segura
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
        
        <Text style={styles.title}>Bem-vindo(a)!</Text>
        <Text style={styles.subtitle}>
          Autenticação facial confirmada. Acessando sua conta...
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {authStep === 'intro' && renderIntroScreen()}
      {authStep === 'processing' && renderProcessingScreen()}
      {authStep === 'success' && renderSuccessScreen()}

      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <FaceCamera
          onCapture={handleCapture}
          onClose={handleCameraClose}
          title="Posicione seu rosto"
          subtitle="Centralize seu rosto e mantenha uma expressão neutra"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
  },
  attemptsContainer: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  attemptsText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },
  tipsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
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
  disabledButton: {
    backgroundColor: '#9CA3AF',
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
});