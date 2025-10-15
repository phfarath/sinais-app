# 401 Unauthorized Error Debug Guide

## Problem Analysis
The error shows **401 Unauthorized** which means:
- Supabase connection works (URL is correct)
- ANON key is being read
- But Supabase is rejecting the requests due to authentication/authorization issues

## Most Likely Causes

### 1. **RLS Policies Blocking Anonymous Access**
Row Level Security policies might be preventing anonymous reads/writes to the `user_profiles` table.

### 2. **ANON Key Expired/Invalid**
The ANON key might have been regenerated or expired.

### 3. **Supabase Project Settings**
Anonymous access might be disabled in project settings.

## Debugging Steps

### Step 1: Test with Enhanced Logging
Now when you login with `demo1@fiap.com`, you should see detailed logs:

**Expected Success Logs:**
```
🔍 Testing Supabase connection...
✅ Supabase connection test passed
🔍 Fetching user profile for email: demo1@fiap.com
✅ Found existing user profile: Pedro Silva
```

**Expected Failure Logs (if RLS issue):**
```
🔍 Testing Supabase connection...
✅ Supabase connection test passed
🔍 Fetching user profile for email: demo1@fiap.com
❌ Error fetching user by email: {...}
❌ Error details: {"code":"PGRST301","message":"permission denied..."}
🔍 Trying to list all users...
❌ Cannot list users either: {...}
```

### Step 2: Check Supabase Dashboard

**Go to your Supabase Dashboard:**
1. Navigate to **Authentication** → **Settings**
2. Check **"Enable anonymous sign-in"** is ON
3. Navigate to **Project Settings** → **API**
4. Verify the **anon** key matches what's in your `.env` file

### Step 3: Check RLS Policies

**Go to Supabase Dashboard:**
1. Navigate to **Authentication** → **Policies**
2. Click on **user_profiles** table
3. Check if there are policies blocking anonymous access

**Current RLS Policies Should Be:**
```sql
-- For user_profiles table
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles  
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for anonymous users" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for anonymous users" ON user_profiles
  FOR SELECT USING (true);
```

### Step 4: Quick SQL Test

**Run this in Supabase SQL Editor:**
```sql
-- Test if anonymous can read
SELECT count(*) FROM user_profiles;

-- Test if anonymous can insert
INSERT INTO user_profiles (email, full_name, wellness_score, wellness_trend)
VALUES ('test@test.com', 'Test User', 75, 'stable')
RETURNING id;
```

If these fail, it's definitely an RLS or permission issue.

## Immediate Fixes

### Fix 1: Disable RLS Temporarily (for testing)
```sql
-- In Supabase SQL Editor
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_circles DISABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members DISABLE ROW LEVEL SECURITY;
```

### Fix 2: Add Anonymous Access Policies
```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create permissive policies for demo
CREATE POLICY "Enable anonymous access" ON user_profiles
  FOR ALL USING (true);

CREATE POLICY "Enable anonymous circles" ON accountability_circles
  FOR ALL USING (true);

CREATE POLICY "Enable anonymous members" ON circle_members
  FOR ALL USING (true);
```

### Fix 3: Regenerate ANON Key
1. Go to Supabase Dashboard → Project Settings → API
2. Click **"Regenerate"** next to the **anon** key
3. Copy the new key to your `.env` file
4. Update `config/env.ts` with the new key
5. Restart the app: `npx expo start -c`

## Test Results to Share

Please copy and paste the console logs after testing with `demo1@fiap.com`. I need to see:

1. **Connection test results**
2. **Error details (JSON format)**
3. **Whether user listing works**
4. **Insert attempt results**

## Expected Console Output

**If RLS is the issue:**
```
🔍 Testing Supabase connection...
✅ Supabase connection test passed
🔍 Fetching user profile for email: demo1@fiap.com
❌ Error fetching user by email: {
  "code": "PGRST301",
  "message": "permission denied for table user_profiles",
  "details": "...",
  "hint": "..."
}
🔍 Trying to list all users...
❌ Cannot list users either: {
  "code": "PGRST301", 
  "message": "permission denied for table user_profiles"
}
```

**If it works:**
```
🔍 Testing Supabase connection...
✅ Supabase connection test passed
🔍 Fetching user profile for email: demo1@fiap.com
✅ Found existing user profile: Pedro Silva
```

## Next Steps

1. **Test the app now** with enhanced logging
2. **Share the console output** 
3. **I'll provide the exact fix** based on the specific error

The enhanced logging will tell us exactly what's wrong and I can give you the precise solution.