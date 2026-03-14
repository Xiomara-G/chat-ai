'use client';

import React, { memo, useRef, useEffect } from 'react';
import { Message } from '../interfaces/ChatbotInterfaces';
import { ChatMessage } from './ChatMessage';
import { ChatbotLocalization } from '../localization/Core/ChatbotLocalization';

interface ChatMessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatMessageList = memo(function ChatMessageList({
  messages,
  isLoading,
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const hasMessages = messages.length > 0;

  if (!hasMessages) {
    return (
      <section
        className="flex flex-1 flex-col items-center justify-center px-4"
        aria-label="Empty chat state"
      >
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {ChatbotLocalization.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {ChatbotLocalization.subtitle}
          </p>
        </div>
      </section>
    );
  }

  const isStreaming = messages.some((msg) => msg.isStreaming);
  const hasContent = messages.some((msg) => msg.isStreaming && msg.content);

  return (
    <section
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-4"
      aria-label="Chat messages"
      role="log"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {messages
          .filter((msg) => !(msg.isStreaming && !msg.content))
          .map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        {isStreaming && !hasContent && (
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium dark:bg-gray-700">
              AI
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></span>
            </div>
            <span className="text-sm">{ChatbotLocalization.loadingMessage}</span>
          </div>
        )}
      </div>
    </section>
  );
});
