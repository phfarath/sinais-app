// Environment configuration
// In a production app, these values should be stored in .env file
// and accessed through expo-constants or react-native-config

export const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
export const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
export const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY || 'your-openai-api-key'; // API key should be in .env file
export const FACE_RECOGNITION_URL = process.env.EXPO_PUBLIC_FACE_RECOGNITION_URL || 'http://192.168.15.10:8000';

// For development, we'll use placeholder values
// Replace these with your actual Supabase credentials when setting up the project