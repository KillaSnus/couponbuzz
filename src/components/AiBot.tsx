import React, { useState, useRef, useEffect } from 'react';
import { AppDatabase } from '../data/types';
import { MessageSquare, X, Send, Bot, User, Sparkles, Tag, ArrowRight } from 'lucide-react';

interface AiBotProps {
  db: AppDatabase;
  navigate: (path: string) => void;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
  storeLink?: { name: string; url: string };
}

export const AiBot: React.FC<AiBotProps> = ({ db, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botConfig = db.settings.bot;

  // Initialize bot greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: botConfig.greeting || 'Hi! I am Buzz, your CouponBuz assistant. How can I help you save today?'
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!botConfig?.enabled) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    // Add user message
    const userMsg: Message = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Answer bot query
    setTimeout(() => {
      const qLower = query.toLowerCase();

      // Check store matches
      const matchedStore = db.stores.find(s => 
        qLower.includes(s.name.toLowerCase()) || 
        qLower.includes(s.domain.toLowerCase()) || 
        qLower.includes(s.slug)
      );

      if (matchedStore) {
        const storeOffers = db.coupons.filter(c => c.storeSlug === matchedStore.slug);
        const codeOffer = storeOffers.find(c => c.type === 'code' && c.code);

        let reply = `Yes! We currently have ${storeOffers.length} active offer(s) for ${matchedStore.name}.`;
        if (codeOffer) {
          reply += ` Top promo code: "${codeOffer.code}" (${codeOffer.discount}).`;
        }

        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: reply,
            storeLink: { name: `View ${matchedStore.name} coupons`, url: `/coupons/${matchedStore.slug}` }
          }
        ]);
        return;
      }

      // Check FAQ matches
      let bestFaq = null;
      let highestScore = 0;

      for (const faq of botConfig.faqs || []) {
        const keywords = (faq.q + ' ' + (faq.k || '')).toLowerCase().split(/\W+/).filter(w => w.length > 2);
        let score = 0;
        for (const kw of keywords) {
          if (qLower.includes(kw)) score++;
        }
        if (score > highestScore) {
          highestScore = score;
          bestFaq = faq;
        }
      }

      if (bestFaq && highestScore >= 1) {
        setMessages(prev => [...prev, { sender: 'bot', text: bestFaq.a }]);
        return;
      }

      // Fallback
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `I'm not completely certain about that. You can browse all stores A–Z or contact our team at ${botConfig.contactEmail || 'hello@couponbuz.com'}.`,
          storeLink: { name: 'Browse all stores', url: '/stores/' }
        }
      ]);
    }, 450);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundColor: botConfig.color || '#4f46e5' }}
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-[350px] sm:w-[390px] h-[520px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div 
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: botConfig.color || '#4f46e5' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{botConfig.name || 'Buzz Assistant'}</h4>
                <span className="text-[11px] text-white/80">CouponBuz Instant Help</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.storeLink && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate(m.storeLink!.url);
                      }}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {m.storeLink.name} →
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Quick replies */}
            {messages.length === 1 && botConfig.quickReplies && (
              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Suggested Questions:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {botConfig.quickReplies.map((qr, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(qr)}
                      className="text-xs bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer transition-colors shadow-xs"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about a store or promo code..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-100 text-slate-900 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white focus:outline-hidden"
            />
            <button
              type="submit"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
