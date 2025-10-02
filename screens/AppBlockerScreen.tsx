import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlockedAppsService, BlockedApp } from '../services/BlockedAppsService';
import { GamificationService } from '../services/GamificationService';

export default function AppBlockerScreen() {
  const insets = useSafeAreaInsets();
  const [apps, setApps] = useState<BlockedApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const blockedApps = await BlockedAppsService.getBlockedApps();
      setApps(blockedApps);
    } catch (error) {
      console.error('Error loading apps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBlock = async (appId: string) => {
    try {
      const updatedApps = await BlockedAppsService.toggleAppBlock(appId);
      setApps(updatedApps);
      
      const blockedCount = updatedApps.filter(app => app.blocked).length;
      
      // Check if unlocked achievement
      if (blockedCount >= 5) {
        await GamificationService.unlockBadge('2'); // Controlador badge
        Alert.alert('🏆 Conquista!', 'Badge "Controlador" desbloqueado!');
      }
      
      // Add points for blocking an app
      const app = updatedApps.find(a => a.id === appId);
      if (app?.blocked) {
        await GamificationService.addPoints(10);
      }
    } catch (error) {
      console.error('Error toggling block:', error);
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes === 0) return '0min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    return `${hours}h ${mins}min`;
  };

  const blockedCount = apps.filter(app => app.blocked).length;
  const totalBlockedTime = apps.reduce((sum, app) => sum + (app.blocked ? app.timeBlocked : 0), 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social': return 'account-group';
      case 'gaming': return 'gamepad-variant';
      case 'entertainment': return 'netflix';
      default: return 'apps';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <MaterialCommunityIcons name="shield-lock" size={48} color="white" />
        <Text style={styles.headerTitle}>Bloqueio de Apps</Text>
        <Text style={styles.headerSubtitle}>
          Controle seus apps problemáticos
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.statCard}
          >
            <MaterialCommunityIcons name="lock" size={32} color="#4A90E2" />
            <Text style={styles.statValue}>{blockedCount}</Text>
            <Text style={styles.statLabel}>Apps Bloqueados</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#FFFFFF', '#FFF0F0']}
            style={styles.statCard}
          >
            <MaterialCommunityIcons name="clock-outline" size={32} color="#EF4444" />
            <Text style={styles.statValue}>{formatTime(totalBlockedTime)}</Text>
            <Text style={styles.statLabel}>Tempo Economizado</Text>
          </LinearGradient>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="information" size={24} color="#4A90E2" />
          <Text style={styles.infoText}>
            Apps bloqueados mostram uma tela de aviso quando você tenta abri-los
          </Text>
        </View>

        {/* Apps List */}
        <Text style={styles.sectionTitle}>Aplicativos</Text>
        
        {apps.map((app) => (
          <LinearGradient
            key={app.id}
            colors={app.blocked ? ['#FEF2F2', '#FFFFFF'] : ['#FFFFFF', '#F8FAFC']}
            style={styles.appCard}
          >
            <View style={styles.appInfo}>
              <View style={[
                styles.appIconContainer,
                { backgroundColor: app.blocked ? '#FEE2E2' : '#E0F2FE' }
              ]}>
                <Text style={styles.appIcon}>{app.icon}</Text>
              </View>
              
              <View style={styles.appDetails}>
                <Text style={styles.appName}>{app.name}</Text>
                <View style={styles.categoryContainer}>
                  <MaterialCommunityIcons 
                    name={getCategoryIcon(app.category)} 
                    size={14} 
                    color="#64748B" 
                  />
                  <Text style={styles.categoryText}>
                    {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
                  </Text>
                </View>
                {app.blocked && app.timeBlocked > 0 && (
                  <Text style={styles.blockedTime}>
                    ⏱️ {formatTime(app.timeBlocked)} economizados
                  </Text>
                )}
              </View>
            </View>

            <Switch
              value={app.blocked}
              onValueChange={() => toggleBlock(app.id)}
              trackColor={{ false: '#D1D5DB', true: '#FCA5A5' }}
              thumbColor={app.blocked ? '#EF4444' : '#F3F4F6'}
            />
          </LinearGradient>
        ))}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              Alert.alert(
                '🔒 Bloquear Todos',
                'Deseja bloquear todos os aplicativos?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Bloquear',
                    onPress: async () => {
                      const updatedApps = apps.map(app => ({ ...app, blocked: true }));
                      setApps(updatedApps);
                      await BlockedAppsService.saveBlockedApps(updatedApps);
                    }
                  }
                ]
              );
            }}
          >
            <MaterialCommunityIcons name="lock-alert" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Bloquear Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={async () => {
              const updatedApps = apps.map(app => ({ ...app, blocked: false }));
              setApps(updatedApps);
              await BlockedAppsService.saveBlockedApps(updatedApps);
            }}
          >
            <MaterialCommunityIcons name="lock-open-variant" size={20} color="#4A90E2" />
            <Text style={styles.secondaryButtonText}>Desbloquear Todos</Text>
          </TouchableOpacity>
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  appIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    fontSize: 28,
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#64748B',
  },
  blockedTime: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 30,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  secondaryButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
});
