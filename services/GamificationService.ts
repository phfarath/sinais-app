import { StorageService } from './StorageService';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'focus' | 'control' | 'progress' | 'wellness';
}

export interface Achievement {
  id: string;
  title: string;
  progress: number;
  target: number;
  reward: number; // points
  icon: string;
}

export interface UserProgress {
  level: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  focusMinutes: number;
  appsBlocked: number;
}

export class GamificationService {
  private static readonly BADGES_KEY = 'gamification_badges';
  private static readonly PROGRESS_KEY = 'user_progress';
  private static readonly ACHIEVEMENTS_KEY = 'achievements';

  private static defaultBadges: Badge[] = [
    {
      id: '1',
      name: 'Primeiro Passo',
      description: 'Complete seu primeiro dia de foco',
      icon: '🏆',
      unlocked: true,
      unlockedAt: new Date(),
      category: 'focus'
    },
    {
      id: '2',
      name: 'Controlador',
      description: 'Bloqueie 5 aplicativos',
      icon: '🛡️',
      unlocked: false,
      category: 'control'
    },
    {
      id: '3',
      name: 'Focado',
      description: 'Complete 2 horas de modo foco',
      icon: '🎯',
      unlocked: false,
      category: 'focus'
    },
    {
      id: '4',
      name: 'Semana Forte',
      description: 'Mantenha uma sequência de 7 dias',
      icon: '💪',
      unlocked: false,
      category: 'progress'
    },
    {
      id: '5',
      name: 'Mestre do Bem-Estar',
      description: 'Complete 30 dias consecutivos',
      icon: '🌟',
      unlocked: false,
      category: 'wellness'
    },
    {
      id: '6',
      name: 'Guerreiro',
      description: 'Acumule 1000 pontos',
      icon: '⚔️',
      unlocked: false,
      category: 'progress'
    },
  ];

  private static defaultAchievements: Achievement[] = [
    {
      id: '1',
      title: 'Tempo de Foco Diário',
      progress: 45,
      target: 120,
      reward: 50,
      icon: '⏱️'
    },
    {
      id: '2',
      title: 'Apps Bloqueados',
      progress: 3,
      target: 5,
      reward: 30,
      icon: '🔒'
    },
    {
      id: '3',
      title: 'Dias Consecutivos',
      progress: 2,
      target: 7,
      reward: 100,
      icon: '📅'
    },
  ];

  static async getBadges(): Promise<Badge[]> {
    try {
      const badges = await StorageService.getData(this.BADGES_KEY);
      return badges || this.defaultBadges;
    } catch (error) {
      console.error('Error getting badges:', error);
      return this.defaultBadges;
    }
  }

  static async saveBadges(badges: Badge[]): Promise<void> {
    try {
      await StorageService.storeData(this.BADGES_KEY, badges);
    } catch (error) {
      console.error('Error saving badges:', error);
    }
  }

  static async unlockBadge(badgeId: string): Promise<void> {
    try {
      const badges = await this.getBadges();
      const updatedBadges = badges.map(badge => {
        if (badge.id === badgeId && !badge.unlocked) {
          return { ...badge, unlocked: true, unlockedAt: new Date() };
        }
        return badge;
      });
      await this.saveBadges(updatedBadges);
    } catch (error) {
      console.error('Error unlocking badge:', error);
    }
  }

  static async getUserProgress(): Promise<UserProgress> {
    try {
      const progress = await StorageService.getData(this.PROGRESS_KEY);
      if (!progress) {
        const defaultProgress: UserProgress = {
          level: 1,
          totalPoints: 125,
          currentStreak: 2,
          longestStreak: 5,
          focusMinutes: 345,
          appsBlocked: 3
        };
        await this.saveUserProgress(defaultProgress);
        return defaultProgress;
      }
      return progress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return {
        level: 1,
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        focusMinutes: 0,
        appsBlocked: 0
      };
    }
  }

  static async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      await StorageService.storeData(this.PROGRESS_KEY, progress);
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }

  static async addPoints(points: number): Promise<UserProgress> {
    try {
      const progress = await this.getUserProgress();
      const newTotalPoints = progress.totalPoints + points;
      const newLevel = Math.floor(newTotalPoints / 100) + 1;
      
      const updatedProgress: UserProgress = {
        ...progress,
        totalPoints: newTotalPoints,
        level: newLevel
      };
      
      await this.saveUserProgress(updatedProgress);
      return updatedProgress;
    } catch (error) {
      console.error('Error adding points:', error);
      throw error;
    }
  }

  static async updateStreak(increment: boolean = true): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      const newStreak = increment ? progress.currentStreak + 1 : 0;
      const updatedProgress: UserProgress = {
        ...progress,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, progress.longestStreak)
      };
      await this.saveUserProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  static async getAchievements(): Promise<Achievement[]> {
    try {
      const achievements = await StorageService.getData(this.ACHIEVEMENTS_KEY);
      return achievements || this.defaultAchievements;
    } catch (error) {
      console.error('Error getting achievements:', error);
      return this.defaultAchievements;
    }
  }

  static async updateAchievementProgress(achievementId: string, progress: number): Promise<void> {
    try {
      const achievements = await this.getAchievements();
      const updatedAchievements = achievements.map(achievement => {
        if (achievement.id === achievementId) {
          const newProgress = Math.min(progress, achievement.target);
          return { ...achievement, progress: newProgress };
        }
        return achievement;
      });
      await StorageService.storeData(this.ACHIEVEMENTS_KEY, updatedAchievements);
    } catch (error) {
      console.error('Error updating achievement progress:', error);
    }
  }
}
