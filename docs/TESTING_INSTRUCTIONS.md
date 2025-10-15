# Testing Instructions - After Environment Fixes

## What Was Fixed ✅

1. **Environment Variables** - Updated `config/env.ts` with real Supabase credentials
2. **UserContext** - Now imports from `config/env` instead of `process.env`
3. **CirclesService** - Created dedicated Supabase client with proper config
4. **Debugging Logs** - Added comprehensive logging to track data flow

## How to Test

### Step 1: Restart the App
```bash
# Stop the current Expo session
# Restart with cache clear
npx expo start -c
```

### Step 2: Test Login Flow

**Expected Console Logs:**
```
Fetching user profile for email: demo1@fiap.com
✅ User profile loaded: Pedro Silva
✅ User ID: [actual-uuid]
✅ Wellness score: 78
```

**Expected UI Behavior:**
- Home screen shows: "Olá, Pedro Silva" (not "Visitante")
- Profile screen shows: "Pedro Silva" + email + wellness score

### Step 3: Test Circles

**Expected Console Logs:**
```
✅ Loading circles for user ID: [actual-uuid]
✅ Loaded circles: 2 circles found
✅ Circle data: [array with circle objects]
```

**Expected UI Behavior:**
- Circles tab shows 2 circle cards
- Each card shows member count and wellness scores
- Can click circles to see member details

### Step 4: Test Circle Creation

**Steps:**
1. Click "+" button in Circles
2. Enter name: "Teste Circle"
3. Select type: "Duo"
4. Click "Criar Círculo"
5. Should see new circle in list

### Step 5: Test Member Invitation

**Steps:**
1. Click any circle
2. Click "Convidar Membros"
3. Enter email: demo4@fiap.com
4. Click "Enviar Convite"
5. Should show success message

## Debugging Console Output

### Successful Login Flow:
```
🔹 LoginScreen: Fetching user profile for email: demo1@fiap.com
✅ User profile loaded: Pedro Silva
✅ User ID: 12345678-1234-1234-1234-123456789012
✅ Wellness score: 78

🏠 HomeScreen - User data: {id: "123...", full_name: "Pedro Silva", ...}
🏠 HomeScreen - Display name: Pedro Silva

👤 ProfileScreen - User data: {id: "123...", full_name: "Pedro Silva", ...}
👤 ProfileScreen - Display name: Pedro Silva
```

### Successful Circles Flow:
```
✅ Loading circles for user ID: 12345678-1234-1234-1234-123456789012
✅ Loaded circles: 2 circles found
✅ Circle data: [
  {
    id: "circle-1",
    name: "Família Silva",
    type: "family",
    members: [...]
  },
  {
    id: "circle-2", 
    name: "Accountability Friends",
    type: "duo",
    members: [...]
  }
]
```

## If Still Not Working

### Check Console for Errors:

**Connection Errors:**
```
❌ Error fetching user profile: Network request failed
❌ Error loading circles: Invalid Supabase URL
```

**No Data Found:**
```
❌ No user profile found for email: demo1@fiap.com
❌ Loaded circles: 0 circles found
```

**Environment Issues:**
```
❌ Supabase URL is undefined
❌ Cannot read property 'from' of undefined
```

### Quick Fixes:

1. **No circles found:**
   - Check if demo users exist in `user_profiles` table
   - Check if `circle_members` table has relationships
   - Run the setup SQL from `FINAL_SETUP_STEPS.md`

2. **Still showing "Visitante":**
   - Check console logs during login
   - Verify UserContext.setUser() is called
   - Check if UserContext.getUser() returns data

3. **Network errors:**
   - Verify internet connection
   - Check Supabase project is active
   - try different network

## Expected Final State

### Home Screen:
- ✅ "Olá, Pedro Silva" (real name)
- ✅ Risk profile from quiz results
- ✅ All features working

### Profile Screen:
- ✅ "Pedro Silva" (real name)
- ✅ "demo1@fiap.com" (real email)
- ✅ Wellness score: 78 (real data)
- ✅ Face recognition toggle working

### Circles Screen:
- ✅ 2 circles showing with real data
- ✅ Member counts accurate
- ✅ Wellness scores displayed
- ✅ Create circle working
- ✅ Invite members working

---

## Success Criteria

**Login Success:**
- [ ] Console shows "✅ User profile loaded: [name]"
- [ ] Home shows "Olá, [name]" not "Visitante"
- [ ] Profile shows real user data

**Circles Success:**
- [ ] Console shows "✅ Loaded circles: [number] circles found"
- [ ] Circles tab shows circle cards
- [ ] Can create new circle
- [ ] Can invite members

If all checks pass, the app is ready for your demo event! 🎉