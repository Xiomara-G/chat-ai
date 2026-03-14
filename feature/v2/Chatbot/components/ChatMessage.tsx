'use client';

import React, { memo } from 'react';
import { Message } from '../interfaces/ChatbotInterfaces';
import { formatMessageTime } from '../adapters/MessageAdapter';
import { ChatbotLocalization } from '../localization/Core/ChatbotLocalization';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <article
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
      aria-label={`${isUser ? 'Your' : 'Assistant'} message`}
    >
      <div
        className={`flex max-w-[85%] items-start gap-3 sm:max-w-[75%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {isUser ? 'U' : 'AI'}
        </div>
        <div
          className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
        >
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
            }`}
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </p>
            {message.isStreaming && (
              <span className="ml-1 inline-block animate-pulse">▊</span>
            )}
          </div>
          <time
            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
            dateTime={message.timestamp.toISOString()}
          >
            {formatMessageTime(message.timestamp)}
          </time>
        </div>
      </div>
    </article>
  );
});
