import { Message } from '../interfaces/ChatbotInterfaces';

export const createUserMessage = (content: string): Message => ({
  id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  role: 'user',
  content,
  timestamp: new Date(),
});

export const createAssistantMessage = (content: string, isStreaming = false): Message => ({
  id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  role: 'assistant',
  content,
  timestamp: new Date(),
  isStreaming,
});

export const formatMessageTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

export const truncateMessage = (content: string, maxLength: number = 50): string => {
  if (content.length <= maxLength) return content;
  return `${content.substring(0, maxLength)}...`;
};
