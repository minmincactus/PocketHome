import React, { useState, useRef } from 'react';
import { View, TextInput, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import { Sunshiney_400Regular } from '@expo-google-fonts/sunshiney';

const ProfileScreen = () => {
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  const apiKey = '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'; // Your Hugging Face API key

  const [fontsLoaded] = useFonts({
    Sunshiney_400Regular,
  });

  const handleChat = async () => {
    if (inputText.trim() === '') return;
  
    setIsLoading(true);
  
    // Add user message to the conversation
    setConversation((prevConversation) => [
      ...prevConversation,
      { sender: 'user', message: inputText },
    ]);
  
    // Custom hardcoded responses for specific inputs
    if (inputText.toLowerCase() === 'hi') {
      const botResponse = "Hi, how can I help you organize today?";
      setConversation((prevConversation) => [
        ...prevConversation,
        { sender: 'bot', message: botResponse },
      ]);
    } else if (inputText.toLowerCase().includes('when should i buy toilet paper')) {
      // Custom response for toilet paper
      const botResponse = "In about two weeks, your 2 rolls will run out!";
      setConversation((prevConversation) => [
        ...prevConversation,
        { sender: 'bot', message: botResponse },
      ]);
    } else if (inputText.toLowerCase().includes('how much toilet paper do i have')) {
      // Respond with a hypothetical toilet paper count
      const botResponse = "You currently have 2 rolls of toilet paper left.";
      setConversation((prevConversation) => [
        ...prevConversation,
        { sender: 'bot', message: botResponse },
      ]);
    } else if (inputText.toLowerCase().includes('how many rolls per week')) {
      // Custom logic to estimate usage
      const botResponse = "You typically use 1 roll per week.";
      setConversation((prevConversation) => [
        ...prevConversation,
        { sender: 'bot', message: botResponse },
      ]);
    } else {
      // Default API response for any other message
      try {
        const result = await axios.post(
          'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
          {
            inputs: inputText,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        // Handle success
        const botResponse =
          result.data && Array.isArray(result.data) && result.data.length > 0
            ? result.data[0].generated_text
            : 'No response from the model';
  
        // Add bot response to the conversation
        setConversation((prevConversation) => [
          ...prevConversation,
          { sender: 'bot', message: botResponse },
        ]);
      } catch (error) {
        console.error('Error:', error);
        setConversation((prevConversation) => [
          ...prevConversation,
          { sender: 'bot', message: 'Error fetching response from the API' },
        ]);
      }
    }
  
    setIsLoading(false);
    setInputText(''); // Clear input field
  };
  
  

  const renderTypingDots = () => (
    <View style={styles.typingContainer}>
      <Text style={styles.typingDot}>•</Text>
      <Text style={styles.typingDot}>•</Text>
      <Text style={styles.typingDot}>•</Text>
    </View>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={require('../assets/plaid.png')} style={styles.backgroundImage}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -120 : -120} // Slightly higher offset for better balance
      >
        <ScrollView
          style={styles.conversationContainer}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {conversation.map((chat, index) => (
            <View
              key={index}
              style={[
                styles.chatBubble,
                chat.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={[styles.chatText, { fontFamily: 'Sunshiney_400Regular' }]}>{chat.message}</Text>
            </View>
          ))}
          {isLoading && renderTypingDots()}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.disabledButton]}
            onPress={handleChat}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>{isLoading ? 'Send' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginBottom: 0,
  },
  conversationContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 0, // Adjust this based on the input field's bottom padding when inactive
  },
  chatBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: 'rgba(247, 255, 224, 0.5)',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderRadius: 30,
    padding: 10,
    marginVertical: 5,
  },
  botBubble: {
    backgroundColor: 'rgba(213, 194, 255, 0.5)',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderRadius: 30,
  },
  chatText: {
    fontSize: 18,
    color: '#616161',
    fontFamily: 'Sunshiney_400Regular',
  },
  typingContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingVertical: 5,
    backgroundColor: '#eeffd9',
    borderRadius: 30,
    fontColor: '#eeffd9',
  },
  typingDot: {
    fontSize: 20,
    backgroundColor: 'rgba(213, 194, 255, 0.5)',
    marginHorizontal: 2,
    color: '#808080',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(182, 255, 133, 0.1)',
    marginBottom: Platform.OS === 'android' ? 0 : 0, // Adjusted padding for Android and iOS
    paddingHorizontal: 15, // Padding for space on the sides
    marginBottom: 120, // Increased to ensure the input doesn't go too high
  },
  input: {
    flex: 1,
    borderRadius: 50,
    padding: 10,
    marginRight: 10,
    fontFamily: 'Sunshiney_400Regular',
    backgroundColor: '#f4f4f4',
    fontSize: 18,
    fontColor: '#eeffd9', 
  },
  sendButton: {
    backgroundColor: 'rgba(232, 199, 255, 0.5)',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Sunshiney_400Regular',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default ProfileScreen;
