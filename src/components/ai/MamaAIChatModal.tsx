import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, AlertCircle, Bot, User, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aiService, SUGGESTED_QUESTIONS, GENERAL_MEDICAL_DISCLAIMER } from '../../services/aiService';
import { AIMessage } from '../../types';
import { formatTimeOnly } from '../../utils/formatters';

export const MamaAIChatModal: React.FC = () => {
  const { isMamaAIOpen, closeMamaAI } = useApp();

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content:
        "Hi Mom ❤️\n\nI'm Mama AI, your gentle pediatric companion. How can I support you and your little one today?\n\nFeel free to ask about feeding, sleep routines, milestones, or questions for your next doctor's visit.",
      timestamp: new Date().toISOString(),
      disclaimer: GENERAL_MEDICAL_DISCLAIMER,
      suggestedFollowUps: SUGGESTED_QUESTIONS.slice(0, 3),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isMamaAIOpen) {
      scrollToBottom();
    }
  }, [messages, isMamaAIOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg: AIMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const assistantReply = await aiService.sendMessage(query, messages);
      setMessages((prev) => [...prev, assistantReply]);
    } catch (err) {
      console.error('Mama AI error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'assistant',
          content:
            "I'm experiencing a momentary connection pause. Remember, you can always check your doctor's office or our Learn section for guidance.",
          timestamp: new Date().toISOString(),
          disclaimer: GENERAL_MEDICAL_DISCLAIMER,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isMamaAIOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMamaAI}
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="relative w-full max-w-md h-[90vh] max-h-[720px] bg-[#FAF7F5] rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden mx-3"
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-white border-b border-stone-200/80 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-stone-900 font-display">Mama AI</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                    Companion
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">Gentle educational guidance</p>
              </div>
            </div>

            <button
              onClick={closeMamaAI}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close Mama AI"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Medical Disclaimer Alert Banner */}
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-[11px] text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mama AI provides general education only. Always consult your pediatrician for medical advice.</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 text-xs font-bold ${
                      isUser
                        ? 'bg-stone-800 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1.5 ${
                      isUser
                        ? 'bg-stone-900 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white border border-stone-200/80 text-stone-800 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.content}</div>

                    {m.disclaimer && (
                      <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-400 italic">
                        {m.disclaimer}
                      </div>
                    )}

                    <div
                      className={`text-[10px] font-medium text-right ${
                        isUser ? 'text-stone-400' : 'text-stone-400'
                      }`}
                    >
                      {formatTimeOnly(m.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-stone-400 text-xs pl-9">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-stone-500 ml-1">Mama AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions Pills */}
          <div className="px-4 py-2 border-t border-stone-200/60 bg-white/70">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
              Suggested Questions
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-stone-200 rounded-full text-[11px] text-stone-700 font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <span>{q}</span>
                  <ArrowRight className="w-3 h-3 text-stone-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-stone-200/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Mama AI anything about baby care..."
              className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition-all cursor-pointer"
              aria-label="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
