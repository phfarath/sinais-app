import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type EducationalScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Educational'>;
};

export default function EducationalScreen({ navigation }: EducationalScreenProps) {
  const insets = useSafeAreaInsets();

  const resources = [
    {
      id: 1,
      title: 'Como funciona o vício em apostas',
      image: require('../assets/icon.png'),
      type: 'Artigo',
      duration: '5 min',
    },
    {
      id: 2,
      title: 'Sinais de alerta para comportamento compulsivo',
      image: require('../assets/icon.png'),
      type: 'Vídeo',
      duration: '3 min',
    },
    {
      id: 3,
      title: 'Técnicas de controle financeiro',
      image: require('../assets/icon.png'),
      type: 'Tutorial',
      duration: '7 min',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.headerGradient}
        >
          <Text style={styles.title}>Central Educativa</Text>
          <Text style={styles.subtitle}>Aprenda sobre jogo responsável</Text>
        </LinearGradient>

        {/* Botão para insights de IA */}
        <TouchableOpacity 
          style={styles.insightsButton}
          onPress={() => navigation.navigate('Insights')}
        >
          <MaterialCommunityIcons name="brain" size={24} color="white" />
          <Text style={styles.insightsButtonText}>Insights da IA</Text>
        </TouchableOpacity>

        {/* Seção de Apoio (do HelpScreen) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Precisa de Apoio?</Text>
          
          <TouchableOpacity style={styles.chatSupport}>
            <MaterialCommunityIcons name="chat-processing" size={24} color="#4A90E2" />
            <View style={styles.chatInfo}>
              <Text style={styles.chatTitle}>Chat de Apoio 24/7</Text>
              <Text style={styles.chatSubtitle}>Disponível agora</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.appointmentButton}>
            <MaterialCommunityIcons name="calendar-clock" size={24} color="#4A90E2" />
            <View style={styles.chatInfo}>
              <Text style={styles.chatTitle}>Agendar Consulta</Text>
              <Text style={styles.chatSubtitle}>Psicólogo voluntário</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Contatos de Apoio (do HelpScreen) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contatos de Apoio</Text>
          
          <TouchableOpacity style={styles.contactCard}>
            <MaterialCommunityIcons name="phone" size={24} color="#10B981" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Linha de Apoio ao Jogador</Text>
              <Text style={styles.contactDetail}>0800 000 0000</Text>
            </View>
            <MaterialCommunityIcons name="phone-outgoing" size={24} color="#4A90E2" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactCard}>
            <MaterialCommunityIcons name="earth" size={24} color="#10B981" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Jogadores Anônimos</Text>
              <Text style={styles.contactDetail}>www.jogadoresanonimos.org.br</Text>
            </View>
            <MaterialCommunityIcons name="open-in-new" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        {/* Conteúdo educativo original */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conteúdo Recomendado</Text>
          
          {resources.map(resource => (
            <TouchableOpacity key={resource.id} style={styles.resourceCard}>
              <Image source={resource.image} style={styles.resourceImage} />
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <View style={styles.resourceMeta}>
                  <Text style={styles.resourceType}>{resource.type}</Text>
                  <Text style={styles.resourceDuration}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#6B7280" />
                    {' ' + resource.duration}
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dicas Rápidas</Text>
          
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.tipCard}
          >
            <View style={styles.tipHeader}>
              <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#4A90E2" />
              <Text style={styles.tipTitle}>Defina limites</Text>
            </View>
            <Text style={styles.tipDescription}>
              Estabeleça um orçamento e um tempo máximo para apostas antes de começar
            </Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#FFFFFF', '#FFFAEB']}
            style={styles.tipCard}
          >
            <View style={styles.tipHeader}>
              <MaterialCommunityIcons name="timer-outline" size={24} color="#F59E0B" />
              <Text style={styles.tipTitle}>Faça pausas</Text>
            </View>
            <Text style={styles.tipDescription}>
              Intervalos regulares ajudam a manter o controle e a clareza mental
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
    backgroundColor: '#F5F8FF',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  insightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  insightsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  resourceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceType: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
    marginRight: 12,
  },
  resourceDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  // Estilos para o conteúdo de apoio (do HelpScreen)
  chatSupport: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chatInfo: {
    marginLeft: 16,
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#4A90E2',
  },
  appointmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInfo: {
    marginLeft: 16,
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 14,
    color: '#4B5563',
  },
});