// IMPORTANT: Storing API keys directly in the code is a security risk.
// Consider using environment variables or a secure configuration service for production.
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

export async function sendMessageToGPT(userMessage: string): Promise<string> {
  try {
    const response = await fetch(CHATGPT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHATGPT_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Or your preferred model
        messages: [{ role: 'user', content: userMessage }],
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
    console.error('Error sending message to GPT:', error);
    // Return a user-friendly error message or rethrow
    return "I'm having trouble connecting to the AI at the moment. Please try again later.";
  }
}
