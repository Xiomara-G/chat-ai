/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Message, ChatState } from './interfaces/ChatbotInterfaces';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatInput } from './components/ChatInput';
import { ChatSuggestions } from './components/ChatSuggestions';
import { createUserMessage, createAssistantMessage } from './adapters/MessageAdapter';
import { sendMessage } from './services/ChatbotService';
import { ThemeToggle } from './components/ThemeToggle';

const INITIAL_GREETING = "¡Hola! Soy Lucky, tu asistente de soporte. Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?";
const STORAGE_KEY = 'chat_messages';

export default function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<ChatState>({
    messages: [],
    inputValue: '',
    isLoading: false,
    error: null,
  });
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    const storedSuggestions = localStorage.getItem('show_suggestions');
    if (storedSuggestions !== null) {
      setShowSuggestions(storedSuggestions === 'true');
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setState((prev) => ({
            ...prev,
            messages: parsed.map((msg: Message) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }));
          return;
        }
      } catch {
        // Ignore parse errors
      }
    }
    setState((prev) => ({
      ...prev,
      messages: [createAssistantMessage(INITIAL_GREETING)],
    }));
  }, []);

  useEffect(() => {
    if (mounted && state.messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.messages));
    }
  }, [state.messages, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('show_suggestions', String(showSuggestions));
    }
  }, [showSuggestions, mounted]);

  const handleSendMessage = useCallback(async (content: string) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return;
    }

    const userMessage = createUserMessage(trimmedContent);
    const streamingMessage = createAssistantMessage('', true);
    const conversationHistory = state.messages.filter((message) => !message.isStreaming);

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage, streamingMessage],
      isLoading: true,
      error: null,
    }));

    try {
      await sendMessage(
        {
          content: trimmedContent,
          conversationHistory,
        },
        (chunk) => {
          setState((prev) => ({
            ...prev,
            messages: prev.messages.map((msg, idx) =>
              idx === prev.messages.length - 1
                ? { ...msg, content: chunk }
                : msg
            ),
          }));
        }
      );

      setState((prev) => ({
        ...prev,
        isLoading: false,
        messages: prev.messages.map((msg, idx) =>
          idx === prev.messages.length - 1
            ? { ...msg, isStreaming: false }
            : msg
        ),
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        messages: prev.messages.map((msg, idx) =>
          idx === prev.messages.length - 1
            ? { ...msg, isStreaming: false, content: 'Lo siento, estoy teniendo problemas técnicos en este momento. Por favor, intenta nuevamente en unos momentos o contacta a soporte directamente.' }
            : msg
        ),
        error: 'Failed to send message',
      }));
    }
  }, [state.messages]);

  const handleNewChat = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('show_suggestions');
    setState({
      messages: [createAssistantMessage(INITIAL_GREETING)],
      inputValue: '',
      isLoading: false,
      error: null,
    });
    setShowSuggestions(true);
  }, []);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setShowSuggestions(false);
      handleSendMessage(suggestion);
    },
    [handleSendMessage]
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative flex h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <ChatHeader onNewChat={handleNewChat} />
      <ChatMessageList messages={state.messages} isLoading={state.isLoading} />
      <ChatSuggestions
        onSuggestionClick={handleSuggestionClick}
        hasMessages={!showSuggestions}
      />
      <ChatInput onSendMessage={handleSendMessage} isLoading={state.isLoading} />
      <div className="absolute bottom-4 right-4 z-10">
        <ThemeToggle />
      </div>
    </div>
  );
}