import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/feature/v2/Chatbot/interfaces/ChatbotInterfaces';
import { getCustomerServicePrompt } from '@/feature/v2/Chatbot/prompts/CustomerServiceAgent';

const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/chat/completions';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  content: string;
  conversationHistory: Message[];
}

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'DEEPSEEK_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const { content, conversationHistory = [] }: RequestBody = await request.json();

    const systemPrompt = getCustomerServicePrompt();

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg): DeepSeekMessage => ({
        role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
        content: msg.content,
      })),
      { role: 'user', content },
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages,
              temperature: 0.7,
              max_tokens: 1000,
              stream: true,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body');
          }

          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += new TextDecoder().decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch {
                  // Ignore parse errors for incomplete chunks
                }
              }
            }
          }

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
}