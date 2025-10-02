import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GamificationService } from '../services/GamificationService';
import { NotificationService } from '../services/NotificationService';

export default function FocusModeScreen() {
  const insets = useSafeAreaInsets();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const durations = [
    { label: '15min', minutes: 15 },
    { label: '25min', minutes: 25 },
    { label: '45min', minutes: 45 },
    { label: '60min', minutes: 60 },
  ];

  useEffect(() => {
    loadTotalFocusTime();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadTotalFocusTime = async () => {
    const progress = await GamificationService.getUserProgress();
    setTotalFocusTime(progress.focusMinutes);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startFocus = () => {
    setIsActive(true);
    setTimeLeft(selectedDuration * 60);
    
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          completeFocusSession();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const pauseFocus = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const stopFocus = () => {
    Alert.alert(
      '⏸️ Parar Sessão',
      'Tem certeza que deseja parar? Você perderá o progresso desta sessão.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Parar',
          style: 'destructive',
          onPress: () => {
            setIsActive(false);
            setTimeLeft(selectedDuration * 60);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
          }
        }
      ]
    );
  };

  const completeFocusSession = async () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Update total focus time
    const newTotalTime = totalFocusTime + selectedDuration;
    setTotalFocusTime(newTotalTime);

    // Update gamification
    const progress = await GamificationService.getUserProgress();
    await GamificationService.saveUserProgress({
      ...progress,
      focusMinutes: newTotalTime
    });

    // Add points
    const points = selectedDuration * 2; // 2 points per minute
    await GamificationService.addPoints(points);

    // Update achievement
    await GamificationService.updateAchievementProgress('1', newTotalTime);

    // Check for badge unlock
    if (newTotalTime >= 120) {
      await GamificationService.unlockBadge('3'); // Focado badge
    }

    // Send notification
    await NotificationService.sendGoalAchievement(
      'Sessão de Foco Completa!',
      `Parabéns! Você ganhou ${points} pontos.`
    );

    Alert.alert(
      '🎉 Sessão Completa!',
      `Ótimo trabalho! Você ganhou ${points} pontos.\n\nTempo total de foco: ${Math.floor(newTotalTime / 60)}h ${newTotalTime % 60}min`,
      [{ text: 'Continuar', onPress: () => setTimeLeft(selectedDuration * 60) }]
    );
  };

  const progress = timeLeft / (selectedDuration * 60);
  const progressPercentage = Math.round((1 - progress) * 100);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        style={styles.header}
      >
        <MaterialCommunityIcons name="brain" size={48} color="white" />
        <Text style={styles.headerTitle}>Modo Foco</Text>
        <Text style={styles.headerSubtitle}>
          Concentre-se sem distrações
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Timer Display */}
        <LinearGradient
          colors={isActive ? ['#F3E8FF', '#E9D5FF'] : ['#FFFFFF', '#F8FAFC']}
          style={styles.timerContainer}
        >
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerProgress}>{progressPercentage}%</Text>
          </View>
          
          {isActive && (
            <View style={styles.statusBadge}>
              <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color="#10B981" />
              <Text style={styles.statusText}>Em Foco</Text>
            </View>
          )}
        </LinearGradient>

        {/* Duration Selection */}
        {!isActive && (
          <View style={styles.durationSection}>
            <Text style={styles.sectionTitle}>Duração da Sessão</Text>
            <View style={styles.durationButtons}>
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration.minutes}
                  style={[
                    styles.durationButton,
                    selectedDuration === duration.minutes && styles.durationButtonActive
                  ]}
                  onPress={() => {
                    setSelectedDuration(duration.minutes);
                    setTimeLeft(duration.minutes * 60);
                  }}
                >
                  <Text style={[
                    styles.durationButtonText,
                    selectedDuration === duration.minutes && styles.durationButtonTextActive
                  ]}>
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          {!isActive ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={startFocus}
            >
              <MaterialCommunityIcons name="play" size={32} color="white" />
              <Text style={styles.startButtonText}>Iniciar Foco</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeControls}>
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={pauseFocus}
              >
                <MaterialCommunityIcons name="pause" size={24} color="white" />
                <Text style={styles.controlButtonText}>Pausar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.stopButton}
                onPress={stopFocus}
              >
                <MaterialCommunityIcons name="stop" size={24} color="white" />
                <Text style={styles.controlButtonText}>Parar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          
          <LinearGradient
            colors={['#FFFFFF', '#F0F7FF']}
            style={styles.statCard}
          >
            <MaterialCommunityIcons name="trophy" size={32} color="#F59E0B" />
            <Text style={styles.statValue}>
              {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}min
            </Text>
            <Text style={styles.statLabel}>Tempo Total de Foco</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#FFFFFF', '#FFF0F0']}
            style={styles.statCard}
          >
            <MaterialCommunityIcons name="fire" size={32} color="#EF4444" />
            <Text style={styles.statValue}>
              {Math.floor(totalFocusTime / selectedDuration)}
            </Text>
            <Text style={styles.statLabel}>Sessões Completadas</Text>
          </LinearGradient>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <LinearGradient
            colors={['#EFF6FF', '#DBEAFE']}
            style={styles.tipCard}
          >
            <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#4A90E2" />
            <Text style={styles.tipTitle}>Dica de Foco</Text>
            <Text style={styles.tipText}>
              Durante o modo foco, mantenha seu celular virado para baixo e elimine distrações do ambiente.
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={['#F0FDF4', '#DCFCE7']}
            style={styles.tipCard}
          >
            <MaterialCommunityIcons name="meditation" size={24} color="#10B981" />
            <Text style={styles.tipTitle}>Técnica Pomodoro</Text>
            <Text style={styles.tipText}>
              Faça uma pausa de 5 minutos após cada sessão de 25 minutos para manter a produtividade.
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
  timerContainer: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#8B5CF6',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1F2937',
  },
  timerProgress: {
    fontSize: 18,
    color: '#64748B',
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    gap: 6,
  },
  statusText: {
    color: '#065F46',
    fontSize: 14,
    fontWeight: '600',
  },
  durationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  durationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  durationButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  durationButtonTextActive: {
    color: 'white',
  },
  controlButtons: {
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  activeControls: {
    flexDirection: 'row',
    gap: 12,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 24,
  },
  statCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});
