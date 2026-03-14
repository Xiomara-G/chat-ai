import { Message, SendMessageRequest, SendMessageResponse } from '../interfaces/ChatbotInterfaces';
import { getCustomerServicePrompt } from '../prompts/CustomerServiceAgent';

const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.GOOGLE_API_KEY || '';
const API_URL = 'https://api.deepseek.com/chat/completions';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface DeepSeekResponse {
  choices?: Array<{
    message?: {
      role: string;
      content: string;
    };
    finish_reason?: string;
  }>;
  error?: {
    message: string;
    type: string;
    code: string;
  };
}

const convertMessagesToDeepSeekFormat = (messages: Message[]): DeepSeekMessage[] => {
  return messages.map((msg) => ({
    role: msg.role === 'system' ? 'system' : msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content,
  }));
};

const MOCK_RESPONSES = [
  'Entiendo tu consulta. Permíteme ayudarte con eso.',
  'Gracias por contactar a soporte. Aquí está la información que necesitas.',
  'Claro, te explico el proceso paso a paso.',
  'Voy a verificar eso para ti ahora mismo.',
  'No hay problema, eso tiene solución.',
];

const getMockResponse = (userMessage: string): string => {
  const baseResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
  return `${baseResponse}\n\n(Este es un modo de demostración - API de DeepSeek no configurada)`;
};

export const sendMessage = async (
  request: SendMessageRequest,
  conversationHistory: Message[] = []
): Promise<SendMessageResponse> => {
  if (!API_KEY) {
    console.warn('DEEPSEEK_API_KEY not configured, using mock response');

    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

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
  }

  try {
    const systemPrompt = getCustomerServicePrompt();

    const deepSeekMessages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...convertMessagesToDeepSeekFormat(conversationHistory),
      {
        role: 'user',
        content: request.content,
      },
    ];

    const deepSeekRequest: DeepSeekRequest = {
      model: 'deepseek-chat',
      messages: deepSeekMessages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: false,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(deepSeekRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data: DeepSeekResponse = await response.json();

    const assistantContent = data.choices?.[0]?.message?.content ||
      'Lo siento, no pude procesar tu mensaje. Por favor, intenta nuevamente.';

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date(),
    };

    return {
      message,
      sessionId: request.sessionId || `session_${Date.now()}`,
    };
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);

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
