'use client';

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../interfaces/ChatbotInterfaces';
import { formatMessageTime } from '../adapters/MessageAdapter';

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
            {isUser ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </p>
            ) : (
              <div className="markdown-content text-sm leading-relaxed">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2">{children}</p>,
                    ul: ({ children }) => <ul className="mb-2 list-disc pl-4">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 list-decimal pl-4">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    h1: ({ children }) => <h1 className="mb-2 text-xl font-bold">{children}</h1>,
                    h2: ({ children }) => <h2 className="mb-2 text-lg font-bold">{children}</h2>,
                    h3: ({ children }) => <h3 className="mb-1 font-semibold">{children}</h3>,
                    hr: () => <hr className="my-3 border-gray-300" />,
                    code: ({ children }) => <code className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-700">{children}</code>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
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
