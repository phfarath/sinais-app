import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import { AIService } from '../services/AIService'; // Import the AI service

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

interface AIChatScreenProps {
  visible: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function AIChatScreen({ visible, onClose }: AIChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false); // To disable input while sending
  const [suggestions, setSuggestions] = useState<string[]>([]); // Dynamic suggestions

  // Load quick replies when component mounts
  useEffect(() => {
    const loadQuickReplies = async () => {
      try {
        // For now, we'll use a placeholder user ID. In a real app, this would come from authentication
        const userId = 'user_123';
        const quickReplies = await AIService.getQuickReplies(userId);
        setSuggestions(quickReplies);
      } catch (error) {
        console.error('Error loading quick replies:', error);
        // Fallback to default suggestions
        setSuggestions(["Como proteger meus dados?", "O que é phishing?", "Dicas de senha segura", "Como funciona a IA?"]);
      }
    };

    if (visible) {
      loadQuickReplies();
    }
  }, [visible]);


  const handleSendMessage = async (textToSend?: string) => {
    const currentText = textToSend || inputText;
    if (currentText.trim() === '' || isSending) return;

    const userMessage: Message = { id: Date.now().toString(), text: currentText, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    if (!textToSend) { // Clear input only if not from voice direct send
        setInputText('');
    }
    setIsSending(true);

    try {
      // For now, we'll use a placeholder user ID. In a real app, this would come from authentication
      const userId = 'user_123';
      const aiText = await AIService.sendMessage(userId, userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error processing AI message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process that. Please try again.",
        sender: 'ai',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
    // Optionally, send the suggestion directly
    // handleSendMessage(suggestion);
  };


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* BlurView or semi-transparent overlay */}
      {/* <BlurView style={styles.absolute} blurType="light" blurAmount={10} /> */}
      <View style={styles.modalOverlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingViewContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Pergunte à IA</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              {/* Using a simple text 'X' for now, replace with an icon if available */}
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
                <Text style={item.sender === 'user' ? styles.userMessageText : styles.aiMessageText}>
                  {item.text}
                </Text>
              </View>
            )}
            keyExtractor={item => item.id}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContentContainer}
            // Removed inverted prop to show messages in normal order (newest at bottom)
          />

          {/* Suggestions */}
          <View style={styles.suggestionsOuterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScrollContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity key={index} style={styles.suggestionBubble} onPress={() => handleSuggestionPress(suggestion)}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#9CA3AF" // Medium gray for placeholder
              multiline
              editable={!isSending} // Disable input while sending
            />
            <TouchableOpacity onPress={() => handleSendMessage()} style={[styles.sendButton, isSending && styles.sendButtonDisabled]} disabled={isSending}>
              {/* Placeholder for Send Icon - replace with actual icon */}
              <Text style={styles.iconText}>{isSending ? "..." : "➤"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  absolute: { // For BlurView
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalOverlay: { // Fallback for blur - semi-transparent background
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', 
  },
  keyboardAvoidingViewContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Aligns modal to the bottom or where content is
  },
  modalContent: {
    height: screenHeight * 0.80, // Modal takes 80% of screen height
    width: screenWidth,
    backgroundColor: '#FFFFFF', // White background for the chat area
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20, // Padding for home indicator on iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937', // Dark gray
  },
  closeButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#F3F4F6', // Light gray background for button
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563', // Medium gray
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messagesContentContainer: {
    paddingBottom: 10, // Ensure last message is not hidden by input
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 12,
    maxWidth: '85%',
    elevation: 1, // Subtle shadow for bubbles
  },
  userMessage: {
    backgroundColor: '#3B82F6', // Blue for user messages
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    backgroundColor: '#E5E7EB', // Light gray for AI messages
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  userMessageText: {
    fontSize: 16,
    color: '#FFFFFF', // White text for user messages
  },
  aiMessageText: {
    fontSize: 16,
    color: '#1F2937', // Dark gray text for AI messages
  },
  suggestionsOuterContainer: {
    height: 50, // Fixed height for the suggestions scroll area
    marginBottom: 10,
  },
  suggestionsScrollContainer: {
    paddingVertical: 5,
    alignItems: 'center', // Vertically center bubbles if they have different heights
  },
  suggestionBubble: {
    backgroundColor: '#F3F4F6', // Light gray, similar to close button
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151', // Darker gray for suggestion text
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // Light gray border
    paddingVertical: 10,
    paddingHorizontal: 5, // Reduced horizontal padding for the container
    backgroundColor: '#F9FAFB', // Slightly off-white background for input area
  },
  textInput: {
    flex: 1,
    minHeight: 44, // Good tap target size
    maxHeight: 120, // Limit multiline input height
    borderColor: '#D1D5DB', // Medium gray border
    borderWidth: 1,
    borderRadius: 22, // Rounded input field
    paddingHorizontal: 16,
    paddingVertical: 10, // Vertical padding for multiline
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#1F2937',
  },
  sendButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    backgroundColor: '#3B82F6', // Blue, matching user message bubble
    borderRadius: 22, // Circular button
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF', // Gray out when disabled
  },
  iconText: { // For placeholder icons
    fontSize: 20,
    color: '#FFFFFF', // White for send button
  },
});
