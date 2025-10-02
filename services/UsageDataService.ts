import { StorageService } from './StorageService';

export interface AppUsageData {
  appName: string;
  icon: string;
  todayMinutes: number;
  yesterdayMinutes: number;
  weeklyData: number[]; // 7 days of data
  category: 'social' | 'productivity' | 'entertainment' | 'communication';
}

export interface UsageStats {
  totalScreenTime: number; // in minutes
  mostUsedApp: string;
  productiveTime: number;
  distractingTime: number;
  averageDaily: number;
}

export class UsageDataService {
  private static readonly STORAGE_KEY = 'usage_data';
  private static readonly STATS_KEY = 'usage_stats';

  private static generateMockData(): AppUsageData[] {
    const today = new Date().getDay();
    return [
      {
        appName: 'Instagram',
        icon: '📷',
        todayMinutes: 120,
        yesterdayMinutes: 180,
        weeklyData: [120, 180, 95, 110, 140, 200, 85],
        category: 'social'
      },
      {
        appName: 'TikTok',
        icon: '🎵',
        todayMinutes: 85,
        yesterdayMinutes: 95,
        weeklyData: [85, 95, 120, 75, 100, 110, 90],
        category: 'social'
      },
      {
        appName: 'WhatsApp',
        icon: '💬',
        todayMinutes: 45,
        yesterdayMinutes: 30,
        weeklyData: [45, 30, 50, 40, 35, 55, 42],
        category: 'communication'
      },
      {
        appName: 'YouTube',
        icon: '📺',
        todayMinutes: 90,
        yesterdayMinutes: 120,
        weeklyData: [90, 120, 80, 100, 115, 95, 105],
        category: 'entertainment'
      },
      {
        appName: 'Gmail',
        icon: '📧',
        todayMinutes: 25,
        yesterdayMinutes: 35,
        weeklyData: [25, 35, 30, 28, 32, 40, 22],
        category: 'productivity'
      },
    ];
  }

  static async getUsageData(): Promise<AppUsageData[]> {
    try {
      const data = await StorageService.getData(this.STORAGE_KEY);
      if (!data) {
        const mockData = this.generateMockData();
        await this.saveUsageData(mockData);
        return mockData;
      }
      return data;
    } catch (error) {
      console.error('Error getting usage data:', error);
      return this.generateMockData();
    }
  }

  static async saveUsageData(data: AppUsageData[]): Promise<void> {
    try {
      await StorageService.storeData(this.STORAGE_KEY, data);
    } catch (error) {
      console.error('Error saving usage data:', error);
    }
  }

  static async updateTodayUsage(appName: string, minutes: number): Promise<void> {
    try {
      const data = await this.getUsageData();
      const updatedData = data.map(app => {
        if (app.appName === appName) {
          return { 
            ...app, 
            todayMinutes: app.todayMinutes + minutes,
            weeklyData: [...app.weeklyData.slice(1), app.weeklyData[6] + minutes]
          };
        }
        return app;
      });
      await this.saveUsageData(updatedData);
    } catch (error) {
      console.error('Error updating today usage:', error);
    }
  }

  static async getUsageStats(): Promise<UsageStats> {
    try {
      const data = await this.getUsageData();
      
      const totalScreenTime = data.reduce((sum, app) => sum + app.todayMinutes, 0);
      const mostUsedApp = data.reduce((max, app) => 
        app.todayMinutes > max.todayMinutes ? app : max
      ).appName;
      
      const productiveTime = data
        .filter(app => app.category === 'productivity')
        .reduce((sum, app) => sum + app.todayMinutes, 0);
      
      const distractingTime = data
        .filter(app => app.category === 'social' || app.category === 'entertainment')
        .reduce((sum, app) => sum + app.todayMinutes, 0);
      
      const weeklyTotal = data.reduce((sum, app) => 
        sum + app.weeklyData.reduce((a, b) => a + b, 0), 0
      );
      const averageDaily = Math.round(weeklyTotal / 7);

      return {
        totalScreenTime,
        mostUsedApp,
        productiveTime,
        distractingTime,
        averageDaily
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return {
        totalScreenTime: 0,
        mostUsedApp: 'N/A',
        productiveTime: 0,
        distractingTime: 0,
        averageDaily: 0
      };
    }
  }
}
