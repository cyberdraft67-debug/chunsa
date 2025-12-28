
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMangoAssistantResponse } from '../services/geminiService';
import { Message } from '../types';

const RECIPE_SUGGESTIONS = [
  { label: '🍹 Smoothies', query: 'Give me a refreshing Chaunsa mango smoothie recipe' },
  { label: '🥗 Salads', query: 'Show me a summer salad using Chaunsa mangoes' },
  { label: '🍰 Desserts', query: 'What is a classic dessert I can make with Chaunsa mangoes?' },
  { label: '🍛 Main Course', query: 'Are there any savory main course dishes that use Chaunsa mangoes?' },
];

const AIChef: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Royal Greetings! I'm your Chaunsa Expert. From honey-sweet recipes to the history of these golden wonders, how can I inspire your palate today?" }
  ]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = { role: 'user' as const, content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSearchQuery('');
    setIsTyping(true);

    const aiResponse = await getMangoAssistantResponse(textToSend);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsTyping(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSend(`Find me a Chaunsa mango recipe involving: ${searchQuery}`);
    }
  };

  return (
    <section id="ai-chef" className="py-32 bg-[#fffdf7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">The Royal <span className="text-amber-500">Concierge</span></h2>
          <p className="text-gray-500 text-lg font-medium">Unlock the culinary secrets of the King of Mangoes with our AI expert.</p>
        </motion.div>

        <div className="mb-12 space-y-6">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: mint, chicken, or yogurt..."
              className="w-full pl-14 pr-32 py-5 rounded-[2rem] border border-amber-100 shadow-[0_10px_40px_rgba(251,191,36,0.1)] focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none text-lg transition-all text-gray-900 placeholder:text-gray-400 font-medium"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-amber-600 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-amber-700 transition-all active:scale-95 shadow-lg"
            >
              Consult
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-3">
            {RECIPE_SUGGESTIONS.map((suggestion, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSend(suggestion.query)}
                className="px-6 py-2.5 bg-white border border-amber-100 rounded-full text-xs font-black uppercase tracking-widest text-amber-800 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm active:scale-95"
              >
                {suggestion.label}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.05)] overflow-hidden border border-amber-100 flex flex-col h-[600px]"
        >
          <div className="p-6 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">C</div>
              <div>
                <h4 className="font-black text-gray-900 text-sm tracking-widest uppercase">Expert Advisor</h4>
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active Concierge
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-200"></div>
              <div className="w-2 h-2 rounded-full bg-amber-300"></div>
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-white">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-amber-600 text-white rounded-br-none font-medium' 
                      : 'bg-amber-50/50 text-gray-800 rounded-bl-none border border-amber-100/50 leading-relaxed text-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-amber-50/50 p-5 rounded-[2rem] rounded-bl-none border border-amber-100/50 flex items-center space-x-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-6 border-t border-amber-50 bg-white">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message the concierge..."
                className="flex-1 px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-bold text-gray-900 placeholder:text-gray-400"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim()}
                className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-30 active:scale-95 shadow-lg flex items-center gap-3"
              >
                <span>Send</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIChef;
