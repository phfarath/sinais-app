import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthenticationService } from '../services/AuthenticationService';
import { AuditService } from '../services/AuditService';

type RootStackParamList = {
  MFA: undefined;
  MainTabs: undefined;
  Login: undefined;
};

type MFAScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MFA'>;
  route: {
    params: {
      userId: string;
      method?: 'sms' | 'email' | 'authenticator';
    };
  };
};

export default function MFAScreen({ navigation, route }: MFAScreenProps) {
  const insets = useSafeAreaInsets();
  const { userId, method = 'sms' } = route.params;
  
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  const verifyMFA = async () => {
    if (mfaCode.length !== 6) {
      Alert.alert('Erro', 'O código deve ter 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthenticationService.verifyMFA(userId, mfaCode, method);
      
      if (result.success) {
        // Sucesso na verificação MFA
        AuditService.logAction('MFA_VERIFICATION_SUCCESS', 'AUTHENTICATION', userId, 
          { method }, 'LOW');
        navigation.replace('MainTabs');
      } else {
        // Falha na verificação
        const newAttemptsLeft = attemptsLeft - 1;
        setAttemptsLeft(newAttemptsLeft);
        
        if (newAttemptsLeft <= 0) {
          // Bloquear após 3 tentativas
          AuditService.logAction('MFA_VERIFICATION_BLOCKED', 'AUTHENTICATION', userId, 
            { method, reason: 'Too many attempts' }, 'HIGH');
          Alert.alert(
            'Conta Bloqueada',
            'Muitas tentativas incorretas. Tente novamente em 15 minutos.',
            [{ text: 'OK', onPress: () => navigation.replace('Login') }]
          );
        } else {
          Alert.alert(
            'Código Inválido',
            `Código incorreto. Você tem ${newAttemptsLeft} tentativa(s) restante(s).`
          );
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na verificação. Tente novamente.');
    } finally {
      setIsLoading(false);
      setMfaCode('');
    }
  };

  const resendCode = () => {
    Alert.alert(
      'Reenviar Código',
      `Um novo código será enviado via ${method === 'sms' ? 'SMS' : 'email'}.`,
      [
        { text: 'Cancelar' },
        {
          text: 'Reenviar',
          onPress: () => {
            AuditService.logAction('MFA_CODE_RESEND', 'AUTHENTICATION', userId, 
              { method }, 'LOW');
            Alert.alert('Sucesso', 'Novo código enviado!');
          }
        }
      ]
    );
  };

  const useBackupCode = () => {
    Alert.prompt(
      'Código de Backup',
      'Digite um dos seus códigos de backup de 8 dígitos:',
      [
        { text: 'Cancelar' },
        {
          text: 'Verificar',
          onPress: async (backupCode) => {
            if (backupCode && backupCode.length === 8) {
              setIsLoading(true);
              // Simular verificação do código de backup
              setTimeout(() => {
                AuditService.logAction('BACKUP_CODE_USED', 'AUTHENTICATION', userId, 
                  { method: 'backup' }, 'MEDIUM');
                navigation.replace('MainTabs');
              }, 1000);
            } else {
              Alert.alert('Erro', 'Código de backup inválido');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const getMethodTitle = () => {
    switch (method) {
      case 'sms': return 'SMS';
      case 'email': return 'Email';
      case 'authenticator': return 'Authenticator';
      default: return 'SMS';
    }
  };

  const getMethodDescription = () => {
    switch (method) {
      case 'sms': return 'Digite o código enviado para seu celular';
      case 'email': return 'Digite o código enviado para seu email';
      case 'authenticator': return 'Digite o código do seu app autenticador';
      default: return 'Digite o código de verificação';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name={method === 'authenticator' ? 'shield-key' : 'cellphone-message'} 
            size={64} 
            color="#4A90E2" 
          />
        </View>

        <Text style={styles.title}>Verificação em Duas Etapas</Text>
        <Text style={styles.subtitle}>
          {getMethodDescription()}
        </Text>

        <View style={styles.methodBadge}>
          <Text style={styles.methodText}>via {getMethodTitle()}</Text>
        </View>

        <View style={styles.inputContainer}>          <TextInput
            value={mfaCode}
            onChangeText={setMfaCode}
            placeholder="000000"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={6}
            style={styles.codeInput}
            autoFocus
            textAlign="center"
          />
        </View>

        <TouchableOpacity 
          onPress={verifyMFA}
          disabled={isLoading || mfaCode.length !== 6}
          style={[
            styles.verifyButton,
            (isLoading || mfaCode.length !== 6) && styles.buttonDisabled
          ]}
        >
          <Text style={[
            styles.verifyButtonText,
            (isLoading || mfaCode.length !== 6) && styles.buttonTextDisabled
          ]}>
            {isLoading ? 'Verificando...' : 'Verificar'}
          </Text>
        </TouchableOpacity>

        <View style={styles.alternatives}>
          <TouchableOpacity style={styles.alternativeButton} onPress={resendCode}>
            <MaterialCommunityIcons name="refresh" size={16} color="#4A90E2" />
            <Text style={styles.alternativeText}>Reenviar código</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.alternativeButton} onPress={useBackupCode}>
            <MaterialCommunityIcons name="key-variant" size={16} color="#4A90E2" />
            <Text style={styles.alternativeText}>Usar código de backup</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.attemptsIndicator}>
          <Text style={styles.attemptsText}>
            Tentativas restantes: {attemptsLeft}
          </Text>
        </View>

        <View style={styles.securityInfo}>
          <MaterialCommunityIcons name="shield-check" size={20} color="#10B981" />
          <Text style={styles.securityText}>
            Sua conta está protegida com autenticação multifator
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  methodBadge: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 32,
  },
  methodText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 20,
    backgroundColor: 'white',
    color: '#1F2937',
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#F3F4F6',
  },
  alternatives: {
    alignItems: 'center',
    marginBottom: 24,
  },
  alternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  alternativeText: {
    color: '#4A90E2',
    fontSize: 14,
    marginLeft: 6,
  },
  attemptsIndicator: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 24,
  },
  attemptsText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  securityText: {
    fontSize: 14,
    color: '#065F46',
    marginLeft: 8,
    flex: 1,
  },
});
