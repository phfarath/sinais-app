# SINAIS Circles - Implementation Guide

## 🎯 Quick Start Guide

This document provides step-by-step instructions for implementing SINAIS Circles in your app.

---

## 📋 Prerequisites

Before implementing SINAIS Circles, ensure you have:

- ✅ Supabase project configured
- ✅ User authentication working
- ✅ Existing monitoring services ([`BettingMonitorService.ts`](../services/BettingMonitorService.ts))
- ✅ React Native navigation setup
- ✅ TypeScript configured

---

## 🗄️ Step 1: Database Setup

### Create Supabase Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- 1. Create accountability_circles table
CREATE TABLE accountability_circles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('duo', 'family', 'support', 'challenge')),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    description TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Create circle_members table
CREATE TABLE circle_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES accountability_circles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    role TEXT NOT NULL CHECK (role IN ('member', 'guardian', 'professional')),
    transparency_level TEXT NOT NULL CHECK (transparency_level IN ('score_only', 'trends', 'detailed')),
    can_view_level TEXT NOT NULL CHECK (can_view_level IN ('score_only', 'trends', 'detailed')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invited_by UUID REFERENCES auth.users(id),
    acceptance_status TEXT NOT NULL CHECK (acceptance_status IN ('pending', 'accepted', 'rejected', 'revoked')),
    auto_expire_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    preferences JSONB DEFAULT '{}',
    UNIQUE(circle_id, user_id)
);

-- 3. Create shared_insights table
CREATE TABLE shared_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES accountability_circles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    insight_type TEXT NOT NULL,
    data JSONB NOT NULL,
    visibility_level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 4. Create access_audit_log table
CREATE TABLE access_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID REFERENCES accountability_circles(id),
    viewer_id UUID NOT NULL REFERENCES auth.users(id),
    subject_id UUID NOT NULL REFERENCES auth.users(id),
    access_type TEXT NOT NULL,
    data_accessed TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT,
    device_info TEXT
);

-- 5. Create circle_invitations table
CREATE TABLE circle_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES accountability_circles(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES auth.users(id),
    invitee_email TEXT NOT NULL,
    invitee_id UUID REFERENCES auth.users(id),
    role TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
    accepted_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE
);

-- 6. Create emergency_events table
CREATE TABLE emergency_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    circle_id UUID REFERENCES accountability_circles(id),
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    detection_method TEXT NOT NULL CHECK (detection_method IN ('ai', 'manual', 'pattern')),
    details JSONB NOT NULL,
    notified_members UUID[] DEFAULT '{}',
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_circle_members_user ON circle_members(user_id);
CREATE INDEX idx_circle_members_circle ON circle_members(circle_id);
CREATE INDEX idx_shared_insights_circle ON shared_insights(circle_id);
CREATE INDEX idx_audit_log_viewer ON access_audit_log(viewer_id);
CREATE INDEX idx_invitations_invitee ON circle_invitations(invitee_email);
CREATE INDEX idx_emergency_user ON emergency_events(user_id);
```

### Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE accountability_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accountability_circles
CREATE POLICY "Users can view circles they're members of"
    ON accountability_circles FOR SELECT
    USING (
        id IN (
            SELECT circle_id FROM circle_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Users can create circles"
    ON accountability_circles FOR INSERT
    WITH CHECK (created_by = auth.uid());

-- RLS Policies for circle_members
CREATE POLICY "Members can view circle members"
    ON circle_members FOR SELECT
    USING (
        circle_id IN (
            SELECT circle_id FROM circle_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- RLS Policies for shared_insights
CREATE POLICY "Members can view insights in their circles"
    ON shared_insights FOR SELECT
    USING (
        circle_id IN (
            SELECT circle_id FROM circle_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Additional policies for other tables...
```

---

## 📝 Step 2: Create Type Definitions

Create `types/circles.ts`:

```typescript
// Circle Types
export type CircleType = 'duo' | 'family' | 'support' | 'challenge';
export type MemberRole = 'member' | 'guardian' | 'professional';
export type TransparencyLevel = 'score_only' | 'trends' | 'detailed';
export type AcceptanceStatus = 'pending' | 'accepted' | 'rejected' | 'revoked';
export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

// Main Interfaces
export interface AccountabilityCircle {
  id: string;
  name: string;
  type: CircleType;
  created_by: string;
  description?: string;
  settings: CircleSettings;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface CircleSettings {
  allow_emergency_override: boolean;
  notification_frequency: 'realtime' | 'daily' | 'weekly';
  default_transparency: TransparencyLevel;
  require_mutual_acceptance: boolean;
}

export interface CircleMember {
  id: string;
  circle_id: string;
  user_id: string;
  role: MemberRole;
  transparency_level: TransparencyLevel;
  can_view_level: TransparencyLevel;
  joined_at: Date;
  invited_by: string;
  acceptance_status: AcceptanceStatus;
  auto_expire_at?: Date;
  is_active: boolean;
  preferences: MemberPreferences;
}

export interface MemberPreferences {
  pause_sharing_until?: Date;
  quiet_hours: { start: string; end: string };
  notification_enabled: boolean;
  share_achievements: boolean;
  share_struggles: boolean;
}

export interface SharedInsight {
  id: string;
  circle_id: string;
  user_id: string;
  insight_type: InsightType;
  data: InsightData;
  visibility_level: TransparencyLevel;
  created_at: Date;
  expires_at?: Date;
}

export type InsightType = 
  | 'wellness_score' 
  | 'activity_summary' 
  | 'risk_alert' 
  | 'achievement' 
  | 'goal_progress'
  | 'pattern_detection';

export interface InsightData {
  score?: number;
  trend?: 'improving' | 'stable' | 'declining';
  summary?: string;
  metrics?: Record<string, any>;
  ai_analysis?: string;
}
```

---

## 🛠️ Step 3: Build Core Services

### CircleManagementService.ts

```typescript
import { SupabaseClient } from '@supabase/supabase-js';
import { AccountabilityCircle, CircleMember, CircleInvitation } from '../types/circles';

export class CircleManagementService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  // Create a new circle
  async createCircle(
    userId: string,
    name: string,
    type: CircleType,
    description?: string
  ): Promise<AccountabilityCircle | null> {
    try {
      // 1. Create the circle
      const { data: circle, error: circleError } = await this.supabase
        .from('accountability_circles')
        .insert({
          name,
          type,
          created_by: userId,
          description,
          settings: {
            allow_emergency_override: true,
            notification_frequency: 'realtime',
            default_transparency: 'trends',
            require_mutual_acceptance: true,
          },
        })
        .select()
        .single();

      if (circleError) throw circleError;

      // 2. Add creator as first member
      await this.supabase.from('circle_members').insert({
        circle_id: circle.id,
        user_id: userId,
        role: type === 'family' ? 'guardian' : 'member',
        transparency_level: 'detailed',
        can_view_level: 'detailed',
        acceptance_status: 'accepted',
      });

      return circle;
    } catch (error) {
      console.error('Error creating circle:', error);
      return null;
    }
  }

  // Invite member to circle
  async inviteMember(
    circleId: string,
    inviterId: string,
    inviteeEmail: string,
    role: MemberRole = 'member'
  ): Promise<CircleInvitation | null> {
    try {
      const { data, error } = await this.supabase
        .from('circle_invitations')
        .insert({
          circle_id: circleId,
          inviter_id: inviterId,
          invitee_email: inviteeEmail,
          role,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // TODO: Send notification to invitee
      return data;
    } catch (error) {
      console.error('Error inviting member:', error);
      return null;
    }
  }

  // Get user's circles
  async getUserCircles(userId: string): Promise<AccountabilityCircle[]> {
    try {
      const { data, error } = await this.supabase
        .from('accountability_circles')
        .select(`
          *,
          circle_members!inner(user_id)
        `)
        .eq('circle_members.user_id', userId)
        .eq('circle_members.is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching circles:', error);
      return [];
    }
  }

  // Get circle members
  async getCircleMembers(circleId: string): Promise<CircleMember[]> {
    try {
      const { data, error } = await this.supabase
        .from('circle_members')
        .select('*')
        .eq('circle_id', circleId)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  }
}
```

### SharedInsightsService.ts

```typescript
export class SharedInsightsService {
  
  // Generate wellness score from 0-100
  static async generateWellnessScore(userId: string): Promise<number> {
    try {
      // Fetch recent user activities
      const activities = await BettingMonitor.getAllEvents();
      const recentActivities = activities.slice(-20);

      if (recentActivities.length === 0) return 100; // Perfect score if no activity

      // Calculate factors
      const factors = {
        frequency: this.calculateFrequencyScore(recentActivities),
        amount: this.calculateAmountScore(recentActivities),
        pattern: this.calculatePatternScore(recentActivities),
        timing: this.calculateTimingScore(recentActivities),
      };

      // Weighted average
      const score = Math.round(
        factors.frequency * 0.3 +
        factors.amount * 0.3 +
        factors.pattern * 0.25 +
        factors.timing * 0.15
      );

      return Math.max(0, Math.min(100, score));
    } catch (error) {
      console.error('Error generating wellness score:', error);
      return 50; // Default middle score
    }
  }

  private static calculateFrequencyScore(activities: BettingEvent[]): number {
    // Lower frequency = higher score
    const dailyAvg = activities.length / 7; // Assuming 7-day window
    if (dailyAvg <= 1) return 100;
    if (dailyAvg <= 3) return 75;
    if (dailyAvg <= 5) return 50;
    if (dailyAvg <= 10) return 25;
    return 0;
  }

  private static calculateAmountScore(activities: BettingEvent[]): number {
    // Lower amounts = higher score
    const totalAmount = activities.reduce((sum, a) => sum + a.amount, 0);
    const avgAmount = totalAmount / activities.length;
    
    if (avgAmount <= 50) return 100;
    if (avgAmount <= 100) return 75;
    if (avgAmount <= 200) return 50;
    if (avgAmount <= 500) return 25;
    return 0;
  }

  // ... more scoring methods
}
```

---

## 🎨 Step 4: Create UI Screens

### CirclesListScreen.tsx

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CircleManagementService } from '../services/CircleManagementService';

export default function CirclesListScreen({ navigation }) {
  const [circles, setCircles] = useState([]);
  const circleService = new CircleManagementService(supabase);

  useEffect(() => {
    loadCircles();
  }, []);

  const loadCircles = async () => {
    const userId = 'current-user-id'; // Get from auth
    const userCircles = await circleService.getUserCircles(userId);
    setCircles(userCircles);
  };

  const renderCircle = ({ item }) => (
    <TouchableOpacity
      style={styles.circleCard}
      onPress={() => navigation.navigate('CircleDetail', { circleId: item.id })}
    >
      <View style={styles.circleHeader}>
        <MaterialCommunityIcons 
          name={getCircleIcon(item.type)} 
          size={32} 
          color="#4A90E2" 
        />
        <View style={styles.circleInfo}>
          <Text style={styles.circleName}>{item.name}</Text>
          <Text style={styles.circleType}>{item.type}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={circles}
        renderItem={renderCircle}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-group" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>No circles yet</Text>
            <Text style={styles.emptySubtext}>Create your first accountability circle</Text>
          </View>
        }
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateCircle')}
      >
        <MaterialCommunityIcons name="plus" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

function getCircleIcon(type: CircleType): string {
  switch (type) {
    case 'family': return 'home-heart';
    case 'duo': return 'account-multiple';
    case 'support': return 'medical-bag';
    case 'challenge': return 'trophy';
    default: return 'account-group';
  }
}
```

---

## 🔐 Step 5: Privacy & Security

### Transparency Control Implementation

```typescript
// In TransparencyControlService.ts

export class TransparencyControlService {
  
  // Filter data based on transparency level
  static filterInsightByLevel(
    insight: InsightData,
    viewerLevel: TransparencyLevel
  ): Partial<InsightData> {
    switch (viewerLevel) {
      case 'score_only':
        return { 
          score: insight.score,
          trend: insight.trend 
        };
      
      case 'trends':
        return { 
          score: insight.score,
          trend: insight.trend,
          summary: insight.summary 
        };
      
      case 'detailed':
        return insight; // Full access
      
      default:
        return { score: insight.score };
    }
  }

  // Log data access for audit trail
  static async logAccess(
    viewerId: string,
    subjectId: string,
    circleId: string,
    accessType: string
  ): Promise<void> {
    await supabase.from('access_audit_log').insert({
      viewer_id: viewerId,
      subject_id: subjectId,
      circle_id: circleId,
      access_type: accessType,
      timestamp: new Date(),
    });
  }
}
```

---

## 📱 Step 6: Navigation Integration

Add to `App.tsx`:

```typescript
// Add to RootStackParamList
export type RootStackParamList = {
  // ... existing routes
  CirclesList: undefined;
  CreateCircle: undefined;
  CircleDetail: { circleId: string };
  InviteMembers: { circleId: string };
  TransparencySettings: { circleId: string; userId: string };
};

// In ProfileStack
<ProfileStack.Screen 
  name="CirclesList" 
  component={CirclesListScreen} 
  options={{ title: 'My Circles' }} 
/>
```

---

## ✅ Testing Checklist

- [ ] Can create a new circle
- [ ] Can invite members via email
- [ ] Invitations expire after 7 days
- [ ] Members can set transparency level
- [ ] Wellness score calculates correctly
- [ ] Privacy filters work (score/trends/detailed)
- [ ] Audit log records all access
- [ ] Emergency override triggers correctly
- [ ] Minors have auto-expiration at 18
- [ ] Can leave circle and data is deleted
- [ ] Mutual visibility works both ways

---

## 🚀 Deployment Steps

1. **Database Migration**
   - Run SQL scripts in Supabase
   - Verify RLS policies are active
   - Test with sample data

2. **Service Deployment**
   - Deploy updated services
   - Configure environment variables
   - Test API endpoints

3. **App Update**
   - Build new app version
   - Test on TestFlight/Internal Testing
   - Monitor for errors

4. **User Rollout**
   - Beta test with small group
   - Gather feedback
   - Iterate and improve
   - Full release

---

## 📚 Additional Resources

- [Full Architecture Doc](./SINAIS_CIRCLES_ARCHITECTURE.md)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [React Navigation Docs](https://reactnavigation.org/)
- [LGPD Compliance](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

---

**Ready to implement? Switch to Code mode and let's build it!**