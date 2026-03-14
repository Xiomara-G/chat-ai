import { Message, SendMessageRequest, SendMessageResponse } from '../interfaces/ChatbotInterfaces';

const API_BASE_URL = '/api/chat';

export const sendMessage = async (
request: SendMessageRequest, conversationHistory?: Message[], onChunk?: (content: string) => void): Promise<SendMessageResponse> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: request.content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response');
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            fullContent += parsed.content || '';
            if (onChunk) {
              onChunk(fullContent);
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    }

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content: fullContent,
      timestamp: new Date(),
    };

    return {
      message,
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