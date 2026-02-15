"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { aiService } from "@/lib/aiService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when dialog opens
      const welcomeMessage: Message = {
        id: "welcome",
        text: "Hello! I'm your AI assistant for EcoMetrics. How can I help you with your carbon footprint tracking today?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Call AI API
    setIsTyping(true);
    try {
      const result = await aiService.generate({
        model: "llama3.2",
        prompt: `You are an AI assistant for EcoMetrics, a carbon footprint tracking application. 
        
User question: ${inputValue}

Please provide a helpful, concise response about:
- Carbon emissions tracking
- Sustainability metrics
- Environmental compliance
- Emission calculations

If the question is not related to environmental topics, politely redirect to relevant topics.`,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("AI API error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'm having trouble connecting to the AI server. This may be due to CORS restrictions or network issues. Please ensure the Ollama server at 13.48.35.34:11434 is running and has CORS enabled.\n\nError: ${error.message || "Unknown error"}`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Open AI Chat Assistant"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md h-[500px] flex flex-col bg-white rounded-2xl shadow-2xl border-0">
          <DialogHeader className="border-b border-gray-100 pb-3">
            <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              AI Assistant
            </DialogTitle>
          </DialogHeader>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-bl-md rounded-tr-md rounded-br-md p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about carbon emissions..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-full transition-colors duration-200 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
