import { StorageService } from './StorageService';

export interface BlockedApp {
  id: string;
  name: string;
  icon: string;
  blocked: boolean;
  timeBlocked: number; // in minutes
  category: 'social' | 'gaming' | 'entertainment' | 'other';
}

export class BlockedAppsService {
  private static readonly STORAGE_KEY = 'blocked_apps';
  
  private static defaultApps: BlockedApp[] = [
    { id: '1', name: 'Instagram', icon: '📷', blocked: false, timeBlocked: 0, category: 'social' },
    { id: '2', name: 'TikTok', icon: '🎵', blocked: false, timeBlocked: 0, category: 'social' },
    { id: '3', name: 'Facebook', icon: '👥', blocked: false, timeBlocked: 0, category: 'social' },
    { id: '4', name: 'Twitter/X', icon: '🐦', blocked: false, timeBlocked: 0, category: 'social' },
    { id: '5', name: 'Games', icon: '🎮', blocked: false, timeBlocked: 0, category: 'gaming' },
    { id: '6', name: 'YouTube', icon: '📺', blocked: false, timeBlocked: 0, category: 'entertainment' },
    { id: '7', name: 'Netflix', icon: '🎬', blocked: false, timeBlocked: 0, category: 'entertainment' },
    { id: '8', name: 'WhatsApp', icon: '💬', blocked: false, timeBlocked: 0, category: 'social' },
  ];

  static async getBlockedApps(): Promise<BlockedApp[]> {
    try {
      const apps = await StorageService.getData(this.STORAGE_KEY);
      return apps || this.defaultApps;
    } catch (error) {
      console.error('Error getting blocked apps:', error);
      return this.defaultApps;
    }
  }

  static async saveBlockedApps(apps: BlockedApp[]): Promise<void> {
    try {
      await StorageService.storeData(this.STORAGE_KEY, apps);
    } catch (error) {
      console.error('Error saving blocked apps:', error);
      throw error;
    }
  }

  static async toggleAppBlock(appId: string): Promise<BlockedApp[]> {
    try {
      const apps = await this.getBlockedApps();
      const updatedApps = apps.map(app => {
        if (app.id === appId) {
          return { ...app, blocked: !app.blocked };
        }
        return app;
      });
      await this.saveBlockedApps(updatedApps);
      return updatedApps;
    } catch (error) {
      console.error('Error toggling app block:', error);
      throw error;
    }
  }

  static async updateBlockedTime(appId: string, minutes: number): Promise<void> {
    try {
      const apps = await this.getBlockedApps();
      const updatedApps = apps.map(app => {
        if (app.id === appId && app.blocked) {
          return { ...app, timeBlocked: app.timeBlocked + minutes };
        }
        return app;
      });
      await this.saveBlockedApps(updatedApps);
    } catch (error) {
      console.error('Error updating blocked time:', error);
    }
  }

  static async getBlockedAppsCount(): Promise<number> {
    try {
      const apps = await this.getBlockedApps();
      return apps.filter(app => app.blocked).length;
    } catch (error) {
      console.error('Error getting blocked apps count:', error);
      return 0;
    }
  }

  static async getTotalBlockedTime(): Promise<number> {
    try {
      const apps = await this.getBlockedApps();
      return apps.reduce((total, app) => total + (app.blocked ? app.timeBlocked : 0), 0);
    } catch (error) {
      console.error('Error getting total blocked time:', error);
      return 0;
    }
  }
}
