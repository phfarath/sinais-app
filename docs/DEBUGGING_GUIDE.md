# Debugging Guide - User Data & Circles Not Loading

## Problem Analysis

The issues you're experiencing are caused by environment variable configuration problems:

1. **"Visitante" still showing** - UserContext not loading real user data
2. **Circles tab empty** - CirclesService not connecting to Supabase properly

## Root Causes

### 1. Environment Variables Not Loading
- `config/env.ts` has placeholder values
- `.env` has real values but not being read
- `UserContext.ts` tries to read `process.env.EXPO_PUBLIC_SUPABASE_URL` directly

### 2. Multiple Supabase Clients
- `UserContext.ts` creates its own Supabase client
- `SupabaseService.ts` has another client
- Environment variables not shared properly

## Required Fixes

### Fix 1: Update config/env.ts
```typescript
// Replace placeholder values with real ones
export const SUPABASE_URL = 'https://vjgoqxgjzebhcxmosbli.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZ29xeGdqemViaGN4bW9zYmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDU0OTMsImV4cCI6MjA3NjEyMTQ5M30.42LcOvx8lsF_y9dLDN0swhQpO2FFsfZO97Pfwwyf-3o';
```

### Fix 2: Update UserContext.ts
```typescript
// Remove direct process.env access
// Import from config/env instead
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';

// Use existing SupabaseService client or create consistent one
```

### Fix 3: Update CirclesService.ts
```typescript
// Import from config/env instead of UserContext
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';
```

## Step-by-Step Debugging Process

### Step 1: Check Environment Variables
1. Open `config/env.ts`
2. Verify SUPABASE_URL and SUPABASE_ANON_KEY have real values
3. If not, copy from `.env` file

### Step 2: Check Console Logs
1. Open app in Expo Go
2. Check Metro console for errors like:
   - "Supabase URL is undefined"
   - "Cannot connect to Supabase"
   - "Network request failed"

### Step 3: Test Database Connection
1. Add console.log to UserContext.ts fetchUserByEmail
2. Check if email is being passed correctly
3. Check if Supabase query returns data

### Step 4: Verify User Data Flow
```
LoginScreen.handleConsentComplete()
  ↓
UserContext.fetchUserByEmail(email)
  ↓
Supabase query
  ↓
UserContext.setUser(profile)
  ↓
HomeScreen shows UserContext.getDisplayName()
```

### Step 5: Verify Circles Data Flow
```
CirclesScreen.onFocus()
  ↓
CirclesService.getUserCircles(userId)
  ↓
Supabase queries
  ↓
setCircles(data)
```

## Quick Test Commands

### Test Environment Variables
Add this to any screen:
```typescript
import Constants from 'expo-constants';
console.log('Supabase URL:', Constants.expoConfig.extra?.supabaseUrl);
```

### Test Supabase Connection
Add this to CirclesScreen:
```typescript
useEffect(() => {
  console.log('Testing Supabase...');
  supabase.from('user_profiles').select('*').limit(1).then(console.log);
}, []);
```

## Common Error Messages & Solutions

### "Invalid Supabase URL"
**Cause**: Environment variables not loaded
**Fix**: Update config/env.ts with real values

### "JWT token is invalid"
**Cause**: Wrong ANON_KEY
**Fix**: Copy correct key from Supabase dashboard

### "No rows returned"
**Cause**: User email not found in database
**Fix**: Ensure demo users exist in user_profiles table

### "RLS policy violation"
**Cause**: User not authenticated or wrong permissions
**Fix**: Check RLS policies in Supabase

## Expected Behavior After Fixes

### Login Flow
1. Login with demo1@fiap.com
2. Console shows: "User profile loaded: Pedro Silva"
3. Home shows: "Olá, Pedro Silva"
4. Profile shows: Pedro Silva + email + wellness score

### Circles Flow
1. Navigate to Circles tab
2. Console shows: "Loaded 2 circles"
3. Screen shows: 2 circle cards with member counts
4. Click circle: Shows members with real wellness scores

## If Still Not Working

### 1. Reset Metro Cache
```bash
npx expo start -c
```

### 2. Clear App Data
- Delete and reinstall Expo Go
- Clear app cache in device settings

### 3. Check Network
- Ensure device has internet connection
- Try different network (WiFi vs cellular)

### 4. Verify Supabase Project
- Check project URL in Supabase dashboard
- Verify ANON_KEY is correct
- Test API connection in Supabase SQL Editor

---

## Implementation Priority

**HIGH - Must Fix Before Demo:**
1. ✅ Update config/env.ts with real Supabase credentials
2. ✅ Fix UserContext.ts to use config/env
3. ✅ Fix CirclesService.ts to use config/env
4. ✅ Test login flow shows real user name
5. ✅ Test circles show real data

**Time Estimate:** 15 minutes to fix all issues