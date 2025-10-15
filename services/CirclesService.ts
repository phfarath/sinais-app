import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Circle {
  id: string;
  name: string;
  type: 'duo' | 'family' | 'support' | 'challenge';
  description: string;
  created_by: string;
  created_at: string;
  member_count?: number;
}

export interface CircleMember {
  circle_id: string;
  user_id: string;
  role: 'owner' | 'member' | 'viewer';
  transparency_level: 'score_only' | 'trends' | 'detailed';
  acceptance_status: 'pending' | 'accepted' | 'rejected';
  joined_at: string;
  user_profile?: {
    id: string;
    full_name: string;
    email: string;
    wellness_score: number;
    wellness_trend: 'improving' | 'stable' | 'declining';
  };
}

export interface CircleWithMembers extends Circle {
  members: CircleMember[];
}

export class CirclesService {
  /**
   * Fetch all circles where the user is a member
   */
  static async getUserCircles(userId: string): Promise<CircleWithMembers[]> {
    try {
      // Get circle IDs where user is a member
      const { data: memberships, error: memberError } = await supabase
        .from('circle_members')
        .select('circle_id')
        .eq('user_id', userId)
        .eq('acceptance_status', 'accepted');

      if (memberError) {
        console.error('Error fetching memberships:', memberError);
        return [];
      }

      if (!memberships || memberships.length === 0) {
        return [];
      }

      const circleIds = memberships.map(m => m.circle_id);

      // Fetch circle details
      const { data: circles, error: circleError } = await supabase
        .from('accountability_circles')
        .select('*')
        .in('id', circleIds);

      if (circleError) {
        console.error('Error fetching circles:', circleError);
        return [];
      }

      // Fetch members for each circle
      const circlesWithMembers: CircleWithMembers[] = [];
      
      for (const circle of circles || []) {
        const members = await this.getCircleMembers(circle.id);
        circlesWithMembers.push({
          ...circle,
          member_count: members.length,
          members
        });
      }

      return circlesWithMembers;
    } catch (error) {
      console.error('Error in getUserCircles:', error);
      return [];
    }
  }

  /**
   * Get members of a specific circle
   */
  static async getCircleMembers(circleId: string): Promise<CircleMember[]> {
    try {
      const { data: members, error } = await supabase
        .from('circle_members')
        .select(`
          *,
          user_profile:user_profiles(id, full_name, email, wellness_score, wellness_trend)
        `)
        .eq('circle_id', circleId)
        .eq('acceptance_status', 'accepted');

      if (error) {
        console.error('Error fetching circle members:', error);
        return [];
      }

      return members || [];
    } catch (error) {
      console.error('Error in getCircleMembers:', error);
      return [];
    }
  }

  /**
   * Create a new circle
   */
  static async createCircle(
    userId: string,
    name: string,
    type: Circle['type'],
    description: string
  ): Promise<{ success: boolean; circle?: Circle; error?: string }> {
    try {
      // Insert circle
      const { data: circle, error: circleError } = await supabase
        .from('accountability_circles')
        .insert({
          name,
          type,
          description,
          created_by: userId,
          settings: {
            allow_member_invites: true,
            require_approval: true
          }
        })
        .select()
        .single();

      if (circleError) {
        console.error('Error creating circle:', circleError);
        return { success: false, error: circleError.message };
      }

      // Add creator as owner
      const { error: memberError } = await supabase
        .from('circle_members')
        .insert({
          circle_id: circle.id,
          user_id: userId,
          role: 'owner',
          transparency_level: 'detailed',
          acceptance_status: 'accepted'
        });

      if (memberError) {
        console.error('Error adding circle owner:', memberError);
        return { success: false, error: memberError.message };
      }

      return { success: true, circle };
    } catch (error) {
      console.error('Error in createCircle:', error);
      return { success: false, error: 'Failed to create circle' };
    }
  }

  /**
   * Invite a member to a circle
   */
  static async inviteMember(
    circleId: string,
    email: string,
    role: 'member' | 'viewer' = 'member',
    transparencyLevel: CircleMember['transparency_level'] = 'trends'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Find user by email
      const { data: user, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !user) {
        return { success: false, error: 'User not found with that email' };
      }

      // Check if already a member
      const { data: existing } = await supabase
        .from('circle_members')
        .select('id')
        .eq('circle_id', circleId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        return { success: false, error: 'User is already a member of this circle' };
      }

      // Create invitation
      const { error: inviteError } = await supabase
        .from('circle_members')
        .insert({
          circle_id: circleId,
          user_id: user.id,
          role,
          transparency_level: transparencyLevel,
          acceptance_status: 'pending'
        });

      if (inviteError) {
        console.error('Error creating invitation:', inviteError);
        return { success: false, error: inviteError.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in inviteMember:', error);
      return { success: false, error: 'Failed to invite member' };
    }
  }

  /**
   * Accept a circle invitation
   */
  static async acceptInvitation(circleId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('circle_members')
        .update({ acceptance_status: 'accepted' })
        .eq('circle_id', circleId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error accepting invitation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in acceptInvitation:', error);
      return false;
    }
  }

  /**
   * Leave a circle
   */
  static async leaveCircle(circleId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('circle_members')
        .delete()
        .eq('circle_id', circleId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error leaving circle:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in leaveCircle:', error);
      return false;
    }
  }

  /**
   * Update transparency level
   */
  static async updateTransparency(
    circleId: string,
    userId: string,
    level: CircleMember['transparency_level']
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('circle_members')
        .update({ transparency_level: level })
        .eq('circle_id', circleId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating transparency:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateTransparency:', error);
      return false;
    }
  }

  /**
   * Get pending invitations for a user
   */
  static async getPendingInvitations(userId: string): Promise<CircleWithMembers[]> {
    try {
      const { data: invites, error } = await supabase
        .from('circle_members')
        .select(`
          circle_id,
          accountability_circles(*)
        `)
        .eq('user_id', userId)
        .eq('acceptance_status', 'pending');

      if (error) {
        console.error('Error fetching pending invitations:', error);
        return [];
      }

      return (invites || []).map(invite => ({
        ...(invite.accountability_circles as any),
        members: []
      }));
    } catch (error) {
      console.error('Error in getPendingInvitations:', error);
      return [];
    }
  }
}