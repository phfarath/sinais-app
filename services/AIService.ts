import { StorageService } from './StorageService';
import { CHATGPT_API_KEY } from '../config/env';

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: 'assistant' | 'user' | 'system';
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface UserProfile {
  id?: string;
  name?: string;
  riskProfile?: string;
  preferences?: {
    notifications: boolean;
    dailyReminders: boolean;
    riskAlerts: boolean;
  };
  goals?: Array<{
    id: string;
    title: string;
    progress: number;
  }>;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  riskLevel?: 'low' | 'medium' | 'high';
}

export class AIService {
  // Maximum number of messages to keep in history
  private static readonly MAX_HISTORY_LENGTH = 20;
  
  // Maximum number of recent activities to include in context
  private static readonly MAX_ACTIVITIES_IN_CONTEXT = 5;
  
  static async sendMessage(userId: string, message: string): Promise<string> {
    try {
      // Check if API key is available
      if (!CHATGPT_API_KEY) {
        return "I'm currently in demo mode. To use the full AI capabilities, please add your OpenAI API key in the configuration.";
      }
      
      // Get conversation history
      const historyKey = `chat_history_${userId}`;
      const history = await StorageService.getData(historyKey) || [];
      
      // Get user context
      const userProfile = await StorageService.getData('user_profile') || {};
      const recentActivities = await StorageService.getData('recent_activities') || [];
      
      // Get user goals
      const userGoals = await StorageService.getData('user_goals') || [];
      
      // Create context-aware prompt
      const contextPrompt = this.createContextPrompt(userProfile, recentActivities, userGoals, history);
      
      // Send message to GPT with context
      const fullMessage = `${contextPrompt}\nUser: ${message}`;
      const response = await this.callChatGPTAPI(fullMessage);
      
      // Update conversation history
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      // Add new messages to history
      const updatedHistory = [...history, userMessage, assistantMessage];
      
      // Limit history length
      if (updatedHistory.length > this.MAX_HISTORY_LENGTH) {
        updatedHistory.splice(0, updatedHistory.length - this.MAX_HISTORY_LENGTH);
      }
      
      // Save updated history
      await StorageService.storeData(historyKey, updatedHistory);
      
      return response;
    } catch (error) {
      console.error('Error in AIService:', error);
      return "I'm having trouble processing your request right now. Please try again later.";
    }
  }
  
  private static async callChatGPTAPI(message: string): Promise<string> {
    try {
      const response = await fetch(CHATGPT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHATGPT_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('ChatGPT API Error:', errorData);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json() as ChatCompletionResponse;
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      } else {
        console.error('Unexpected API response structure:', data);
        throw new Error('Failed to get a valid response from AI.');
      }
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
      throw error;
    }
  }
  
  private static createContextPrompt(
    userProfile: UserProfile, 
    recentActivities: Activity[], 
    userGoals: any[], 
    history: ChatMessage[]
  ): string {
    // Limit activities to include in context
    const limitedActivities = recentActivities.slice(0, this.MAX_ACTIVITIES_IN_CONTEXT);
    
    // Limit history to include in context
    const limitedHistory = history.slice(-5); // Last 5 messages
    
    return `
You are a supportive assistant for the SinaisApp, a gambling addiction recovery and monitoring application.

User Context:
- Name: ${userProfile.name || 'User'}
- Risk Profile: ${userProfile.riskProfile || 'Not assessed'}
- Preferences: ${JSON.stringify(userProfile.preferences || {})}
- Goals: ${JSON.stringify(userGoals || [])}

Recent Activities:
${limitedActivities.map(activity => 
  `- ${activity.type}: ${activity.description} (${activity.timestamp}) [Risk: ${activity.riskLevel || 'unknown'}]`
).join('\n')}

Recent Conversation History:
${limitedHistory.map(msg => 
  `${msg.role}: ${msg.content}`
).join('\n')}

Guidelines:
1. Be empathetic and supportive
2. Provide personalized advice based on the user's risk profile and goals
3. Reference recent activities when relevant
4. Keep responses concise and actionable
5. Focus on recovery strategies and harm reduction
6. Avoid judgmental language
7. Suggest specific features of the app when appropriate
`;
  }
  
  static async getChatHistory(userId: string): Promise<ChatMessage[]> {
    const historyKey = `chat_history_${userId}`;
    return await StorageService.getData(historyKey) || [];
  }
  
  static async clearChatHistory(userId: string): Promise<void> {
    const historyKey = `chat_history_${userId}`;
    await StorageService.removeData(historyKey);
  }
  
  static async getQuickReplies(userId: string): Promise<string[]> {
    // Get user context to personalize quick replies
    const userProfile = await StorageService.getData('user_profile') || {};
    const recentActivities = await StorageService.getData('recent_activities') || [];
    
    // Base quick replies
    const baseReplies = [
      "How am I doing this week?",
      "What are some healthy alternatives?",
      "I'm feeling stressed right now",
      "Help me set a new goal"
    ];
    
    // Personalize based on context
    const personalizedReplies = [...baseReplies];
    
    // If user has high-risk activities, add crisis-related replies
    const hasHighRiskActivity = recentActivities.some(
      (activity: Activity) => activity.riskLevel === 'high'
    );
    
    if (hasHighRiskActivity) {
      personalizedReplies.push("I need help with a craving");
      personalizedReplies.push("Can we talk about my recent activities?");
    }
    
    // If user has goals, add goal-related replies
    if (userProfile.goals && userProfile.goals.length > 0) {
      personalizedReplies.push("How can I achieve my goals faster?");
    }
    
    return personalizedReplies;
  }
  
  static async saveUserFeedback(userId: string, messageId: string, feedback: 'positive' | 'negative'): Promise<void> {
    const feedbackKey = `chat_feedback_${userId}`;
    const existingFeedback = await StorageService.getData(feedbackKey) || {};
    
    await StorageService.storeData(feedbackKey, {
      ...existingFeedback,
      [messageId]: {
        feedback,
        timestamp: new Date()
      }
    });
  }
}