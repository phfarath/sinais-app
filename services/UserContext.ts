import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  wellness_score: number;
  wellness_trend: 'improving' | 'stable' | 'declining';
  avatar_url?: string;
  created_at: string;
}

export class UserContext {
  private static currentUser: UserProfile | null = null;
  private static userId: string | null = null;

  /**
   * Set the current logged-in user
   */
  static setUser(user: UserProfile) {
    this.currentUser = user;
    this.userId = user.id;
  }

  /**
   * Get the current user profile
   */
  static getUser(): UserProfile | null {
    return this.currentUser;
  }

  /**
   * Get the current user ID
   */
  static getUserId(): string | null {
    return this.userId;
  }

  /**
   * Fetch user profile from Supabase
   */
  static async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (data) {
        this.setUser(data as UserProfile);
        return data as UserProfile;
      }

      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  }

  /**
   * Fetch user profile by email (for login)
   */
  static async fetchUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error fetching user by email:', error);
        return null;
      }

      if (data) {
        this.setUser(data as UserProfile);
        return data as UserProfile;
      }

      return null;
    } catch (error) {
      console.error('Error in fetchUserByEmail:', error);
      return null;
    }
  }

  /**
   * Update user wellness score
   */
  static async updateWellnessScore(userId: string, score: number, trend: 'improving' | 'stable' | 'declining'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ wellness_score: score, wellness_trend: trend })
        .eq('id', userId);

      if (error) {
        console.error('Error updating wellness score:', error);
        return false;
      }

      // Update local cache
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser.wellness_score = score;
        this.currentUser.wellness_trend = trend;
      }

      return true;
    } catch (error) {
      console.error('Error in updateWellnessScore:', error);
      return false;
    }
  }

  /**
   * Clear current user (logout)
   */
  static clearUser() {
    this.currentUser = null;
    this.userId = null;
  }

  /**
   * Check if user is logged in
   */
  static isLoggedIn(): boolean {
    return this.currentUser !== null && this.userId !== null;
  }

  /**
   * Get display name (fallback to email if no name)
   */
  static getDisplayName(): string {
    if (!this.currentUser) return 'Visitante';
    return this.currentUser.full_name || this.currentUser.email.split('@')[0];
  }
}