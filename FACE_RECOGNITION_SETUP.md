# Face Recognition Setup and Testing Guide

## Quick Setup

### 1. Start the Backend Server

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The server should start on `http://localhost:8000`

### 2. Start the Mobile App

```bash
npm start
# or
expo start
```

## Testing the Face Recognition Flow

### Step 1: Test Navigation
1. Open the app
2. Go to the Login screen
3. Click on "Entrar com Reconhecimento Facial" button
4. You should see the FaceAuthenticationScreen open

### Step 2: Test Face Registration (After Quiz)
1. Complete the quiz questions
2. After the quiz, you should be prompted to register your face
3. Follow the on-screen instructions to register your face

### Step 3: Test Face Authentication
1. Logout and return to the Login screen
2. Click "Entrar com Reconhecimento Facial"
3. Position your face in the camera view
4. The app should authenticate you if your face is registered

## Troubleshooting Common Issues

### Navigation Error: "The action 'NAVIGATE' with payload was not handled"

**Solution**: This should now be fixed with the updated App.tsx. If you still see this error:

1. Make sure you've restarted the app after the changes
2. Check that the FaceAuthenticationScreen is properly imported in App.tsx
3. Verify the route names match exactly in the navigation

### Camera Not Working

**Symptoms**: Black screen, permission errors, or camera crashes

**Solutions**:
1. Check that camera permissions are granted in your device settings
2. Make sure expo-camera is installed: `expo install expo-camera`
3. Restart the Expo app
4. Check that app.json has the correct camera permissions

### Backend Connection Issues

**Symptoms**: "Network error", "Failed to register face", or timeout errors

**Solutions**:
1. Make sure the backend server is running on `http://localhost:8000`
2. Check that your mobile device and computer are on the same network
3. If using a physical device, replace `localhost` with your computer's IP address
4. Update the FACE_RECOGNITION_URL in config/env.ts

### Face Recognition Not Working

**Symptoms**: "Face not recognized" even with correct face

**Solutions**:
1. Ensure good lighting conditions
2. Position your face centrally in the camera view
3. Remove glasses or accessories that might obstruct your face
4. Try registering your face again in better lighting
5. Check that the face recognition models are in the correct folder

## Development Tips

### Testing with Different Environments

**For development on the same machine**:
- Backend: `http://localhost:8000`
- Frontend: Uses default configuration

**For testing with physical devices**:
1. Find your computer's IP address:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`
2. Update config/env.ts:
   ```typescript
   export const FACE_RECOGNITION_URL = 'http://YOUR_COMPUTER_IP:8000';
   ```

### Debugging the Backend

Check the backend console for:
- Model loading errors
- Face detection issues
- Database problems

Common backend logs:
- `"Face recognition models loaded successfully"` - Good
- `"Failed to import dlib"` - Install dlib properly
- `"No faces registered in database"` - Register a face first

### Debugging the Frontend

Check the mobile app console for:
- Network request failures
- Camera permission issues
- Navigation errors

## Face Recognition Flow Summary

1. **Registration Flow**:
   - User completes quiz → FaceRegistrationScreen → Camera captures face → Backend stores face embedding → User can now use face recognition

2. **Authentication Flow**:
   - User clicks face recognition button → FaceAuthenticationScreen → Camera captures face → Backend matches face → User is logged in

3. **Settings Management**:
   - User can enable/disable face recognition in Profile settings
   - User can update or delete their face data
   - All changes are reflected in the backend

## Security Notes

- Face data is stored as mathematical embeddings, not actual images
- The backend should be secured with HTTPS in production
- Consider implementing rate limiting for authentication attempts
- Face recognition should be used as an additional security layer, not the only method

## Next Steps

Once everything is working:

1. Test the complete flow from registration to authentication
2. Test edge cases (poor lighting, different angles, etc.)
3. Test the settings management features
4. Consider adding more security features (liveness detection, etc.)