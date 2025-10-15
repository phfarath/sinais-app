# Circles Debug SQL Commands

## What to Check

Since the app is working but circles show no members, let's check the database state.

## SQL Commands to Run in Supabase Dashboard

### 1. Check if Circles Were Created
```sql
SELECT 
  id, 
  name, 
  type, 
  created_by,
  created_at 
FROM accountability_circles 
ORDER BY created_at DESC;
```

### 2. Check User Profiles
```sql
SELECT 
  id, 
  email, 
  full_name, 
  wellness_score,
  created_at
FROM user_profiles 
ORDER BY created_at DESC;
```

### 3. Check Circle Memberships
```sql
SELECT 
  cm.circle_id,
  cm.user_id,
  cm.role,
  cm.acceptance_status,
  cm.joined_at,
  up.full_name,
  up.email,
  ac.name as circle_name
FROM circle_members cm
LEFT JOIN user_profiles up ON cm.user_id = up.id
LEFT JOIN accountability_circles ac ON cm.circle_id = ac.id
ORDER BY cm.joined_at DESC;
```

### 4. Check Specific User's Circles
```sql
-- Replace with actual user ID from user_profiles table
SELECT 
  ac.id,
  ac.name,
  ac.type,
  ac.created_by,
  cm.role,
  cm.acceptance_status
FROM accountability_circles ac
JOIN circle_members cm ON ac.id = cm.circle_id
WHERE cm.user_id = 'YOUR_USER_ID_HERE'
AND cm.acceptance_status = 'accepted';
```

## Expected Results

### If Everything Worked:
1. **Circles table** should show 2-3 circles
2. **User profiles** should show the demo users you created
3. **Circle members** should show the user as owner of their circles

### If Circles Exist But No Members:
- Circles table has data
- Circle members table is empty or has wrong user IDs
- The `createCircle` method failed to add the owner

### If No Circles:
- Circles table is empty
- The `createDemoCircles` method failed completely

## Quick Fix SQL

If circles exist but have no members, run this to add the owner:

```sql
-- First, get the user ID and circle IDs from the queries above
-- Then run this for each circle-member relationship:

INSERT INTO circle_members (
  circle_id, 
  user_id, 
  role, 
  transparency_level, 
  acceptance_status, 
  joined_at
) VALUES (
  'CIRCLE_ID_HERE',    -- Replace with actual circle ID
  'USER_ID_HERE',      -- Replace with actual user ID  
  'owner',
  'detailed',
  'accepted',
  NOW()
);
```

## Complete Demo Setup SQL

If you want to reset and create everything from scratch:

```sql
-- Clean up existing data
DELETE FROM circle_members;
DELETE FROM accountability_circles;
DELETE FROM user_profiles WHERE email LIKE '%demo%@fiap.com';

-- Create demo users
INSERT INTO user_profiles (id, email, full_name, wellness_score, wellness_trend, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo1@fiap.com', 'Pedro Silva', 78, 'improving', NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'demo2@fiap.com', 'Ana Santos', 85, 'stable', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'demo3@fiap.com', 'Carlos Oliveira', 72, 'declining', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'demo4@fiap.com', 'Maria Costa', 90, 'improving', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'demo5@fiap.com', 'João Pereira', 65, 'stable', NOW());

-- Create circles
INSERT INTO accountability_circles (id, name, type, description, created_by, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'Família Silva', 'family', 'Círculo familiar para apoio mútuo', '550e8400-e29b-41d4-a716-446655440000', NOW()),
('660e8400-e29b-41d4-a716-446655440001', 'Accountability Friends', 'duo', 'Parceria de responsabilidade e apoio', '550e8400-e29b-41d4-a716-446655440000', NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Accountability Friends', 'duo', 'Parceria de responsabilidade e apoio', '550e8400-e29b-41d4-a716-446655440001', NOW());

-- Add circle members (owners)
INSERT INTO circle_members (circle_id, user_id, role, transparency_level, acceptance_status, joined_at) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'owner', 'detailed', 'accepted', NOW()),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'owner', 'detailed', 'accepted', NOW()),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'owner', 'detailed', 'accepted', NOW());

-- Add some additional members for demo
INSERT INTO circle_members (circle_id, user_id, role, transparency_level, acceptance_status, joined_at) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'member', 'trends', 'accepted', NOW()),
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'member', 'trends', 'accepted', NOW()),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'member', 'trends', 'accepted', NOW());
```

## What to Do

1. **Run the diagnostic queries** first to see what's in the database
2. **Share the results** so I can see exactly what's missing
3. **Run the appropriate fix** based on what you find

The diagnostic queries will tell us whether:
- Circles were created but members weren't added
- The user IDs don't match between tables
- Something else is wrong

Once I see the actual data, I can give you the exact fix needed.