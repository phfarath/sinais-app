// Environment configuration
// In a production app, these values should be stored in .env file
// and accessed through expo-constants or react-native-config

export const SUPABASE_URL = 'https://vjgoqxgjzebhcxmosbli.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZ29xeGdqemViaGN4bW9zYmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDU0OTMsImV4cCI6MjA3NjEyMTQ5M30.42LcOvx8lsF_y9dLDN0swhQpO2FFsfZO97Pfwwyf-3o';
export const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY || 'your-openai-api-key'; // API key should be in .env file
export const FACE_RECOGNITION_URL = process.env.EXPO_PUBLIC_FACE_RECOGNITION_URL || 'http://192.168.15.10:8000';

// For development, we'll use placeholder values
// Replace these with your actual Supabase credentials when setting up the project