import { Message, SendMessageRequest, SendMessageResponse } from '../interfaces/ChatbotInterfaces';

const API_BASE_URL = '/api/chat';

export const sendMessage = async (
  request: SendMessageRequest,
  conversationHistory: Message[] = []
): Promise<SendMessageResponse> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: request.content,
        conversationHistory: conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response');
    }

    const data = await response.json();

    return {
      message: {
        ...data.message,
        timestamp: new Date(data.message.timestamp),
      },
      sessionId: request.sessionId || `session_${Date.now()}`,
    };
  } catch (error) {
    console.error('Error calling chat API:', error);

    const errorMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content: 'Lo siento, estoy teniendo problemas técnicos en este momento. Por favor, intenta nuevamente en unos momentos o contacta a soporte directamente.',
      timestamp: new Date(),
    };

    return {
      message: errorMessage,
      sessionId: request.sessionId || `session_${Date.now()}`,
    };
  }
};

export const generateId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};