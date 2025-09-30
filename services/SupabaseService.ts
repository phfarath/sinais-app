import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';

// Initialize Supabase client
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export class SupabaseService {
  // User Activities
  static async saveUserActivity(userId: string, activity: any) {
    const { data, error } = await supabase
      .from('user_activities')
      .insert([{ user_id: userId, ...activity }]);
    
    if (error) {
      console.error('Error saving activity:', error);
      return null;
    }
    return data;
  }

  static async getUserActivities(userId: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
    return data;
  }

  // User Goals
  static async getUserGoals(userId: string) {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
    return data;
  }

  static async saveUserGoal(userId: string, goal: any) {
    const { data, error } = await supabase
      .from('user_goals')
      .insert([{ user_id: userId, ...goal }]);
    
    if (error) {
      console.error('Error saving goal:', error);
      return null;
    }
    return data;
  }

  static async updateUserProgress(userId: string, goalId: string, progress: number) {
    const { data, error } = await supabase
      .from('user_goals')
      .update({ progress, updated_at: new Date() })
      .eq('user_id', userId)
      .eq('id', goalId);
    
    if (error) {
      console.error('Error updating progress:', error);
      return null;
    }
    return data;
  }

  static async deleteUserGoal(userId: string, goalId: string) {
    const { data, error } = await supabase
      .from('user_goals')
      .delete()
      .eq('user_id', userId)
      .eq('id', goalId);
    
    if (error) {
      console.error('Error deleting goal:', error);
      return null;
    }
    return data;
  }

  // User Profile
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  }

  static async updateUserProfile(userId: string, profile: any) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ id: userId, ...profile, updated_at: new Date() });
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    return data;
  }

  // Risk Assessments
  static async saveRiskAssessment(userId: string, assessment: any) {
    const { data, error } = await supabase
      .from('risk_assessments')
      .insert([{ user_id: userId, ...assessment }]);
    
    if (error) {
      console.error('Error saving risk assessment:', error);
      return null;
    }
    return data;
  }

  static async getRiskAssessments(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('risk_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching risk assessments:', error);
      return [];
    }
    return data;
  }

  // Betting Events
  static async saveBettingEvent(userId: string, event: any) {
    const { data, error } = await supabase
      .from('betting_events')
      .insert([{ user_id: userId, ...event }]);
    
    if (error) {
      console.error('Error saving betting event:', error);
      return null;
    }
    return data;
  }

  static async getBettingEvents(userId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('betting_events')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching betting events:', error);
      return [];
    }
    return data;
  }

  // Chat History
  static async saveChatMessage(userId: string, message: any) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{ user_id: userId, ...message }]);
    
    if (error) {
      console.error('Error saving chat message:', error);
      return null;
    }
    return data;
  }

  static async getChatHistory(userId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
    return data;
  }

  // Notifications
  static async saveNotification(userId: string, notification: any) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ user_id: userId, ...notification }]);
    
    if (error) {
      console.error('Error saving notification:', error);
      return null;
    }
    return data;
  }

  static async getNotifications(userId: string, unreadOnly: boolean = false) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (unreadOnly) {
      query = query.eq('read', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return data;
  }

  static async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date() })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return null;
    }
    return data;
  }
}