'use client';

import React, { useState, useCallback } from 'react';
import { Message, ChatState } from './interfaces/ChatbotInterfaces';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatInput } from './components/ChatInput';
import { ChatSuggestions } from './components/ChatSuggestions';
import { createUserMessage, createAssistantMessage } from './adapters/MessageAdapter';
import { sendMessage } from './services/ChatbotService';

export default function Chatbot() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    inputValue: '',
    isLoading: false,
    error: null,
  });

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage = createUserMessage(content);

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await sendMessage({ content });

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, response.message],
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to send message',
      }));
    }
  }, []);

  const handleNewChat = useCallback(() => {
    setState({
      messages: [],
      inputValue: '',
      isLoading: false,
      error: null,
    });
  }, []);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSendMessage(suggestion);
    },
    [handleSendMessage]
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <ChatHeader onNewChat={handleNewChat} />
      <ChatMessageList messages={state.messages} isLoading={state.isLoading} />
      <ChatSuggestions
        onSuggestionClick={handleSuggestionClick}
        hasMessages={state.messages.length > 0}
      />
      <ChatInput onSendMessage={handleSendMessage} isLoading={state.isLoading} />
    </div>
  );
}
