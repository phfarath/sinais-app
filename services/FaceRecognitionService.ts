import { ApiService } from './ApiService';
import { AuditService } from './AuditService';
import { EncryptionService } from './EncryptionService';
import { FACE_RECOGNITION_URL } from '../config/env';
import * as FileSystem from 'expo-file-system/legacy';

export interface FaceRegistrationResult {
  success: boolean;
  message?: string;
  user_id?: string;
}

export interface FaceAuthenticationResult {
  recognized: boolean;
  user_id?: string;
  confidence?: number;
  profile?: any;
  message?: string;
  closest_match?: string;
  distance?: number;
}

export interface FaceRegistrationStatus {
  user_id: string;
  face_registered: boolean;
  profile?: any;
}

export class FaceRecognitionService {
  private static readonly API_BASE = FACE_RECOGNITION_URL;
  
  /**
   * Register a user's face
   * @param userId User ID
   * @param imageUri URI of the captured image
   * @param profileData Optional profile data (risk profile, etc.)
   * @returns Registration result
   */
  static async registerFace(
    userId: string,
    imageUri: string,
    profileData?: any
  ): Promise<FaceRegistrationResult> {
    try {
      console.log('Starting face registration for user:', userId);
      console.log('API Base URL:', this.API_BASE);
      console.log('Image URI:', imageUri);
      
      AuditService.logAction('FACE_REGISTRATION_STARTED', 'FACE_RECOGNITION', userId,
        { hasProfile: !!profileData }, 'MEDIUM');

      // Create form data
      const formData = new FormData();
      formData.append('user_id', userId);
      
      if (profileData) {
        formData.append('profile_data', JSON.stringify(profileData));
      }

      // Convert image URI to base64 and send as base64 string
      console.log('Converting image URI to base64...');
      
      try {
        // Read the file as base64
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: 'base64',
        });
        
        // Create a proper data URI
        const dataUri = `data:image/jpeg;base64,${base64}`;
        
        // Convert to blob using fetch
        const response = await fetch(dataUri);
        const blob = await response.blob();
        formData.append('file', blob);
        console.log('Blob created successfully from base64');
      } catch (fsError) {
        console.error('FileSystem approach failed, trying direct URI approach:', fsError);
        
        // Try using the image URI directly in FormData
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any);
        console.log('Using direct URI approach');
      }

      // Send to backend
      const apiUrl = `${this.API_BASE}/api/face/register`;
      console.log('Sending request to:', apiUrl);
      
      const result = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Response status:', result.status);
      console.log('Response ok:', result.ok);
      
      const data = await result.json();
      console.log('Response data:', data);

      if (!result.ok) {
        AuditService.logAction('FACE_REGISTRATION_FAILED', 'FACE_RECOGNITION', userId,
          { error: data.detail || 'Unknown error' }, 'HIGH');
        
        return {
          success: false,
          message: data.detail || 'Failed to register face'
        };
      }

      AuditService.logAction('FACE_REGISTRATION_SUCCESS', 'FACE_RECOGNITION', userId,
        {}, 'LOW');

      return {
        success: true,
        message: data.message,
        user_id: data.user_id
      };

    } catch (error) {
      console.error('Complete error object:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      AuditService.logAction('FACE_REGISTRATION_ERROR', 'FACE_RECOGNITION', userId,
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
      
      return {
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Authenticate user with face
   * @param imageUri URI of the captured image
   * @returns Authentication result
   */
  static async authenticateWithFace(imageUri: string): Promise<FaceAuthenticationResult> {
    try {
      console.log('Starting face authentication');
      console.log('API Base URL:', this.API_BASE);
      console.log('Image URI:', imageUri);
      
      AuditService.logAction('FACE_AUTH_STARTED', 'FACE_RECOGNITION', 'anonymous',
        {}, 'MEDIUM');

      // Create form data
      const formData = new FormData();

      // Convert image URI to base64 and send as base64 string
      console.log('Converting image URI to base64...');
      
      try {
        // Read the file as base64
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: 'base64',
        });
        
        // Create a proper data URI
        const dataUri = `data:image/jpeg;base64,${base64}`;
        
        // Convert to blob using fetch
        const response = await fetch(dataUri);
        const blob = await response.blob();
        formData.append('file', blob);
        console.log('Blob created successfully from base64');
      } catch (fsError) {
        console.error('FileSystem approach failed, trying direct URI approach:', fsError);
        
        // Try using the image URI directly in FormData
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any);
        console.log('Using direct URI approach');
      }

      // Send to backend
      const apiUrl = `${this.API_BASE}/api/face/authenticate`;
      console.log('Sending request to:', apiUrl);
      
      const result = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Response status:', result.status);
      console.log('Response ok:', result.ok);
      
      const data = await result.json();
      console.log('Response data:', data);

      if (!result.ok) {
        AuditService.logAction('FACE_AUTH_FAILED', 'FACE_RECOGNITION', 'anonymous',
          { error: data.detail || 'Unknown error' }, 'HIGH');
        
        return {
          recognized: false,
          message: data.detail || 'Failed to authenticate face'
        };
      }

      if (data.recognized) {
        AuditService.logAction('FACE_AUTH_SUCCESS', 'FACE_RECOGNITION', data.user_id,
          { confidence: data.confidence }, 'LOW');
      } else {
        AuditService.logAction('FACE_AUTH_NOT_RECOGNIZED', 'FACE_RECOGNITION', 'anonymous',
          { message: data.message, distance: data.distance }, 'MEDIUM');
      }

      return data;

    } catch (error) {
      console.error('Complete error object:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      AuditService.logAction('FACE_AUTH_ERROR', 'FACE_RECOGNITION', 'anonymous',
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
      
      return {
        recognized: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Check if user has registered face
   * @param userId User ID
   * @returns Registration status
   */
  static async getFaceRegistrationStatus(userId: string): Promise<FaceRegistrationStatus> {
    try {
      const result = await fetch(`${this.API_BASE}/api/face/status/${userId}`);
      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.detail || 'Failed to check registration status');
      }

      return data;

    } catch (error) {
      AuditService.logAction('FACE_STATUS_CHECK_ERROR', 'FACE_RECOGNITION', userId, 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'MEDIUM');
      
      return {
        user_id: userId,
        face_registered: false
      };
    }
  }

  /**
   * Delete user's face registration
   * @param userId User ID
   * @returns Deletion result
   */
  static async deleteFaceRegistration(userId: string): Promise<{ success: boolean; message?: string }> {
    try {
      AuditService.logAction('FACE_REGISTRATION_DELETE_STARTED', 'FACE_RECOGNITION', userId, 
        {}, 'MEDIUM');

      const result = await fetch(`${this.API_BASE}/api/face/${userId}`, {
        method: 'DELETE',
      });

      const data = await result.json();

      if (!result.ok) {
        AuditService.logAction('FACE_REGISTRATION_DELETE_FAILED', 'FACE_RECOGNITION', userId, 
          { error: data.detail || 'Unknown error' }, 'HIGH');
        
        return {
          success: false,
          message: data.detail || 'Failed to delete face registration'
        };
      }

      AuditService.logAction('FACE_REGISTRATION_DELETE_SUCCESS', 'FACE_RECOGNITION', userId, 
        {}, 'LOW');

      return {
        success: true,
        message: data.message
      };

    } catch (error) {
      AuditService.logAction('FACE_REGISTRATION_DELETE_ERROR', 'FACE_RECOGNITION', userId, 
        { error: error instanceof Error ? error.message : 'Unknown error' }, 'HIGH');
      
      return {
        success: false,
        message: 'Network error occurred while deleting face registration'
      };
    }
  }

  /**
   * Check if the face recognition service is available
   * @returns Service health status
   */
  static async checkServiceHealth(): Promise<{ healthy: boolean; models_loaded: boolean; registered_faces: number; error?: string }> {
    try {
      console.log('Checking service health at:', `${this.API_BASE}/api/health`);
      const result = await fetch(`${this.API_BASE}/api/health`);
      console.log('Health check response status:', result.status);
      
      const data = await result.json();
      console.log('Health check response data:', data);

      if (!result.ok) {
        return {
          healthy: false,
          models_loaded: false,
          registered_faces: 0,
          error: `HTTP ${result.status}: ${data.detail || 'Unknown error'}`
        };
      }

      return {
        healthy: data.status === 'healthy',
        models_loaded: data.models_loaded,
        registered_faces: data.registered_faces || 0
      };

    } catch (error) {
      console.error('Health check error:', error);
      return {
        healthy: false,
        models_loaded: false,
        registered_faces: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Convert image URI to base64 for debugging purposes
   * @param imageUri URI of the image
   * @returns Base64 string
   */
  static async imageToBase64(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('Failed to convert image to base64');
    }
  }
}