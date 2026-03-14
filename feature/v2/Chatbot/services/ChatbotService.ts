import { Message, SendMessageRequest, SendMessageResponse } from '../interfaces/ChatbotInterfaces';

const MOCK_RESPONSES = [
  'That\'s an interesting question! Let me think about that for a moment.',
  'I understand what you\'re asking. Here\'s what I can tell you about that topic.',
  'Great question! Based on my knowledge, I can provide some insights.',
  'I\'d be happy to help with that. Let me break it down for you.',
  'That\'s a fascinating topic! Here\'s my perspective on it.',
];

const getMockResponse = (userMessage: string): string => {
  const baseResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  return `${baseResponse}\n\nYou asked about: "${userMessage}"\n\nThis is a simulated response for demonstration purposes. In a production environment, this would be connected to an AI API like OpenAI, Claude, or your custom backend.`;
};

export const sendMessage = async (
  request: SendMessageRequest
): Promise<SendMessageResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

  const message: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    role: 'assistant',
    content: getMockResponse(request.content),
    timestamp: new Date(),
  };

  return {
    message,
    sessionId: request.sessionId || `session_${Date.now()}`,
  };
};

export const generateId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
