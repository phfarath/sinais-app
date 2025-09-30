import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  static async storeData(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error('Error storing data', e);
    }
  }

  static async getData(key: string): Promise<any> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error retrieving data', e);
      return null;
    }
  }

  static async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing data', e);
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Error clearing all data', e);
    }
  }

  static async mergeData(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.mergeItem(key, jsonValue);
    } catch (e) {
      console.error('Error merging data', e);
    }
  }

  // Helper methods for specific data types
  static async storeString(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error('Error storing string', e);
    }
  }

  static async getString(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error('Error retrieving string', e);
      return null;
    }
  }

  static async storeNumber(key: string, value: number): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (e) {
      console.error('Error storing number', e);
    }
  }

  static async getNumber(key: string): Promise<number | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? parseFloat(value) : null;
    } catch (e) {
      console.error('Error retrieving number', e);
      return null;
    }
  }

  static async storeBoolean(key: string, value: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (e) {
      console.error('Error storing boolean', e);
    }
  }

  static async getBoolean(key: string): Promise<boolean | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? value === 'true' : null;
    } catch (e) {
      console.error('Error retrieving boolean', e);
      return null;
    }
  }
}