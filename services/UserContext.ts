import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
      // First, test if Supabase connection works at all
      console.log('🔍 Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Supabase connection test failed:', testError);
        console.error('❌ Error details:', JSON.stringify(testError, null, 2));
        return null;
      }
      
      console.log('✅ Supabase connection test passed');
      
      // Now try to fetch the specific user
      console.log('🔍 Fetching user profile for email:', email);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email.toLowerCase().trim()) // Normalize email
        .maybeSingle(); // Use maybeSingle instead of single to handle 0 rows

      console.log('🔍 Query result:', { data, error });

      if (error) {
        console.error('❌ Error fetching user by email:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        
        // Try a different approach - list all users to see if we have access
        console.log('🔍 Trying to list all users...');
        const { data: allUsers, error: allUsersError } = await supabase
          .from('user_profiles')
          .select('email, full_name')
          .limit(5);
          
        if (allUsersError) {
          console.error('❌ Cannot list users either:', allUsersError);
        } else {
          console.log('✅ Found users in database:', allUsers);
        }
        
        return null;
      }

      if (data) {
        this.setUser(data as UserProfile);
        console.log('✅ Found existing user profile:', data.full_name);
        return data as UserProfile;
      }

      // If no user found, create a demo profile
      console.log('⚠️ No user profile found, creating demo profile for:', email);
      const demoProfile = await this.createDemoUserProfile(email);
      return demoProfile;
    } catch (error) {
      console.error('Error in fetchUserByEmail:', error);
      return null;
    }
  }

  /**
   * Create a demo user profile for testing
   */
  static async createDemoUserProfile(email: string): Promise<UserProfile | null> {
    try {
      const demoNames = {
        'demo1@fiap.com': 'Pedro Silva',
        'demo2@fiap.com': 'Ana Santos',
        'demo3@fiap.com': 'Carlos Oliveira',
        'demo4@fiap.com': 'Maria Costa',
        'demo5@fiap.com': 'João Pereira'
      };

      const fullName = demoNames[email as keyof typeof demoNames] || email.split('@')[0];
      const wellnessScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const wellnessTrend = ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)];
      
      console.log('🔍 Creating demo user profile:', { email, fullName, wellnessScore, wellnessTrend });
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          email,
          full_name: fullName,
          wellness_score: wellnessScore,
          wellness_trend: wellnessTrend
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating demo user profile:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error hint:', error.hint);
        
        // Try without .single() to see if the insert worked but just failed to return
        console.log('🔍 Trying insert without .single()...');
        const { data: insertData, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            email,
            full_name: fullName,
            wellness_score: wellnessScore,
            wellness_trend: wellnessTrend
          })
          .select();
          
        if (insertError) {
          console.error('❌ Insert also failed:', insertError);
        } else {
          console.log('✅ Insert worked, data:', insertData);
        }
        
        return null;
      }

      if (data) {
        this.setUser(data as UserProfile);
        console.log('✅ Created demo user profile:', data.full_name);
        
        // Create demo circles for this user
        await this.createDemoCircles(data.id, email);
        
        return data as UserProfile;
      }

      return null;
    } catch (error) {
      console.error('Error in createDemoUserProfile:', error);
      return null;
    }
  }

  /**
   * Create demo circles for a new user
   */
  static async createDemoCircles(userId: string, email: string): Promise<void> {
    try {
      console.log('🔍 Creating demo circles for user:', userId, email);
      
      // Import CirclesService here to avoid circular dependency
      const { CirclesService } = await import('./CirclesService');
      
      // Create "Família Silva" circle for demo1
      if (email === 'demo1@fiap.com') {
        console.log('🔍 Creating Família Silva circle...');
        const result1 = await CirclesService.createCircle(
          userId,
          'Família Silva',
          'family',
          'Círculo familiar para apoio mútuo'
        );
        if (result1.success) {
          console.log('✅ Created demo circle: Família Silva');
          console.log('🔍 Circle ID:', result1.circle?.id);
        } else {
          console.error('❌ Failed to create Família Silva circle:', result1.error);
        }
      }
      
      // Create "Accountability Friends" circle for demo1
      if (email === 'demo1@fiap.com') {
        console.log('🔍 Creating Accountability Friends circle...');
        const result2 = await CirclesService.createCircle(
          userId,
          'Accountability Friends',
          'duo',
          'Parceria de responsabilidade e apoio'
        );
        if (result2.success) {
          console.log('✅ Created demo circle: Accountability Friends');
          console.log('🔍 Circle ID:', result2.circle?.id);
        } else {
          console.error('❌ Failed to create Accountability Friends circle:', result2.error);
        }
      }
      
      // Create other demo circles for other users
      if (email === 'demo2@fiap.com') {
        console.log('🔍 Creating Accountability Friends circle for Ana...');
        const result3 = await CirclesService.createCircle(
          userId,
          'Accountability Friends',
          'duo',
          'Parceria de responsabilidade e apoio'
        );
        if (result3.success) {
          console.log('✅ Created demo circle: Accountability Friends for Ana');
        } else {
          console.error('❌ Failed to create circle for Ana:', result3.error);
        }
      }
      
      console.log('✅ Demo circles creation process completed');
    } catch (error) {
      console.error('❌ Error creating demo circles:', error);
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