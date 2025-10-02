import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  icon: string;
  type: 'personal' | 'professional' | 'emergency';
}

export default function EmergencyModeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [sosActivated, setSosActivated] = useState(false);

  const emergencyContacts: EmergencyContact[] = [
    { id: '1', name: 'CVV - Centro de Valorização da Vida', phone: '188', icon: '💚', type: 'emergency' },
    { id: '2', name: 'SAMU', phone: '192', icon: '🚑', type: 'emergency' },
    { id: '3', name: 'Família/Responsável', phone: '(11) 99999-9999', icon: '👨‍👩‍👧', type: 'personal' },
    { id: '4', name: 'Terapeuta', phone: '(11) 98888-8888', icon: '🩺', type: 'professional' },
  ];

  const handleSOS = () => {
    setSosActivated(true);
    Alert.alert(
      '🆘 SOS Ativado',
      'Seus contatos de emergência serão notificados. Você está em segurança agora.\n\nDeseja ligar para o CVV agora?',
      [
        {
          text: 'Não',
          style: 'cancel',
          onPress: () => setSosActivated(false)
        },
        {
          text: 'Sim, ligar',
          onPress: () => {
            Linking.openURL('tel:188');
            setSosActivated(false);
          }
        }
      ]
    );
  };

  const handleCall = (phone: string, name: string) => {
    Alert.alert(
      'Fazer Chamada',
      `Ligar para ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ligar',
          onPress: () => Linking.openURL(`tel:${phone.replace(/\D/g, '')}`)
        }
      ]
    );
  };

  const navigateToBreathing = () => {
    navigation.navigate('Breathing' as never);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={sosActivated ? ['#EF4444', '#DC2626'] : ['#F59E0B', '#D97706']}
        style={styles.header}
      >
        <MaterialCommunityIcons 
          name={sosActivated ? "alert-octagon" : "shield-alert"} 
          size={48} 
          color="white" 
        />
        <Text style={styles.headerTitle}>
          {sosActivated ? 'SOS ATIVADO' : 'Modo Emergência'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {sosActivated ? 'Ajuda a caminho' : 'Estamos aqui para ajudar'}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* SOS Button */}
        <TouchableOpacity
          style={[styles.sosButton, sosActivated && styles.sosButtonActive]}
          onPress={handleSOS}
          disabled={sosActivated}
        >
          <LinearGradient
            colors={sosActivated ? ['#EF4444', '#DC2626'] : ['#EF4444', '#B91C1C']}
            style={styles.sosButtonGradient}
          >
            <MaterialCommunityIcons 
              name="alert-octagon" 
              size={64} 
              color="white" 
            />
            <Text style={styles.sosButtonText}>
              {sosActivated ? 'SOS ATIVADO' : 'BOTÃO SOS'}
            </Text>
            <Text style={styles.sosButtonSubtext}>
              {sosActivated ? 'Contatos notificados' : 'Toque para pedir ajuda'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={navigateToBreathing}
          >
            <LinearGradient
              colors={['#DBEAFE', '#BFDBFE']}
              style={styles.quickActionGradient}
            >
              <MaterialCommunityIcons name="meditation" size={32} color="#1E40AF" />
              <View style={styles.quickActionInfo}>
                <Text style={styles.quickActionTitle}>Respiração Guiada</Text>
                <Text style={styles.quickActionSubtitle}>
                  Acalme-se com exercícios de respiração
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => Alert.alert(
              '🎵 Música Relaxante',
              'Esta função reproduziria uma playlist calmante. Por enquanto, sugerimos usar seu app de música favorito com nossa playlist "SINAIS - Calm".'
            )}
          >
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A']}
              style={styles.quickActionGradient}
            >
              <MaterialCommunityIcons name="music" size={32} color="#92400E" />
              <View style={styles.quickActionInfo}>
                <Text style={styles.quickActionTitle}>Música Relaxante</Text>
                <Text style={styles.quickActionSubtitle}>
                  Ouça sons calmantes
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>Contatos de Emergência</Text>
          
          {emergencyContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactCard}
              onPress={() => handleCall(contact.phone, contact.name)}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                style={styles.contactGradient}
              >
                <Text style={styles.contactIcon}>{contact.icon}</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCall(contact.phone, contact.name)}
                >
                  <MaterialCommunityIcons name="phone" size={24} color="white" />
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Recursos de Apoio</Text>
          
          <LinearGradient
            colors={['#F0FDF4', '#DCFCE7']}
            style={styles.resourceCard}
          >
            <MaterialCommunityIcons name="chat" size={28} color="#15803D" />
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>Chat Online CVV</Text>
              <Text style={styles.resourceText}>
                Disponível 24h por dia para conversar
              </Text>
              <TouchableOpacity
                style={styles.resourceButton}
                onPress={() => Linking.openURL('https://www.cvv.org.br')}
              >
                <Text style={styles.resourceButtonText}>Acessar Chat</Text>
                <MaterialCommunityIcons name="open-in-new" size={16} color="#15803D" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#EFF6FF', '#DBEAFE']}
            style={styles.resourceCard}
          >
            <MaterialCommunityIcons name="hospital-building" size={28} color="#1E40AF" />
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>CAPS - Centro de Atenção Psicossocial</Text>
              <Text style={styles.resourceText}>
                Atendimento gratuito em saúde mental
              </Text>
              <TouchableOpacity
                style={styles.resourceButton}
                onPress={() => Alert.alert(
                  'CAPS',
                  'Para encontrar o CAPS mais próximo, consulte o site do Ministério da Saúde ou ligue para 136.'
                )}
              >
                <Text style={styles.resourceButtonText}>Saber Mais</Text>
                <MaterialCommunityIcons name="information" size={16} color="#1E40AF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Safety Message */}
        <View style={styles.safetyMessage}>
          <LinearGradient
            colors={['#FEF2F2', '#FEE2E2']}
            style={styles.safetyMessageGradient}
          >
            <MaterialCommunityIcons name="heart" size={32} color="#DC2626" />
            <Text style={styles.safetyMessageTitle}>Você não está sozinho</Text>
            <Text style={styles.safetyMessageText}>
              Momentos difíceis passam. Estamos aqui para apoiar você em cada passo do caminho. 
              Não hesite em buscar ajuda profissional.
            </Text>
          </LinearGradient>
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
    alignItems: 'center',
    padding: 24,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sosButton: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sosButtonActive: {
    elevation: 12,
  },
  sosButtonGradient: {
    padding: 32,
    alignItems: 'center',
  },
  sosButtonText: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginTop: 16,
    letterSpacing: 2,
  },
  sosButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  quickActionCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  quickActionInfo: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  contactsSection: {
    marginBottom: 24,
  },
  contactCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  contactIcon: {
    fontSize: 32,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#64748B',
  },
  callButton: {
    backgroundColor: '#10B981',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourcesSection: {
    marginBottom: 24,
  },
  resourceCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  resourceInfo: {
    marginTop: 8,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  resourceText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 20,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  resourceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  safetyMessage: {
    marginBottom: 30,
  },
  safetyMessageGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  safetyMessageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  safetyMessageText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
});
