# ✅ SINAIS Circles - Final Setup Steps

## 🎉 Database Created Successfully!

Your Supabase database now has:
- ✅ **user_profiles** table
- ✅ **accountability_circles** table  
- ✅ **circle_members** table
- ✅ **Row Level Security (RLS)** policies enabled
- ✅ **Indexes** for performance

---

## 📝 Next Steps to Complete Setup

### Step 1: Create Demo Users in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"** (Email auth)
4. Create these 5 demo accounts:

| Email | Password | Auto Confirm? |
|-------|----------|---------------|
| demo1@fiap.com | Demo123! | ✅ Yes |
| demo2@fiap.com | Demo123! | ✅ Yes |
| demo3@fiap.com | Demo123! | ✅ Yes |
| demo4@fiap.com | Demo123! | ✅ Yes |
| demo5@fiap.com | Demo123! | ✅ Yes |

**Important:** Make sure to check "Auto Confirm User" so they can login immediately!

### Step 2: Get User IDs

After creating each user:
1. Click on the user in the list
2. Copy their **UUID** (it looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
3. Save them temporarily - you'll need them in Step 3

**Example:**
```
USER_ID_1 = 71737a9c-3825-44ef-9de9-08155839600c  (demo1@fiap.com)
USER_ID_2 = 4e01c79c-8600-4b9c-9080-139a982bc5f8  (demo2@fiap.com)
USER_ID_3 = 64e5ef1d-65ab-4cb4-9cdc-41e8925dd7de  (demo3@fiap.com)
USER_ID_4 = 5825e1ad-d8f9-4b15-b257-9e0085522c4b  (demo4@fiap.com)
USER_ID_5 = 7974d85f-1582-4df7-8e74-5dfb1498ff12  (demo5@fiap.com)
```

### Step 3: Insert Demo Data

1. Go to **SQL Editor** in Supabase
2. Create a **New Query**
3. **REPLACE the USER_ID placeholders** with actual UUIDs from Step 2
4. Copy and paste this complete script:

```sql
-- ==========================================
-- INSERT DEMO DATA - REPLACE USER_IDs FIRST!
-- ==========================================

-- 1. Insert User Profiles
INSERT INTO user_profiles (id, full_name, email, wellness_score, wellness_trend) VALUES
    ('USER_ID_1', 'Pedro Silva', 'demo1@fiap.com', 85, 'improving'),
    ('USER_ID_2', 'Ana Costa', 'demo2@fiap.com', 78, 'stable'),
    ('USER_ID_3', 'João Santos', 'demo3@fiap.com', 92, 'improving'),
    ('USER_ID_4', 'Maria Oliveira', 'demo4@fiap.com', 68, 'declining'),
    ('USER_ID_5', 'Carlos Ferreira', 'demo5@fiap.com', 88, 'stable');

-- 2. Create Demo Circles (using fixed UUIDs for consistency)
INSERT INTO accountability_circles (id, name, type, created_by, description) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Família Silva', 'family', 'USER_ID_1', 'Nossa família trabalhando juntos no bem-estar digital'),
    ('22222222-2222-2222-2222-222222222222', 'Accountability Friends', 'duo', 'USER_ID_2', 'Parceiras de responsabilidade e apoio mútuo'),
    ('33333333-3333-3333-3333-333333333333', 'Desafio 30 Dias', 'challenge', 'USER_ID_3', 'Desafio coletivo de 30 dias de bem-estar');

-- 3. Add Members to Circles
-- Family Circle (Pedro, Ana, João)
INSERT INTO circle_members (circle_id, user_id, role, transparency_level, can_view_level, acceptance_status, invited_by) VALUES
    ('11111111-1111-1111-1111-111111111111', 'USER_ID_1', 'guardian', 'trends', 'trends', 'accepted', 'USER_ID_1'),
    ('11111111-1111-1111-1111-111111111111', 'USER_ID_2', 'member', 'trends', 'trends', 'accepted', 'USER_ID_1'),
    ('11111111-1111-1111-1111-111111111111', 'USER_ID_3', 'member', 'score_only', 'trends', 'accepted', 'USER_ID_1');

-- Accountability Duo (Ana, Maria)
INSERT INTO circle_members (circle_id, user_id, role, transparency_level, can_view_level, acceptance_status, invited_by) VALUES
    ('22222222-2222-2222-2222-222222222222', 'USER_ID_2', 'member', 'detailed', 'detailed', 'accepted', 'USER_ID_2'),
    ('22222222-2222-2222-2222-222222222222', 'USER_ID_4', 'member', 'detailed', 'detailed', 'accepted', 'USER_ID_2');

-- Challenge Circle (Everyone!)
INSERT INTO circle_members (circle_id, user_id, role, transparency_level, can_view_level, acceptance_status, invited_by) VALUES
    ('33333333-3333-3333-3333-333333333333', 'USER_ID_1', 'member', 'trends', 'trends', 'accepted', 'USER_ID_3'),
    ('33333333-3333-3333-3333-333333333333', 'USER_ID_2', 'member', 'trends', 'trends', 'accepted', 'USER_ID_3'),
    ('33333333-3333-3333-3333-333333333333', 'USER_ID_3', 'member', 'trends', 'trends', 'accepted', 'USER_ID_3'),
    ('33333333-3333-3333-3333-333333333333', 'USER_ID_4', 'member', 'trends', 'trends', 'accepted', 'USER_ID_3'),
    ('33333333-3333-3333-3333-333333333333', 'USER_ID_5', 'member', 'trends', 'trends', 'accepted', 'USER_ID_3');
```

5. Click **RUN** (bottom right corner)
6. You should see ✅ **Success** message

---

## 🧪 Step 4: Test Everything

### Test in Supabase Dashboard:

1. Go to **Table Editor**
2. Check each table has data:
   - **user_profiles**: Should have 5 rows
   - **accountability_circles**: Should have 3 rows
   - **circle_members**: Should have 10 rows

### Test in Your App:

1. Run your app: `npm start`
2. Open in Expo Go
3. Login with: `demo1@fiap.com` / `Demo123!`
4. Navigate to **Circles tab** (🌍 icon)
5. You should see **2 circles**:
   - Família Silva
   - Desafio 30 Dias

**If you see the circles, SUCCESS! 🎉**

---

## 📱 Demo Day Login Cards

Print these for your university event:

```
╔══════════════════════════════════════════╗
║      SINAIS CIRCLES - DEMO ACCOUNTS      ║
╠══════════════════════════════════════════╣
║                                          ║
║  👤 Demo 1: Pedro Silva                  ║
║  📧 demo1@fiap.com                       ║
║  🔑 Demo123!                             ║
║  📊 Score: 85 (improving)                ║
║  👥 Circles: Family, Challenge           ║
║                                          ║
╠══════════════════════════════════════════╣
║                                          ║
║  👤 Demo 2: Ana Costa                    ║
║  📧 demo2@fiap.com                       ║
║  🔑 Demo123!                             ║
║  📊 Score: 78 (stable)                   ║
║  👥 Circles: Family, Duo, Challenge      ║
║                                          ║
╠══════════════════════════════════════════╣
║                                          ║
║  👤 Demo 3: João Santos                  ║
║  📧 demo3@fiap.com                       ║
║  🔑 Demo123!                             ║
║  📊 Score: 92 (improving) ⭐             ║
║  👥 Circles: Family, Challenge           ║
║                                          ║
╠══════════════════════════════════════════╣
║                                          ║
║  👤 Demo 4: Maria Oliveira               ║
║  📧 demo4@fiap.com                       ║
║  🔑 Demo123!                             ║
║  📊 Score: 68 (declining)                ║
║  👥 Circles: Duo, Challenge              ║
║                                          ║
╠══════════════════════════════════════════╣
║                                          ║
║  👤 Demo 5: Carlos Ferreira              ║
║  📧 demo5@fiap.com                       ║
║  🔑 Demo123!                             ║
║  📊 Score: 88 (stable)                   ║
║  👥 Circles: Challenge                   ║
║                                          ║
╚══════════════════════════════════════════╝
```

---

## 🎪 Event Day Script

**When someone wants to try:**

1. **"Quer testar SINAIS Circles?"**
2. Hand them a login card
3. **"Abra o Expo Go e escaneie este QR"**
4. Wait for app to load (~10 seconds)
5. **"Faça login com este email e senha"** (point to card)
6. **"Agora vá para a aba Circles"** (show 🌍 icon)
7. **"Veja seus círculos de responsabilidade!"**
8. Let them explore and ask questions

**Key Points to Mention:**
- ✅ "É responsabilidade mútua, não vigilância"
- ✅ "Todos no círculo compartilham igualmente"
- ✅ "Você controla o que compartilha (3 níveis)"
- ✅ "Pode criar novos círculos aqui!" (show + button)

---

## 🔄 After Event - Reset Data

To reset for next demo:

```sql
-- Clean up demo data
DELETE FROM circle_members;
DELETE FROM accountability_circles;
DELETE FROM user_profiles;

-- Then re-run Step 3 to restore demo data
```

---

## 🆘 Troubleshooting

### "I don't see any circles!"
→ Check that user_profiles and circle_members have data
→ Verify the user IDs match between tables

### "Login not working"
→ Make sure users are "Confirmed" in Auth
→ Check email/password exactly matches

### "RLS error when viewing data"
→ The user must exist in user_profiles table
→ Re-run RLS policies script if needed

### "Can't create new circle"
→ Check that user is logged in (auth.uid() exists)
→ Verify RLS policy for INSERT is active

---

## ✅ Final Checklist

Before your event:

- [ ] 5 demo users created in Supabase Auth
- [ ] User IDs copied and saved
- [ ] Demo data SQL script run with correct IDs
- [ ] Verified 5 profiles, 3 circles, 10 members in tables
- [ ] Tested login with demo1@fiap.com
- [ ] Confirmed Circles tab shows 2 circles
- [ ] 10+ login cards printed
- [ ] Expo Go QR code ready
- [ ] Phone/tablet fully charged
- [ ] Practiced demo script

---

## 🚀 You're Ready!

Your SINAIS Circles demo is fully configured with:
- ✅ Working database
- ✅ Security policies
- ✅ Realistic demo data
- ✅ Multiple user accounts
- ✅ Interactive features

**The circles will impress everyone! Good luck at your university event! 🎓**