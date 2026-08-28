import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, PhoneCall, HelpCircle, CheckCircle2 } from 'lucide-react';

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: '👋 আসসালামু আলাইকুম! Course Kori সাপোর্ট এ আপনাকে স্বাগতম। কীভাবে সাহায্য করতে পারি?' }
  ]);
  const [inputText, setInputText] = useState('');

  const quickQuestions = [
    'কিভাবে ফ্রিতে কোর্স শুরু করবো?',
    'কোর্স শেষে কি সার্টিফিকেট পাবো?',
    'মেন্টরের সাথে সরাসরি কথা বলা যাবে?'
  ];

  const handleSend = (textToSend?: string) => {
    const msg = textToSend || inputText;
    if (!msg.trim()) return;

    // Add user message
    setChatMessages((prev) => [...prev, { sender: 'user', text: msg }]);
    if (!textToSend) setInputText('');

    // Simulate bot response
    setTimeout(() => {
      let reply = 'ধন্যবাদ আপনার মেসেজের জন্য! আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে। জরুরী প্রয়োজনে কল করুন: +880 1712-949410';
      if (msg.includes('ফ্রি')) {
        reply = 'আমাদের ওয়েবসাইট থেকে যেসকল কোর্সে FREE ব্যাজ রয়েছে সেগুলো এখনই কোনো ফি ছাড়াই শুরু করতে পারবেন।';
      } else if (msg.includes('সার্টিফিকেট')) {
        reply = 'হ্যাঁ! ১০০% ভিডিও দেখা ও প্রজেক্ট জমা দেওয়ার পর ভেরিফাইড ই-সার্টিফিকেট পেয়ে যাবেন।';
      } else if (msg.includes('মেন্টর')) {
        reply = 'আমাদের প্রাইভেট সাপোর্ট গ্রুপে হাসিবুল ইসলাম স্যার সহ অন্যান্য মেন্টররা সরাসরি গাইড করেন।';
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Floating Popup Box */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#0F2B5A] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Mentor Hasibul"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 ring-2 ring-[#0F2B5A] rounded-full" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1">
                  <span>Course Kori Advisor</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                </h4>
                <p className="text-[10px] text-emerald-300 font-semibold">Online • Reply within minutes</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {chatMessages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-brand-500 text-white font-medium rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick FAQ Chips */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto custom-scrollbar">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-full whitespace-nowrap shrink-0 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              placeholder="প্রশ্নটি লিখুন..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-slate-800"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white flex items-center justify-center shadow-2xl shadow-brand-500/50 hover:scale-110 transition-all duration-300 group"
      >
        <MessageCircle className="w-7 h-7 stroke-[2.2]" />
        
        {/* Unread Alert Ping */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-black text-white items-center justify-center">1</span>
          </span>
        )}
      </button>

    </div>
  );
};
