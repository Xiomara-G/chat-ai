'use client';

import React, { memo } from 'react';
import { ChatbotLocalization } from '../localization/Core/ChatbotLocalization';

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  hasMessages: boolean;
}

export const ChatSuggestions = memo(function ChatSuggestions({
  onSuggestionClick,
  hasMessages,
}: ChatSuggestionsProps) {
  if (hasMessages) return null;

  return (
    <section
      className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900"
      aria-label="Preguntas frecuentes"
    >
      <div className="mx-auto max-w-3xl">
        <h3 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Preguntas frecuentes
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ChatbotLocalization.suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-left text-sm text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-600 dark:hover:bg-gray-700"
            >
              <span className="line-clamp-2">{suggestion}</span>
              <svg
                className="ml-2 h-4 w-4 shrink-0 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
});
