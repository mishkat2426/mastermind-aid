import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { playUiClickSound } from './SoundEffects';

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'আসসালামু আলাইকুম! Mastermind Aid কাস্টমার সাপোর্ট থেকে আপনাকে স্বাগতম। আপনার কি ধরনের প্রশ্ন বা কোর্স সাহায্য প্রয়োজন?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const quickQuestions = [
    'কিভাবে ফ্রিতে কোর্স শুরু করবো?',
    'পেমেন্ট অপশন কি কি আছে?',
    'কোর্স শেষে সার্টিফিকেট কিভাবে পাবো?'
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;
    playUiClickSound();

    const newMsgs = [...messages, { sender: 'user', text: userText }];
    setMessages(newMsgs);
    setInputMsg('');

    // Automated smart reply simulation
    setTimeout(() => {
      let botReply = 'ধন্যবাদ আপনার মেসেজের জন্য! আমাদের প্রতিনিধি খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন। অথবা সরাসরি +880 1712-949410 নম্বরে কল করুন।';
      if (userText.includes('ফ্রি') || userText.includes('ফ্রিতে')) {
        botReply = 'Mastermind Aid প্ল্যাটফর্মে ওয়ার্ডপ্রেস প্লাগইন ডেভেলপমেন্ট, ফাইভার ফ্রিল্যান্সিং এবং রেসপন্সিভ ওয়েব ডিজাইন সম্পূর্ণ ফ্রিতে পাচ্ছেন! যেকোনো ফ্রি কোর্সে ক্লিক করে সাথে সাথে দেখা শুরু করুন।';
      } else if (userText.includes('পেমেন্ট') || userText.includes('টাকা')) {
        botReply = 'আমাদের প্ল্যাটফর্মে বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket) এবং কার্ড পেমেন্টের মাধ্যমে খুব সহজেই ইন্সট্যান্ট কোর্স অ্যাক্টিভেশন করতে পারবেন।';
      } else if (userText.includes('সার্টিফিকেট')) {
        botReply = 'কোর্সের ভিডিও ১০০% সম্পন্ন করে কুইজ এবং প্রজেক্ট জমা দিলে আপনার ড্যাশবোর্ডে ভেরিফাইড ই-সার্টিফিকেট অটোমেটিক জেনারেট হয়ে যাবে।';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Trigger Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playUiClickSound();
          setIsOpen(!isOpen);
        }}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-2xl flex items-center justify-center ring-4 ring-brand-200 transition-all duration-300 relative group"
        title="Live Support Advisor"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white animate-ping" />
        )}
      </motion.button>

      {/* Live Support Popup Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="absolute bottom-18 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[480px]"
          >
            {/* Header */}
            <div className="bg-[#0A192F] text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Instructor Mentor"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-400"
                  />
                  <span className="w-3 h-3 bg-emerald-500 rounded-full absolute bottom-0 right-0 ring-2 ring-[#0A192F]" />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold flex items-center gap-1">
                    <span>Hasibul Islam</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                  </h4>
                  <p className="text-[10px] text-slate-300 font-semibold">
                    Mastermind Aid Support Advisor
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed font-medium shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-brand-500 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions Chips */}
            <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1 bg-white hover:bg-brand-50 text-brand-700 font-extrabold text-[11px] rounded-full border border-slate-200 shadow-2xs transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputMsg);
              }}
              className="p-3 bg-white border-t border-slate-200 flex gap-2"
            >
              <input
                type="text"
                placeholder="Type your message in Bangla/English..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="w-9 h-9 bg-brand-500 hover:bg-brand-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
