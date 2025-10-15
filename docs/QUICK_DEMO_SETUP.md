# 🚀 Quick Demo Setup - 15 Minutes

**Get SINAIS Circles demo-ready for your university event in 15 minutes!**

---

## ⏱️ Timeline

- **5 min** - Supabase setup
- **5 min** - Database & demo data
- **5 min** - Test & print login cards

---

## Step 1: Supabase Project (5 min)

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `sinais-demo`
4. Password: (save this!)
5. Region: São Paulo (closest to Brazil)
6. Click "Create Project"

### 1.2 Get Credentials
While project is creating, grab these:
1. Go to Settings > API
2. Copy **Project URL** → Save to `.env` as `SUPABASE_URL`
3. Copy **anon public key** → Save to `.env` as `SUPABASE_ANON_KEY`

### 1.3 Update .env file
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Step 2: Database Setup (5 min)

### 2.1 Run SQL Script
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy & paste this COMPLETE script:

```sql
-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tables
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    wellness_score INTEGER DEFAULT 75,
    wellness_trend TEXT DEFAULT 'stable',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE accountability_circles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('duo', 'family', 'support', 'challenge')),
    created_by UUID REFERENCES auth.users(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE circle_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID REFERENCES accountability_circles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    role TEXT CHECK (role IN ('member', 'guardian', 'professional')),
    transparency_level TEXT CHECK (transparency_level IN ('score_only', 'trends', 'detailed')),
    acceptance_status TEXT CHECK (acceptance_status IN ('accepted', 'pending')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(circle_id, user_id)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users view their circles" ON accountability_circles FOR SELECT USING (
    id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid())
);
CREATE POLICY "Users create circles" ON accountability_circles FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Members view circle members" ON circle_members FOR SELECT USING (
    circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid())
);
CREATE POLICY "Users join circles" ON circle_members FOR INSERT WITH CHECK (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_circle_members_user ON circle_members(user_id);
CREATE INDEX idx_circle_members_circle ON circle_members(circle_id);
```

5. Click **RUN** (bottom right)
6. Wait for ✅ Success

### 2.2 Create Demo Users
1. Go to **Authentication** > **Users**
2. Click **Add User** and create these 5:

| Email | Password | Name |
|-------|----------|------|
| demo1@fiap.com | Demo123! | Pedro Silva |
| demo2@fiap.com | Demo123! | Ana Costa |
| demo3@fiap.com | Demo123! | João Santos |
| demo4@fiap.com | Demo123! | Maria Oliveira |
| demo5@fiap.com | Demo123! | Carlos Ferreira |

3. **IMPORTANT**: After creating each user, copy their UUID

### 2.3 Insert Demo Data
1. Go back to **SQL Editor**
2. **Replace USER_ID_X with actual UUIDs** from step 2.2
3. Run this script:

```sql
-- Insert profiles (REPLACE USER_IDs!)
INSERT INTO user_profiles (id, full_name, email, wellness_score, wellness_trend) VALUES
    ('USER_ID_1', 'Pedro Silva', 'demo1@fiap.com', 85, 'improving'),
    ('USER_ID_2', 'Ana Costa', 'demo2@fiap.com', 78, 'stable'),
    ('USER_ID_3', 'João Santos', 'demo3@fiap.com', 92, 'improving'),
    ('USER_ID_4', 'Maria Oliveira', 'demo4@fiap.com', 68, 'declining'),
    ('USER_ID_5', 'Carlos Ferreira', 'demo5@fiap.com', 88, 'stable');

-- Create circles
INSERT INTO accountability_circles (id, name, type, created_by, description) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Família Silva', 'family', 'USER_ID_1', 'Família trabalhando juntos'),
    ('22222222-2222-2222-2222-222222222222', 'Accountability Friends', 'duo', 'USER_ID_2', 'Parceiras de apoio'),
    ('33333333-3333-3333-3333-333333333333', 'Desafio 30 Dias', 'challenge', 'USER_ID_3', 'Desafio coletivo');

-- Add members to circles
INSERT INTO circle_members (circle_id, user_id, role, transparency_level, acceptance_status) VALUES
    -- Family Circle
    ('11111111-1111-1111-1111-111111111111', 'USER_ID_1', 'guardian', 'trends', 'accepted'),
    ('11111111-1111-1111-1111-111111111111', 'USER_ID_2', 'member', 'trends', 'accepted'),
    ('11111111-1111-1111-1111-111111111111', 'USER_ID_3', 'member', 'score_only', 'accepted'),
    -- Duo Circle
    ('22222222-2222-2222-2222-222222222222', 'USER_ID_2', 'member', 'detailed', 'accepted'),
    ('22222222-2222-2222-2222-222222222222', 'USER_ID_4', 'member', 'detailed', 'accepted'),
    -- Challenge Circle (everyone)
    ('33333333-3333-3333-3333-333333333333', 'USER_ID_1', 'member', 'trends', 'accepted'),
    ('33333333-3333-3333-3333-333333333333', 'USER_ID_2', 'member', 'trends', 'accepted'),
    ('33333333-3333-3333-3333-333333333333', 'USER_ID_3', 'member', 'trends', 'accepted'),
    ('33333333-3333-3333-3333-333333333333', 'USER_ID_4', 'member', 'trends', 'accepted'),
    ('33333333-3333-3333-3333-333333333333', 'USER_ID_5', 'member', 'trends', 'accepted');
```

---

## Step 3: Test & Prepare (5 min)

### 3.1 Test the App
1. Run: `npm start`
2. Open app in Expo Go
3. Login with `demo1@fiap.com` / `Demo123!`
4. Go to **Circles** tab (🌍 icon)
5. You should see **2 circles** ✅

### 3.2 Print Login Cards

Copy this to Word/Google Docs and print **10 copies**:

---

```
╔═══════════════════════════════════════╗
║     SINAIS CIRCLES - DEMO LOGIN       ║
╠═══════════════════════════════════════╣
║                                       ║
║  Account 1: Pedro Silva               ║
║  📧 demo1@fiap.com                    ║
║  🔑 Demo123!                          ║
║  👥 2 Circles (Family, Challenge)     ║
║                                       ║
╠═══════════════════════════════════════╣
║                                       ║
║  Account 2: Ana Costa                 ║
║  📧 demo2@fiap.com                    ║
║  🔑 Demo123!                          ║
║  👥 3 Circles (Family, Duo, Challenge)║
║                                       ║
╠═══════════════════════════════════════╣
║                                       ║
║  Account 3: João Santos               ║
║  📧 demo3@fiap.com                    ║
║  🔑 Demo123!                          ║
║  👥 2 Circles (Family, Challenge)     ║
║                                       ║
╠═══════════════════════════════════════╣
║                                       ║
║  Account 4: Maria Oliveira            ║
║  📧 demo4@fiap.com                    ║
║  🔑 Demo123!                          ║
║  👥 2 Circles (Duo, Challenge)        ║
║                                       ║
╠═══════════════════════════════════════╣
║                                       ║
║  Account 5: Carlos Ferreira           ║
║  📧 demo5@fiap.com                    ║
║  🔑 Demo123!                          ║
║  👥 1 Circle (Challenge)              ║
║                                       ║
╚═══════════════════════════════════════╝

💡 Tip: After login, go to Circles tab (🌍) to see your accountability circles!
```

---

## ✅ Checklist

Before event day:
- [ ] Supabase project created
- [ ] `.env` file updated with credentials
- [ ] Database tables created (run SQL in step 2.1)
- [ ] 5 demo users created in Auth
- [ ] Demo data inserted (run SQL in step 2.3)
- [ ] App tested with demo1@fiap.com
- [ ] 10 login cards printed
- [ ] Phone/tablet charged for demos
- [ ] Backup QR code ready for Expo Go

---

## 🎪 Event Day Script

**When attendee arrives:**

1. **"Quer testar o SINAIS Circles?"**
2. Give them a login card
3. **"Abra o Expo Go e escaneie este QR"** _(show your QR code)_
4. Wait for app to load
5. **"Faça login com este email e senha"** _(point to card)_
6. **"Vá para a aba Circles"** _(show 🌍 icon)_
7. **"Veja seus círculos de responsabilidade!"**
8. Let them explore!

**Key talking points:**
- ✅ "É responsabilidade mútua, não vigilância"
- ✅ "Todos compartilham igualmente"
- ✅ "Você controla o que compartilha"
- ✅ "Pode criar novos círculos e convidar amigos"

---

## 🔄 After Event

Reset database for next demo:

```sql
DELETE FROM circle_members;
DELETE FROM accountability_circles;
DELETE FROM user_profiles WHERE email LIKE '%demo%@fiap.com';
```

Then re-run Step 2.3 to restore demo data.

---

## 🆘 Troubleshooting

**"Can't see circles"**
→ Check if user IDs match in database

**"Login not working"**
→ Verify demo users exist in Auth

**"App crashes on Circles tab"**
→ Check .env has correct Supabase credentials

**"RLS error"**
→ Run RLS policies script again

---

## 📞 Quick Support

During event, if issues:
1. Check Supabase Dashboard > Logs
2. Restart app (close & reopen Expo Go)
3. Try different demo account
4. Show pre-recorded demo video as backup

---

**You're ready! 🚀 The demo will impress everyone!**