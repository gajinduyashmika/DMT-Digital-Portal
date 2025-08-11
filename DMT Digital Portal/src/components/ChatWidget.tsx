import React, { useState } from 'react';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';
import { useStore } from '../store/useStore';

const translations = {
  en: {
    title: 'Chat Support',
    placeholder: 'Type your message...',
    welcome: 'Hi, How can we help you today?',
    staff: 'Chat with DMT Staff',
    bot: 'Chat with AI Bot',
  },
  si: {
    title: 'කතා සහාය',
    placeholder: 'ඔබේ පණිවිඩය ටයිප් කරන්න...',
    welcome: 'ඔබට අද අපට උදව් කළ හැක්කේ කෙසේද?',
    staff: 'DMT කාර්ය මණ්ඩලය සමඟ කතා කරන්න',
    bot: 'AI බොට් සමඟ කතා කරන්න',
  },
  ta: {
    title: 'அரட்டை ஆதரவு',
    placeholder: 'உங்கள் செய்தியை தட்டச்சு செய்யவும்...',
    welcome: 'இன்று நாங்கள் எப்படி உதவ முடியும்?',
    staff: 'DMT ஊழியர்களுடன் அரட்டை',
    bot: 'AI போட்டுடன் அரட்டை',
  },
};

export const ChatWidget = () => {
  const { isChatOpen, setChatOpen, language, isDarkMode } = useStore();
  const [selectedMode, setSelectedMode] = useState<'staff' | 'bot' | null>(null);

  if (!isChatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-red-700"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-80 rounded-lg shadow-xl ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">{translations[language].title}</h3>
        <button
          onClick={() => setChatOpen(false)}
          className="rounded-lg p-1 opacity-70 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="h-96 overflow-y-auto p-4">
        {!selectedMode ? (
          <div className="space-y-4">
            <p className="text-center text-sm">{translations[language].welcome}</p>
            <button
              onClick={() => setSelectedMode('staff')}
              className="flex w-full items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50"
            >
              <User className="text-red-600" />
              <span>{translations[language].staff}</span>
            </button>
            <button
              onClick={() => setSelectedMode('bot')}
              className="flex w-full items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50"
            >
              <Bot className="text-red-600" />
              <span>{translations[language].bot}</span>
            </button>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex-1">
              {/* Chat messages will go here */}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder={translations[language].placeholder}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isDarkMode
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-gray-200 bg-white'
                }`}
              />
              <button className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700">
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};