# SINAIS Circles - Demo Database Setup Guide

## 🎯 Purpose

This guide sets up a **demo-ready Supabase database** with realistic test data for your university event. Attendees can login with demo accounts and interact with SINAIS Circles features.

---

## 📊 Demo Strategy

### **Approach: Shared Demo Database**
- ✅ All attendees use the same Supabase instance
- ✅ Multiple demo accounts (fiap1@fiap.com, fiap2@fiap.com, etc.)
- ✅ Pre-populated with realistic circles and data
- ✅ Attendees can create new circles and see real-time updates
- ✅ Data persists during event, reset after

### **Why This Works:**
- Attendees see a "living" system with other users
- Can demonstrate real-time collaboration
- Shows mutual accountability in action
- Easy to reset after event

---

## 🗄️ Database Setup Steps

### **Step 1: Create Supabase Tables**

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    birth_date DATE,
    wellness_score INTEGER DEFAULT 75,
    wellness_trend TEXT DEFAULT 'stable',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Accountability Circles
CREATE TABLE accountability_circles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('duo', 'family', 'support', 'challenge')),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    description TEXT,
    settings JSONB DEFAULT '{
        "allow_emergency_override": true,
        "notification_frequency": "realtime",
        "default_transparency": "trends",
        "require_mutual_acceptance": true
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Circle Members
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
    preferences JSONB DEFAULT '{
        "notification_enabled": true,
        "share_achievements": true,
        "share_struggles": true,
        "quiet_hours": {"start": "22:00", "end": "07:00"}
    }',
    UNIQUE(circle_id, user_id)
);

-- 4. Shared Insights
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

-- 5. Access Audit Log
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

-- 6. Circle Invitations
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

-- Create indexes for performance
CREATE INDEX idx_circle_members_user ON circle_members(user_id);
CREATE INDEX idx_circle_members_circle ON circle_members(circle_id);
CREATE INDEX idx_shared_insights_circle ON shared_insights(circle_id);
CREATE INDEX idx_audit_log_viewer ON access_audit_log(viewer_id);
CREATE INDEX idx_invitations_invitee ON circle_invitations(invitee_email);
```

### **Step 2: Enable Row Level Security (RLS)**

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_invitations ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Circle Policies
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

-- Circle Members Policies
CREATE POLICY "Members can view circle members"
    ON circle_members FOR SELECT
    USING (
        circle_id IN (
            SELECT circle_id FROM circle_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Users can join circles they're invited to"
    ON circle_members FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Shared Insights Policies
CREATE POLICY "Members can view insights in their circles"
    ON shared_insights FOR SELECT
    USING (
        circle_id IN (
            SELECT circle_id FROM circle_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Users can create their own insights"
    ON shared_insights FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Audit Log Policies (read-only for data subjects)
CREATE POLICY "Users can view their own audit logs"
    ON access_audit_log FOR SELECT
    USING (subject_id = auth.uid() OR viewer_id = auth.uid());

-- Invitations Policies
CREATE POLICY "Users can view invitations sent to them"
    ON circle_invitations FOR SELECT
    USING (invitee_email = auth.email() OR inviter_id = auth.uid());
```

---

## 👥 Demo User Accounts

### **Step 3: Create Demo Users**

Use Supabase Auth UI or run this in your app:

```typescript
// Demo users to create
const demoUsers = [
  { email: 'demo1@fiap.com', password: 'Demo123!', name: 'Pedro Silva' },
  { email: 'demo2@fiap.com', password: 'Demo123!', name: 'Ana Costa' },
  { email: 'demo3@fiap.com', password: 'Demo123!', name: 'João Santos' },
  { email: 'demo4@fiap.com', password: 'Demo123!', name: 'Maria Oliveira' },
  { email: 'demo5@fiap.com', password: 'Demo123!', name: 'Carlos Ferreira' },
];
```

**Or via Supabase Dashboard:**
1. Go to Authentication > Users
2. Click "Add User"
3. Create each demo user with email and password

### **Step 4: Insert User Profiles**

After creating auth users, insert their profiles:

```sql
-- Insert user profiles for demo users
-- Replace UUIDs with actual user IDs from auth.users

INSERT INTO user_profiles (id, full_name, email, wellness_score, wellness_trend) VALUES
    ('USER_ID_1', 'Pedro Silva', 'demo1@fiap.com', 85, 'improving'),
    ('USER_ID_2', 'Ana Costa', 'demo2@fiap.com', 78, 'stable'),
    ('USER_ID_3', 'João Santos', 'demo3@fiap.com', 92, 'improving'),
    ('USER_ID_4', 'Maria Oliveira', 'demo4@fiap.com', 68, 'declining'),
    ('USER_ID_5', 'Carlos Ferreira', 'demo5@fiap.com', 88, 'stable');
```

---

## 🔄 Sample Data Population

### **Step 5: Create Demo Circles**

```sql
-- Circle 1: Family Circle (Pedro, Ana, João)
INSERT INTO accountability_circles (id, name, type, created_by, description) VALUES
    ('circle-family-1', 'Família Silva', 'family', 'USER_ID_1', 'Nossa família trabalhando juntos no bem-estar digital');

-- Circle 2: Accountability Duo (Ana & Maria)
INSERT INTO accountability_circles (id, name, type, created_by, description) VALUES
    ('circle-duo-1', 'Accountability Friends', 'duo', 'USER_ID_2', 'Parceiras de responsabilidade e apoio mútuo');

-- Circle 3: Support Circle (Maria, Carlos, + Professional)
INSERT INTO accountability_circles (id, name, type, created_by, description) VALUES
    ('circle-support-1', 'Grupo de Apoio Digital', 'support', 'USER_ID_4', 'Apoio profissional para bem-estar digital');

-- Circle 4: Challenge Circle (All users)
INSERT INTO accountability_circles (id, name, type, created_by, description) VALUES
    ('circle-challenge-1', 'Desafio 30 Dias', 'challenge', 'USER_ID_3', 'Desafio coletivo de 30 dias de bem-estar');
```

### **Step 6: Add Circle Members**

```sql
-- Family Circle Members
INSERT INTO circle_members (circle_id, user_id, role, transparency_level, can_view_level, acceptance_status, invited_by) VALUES
    ('circle-family-1', 'USER_ID_1', 'guardian', 'trends', 'trends', 'accepted', 'USER_ID_1'),
    ('circle-family-1', 'USER_ID_2', 'member', 'trends', 'trends', 'accepted', 'USER_ID_1'),
    ('circle-family-1', 'USER_ID_3', 'member', 'score_only', 'trends', 'accepted', 'USER_ID_1');

-- Accountability Duo Members
INSERT INTO circle_members (circle_id, user_id, role, transparency_level, can_view_level, acceptance_status, invited_by) VALUES
    ('circle-duo-1', 'USER_ID_2', 'member', 'detailed', 'detailed', 'accepted', 'USER_ID_2'),
    ('circle-duo-1', 'USER_ID_4', 'member', 'detailed', 'detailed', 'accepted', 'USER_ID_2');

-- Support Circle Members
INSERT INTO circle_members (circle_id, user_id, role, transparency_level, can_view_level, acceptance_status, invited_by) VALUES
    ('circle-support-1', 'USER_ID_4', 'member', 'detailed', 'trends', 'accepted', 'USER_ID_4'),
    ('circle-support-1', 'USER_ID_5', 'professional', 'detailed', 'detailed', 'accepted', 'USER_ID_4');

-- Challenge Circle Members (Everyone)
INSERT INTO circle_members (circle_id, user_id, role, transparency_level, can_view_level, acceptance_status, invited_by) VALUES
    ('circle-challenge-1', 'USER_ID_1', 'member', 'trends', 'trends', 'accepted', 'USER_ID_3'),
    ('circle-challenge-1', 'USER_ID_2', 'member', 'trends', 'trends', 'accepted', 'USER_ID_3'),
    ('circle-challenge-1', 'USER_ID_3', 'member', 'trends', 'trends', 'accepted', 'USER_ID_3'),
    ('circle-challenge-1', 'USER_ID_4', 'member', 'trends', 'trends', 'accepted', 'USER_ID_3'),
    ('circle-challenge-1', 'USER_ID_5', 'member', 'trends', 'trends', 'accepted', 'USER_ID_3');
```

### **Step 7: Add Shared Insights**

```sql
-- Wellness score insights for each user in Family Circle
INSERT INTO shared_insights (circle_id, user_id, insight_type, data, visibility_level) VALUES
    ('circle-family-1', 'USER_ID_1', 'wellness_score', 
     '{"score": 85, "trend": "improving", "summary": "Ótimo progresso esta semana!"}', 'trends'),
    ('circle-family-1', 'USER_ID_2', 'wellness_score',
     '{"score": 78, "trend": "stable", "summary": "Mantendo o equilíbrio"}', 'trends'),
    ('circle-family-1', 'USER_ID_3', 'wellness_score',
     '{"score": 92, "trend": "improving", "summary": "Excelente evolução!"}', 'score_only');

-- Achievement insights
INSERT INTO shared_insights (circle_id, user_id, insight_type, data, visibility_level) VALUES
    ('circle-duo-1', 'USER_ID_2', 'achievement',
     '{"title": "7 Dias Consecutivos", "description": "Manteve o foco por uma semana!", "icon": "trophy"}', 'detailed'),
    ('circle-challenge-1', 'USER_ID_3', 'achievement',
     '{"title": "Pontuação Máxima", "description": "Alcançou 90+ de bem-estar!", "icon": "star"}', 'trends');
```

---

## 📱 App Configuration

### **Step 8: Update Supabase Service**

Make sure your `services/SupabaseService.ts` has these additional methods:

```typescript
// Add to SupabaseService class

// Get user's circles
static async getUserCircles(userId: string) {
  const { data, error } = await supabase
    .from('accountability_circles')
    .select(`
      *,
      circle_members!inner(
        id,
        role,
        transparency_level,
        acceptance_status
      )
    `)
    .eq('circle_members.user_id', userId)
    .eq('circle_members.is_active', true);

  if (error) {
    console.error('Error fetching circles:', error);
    return [];
  }
  return data || [];
}

// Get circle members
static async getCircleMembers(circleId: string) {
  const { data, error } = await supabase
    .from('circle_members')
    .select(`
      *,
      user_profiles(full_name, email, wellness_score, wellness_trend)
    `)
    .eq('circle_id', circleId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return data || [];
}

// Get circle insights
static async getCircleInsights(circleId: string) {
  const { data, error } = await supabase
    .from('shared_insights')
    .select('*')
    .eq('circle_id', circleId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching insights:', error);
    return [];
  }
  return data || [];
}

// Create new circle
static async createCircle(userId: string, circleData: any) {
  const { data, error } = await supabase
    .from('accountability_circles')
    .insert({
      name: circleData.name,
      type: circleData.type,
      created_by: userId,
      description: circleData.description,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating circle:', error);
    return null;
  }

  // Add creator as first member
  await supabase.from('circle_members').insert({
    circle_id: data.id,
    user_id: userId,
    role: circleData.type === 'family' ? 'guardian' : 'member',
    transparency_level: 'trends',
    can_view_level: 'trends',
    acceptance_status: 'accepted',
    invited_by: userId,
  });

  return data;
}
```

---

## 🎪 Demo Day Instructions

### **For Event Organizers:**

**Before Event:**
1. ✅ Run all SQL scripts to create tables and RLS policies
2. ✅ Create 5 demo user accounts
3. ✅ Populate with sample circles and data
4. ✅ Test login with each demo account
5. ✅ Prepare printed cards with login credentials

**Demo Login Cards (Print These):**

```
┌─────────────────────────────┐
│   SINAIS Demo Account #1    │
│                             │
│   Email: demo1@fiap.com     │
│   Password: Demo123!        │
│                             │
│   User: Pedro Silva         │
│   Circles: 2 (Family, Challenge)│
└─────────────────────────────┘

┌─────────────────────────────┐
│   SINAIS Demo Account #2    │
│                             │
│   Email: demo2@fiap.com     │
│   Password: Demo123!        │
│                             │
│   User: Ana Costa           │
│   Circles: 3 (Family, Duo, Challenge)│
└─────────────────────────────┘
```

### **For Attendees:**

**Demo Flow:**
1. Login with provided demo account
2. See existing circles on Circles tab
3. View circle members and wellness scores
4. Create a new circle (will persist for event)
5. Explore mutual accountability features
6. (Optional) Invite other demo users to circle

### **After Event:**

```sql
-- Reset demo data (run this after event)
DELETE FROM shared_insights;
DELETE FROM circle_members;
DELETE FROM accountability_circles;
DELETE FROM access_audit_log;
DELETE FROM circle_invitations;

-- Re-run Step 5-7 to restore demo data for next event
```

---

## 🔐 Security Notes

**For Demo Environment:**
- ✅ Use simple passwords (Demo123!) - it's just a demo
- ✅ RLS policies protect data between users
- ✅ Each demo account can only see their circles
- ✅ Audit logs track all access
- ✅ Easy to reset after event

**For Production:**
- ❌ Never use simple passwords
- ✅ Implement proper authentication
- ✅ Add rate limiting
- ✅ Use environment-specific databases
- ✅ Enable 2FA for admin accounts

---

## 📊 Expected Demo Results

After setup, attendees will see:

**Demo1 (Pedro Silva):**
- 2 circles: "Família Silva" (family), "Desafio 30 Dias" (challenge)
- Wellness score: 85 (improving)
- Can view family members' scores

**Demo2 (Ana Costa):**
- 3 circles: "Família Silva", "Accountability Friends", "Desafio 30 Dias"
- Wellness score: 78 (stable)
- Has both family and friendship accountability

**Demo3 (João Santos):**
- 2 circles: "Família Silva", "Desafio 30 Dias"
- Wellness score: 92 (improving)
- Best performing member

**Demo4 (Maria Oliveira):**
- 3 circles: "Accountability Friends", "Grupo de Apoio Digital", "Desafio 30 Dias"
- Wellness score: 68 (declining)
- Has professional support

**Demo5 (Carlos Ferreira):**
- 2 circles: "Grupo de Apoio Digital" (as professional), "Desafio 30 Dias"
- Wellness score: 88 (stable)
- Acts as counselor/professional

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] All SQL tables created
- [ ] RLS policies enabled
- [ ] 5 demo users created in Auth
- [ ] User profiles inserted
- [ ] 4 demo circles created
- [ ] Circle members added
- [ ] Shared insights populated
- [ ] SupabaseService methods added
- [ ] App tested with each demo account
- [ ] Login cards printed for event
- [ ] Reset script prepared for after event

---

**Your demo database is ready! Attendees will experience SINAIS Circles as a real, working system with actual data and collaborative features.**