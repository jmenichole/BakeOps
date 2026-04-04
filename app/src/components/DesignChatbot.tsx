'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, X, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
  refinedPrompt?: string;
}

interface DesignChatbotProps {
  onPromptReady: (prompt: string) => void;
  onClose: () => void;
}

export function DesignChatbot({ onPromptReady, onClose }: DesignChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasGreeted = useRef(false);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send opening greeting on mount
  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    sendMessage('Hello! I need help designing a cake.');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    // History to send to the API excludes the greeting message (index 0 user msg)
    const history = newMessages.slice(0, -1).map(m => ({
      role: m.role,
      parts: m.parts,
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Chat unavailable');
      }

      const modelMessage: Message = {
        role: 'model',
        parts: [{ text: data.reply }],
        refinedPrompt: data.refinedPrompt,
      };

      setMessages(prev => [...prev, modelMessage]);

      if (data.refinedPrompt) {
        setRefinedPrompt(data.refinedPrompt);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([]);
    setRefinedPrompt(null);
    setError(null);
    // Mark as not greeted so the greeting fires once on next render
    hasGreeted.current = false;
    setTimeout(() => {
      sendMessage('Hello! I need help designing a cake.');
    }, 0);
  };

  const renderMessageText = (text: string) => {
    // Split at the refined prompt marker so we can style it differently
    const parts = text.split(/✨ Here's your refined design prompt:/);
    if (parts.length === 1) return <span>{text}</span>;

    return (
      <>
        <span>{parts[0]}</span>
        <div className="mt-3 p-3 bg-pink-50 border border-pink-200 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-pink-500 mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Refined Design Prompt
          </p>
          <p className="text-xs text-gray-700 leading-relaxed">{parts[1].trim()}</p>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col h-[480px] bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-pink-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-secondary">BakeBot</p>
            <p className="text-[10px] text-gray-400">Design prompt assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
            title="Start over"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Starting conversation...</p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-gray-50 text-gray-700 rounded-bl-sm border border-gray-100'
              }`}
            >
              {renderMessageText(msg.parts[0].text)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-red-500 bg-red-50 border border-red-100 p-2 rounded-lg text-center">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Use Prompt Button (shows once a prompt is generated) */}
      {refinedPrompt && (
        <div className="px-4 pb-2">
          <button
            onClick={() => onPromptReady(refinedPrompt)}
            className="w-full btn btn-primary py-2.5 text-sm flex items-center justify-center gap-2 shadow-md shadow-pink-100"
          >
            <Sparkles className="w-4 h-4" /> Use This Prompt
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your vision..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
