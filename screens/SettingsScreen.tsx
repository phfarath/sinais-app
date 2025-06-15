// filepath: d:\sinais-app-certo\sinais-app\screens\SettingsScreen.tsx
import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  ViewStyle, 
  TextStyle, 
  Modal, 
  TextInput,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../App';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  card: ViewStyle;
  cardHeader: ViewStyle;
  cardTitle: TextStyle;
  cardDescription: TextStyle;
  inputRow: ViewStyle;
  label: TextStyle;
  input: ViewStyle;
  inputText: TextStyle;
  checkboxRow: ViewStyle;
  switchContainer: ViewStyle;
  notificationOption: ViewStyle;
  notificationText: TextStyle;
  notificationDescription: TextStyle;
  notificationSchedule: ViewStyle;
  timeRange: TextStyle;
  saveButton: ViewStyle;
  saveButtonText: TextStyle;
  modalContainer: ViewStyle;
  modalContent: ViewStyle;
  modalHeader: ViewStyle;
  modalTitle: TextStyle;
  modalInput: ViewStyle;
  modalButtons: ViewStyle;
  modalButton: ViewStyle;
  modalButtonText: TextStyle;
  modalCancelButton: ViewStyle;
  modalCancelButtonText: TextStyle;
  timePickerRow: ViewStyle;
  timePickerButton: ViewStyle;
  timePickerButtonText: TextStyle;
}

interface Limit {
  daily: string;
  weekly: string;
  dailyAmount: string;
  weeklyAmount: string;
  action: 'alert' | 'block' | 'both';
}

interface NotificationPrefs {
  push: boolean;
  email: boolean;
  whatsapp: boolean;
  quietStart: string;
  quietEnd: string;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const insets = useSafeAreaInsets();
  
  // Estado para os limites
  const [limits, setLimits] = useState<Limit>({
    daily: '60',
    weekly: '240',
    dailyAmount: '200',
    weeklyAmount: '1000',
    action: 'alert'
  });

  // Estado para preferências de notificação
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    push: true,
    email: false,
    whatsapp: false,
    quietStart: '22:00',
    quietEnd: '07:00'
  });

  // Estado para modais
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEditField, setCurrentEditField] = useState<keyof Limit | null>(null);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [currentTimeField, setCurrentTimeField] = useState<'quietStart' | 'quietEnd' | null>(null);
  const [editValue, setEditValue] = useState('');

  // Função para abrir o modal de edição
  const openLimitModal = (field: keyof Limit) => {
    setCurrentEditField(field);
    setEditValue(limits[field]);
    setModalVisible(true);
  };

  // Função para abrir o modal de seleção de hora
  const openTimePicker = (field: 'quietStart' | 'quietEnd') => {
    setCurrentTimeField(field);
    setEditValue(notificationPrefs[field]);
    setTimePickerVisible(true);
  };

  // Função para salvar o valor de limite
  const saveLimitValue = () => {
    if (currentEditField) {
      setLimits({...limits, [currentEditField]: editValue});
    }
    setModalVisible(false);
  };

  // Função para salvar o valor de hora
  const saveTimeValue = () => {
    if (currentTimeField) {
      setNotificationPrefs({...notificationPrefs, [currentTimeField]: editValue});
    }
    setTimePickerVisible(false);
  };

  // Função para alternar preferências de notificação
  const toggleNotificationPref = (key: keyof NotificationPrefs) => {
    if (typeof notificationPrefs[key] === 'boolean') {
      setNotificationPrefs({...notificationPrefs, [key]: !notificationPrefs[key]});
    }
  };

  // Função para alternar ação ao atingir limite
  const toggleLimitAction = (action: Limit['action']) => {
    setLimits({...limits, action});
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView>
        <LinearGradient
          colors={['#FFFFFF', '#F0F7FF']}
          style={styles.header}
        >
          <Text style={styles.title}>Configurações</Text>
          <Text style={styles.subtitle}>Personalize seus limites e alertas</Text>
        </LinearGradient>

        {/* Seção de Limites */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limites de Uso</Text>
          
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#4A90E2" />
              <Text style={styles.cardTitle}>Limites de Tempo</Text>
            </View>
            <Text style={styles.cardDescription}>
              Defina o tempo máximo permitido para apostas
            </Text>
            
            <TouchableOpacity 
              style={styles.inputRow}
              onPress={() => openLimitModal('daily')}
            >
              <Text style={styles.label}>Limite diário (minutos):</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>{limits.daily}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.inputRow}
              onPress={() => openLimitModal('weekly')}
            >
              <Text style={styles.label}>Limite semanal (minutos):</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>{limits.weekly}</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="cash" size={24} color="#4A90E2" />
              <Text style={styles.cardTitle}>Limites de Valor</Text>
            </View>
            <Text style={styles.cardDescription}>
              Defina o valor máximo permitido para apostas
            </Text>
            
            <TouchableOpacity 
              style={styles.inputRow}
              onPress={() => openLimitModal('dailyAmount')}
            >
              <Text style={styles.label}>Limite diário (R$):</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>{limits.dailyAmount}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.inputRow}
              onPress={() => openLimitModal('weeklyAmount')}
            >
              <Text style={styles.label}>Limite semanal (R$):</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>{limits.weeklyAmount}</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="alert-outline" size={24} color="#4A90E2" />
              <Text style={styles.cardTitle}>Ação ao Atingir Limite</Text>
            </View>
            <Text style={styles.cardDescription}>
              O que fazer quando você atingir o limite definido
            </Text>
            
            <View style={styles.checkboxRow}>
              <TouchableOpacity 
                style={[
                  styles.notificationOption,
                  limits.action === 'alert' && { backgroundColor: '#EFF6FF' }
                ]}
                onPress={() => toggleLimitAction('alert')}
              >
                <MaterialCommunityIcons 
                  name={limits.action === 'alert' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                  size={24} 
                  color={limits.action === 'alert' ? "#4A90E2" : "#64748B"} 
                />
                <Text 
                  style={[
                    styles.notificationText,
                    limits.action === 'alert' && { color: '#4A90E2' }
                  ]}
                >
                  Apenas alertar
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.checkboxRow}>
              <TouchableOpacity 
                style={[
                  styles.notificationOption,
                  limits.action === 'block' && { backgroundColor: '#EFF6FF' }
                ]}
                onPress={() => toggleLimitAction('block')}
              >
                <MaterialCommunityIcons 
                  name={limits.action === 'block' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                  size={24} 
                  color={limits.action === 'block' ? "#4A90E2" : "#64748B"} 
                />
                <Text 
                  style={[
                    styles.notificationText,
                    limits.action === 'block' && { color: '#4A90E2' }
                  ]}
                >
                  Bloquear temporariamente
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.checkboxRow}>
              <TouchableOpacity 
                style={[
                  styles.notificationOption,
                  limits.action === 'both' && { backgroundColor: '#EFF6FF' }
                ]}
                onPress={() => toggleLimitAction('both')}
              >
                <MaterialCommunityIcons 
                  name={limits.action === 'both' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                  size={24} 
                  color={limits.action === 'both' ? "#4A90E2" : "#64748B"} 
                />
                <Text 
                  style={[
                    styles.notificationText,
                    limits.action === 'both' && { color: '#4A90E2' }
                  ]}
                >
                  Alertar e bloquear
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Seção de Preferências de Notificação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências de Notificação</Text>
          
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="bell-outline" size={24} color="#4A90E2" />
              <Text style={styles.cardTitle}>Canais de Notificação</Text>
            </View>
            <Text style={styles.cardDescription}>
              Escolha como deseja receber os alertas
            </Text>
            
            <View style={styles.notificationOption}>
              <Text style={styles.notificationText}>Push Notification</Text>
              <Switch 
                value={notificationPrefs.push}
                onValueChange={() => toggleNotificationPref('push')}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={notificationPrefs.push ? '#4A90E2' : '#F4F4F5'}
              />
            </View>
            
            <View style={styles.notificationOption}>
              <Text style={styles.notificationText}>E-mail</Text>
              <Switch 
                value={notificationPrefs.email}
                onValueChange={() => toggleNotificationPref('email')}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={notificationPrefs.email ? '#4A90E2' : '#F4F4F5'}
              />
            </View>
            
            <View style={styles.notificationOption}>
              <Text style={styles.notificationText}>WhatsApp</Text>
              <Switch 
                value={notificationPrefs.whatsapp}
                onValueChange={() => toggleNotificationPref('whatsapp')}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={notificationPrefs.whatsapp ? '#4A90E2' : '#F4F4F5'}
              />
            </View>
          </LinearGradient>
          
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="clock-time-eight-outline" size={24} color="#4A90E2" />
              <Text style={styles.cardTitle}>Horário Silencioso</Text>
            </View>
            <Text style={styles.cardDescription}>
              Período em que nenhum alerta será enviado
            </Text>
            
            <View style={styles.notificationSchedule}>
              <Text style={styles.label}>De</Text>
              <TouchableOpacity 
                style={styles.timePickerButton}
                onPress={() => openTimePicker('quietStart')}
              >
                <Text style={styles.timePickerButtonText}>{notificationPrefs.quietStart}</Text>
              </TouchableOpacity>
              
              <Text style={styles.label}>até</Text>
              <TouchableOpacity 
                style={styles.timePickerButton}
                onPress={() => openTimePicker('quietEnd')}
              >
                <Text style={styles.timePickerButtonText}>{notificationPrefs.quietEnd}</Text>
              </TouchableOpacity>
            </View>          </LinearGradient>
        </View>
        
        {/* Seção de Demonstração Interativa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Demonstrações Interativas</Text>
            <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#EFF6FF', flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => navigation.navigate('DataControl')}
          >
            <MaterialCommunityIcons name="shield-account" size={24} color="#4A90E2" />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={[styles.cardTitle, { marginBottom: 4 }]}>Controle de Dados LGPD</Text>
              <Text style={[styles.cardDescription, { fontSize: 12 }]}>
                Gerencie permissões, exporte dados e configure privacidade
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#4A90E2" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#F0FDF4', flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => navigation.navigate('MFA', { userId: 'demo-user', method: 'sms' })}
          >
            <MaterialCommunityIcons name="two-factor-authentication" size={24} color="#059669" />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={[styles.cardTitle, { marginBottom: 4 }]}>Autenticação Multifator</Text>
              <Text style={[styles.cardDescription, { fontSize: 12 }]}>
                Teste o sistema de MFA com SMS, email ou biometria
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#059669" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#FEF3C7', flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => navigation.navigate('ExplanationAudit')}
          >
            <MaterialCommunityIcons name="brain" size={24} color="#D97706" />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={[styles.cardTitle, { marginBottom: 4 }]}>Auditoria de IA Explicável</Text>
              <Text style={[styles.cardDescription, { fontSize: 12 }]}>
                Veja como as decisões da IA são explicadas e auditadas
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#D97706" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#FEF2F2', flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => navigation.navigate('BiasAnalysis')}
          >
            <MaterialCommunityIcons name="scale-balance" size={24} color="#DC2626" />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={[styles.cardTitle, { marginBottom: 4 }]}>Análise de Viés</Text>
              <Text style={[styles.cardDescription, { fontSize: 12 }]}>
                Execute análise completa de viés e equidade algoritmica
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#DC2626" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#F0F9FF', flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => navigation.navigate('CybersecurityDemo')}
          >
            <MaterialCommunityIcons name="security" size={24} color="#0284C7" />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={[styles.cardTitle, { marginBottom: 4 }]}>Demo Geral Cybersecurity</Text>
              <Text style={[styles.cardDescription, { fontSize: 12 }]}>
                Demonstração completa de todos os critérios de segurança
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#0284C7" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#FEF3C7', flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => navigation.navigate('CryptographyDemo')}
          >
            <MaterialCommunityIcons name="shield-key" size={24} color="#D97706" />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={[styles.cardTitle, { marginBottom: 4 }]}>Demo Criptografia Detalhada</Text>
              <Text style={[styles.cardDescription, { fontSize: 12 }]}>
                Teste criptografia AES e proteção XSS com exemplos visuais
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#D97706" />
          </TouchableOpacity>
        </View>
        
        {/* Botão Salvar */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.saveButtonText}>Salvar Configurações</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para editar valores numéricos */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentEditField === 'daily' ? 'Limite diário de tempo' : 
                 currentEditField === 'weekly' ? 'Limite semanal de tempo' :
                 currentEditField === 'dailyAmount' ? 'Limite diário de valor' :
                 'Limite semanal de valor'}
              </Text>
            </View>
            
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              keyboardType="numeric"
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={saveLimitValue}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para selecionar horários */}
      <Modal
        visible={timePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentTimeField === 'quietStart' ? 'Início do horário silencioso' : 'Fim do horário silencioso'}
              </Text>
            </View>
            
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder="HH:MM"
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={saveTimeValue}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setTimePickerVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#1E293B',
  },
  input: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: 100,
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  checkboxRow: {
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  notificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  notificationText: {
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  notificationSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  timeRange: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  modalCancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timePickerButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  timePickerButtonText: {
    fontSize: 16,
    color: '#1E293B',
  },
});