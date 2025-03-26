"use client";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageContainer, { Avatar } from "./MessageContainer";
import { SuggestionsBar } from "./SuggestionsBar";

interface Props {
  onClose: () => void;
}

export interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface SuggestionItem {
  id: string;
  text: string;
}

// Add this inside your ChatBox component (before the return statement)
const defaultSuggestions: SuggestionItem[] = [
  { id: "1", text: "What can you do?" },
  { id: "2", text: "Tell me about yourself" },
  { id: "3", text: "How does this work?" },
  { id: "4", text: "Show me some examples" },
  { id: "5", text: "What's new?" },
];

export default function ChatBox({ onClose }: Props) {
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I help you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (message: string) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        text: message,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    // Simulate bot response after delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Thanks for your message!",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1000);
  };

  const handleSuggestionClick = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-0 right-0 w-full max-w-md h-[80vh] z-10"
    >
      <div className="relative h-full bg-slate-800/90 backdrop-blur-xl rounded-t-xl shadow-2xl border border-slate-700/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar isUser={false} />
              <h2 className="text-white font-semibold">AI Chatbot</h2>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <MessageContainer data={messages} messagesEndRef={messagesEndRef} />

        <SuggestionsBar
          suggestions={defaultSuggestions}
          onSuggestionClick={handleSuggestionClick}
        />
        {/* Input Component */}
        <ChatInput onSubmit={handleSendMessage} />
      </div>
    </motion.div>
  );
}
