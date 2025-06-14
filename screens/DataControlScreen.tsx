import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuditService } from '../services/AuditService';
import { EncryptionService } from '../services/EncryptionService';

type RootStackParamList = {
  DataControl: undefined;
  Settings: undefined;
};

type DataControlScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DataControl'>;
};

interface DataPreferences {
  collectBehaviorData: boolean;
  shareAnonymousData: boolean;
  allowProfiling: boolean;
  retainDataAfterDeletion: boolean;
  allowLocationTracking: boolean;
  enableAnalytics: boolean;
  allowMarketing: boolean;
}

export default function DataControlScreen({ navigation }: DataControlScreenProps) {
  const insets = useSafeAreaInsets();
  const [dataPreferences, setDataPreferences] = useState<DataPreferences>({
    collectBehaviorData: true,
    shareAnonymousData: false,
    allowProfiling: true,
    retainDataAfterDeletion: false,
    allowLocationTracking: false,
    enableAnalytics: true,
    allowMarketing: false
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await EncryptionService.secureRetrieve('data_preferences');
      if (stored) {
        const preferences = JSON.parse(stored);
        setDataPreferences(preferences);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  const updatePreference = async (key: keyof DataPreferences, value: boolean) => {
    const newPreferences = { ...dataPreferences, [key]: value };
    setDataPreferences(newPreferences);
    
    try {
      await EncryptionService.secureStore('data_preferences', JSON.stringify(newPreferences));
      AuditService.logAction('DATA_PREFERENCE_UPDATED', 'USER_PREFERENCE', 'user-id', 
        { key, value }, 'MEDIUM');
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };

  const exportData = () => {
    Alert.alert(
      'Exportar Dados',
      'Seus dados serão processados e enviados por email em até 48 horas úteis.',
      [
        { text: 'Cancelar' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            AuditService.logAction('DATA_EXPORT_REQUESTED', 'USER_DATA', 'user-id', 
              { requestTime: new Date() }, 'MEDIUM');
            Alert.alert('Sucesso', 'Solicitação de exportação registrada!');
          }
        }
      ]
    );
  };

  const deleteAllData = () => {
    Alert.alert(
      'Deletar Todos os Dados',
      'Esta ação é IRREVERSÍVEL. Todos os seus dados serão permanentemente removidos.\n\nDeseja continuar?',
      [
        { text: 'Cancelar' },
        { 
          text: 'Deletar', 
          style: 'destructive',
          onPress: confirmDataDeletion
        }
      ]
    );
  };

  const confirmDataDeletion = () => {
    Alert.alert(
      'Confirmação Final',
      'Digite "DELETAR" para confirmar a remoção permanente dos dados:',
      [
        { text: 'Cancelar' },
        { 
          text: 'Confirmar',
          style: 'destructive',
          onPress: () => {
            AuditService.logAction('DATA_DELETION_REQUESTED', 'USER_DATA', 'user-id', 
              { confirmationTime: new Date() }, 'HIGH');
            Alert.alert('Processando', 'Seus dados serão removidos em até 24 horas.');
          }
        }
      ]
    );
  };

  const requestDataCorrection = () => {
    Alert.alert(
      'Correção de Dados',
      'Você pode solicitar correção de dados incorretos ou desatualizados.',
      [
        { text: 'Cancelar' },
        { 
          text: 'Solicitar', 
          onPress: () => {
            AuditService.logAction('DATA_CORRECTION_REQUESTED', 'USER_DATA', 'user-id');
            Alert.alert('Sucesso', 'Solicitação de correção registrada!');
          }
        }
      ]
    );
  };

  const preferenceItems = [
    {
      key: 'collectBehaviorData' as keyof DataPreferences,
      title: 'Coletar Dados Comportamentais',
      description: 'Permite análise de padrões de apostas para identificar riscos',
      essential: true
    },
    {
      key: 'allowProfiling' as keyof DataPreferences,
      title: 'Permitir Criação de Perfil',
      description: 'Cria perfil personalizado para recomendações mais precisas',
      essential: false
    },
    {
      key: 'shareAnonymousData' as keyof DataPreferences,
      title: 'Compartilhar Dados Anônimos',
      description: 'Ajuda a melhorar o serviço através de dados anonimizados',
      essential: false
    },
    {
      key: 'enableAnalytics' as keyof DataPreferences,
      title: 'Permitir Análises',
      description: 'Coleta dados de uso para melhorar a experiência',
      essential: false
    },
    {
      key: 'allowLocationTracking' as keyof DataPreferences,
      title: 'Rastreamento de Localização',
      description: 'Usado apenas para estatísticas regionais',
      essential: false
    },
    {
      key: 'allowMarketing' as keyof DataPreferences,
      title: 'Comunicações de Marketing',
      description: 'Receber informações sobre novos recursos',
      essential: false
    }
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Controle dos Seus Dados</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="shield-check" size={32} color="#4A90E2" />
          <Text style={styles.infoTitle}>Sua Privacidade é Prioridade</Text>
          <Text style={styles.infoText}>
            Você tem controle total sobre seus dados. Todos os dados são criptografados 
            e processados conforme a LGPD.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Preferências de Coleta</Text>
        
        {preferenceItems.map((item) => (
          <View key={item.key} style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <View style={styles.preferenceHeader}>
                <Text style={styles.preferenceTitle}>{item.title}</Text>
                {item.essential && (
                  <View style={styles.essentialBadge}>
                    <Text style={styles.essentialText}>Essencial</Text>
                  </View>
                )}
              </View>
              <Text style={styles.preferenceDescription}>{item.description}</Text>
            </View>
            <Switch 
              value={dataPreferences[item.key]} 
              onValueChange={(value) => updatePreference(item.key, value)}
              disabled={item.essential}
              trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
            />
          </View>
        ))}

        <Text style={styles.sectionTitle}>Seus Direitos</Text>

        <TouchableOpacity style={styles.actionButton} onPress={exportData}>
          <MaterialCommunityIcons name="download" size={24} color="#4A90E2" />
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Exportar Meus Dados</Text>
            <Text style={styles.actionDescription}>
              Baixe uma cópia de todos os seus dados
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={requestDataCorrection}>
          <MaterialCommunityIcons name="pencil" size={24} color="#F59E0B" />
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Solicitar Correção</Text>
            <Text style={styles.actionDescription}>
              Corrija dados incorretos ou desatualizados
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={deleteAllData}>
          <MaterialCommunityIcons name="delete" size={24} color="#DC2626" />
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, styles.dangerText]}>Deletar Todos os Dados</Text>
            <Text style={styles.actionDescription}>
              Remove permanentemente todos os seus dados
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.legalInfo}>
          <Text style={styles.legalText}>
            Para mais informações sobre como tratamos seus dados, consulte nossa 
            Política de Privacidade. Em caso de dúvidas, entre em contato conosco.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
  },
  preferenceItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 12,
  },
  preferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  essentialBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  essentialText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#92400E',
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dangerButton: {
    borderColor: '#FEE2E2',
    borderWidth: 1,
  },
  actionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  dangerText: {
    color: '#DC2626',
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  legalInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  legalText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    textAlign: 'center',
  },
});
