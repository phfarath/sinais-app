import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { StorageService } from './StorageService';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationPreferences {
  riskAlerts: boolean;
  dailyReminders: boolean;
  goalAchievements: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
  };
}

export class NotificationService {
  private static readonly PREFERENCES_KEY = 'notification_preferences';
  
  static async initialize(): Promise<void> {
    try {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }
      
      // Set up Android notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('risk_alerts', {
          name: 'Risk Alerts',
          description: 'Notifications for high-risk activities',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
        });
        
        await Notifications.setNotificationChannelAsync('daily_reminders', {
          name: 'Daily Reminders',
          description: 'Daily check-in and goal reminders',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250],
          sound: 'default',
        });
        
        await Notifications.setNotificationChannelAsync('goal_achievements', {
          name: 'Goal Achievements',
          description: 'Celebrations for completed goals',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250, 250],
          sound: 'default',
        });
      }
      
      // Set up notification listeners
      this.setupNotificationListeners();
      
      // Load preferences and schedule daily reminders if enabled
      const preferences = await this.getNotificationPreferences();
      if (preferences.dailyReminders) {
        await this.scheduleDailyCheckIn();
      }
      
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }
  
  private static setupNotificationListeners(): void {
    // Handle notification received while app is in foreground
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });
    
    // Handle notification response when user taps on notification
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Navigate to appropriate screen based on notification data
      const { type } = response.notification.request.content.data;
      
      // In a real app, you would navigate to the appropriate screen
      // For example: navigation.navigate(type === 'risk_alert' ? 'Monitoring' : 'Goals');
    });
    
    // Store subscriptions for cleanup
    // In a real app, you would store these and clean up when the app unmounts
  }
  
  static async sendRiskAlert(riskLevel: string, message: string): Promise<string> {
    try {
      const preferences = await this.getNotificationPreferences();
      
      // Check if risk alerts are enabled
      if (!preferences.riskAlerts) {
        return 'Risk alerts are disabled';
      }
      
      // Check if we're in quiet hours
      if (await this.isInQuietHours(preferences)) {
        return 'Cannot send notification during quiet hours';
      }
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Risk Alert: ${riskLevel}`,
          body: message,
          data: { type: 'risk_alert', level: riskLevel },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Show immediately
      });
      
      return notificationId;
    } catch (error) {
      console.error('Error sending risk alert:', error);
      throw error;
    }
  }
  
  static async scheduleDailyCheckIn(): Promise<string> {
    try {
      const preferences = await this.getNotificationPreferences();
      
      // Check if daily reminders are enabled
      if (!preferences.dailyReminders) {
        return 'Daily reminders are disabled';
      }
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Check-in',
          body: 'How are you feeling today? Take a moment to reflect on your progress.',
          data: { type: 'daily_checkin' },
          sound: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 20, // 8 PM
          minute: 0,
        },
      });
      
      return notificationId;
    } catch (error) {
      console.error('Error scheduling daily check-in:', error);
      throw error;
    }
  }
  
  static async sendGoalAchievement(goalTitle: string, message: string): Promise<string> {
    try {
      const preferences = await this.getNotificationPreferences();
      
      // Check if goal achievements are enabled
      if (!preferences.goalAchievements) {
        return 'Goal achievement notifications are disabled';
      }
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Goal Achieved: ${goalTitle}`,
          body: message,
          data: { type: 'goal_achievement', goalTitle },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Show immediately
      });
      
      return notificationId;
    } catch (error) {
      console.error('Error sending goal achievement:', error);
      throw error;
    }
  }
  
  static async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const preferences = await StorageService.getData(this.PREFERENCES_KEY);
      
      if (!preferences) {
        // Return default preferences if none are set
        const defaultPreferences: NotificationPreferences = {
          riskAlerts: true,
          dailyReminders: true,
          goalAchievements: true,
          quietHours: {
            enabled: false,
            start: '22:00',
            end: '08:00',
          },
        };
        
        await this.saveNotificationPreferences(defaultPreferences);
        return defaultPreferences;
      }
      
      return preferences;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      throw error;
    }
  }
  
  static async saveNotificationPreferences(preferences: NotificationPreferences): Promise<void> {
    try {
      await StorageService.storeData(this.PREFERENCES_KEY, preferences);
      
      // Update scheduled notifications based on new preferences
      if (preferences.dailyReminders) {
        await this.scheduleDailyCheckIn();
      } else {
        await this.cancelScheduledNotifications('daily_checkin');
      }
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      throw error;
    }
  }
  
  private static async isInQuietHours(preferences: NotificationPreferences): Promise<boolean> {
    if (!preferences.quietHours.enabled) {
      return false;
    }
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { start, end } = preferences.quietHours;
    
    // Handle the case where quiet hours span midnight (e.g., 22:00 to 08:00)
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    }
    
    // Normal case (e.g., 22:00 to 06:00)
    return currentTime >= start && currentTime <= end;
  }
  
  private static async cancelScheduledNotifications(type: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        const notificationType = notification.content.data.type;
        if (notificationType === type) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Error canceling scheduled notifications:', error);
    }
  }
  
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }
}