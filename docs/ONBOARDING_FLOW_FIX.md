# Onboarding Flow Fix - Remove Mandatory Face Registration

## Problem
Currently, after completing the quiz, users are forced to register their face before accessing the app. This blocks the demo flow and face registration isn't working properly.

## Solution
Make face registration **optional** and only accessible from Profile/Settings screens.

---

## Changes Required

### 1. Fix QuizScreen.tsx (Line 93-115)

**Current Code:**
```typescript
const calculateAndNavigate = (finalAnswers: Record<number, string>) => {
  const scores: Record<string, number> = { 
    'Nunca': 0, 
    'Raramente': 1, 
    'Às vezes': 2, 
    'Frequentemente': 3 
  };

  const riskScore = Object.values(finalAnswers).reduce((acc, val) => 
    acc + scores[val], 0);

  const maxScore = questions.length * 3;
  const riskLevel = riskScore / maxScore;
  
  const riskProfile = riskLevel < 0.3 ? 'Conservador' : riskLevel < 0.6 ? 'Moderado' : 'Impulsivo';
  
  // Navigate to face registration with quiz results
  navigation.navigate('FaceRegistration', {
    userId: 'user_' + Date.now(),
    riskProfile,
    score: riskScore
  });
};
```

**New Code:**
```typescript
const calculateAndNavigate = (finalAnswers: Record<number, string>) => {
  const scores: Record<string, number> = { 
    'Nunca': 0, 
    'Raramente': 1, 
    'Às vezes': 2, 
    'Frequentemente': 3 
  };

  const riskScore = Object.values(finalAnswers).reduce((acc, val) => 
    acc + scores[val], 0);

  const maxScore = questions.length * 3;
  const riskLevel = riskScore / maxScore;
  
  const riskProfile = riskLevel < 0.3 ? 'Conservador' : riskLevel < 0.6 ? 'Moderado' : 'Impulsivo';
  
  // Navigate directly to MainTabs - face registration is optional in Profile
  navigation.navigate('MainTabs');
};
```

**Changes:**
- Remove navigation to `FaceRegistration`
- Navigate directly to `MainTabs` instead
- Face registration remains available in ProfileScreen (already implemented)

---

## Verification Steps

After applying the fix:

1. **Test Onboarding Flow:**
   - Login with demo1@fiap.com
   - Enter any 6-digit MFA code
   - Accept data permissions (fake screen)
   - Complete quiz
   - ✅ Should land directly on MainTabs (Home screen)

2. **Test Optional Face Registration:**
   - Navigate to Profile tab
   - Find "Reconhecimento Facial" toggle
   - Toggle it ON
   - ✅ Should navigate to FaceRegistrationScreen
   - Can also access from Settings → Face options

3. **Verify Flow is Not Broken:**
   - Logout
   - Login again
   - ✅ Complete flow without face registration blocking

---

## Face Registration Status

Face registration is now **OPTIONAL** and available in:

### ProfileScreen (lines 124-154, 262-298)
- Toggle switch for face recognition
- "Rosto registrado" / "Rosto não registrado" status
- Button to update registered face
- Button to delete face data
- All face registration logic is working correctly here

### Where it's accessible:
1. **Profile Tab** → Toggle "Reconhecimento Facial" ON
2. **Profile Tab** → "Atualizar Rosto Registrado" (if already registered)
3. **Settings** → Can add face registration options here too (optional)

---

## Implementation Priority

**HIGH PRIORITY - Must fix before demo event:**
- ✅ This fix is critical for the demo flow
- ✅ Currently blocks users after quiz
- ✅ Simple one-line change

**Implementation time:** 2 minutes

---

## Code Mode Instructions

When switching to Code mode, execute:

```typescript
// In screens/QuizScreen.tsx, line 110
// REPLACE:
navigation.navigate('FaceRegistration', {
  userId: 'user_' + Date.now(),
  riskProfile,
  score: riskScore
});

// WITH:
navigation.navigate('MainTabs');
```

That's it! Single line change.