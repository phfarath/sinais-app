import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserContext } from '../services/UserContext';
import { CirclesService, CircleWithMembers } from '../services/CirclesService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

// Types for SINAIS Circles
type CircleType = 'duo' | 'family' | 'support' | 'challenge';
type TransparencyLevel = 'score_only' | 'trends' | 'detailed';

interface Circle {
  id: string;
  name: string;
  type: CircleType;
  memberCount: number;
  myTransparency: TransparencyLevel;
  wellnessScore: number;
  trend: 'improving' | 'stable' | 'declining';
}

interface CircleMember {
  id: string;
  name: string;
  wellnessScore: number;
  trend: 'improving' | 'stable' | 'declining';
  lastActive: string;
}

export default function CirclesScreen() {
  const insets = useSafeAreaInsets();
  const [circles, setCircles] = useState<CircleWithMembers[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<CircleWithMembers | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleDescription, setNewCircleDescription] = useState('');
  const [newCircleType, setNewCircleType] = useState<CircleType>('duo');
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Load circles when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadUserCircles();
    }, [])
  );

  const loadUserCircles = async () => {
    const userId = UserContext.getUserId();
    if (!userId) {
      console.log('❌ No user logged in');
      return;
    }

    console.log('✅ Loading circles for user ID:', userId);
    setLoading(true);
    try {
      const userCircles = await CirclesService.getUserCircles(userId);
      console.log('✅ Loaded circles:', userCircles.length, 'circles found');
      console.log('✅ Circle data:', userCircles);
      setCircles(userCircles);
    } catch (error) {
      console.error('❌ Error loading circles:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus círculos');
    } finally {
      setLoading(false);
    }
  };

  const getCircleIcon = (type: CircleType): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (type) {
      case 'family': return 'home-heart';
      case 'duo': return 'account-multiple';
      case 'support': return 'medical-bag';
      case 'challenge': return 'trophy';
      default: return 'account-group';
    }
  };

  const getCircleColor = (type: CircleType): string => {
    switch (type) {
      case 'family': return '#10B981';
      case 'duo': return '#4A90E2';
      case 'support': return '#8B5CF6';
      case 'challenge': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining'): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (trend) {
      case 'improving': return 'trending-up';
      case 'stable': return 'trending-neutral';
      case 'declining': return 'trending-down';
    }
  };

  const getTrendColor = (trend: 'improving' | 'stable' | 'declining'): string => {
    switch (trend) {
      case 'improving': return '#10B981';
      case 'stable': return '#6B7280';
      case 'declining': return '#EF4444';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getTransparencyLabel = (level: TransparencyLevel): string => {
    switch (level) {
      case 'score_only': return 'Apenas Pontuação';
      case 'trends': return 'Tendências';
      case 'detailed': return 'Detalhado';
    }
  };

  const handleCreateCircle = async () => {
    if (!newCircleName.trim()) {
      Alert.alert('Erro', 'Por favor, digite um nome para o círculo');
      return;
    }

    const userId = UserContext.getUserId();
    if (!userId) {
      Alert.alert('Erro', 'Você precisa estar logado para criar um círculo');
      return;
    }

    setLoading(true);
    try {
      const result = await CirclesService.createCircle(
        userId,
        newCircleName,
        newCircleType,
        newCircleDescription || `Círculo ${newCircleName}`
      );

      if (result.success) {
        setNewCircleName('');
        setNewCircleDescription('');
        setCreateModalVisible(false);
        Alert.alert('Sucesso', 'Círculo criado! Agora você pode convidar membros.');
        await loadUserCircles(); // Reload circles
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível criar o círculo');
      }
    } catch (error) {
      console.error('Error creating circle:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao criar o círculo');
    } finally {
      setLoading(false);
    }
  };

  const handleCirclePress = (circle: CircleWithMembers) => {
    setSelectedCircle(circle);
    setDetailModalVisible(true);
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Erro', 'Por favor, digite um e-mail');
      return;
    }

    if (!selectedCircle) return;

    setLoading(true);
    try {
      const result = await CirclesService.inviteMember(
        selectedCircle.id,
        inviteEmail.toLowerCase().trim(),
        'member',
        'trends'
      );

      if (result.success) {
        setInviteEmail('');
        setInviteModalVisible(false);
        Alert.alert('Sucesso', 'Convite enviado com sucesso!');
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível enviar o convite');
      }
    } catch (error) {
      console.error('Error inviting member:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar o convite');
    } finally {
      setLoading(false);
    }
  };

  const getAverageWellness = (circle: CircleWithMembers): number => {
    if (circle.members.length === 0) return 0;
    const sum = circle.members.reduce((acc, m) => acc + (m.user_profile?.wellness_score || 0), 0);
    return Math.round(sum / circle.members.length);
  };

  const getAverageTrend = (circle: CircleWithMembers): 'improving' | 'stable' | 'declining' => {
    // Simple logic: if most members are improving, return improving
    const trends = circle.members.map(m => m.user_profile?.wellness_trend || 'stable');
    const improving = trends.filter(t => t === 'improving').length;
    const declining = trends.filter(t => t === 'declining').length;
    
    if (improving > declining) return 'improving';
    if (declining > improving) return 'declining';
    return 'stable';
  };

  const renderCircleCard = ({ item }: { item: CircleWithMembers }) => (
    <TouchableOpacity
      style={styles.circleCard}
      onPress={() => handleCirclePress(item)}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.circleCardGradient}
      >
        <View style={styles.circleCardHeader}>
          <View style={[styles.circleIcon, { backgroundColor: getCircleColor(item.type) + '20' }]}>
            <MaterialCommunityIcons
              name={getCircleIcon(item.type)}
              size={32}
              color={getCircleColor(item.type)}
            />
          </View>
          <View style={styles.circleCardInfo}>
            <Text style={styles.circleName}>{item.name}</Text>
            <View style={styles.circleMetaRow}>
              <MaterialCommunityIcons name="account-group" size={16} color="#6B7280" />
              <Text style={styles.circleMeta}>{item.members.length} membros</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </View>

        <View style={styles.circleCardStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Bem-estar Médio</Text>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreValue, { color: getScoreColor(getAverageWellness(item)) }]}>
                {getAverageWellness(item)}
              </Text>
              <MaterialCommunityIcons
                name={getTrendIcon(getAverageTrend(item))}
                size={20}
                color={getTrendColor(getAverageTrend(item))}
              />
            </View>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tipo</Text>
            <Text style={styles.transparencyValue}>
              {item.type === 'duo' ? 'Duo' : item.type === 'family' ? 'Família' :
               item.type === 'support' ? 'Apoio' : 'Desafio'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMemberCard = ({ item }: { item: any }) => {
    const profile = item.user_profile;
    if (!profile) return null;

    return (
      <View style={styles.memberCard}>
        <View style={styles.memberAvatar}>
          <MaterialCommunityIcons name="account" size={32} color="#4A90E2" />
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{profile.full_name}</Text>
          <Text style={styles.memberLastActive}>{profile.email}</Text>
        </View>
        <View style={styles.memberStats}>
          <Text style={[styles.memberScore, { color: getScoreColor(profile.wellness_score) }]}>
            {profile.wellness_score}
          </Text>
          <MaterialCommunityIcons
            name={getTrendIcon(profile.wellness_trend)}
            size={18}
            color={getTrendColor(profile.wellness_trend)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#FFFFFF', '#F0F7FF']}
        style={styles.header}
      >
        <MaterialCommunityIcons name="earth" size={40} color="#4A90E2" />
        <Text style={styles.title}>SINAIS Circles</Text>
        <Text style={styles.subtitle}>Responsabilidade compartilhada, não vigilância</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* What is SINAIS Circles */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information" size={24} color="#4A90E2" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>O que são Circles?</Text>
            <Text style={styles.infoText}>
              Círculos de responsabilidade mútua onde você compartilha seu bem-estar com pessoas de confiança. 
              Todos compartilham igualmente - sem vigilância, apenas apoio.
            </Text>
          </View>
        </View>

        {/* Circles List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seus Círculos</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setCreateModalVisible(true)}
            >
              <MaterialCommunityIcons name="plus-circle" size={28} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.emptyStateSubtext}>Carregando círculos...</Text>
            </View>
          ) : circles.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-group-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>Nenhum círculo ainda</Text>
              <Text style={styles.emptyStateSubtext}>
                Crie seu primeiro círculo de responsabilidade
              </Text>
              <TouchableOpacity 
                style={styles.createFirstButton}
                onPress={() => setCreateModalVisible(true)}
              >
                <Text style={styles.createFirstButtonText}>Criar Círculo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={circles}
              renderItem={renderCircleCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.circlesList}
            />
          )}
        </View>

        {/* Circle Types Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos de Círculos</Text>
          
          <View style={styles.typeCard}>
            <MaterialCommunityIcons name="home-heart" size={24} color="#10B981" />
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>Família</Text>
              <Text style={styles.typeDescription}>
                Responsabilidade mútua entre familiares com proteções especiais para menores
              </Text>
            </View>
          </View>

          <View style={styles.typeCard}>
            <MaterialCommunityIcons name="account-multiple" size={24} color="#4A90E2" />
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>Duo</Text>
              <Text style={styles.typeDescription}>
                Parceria de responsabilidade 1:1 com amigos ou colegas
              </Text>
            </View>
          </View>

          <View style={styles.typeCard}>
            <MaterialCommunityIcons name="medical-bag" size={24} color="#8B5CF6" />
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>Apoio</Text>
              <Text style={styles.typeDescription}>
                Inclui profissionais como terapeutas ou conselheiros
              </Text>
            </View>
          </View>

          <View style={styles.typeCard}>
            <MaterialCommunityIcons name="trophy" size={24} color="#F59E0B" />
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>Desafio</Text>
              <Text style={styles.typeDescription}>
                Grupos trabalhando juntos em objetivos compartilhados
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Create Circle Modal */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Criar Novo Círculo</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nome do Círculo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Família Silva, Accountability Friends"
              value={newCircleName}
              onChangeText={setNewCircleName}
              autoFocus
            />

            <Text style={styles.inputLabel}>Descrição (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Descrição do círculo"
              value={newCircleDescription}
              onChangeText={setNewCircleDescription}
              multiline
              numberOfLines={2}
            />

            <Text style={styles.inputLabel}>Tipo de Círculo</Text>
            <View style={styles.typeSelector}>
              {(['duo', 'family', 'support', 'challenge'] as CircleType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    newCircleType === type && styles.typeOptionSelected
                  ]}
                  onPress={() => setNewCircleType(type)}
                >
                  <MaterialCommunityIcons 
                    name={getCircleIcon(type)} 
                    size={24} 
                    color={newCircleType === type ? '#4A90E2' : '#6B7280'} 
                  />
                  <Text style={[
                    styles.typeOptionText,
                    newCircleType === type && styles.typeOptionTextSelected
                  ]}>
                    {type === 'duo' ? 'Duo' : type === 'family' ? 'Família' : 
                     type === 'support' ? 'Apoio' : 'Desafio'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateCircle}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.createButtonText}>Criar Círculo</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Circle Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedCircle?.name}</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.circleDetailStats}>
              <View style={styles.detailStatCard}>
                <Text style={styles.detailStatLabel}>Bem-estar Médio</Text>
                <Text style={[styles.detailStatValue, { color: getScoreColor(selectedCircle ? getAverageWellness(selectedCircle) : 0) }]}>
                  {selectedCircle ? getAverageWellness(selectedCircle) : 0}
                </Text>
              </View>
              <View style={styles.detailStatCard}>
                <Text style={styles.detailStatLabel}>Membros</Text>
                <Text style={styles.detailStatValue}>{selectedCircle?.members.length || 0}</Text>
              </View>
            </View>

            <Text style={styles.membersTitle}>Membros do Círculo</Text>
            <FlatList
              data={selectedCircle?.members || []}
              renderItem={renderMemberCard}
              keyExtractor={(item) => item.user_id}
              style={styles.membersList}
            />

            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => {
                setDetailModalVisible(false);
                setInviteModalVisible(true);
              }}
            >
              <MaterialCommunityIcons name="account-plus" size={20} color="white" />
              <Text style={styles.inviteButtonText}>Convidar Membros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        visible={inviteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Convidar Membro</Text>
              <TouchableOpacity onPress={() => setInviteModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>E-mail do Membro</Text>
            <TextInput
              style={styles.input}
              placeholder="exemplo@email.com"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleInviteMember}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.createButtonText}>Enviar Convite</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    padding: 4,
  },
  circlesList: {
    gap: 12,
  },
  circleCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  circleCardGradient: {
    padding: 16,
  },
  circleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  circleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  circleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  circleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  circleMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  circleCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  transparencyValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A90E2',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  createFirstButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  createFirstButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  typeCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  typeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  typeOption: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  typeOptionSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#EFF6FF',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeOptionTextSelected: {
    color: '#4A90E2',
  },
  createButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  circleDetailStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  detailStatCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  detailStatValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  membersList: {
    maxHeight: 300,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  memberLastActive: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  memberStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberScore: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inviteButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  inviteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});