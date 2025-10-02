import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GamificationService, Badge, Achievement, UserProgress } from '../services/GamificationService';

export default function GamificationScreen() {
  const insets = useSafeAreaInsets();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedTab, setSelectedTab] = useState<'badges' | 'achievements'>('badges');

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      const [badgesData, achievementsData, progressData] = await Promise.all([
        GamificationService.getBadges(),
        GamificationService.getAchievements(),
        GamificationService.getUserProgress()
      ]);
      
      setBadges(badgesData);
      setAchievements(achievementsData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'focus': return '#8B5CF6';
      case 'control': return '#EF4444';
      case 'progress': return '#10B981';
      case 'wellness': return '#F59E0B';
      default: return '#64748B';
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);
  const completedAchievements = achievements.filter(a => a.progress >= a.target);
  const inProgressAchievements = achievements.filter(a => a.progress < a.target);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        style={styles.header}
      >
        <MaterialCommunityIcons name="trophy" size={48} color="white" />
        <Text style={styles.headerTitle}>Conquistas</Text>
        <Text style={styles.headerSubtitle}>
          Seu progresso e recompensas
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* User Progress Card */}
        {progress && (
          <LinearGradient
            colors={['#FBBF24', '#F59E0B']}
            style={styles.progressCard}
          >
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.levelText}>Nível {progress.level}</Text>
                <Text style={styles.pointsText}>{progress.totalPoints} Pontos</Text>
              </View>
              <View style={styles.levelBadge}>
                <MaterialCommunityIcons name="star" size={32} color="white" />
              </View>
            </View>

            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(progress.totalPoints % 100)}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {100 - (progress.totalPoints % 100)} pontos até o nível {progress.level + 1}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="fire" size={24} color="white" />
                <Text style={styles.statValue}>{progress.currentStreak}</Text>
                <Text style={styles.statLabel}>Dias Seguidos</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="white" />
                <Text style={styles.statValue}>{Math.floor(progress.focusMinutes / 60)}h</Text>
                <Text style={styles.statLabel}>Tempo de Foco</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="lock" size={24} color="white" />
                <Text style={styles.statValue}>{progress.appsBlocked}</Text>
                <Text style={styles.statLabel}>Apps Bloqueados</Text>
              </View>
            </View>
          </LinearGradient>
        )}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'badges' && styles.tabActive]}
            onPress={() => setSelectedTab('badges')}
          >
            <Text style={[styles.tabText, selectedTab === 'badges' && styles.tabTextActive]}>
              Badges ({unlockedBadges.length}/{badges.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'achievements' && styles.tabActive]}
            onPress={() => setSelectedTab('achievements')}
          >
            <Text style={[styles.tabText, selectedTab === 'achievements' && styles.tabTextActive]}>
              Desafios ({completedAchievements.length}/{achievements.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Badges Tab */}
        {selectedTab === 'badges' && (
          <View style={styles.badgesContainer}>
            {/* Unlocked Badges */}
            {unlockedBadges.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Desbloqueadas</Text>
                <View style={styles.badgesGrid}>
                  {unlockedBadges.map((badge) => (
                    <LinearGradient
                      key={badge.id}
                      colors={['#FFFFFF', '#F0F9FF']}
                      style={styles.badgeCard}
                    >
                      <View style={[
                        styles.badgeIconContainer,
                        { backgroundColor: `${getCategoryColor(badge.category)}20` }
                      ]}>
                        <Text style={styles.badgeIcon}>{badge.icon}</Text>
                      </View>
                      <Text style={styles.badgeName}>{badge.name}</Text>
                      <Text style={styles.badgeDescription}>{badge.description}</Text>
                      {badge.unlockedAt && (
                        <Text style={styles.badgeDate}>{formatDate(badge.unlockedAt)}</Text>
                      )}
                    </LinearGradient>
                  ))}
                </View>
              </>
            )}

            {/* Locked Badges */}
            {lockedBadges.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Bloqueadas</Text>
                <View style={styles.badgesGrid}>
                  {lockedBadges.map((badge) => (
                    <LinearGradient
                      key={badge.id}
                      colors={['#F8FAFC', '#E5E7EB']}
                      style={[styles.badgeCard, styles.badgeCardLocked]}
                    >
                      <View style={styles.badgeIconContainer}>
                        <MaterialCommunityIcons name="lock" size={32} color="#9CA3AF" />
                      </View>
                      <Text style={[styles.badgeName, styles.badgeNameLocked]}>{badge.name}</Text>
                      <Text style={[styles.badgeDescription, styles.badgeDescriptionLocked]}>
                        {badge.description}
                      </Text>
                    </LinearGradient>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* Achievements Tab */}
        {selectedTab === 'achievements' && (
          <View style={styles.achievementsContainer}>
            {/* In Progress */}
            {inProgressAchievements.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Em Progresso</Text>
                {inProgressAchievements.map((achievement) => (
                  <LinearGradient
                    key={achievement.id}
                    colors={['#FFFFFF', '#F8FAFC']}
                    style={styles.achievementCard}
                  >
                    <View style={styles.achievementHeader}>
                      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>{achievement.title}</Text>
                        <Text style={styles.achievementProgress}>
                          {achievement.progress} / {achievement.target}
                        </Text>
                      </View>
                      <View style={styles.achievementReward}>
                        <MaterialCommunityIcons name="star" size={20} color="#F59E0B" />
                        <Text style={styles.achievementRewardText}>+{achievement.reward}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.achievementProgressBar}>
                      <View 
                        style={[
                          styles.achievementProgressFill,
                          { width: `${(achievement.progress / achievement.target) * 100}%` }
                        ]}
                      />
                    </View>
                    <Text style={styles.achievementProgressText}>
                      {Math.round((achievement.progress / achievement.target) * 100)}% completo
                    </Text>
                  </LinearGradient>
                ))}
              </>
            )}

            {/* Completed */}
            {completedAchievements.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Completados</Text>
                {completedAchievements.map((achievement) => (
                  <LinearGradient
                    key={achievement.id}
                    colors={['#D1FAE5', '#A7F3D0']}
                    style={styles.achievementCard}
                  >
                    <View style={styles.achievementHeader}>
                      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>{achievement.title}</Text>
                        <Text style={styles.achievementCompletedText}>Completo! ✓</Text>
                      </View>
                      <View style={styles.achievementReward}>
                        <MaterialCommunityIcons name="star" size={20} color="#F59E0B" />
                        <Text style={styles.achievementRewardText}>+{achievement.reward}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                ))}
              </>
            )}
          </View>
        )}

        {/* Leaderboard Preview */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Ranking Semanal</Text>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.leaderboardCard}
          >
            <View style={styles.leaderboardItem}>
              <Text style={styles.leaderboardRank}>🥇</Text>
              <Text style={styles.leaderboardName}>Ana Silva</Text>
              <Text style={styles.leaderboardPoints}>1,250 pts</Text>
            </View>
            
            <View style={styles.leaderboardItem}>
              <Text style={styles.leaderboardRank}>🥈</Text>
              <Text style={styles.leaderboardName}>Você</Text>
              <Text style={styles.leaderboardPoints}>{progress?.totalPoints || 0} pts</Text>
            </View>
            
            <View style={styles.leaderboardItem}>
              <Text style={styles.leaderboardRank}>🥉</Text>
              <Text style={styles.leaderboardName}>Carlos Santos</Text>
              <Text style={styles.leaderboardPoints}>980 pts</Text>
            </View>
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
  progressCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  pointsText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  levelBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#1F2937',
  },
  badgesContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeIcon: {
    fontSize: 36,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: '#9CA3AF',
  },
  badgeDescription: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  badgeDescriptionLocked: {
    color: '#9CA3AF',
  },
  badgeDate: {
    fontSize: 10,
    color: '#10B981',
    marginTop: 8,
  },
  achievementsContainer: {
    marginBottom: 30,
  },
  achievementCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementProgress: {
    fontSize: 13,
    color: '#64748B',
  },
  achievementCompletedText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
  achievementReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  achievementRewardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
  },
  achievementProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 6,
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  achievementProgressText: {
    fontSize: 12,
    color: '#64748B',
  },
  leaderboardSection: {
    marginBottom: 30,
  },
  leaderboardCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  leaderboardRank: {
    fontSize: 24,
    marginRight: 12,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  leaderboardPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
});
