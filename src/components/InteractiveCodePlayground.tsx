import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Play, RefreshCw, Sparkles, X, Terminal, CheckCircle2 } from 'lucide-react';
import { AIOrb } from './AIOrb';

interface InteractiveCodePlaygroundProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveCodePlayground: React.FC<InteractiveCodePlaygroundProps> = ({
  isOpen,
  onClose,
}) => {
  const defaultCode = `<div style="background: linear-gradient(135deg, #0D5FF9, #0F2B5A); padding: 30px; border-radius: 20px; text-align: center; color: white; font-family: sans-serif;">
  <h1 style="font-size: 26px; margin-bottom: 10px;">🚀 Welcome to Mastermind Aid Live Sandbox!</h1>
  <p style="font-size: 14px; opacity: 0.9;">Edit this HTML code and click "Run Code" to see live results instantly!</p>
  <button style="background: #10B981; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: bold; margin-top: 15px; cursor: pointer;">
    Enroll Free Today ✓
  </button>
</div>`;

  const [code, setCode] = useState(defaultCode);
  const [outputCode, setOutputCode] = useState(defaultCode);
  const [isRunning, setIsRunning] = useState(false);
  const [statusLabel, setStatusLabel] = useState('');

  if (!isOpen) return null;

  const handleRun = () => {
    setIsRunning(true);
    setStatusLabel('MasterMind is compiling code...');

    setTimeout(() => {
      setStatusLabel('Analyzing HTML structure & CSS...');
    }, 300);

    setTimeout(() => {
      setOutputCode(code);
      setIsRunning(false);
      setStatusLabel('');
    }, 700);
  };

  const handleReset = () => {
    setCode(defaultCode);
    setOutputCode(defaultCode);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="bg-[#0A192F] text-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-slate-700/80 relative flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-lg">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-brand-400 font-extrabold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> World-Class Interactive Sandbox
                </div>
                <h3 className="text-xl font-black">Live Code Editor & Web Sandbox</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Code Editor & Output Split View */}
          <div className="flex-1 overflow-y-auto grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 bg-[#071325]">
            {/* Left: Code Input Editor */}
            <div className="p-6 flex flex-col space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-brand-400">
                  <Terminal className="w-4 h-4 text-brand-400" />
                  <span>index.html (HTML/CSS)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Reset default code"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 shadow-md transition"
                  >
                    {isRunning ? (
                      <AIOrb state="thinking" size={16} />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 bg-[#0B1B33] text-emerald-300 p-4 rounded-2xl text-xs font-mono border border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed resize-none"
              />
            </div>

            {/* Right: Live Web Rendered Result */}
            <div className="p-6 flex flex-col space-y-3">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>Live Browser Output Screen</span>
                <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" /> Live Render Engine
                </span>
              </div>

              <div className="w-full h-80 bg-white rounded-2xl p-4 overflow-auto border border-slate-700/80 shadow-inner relative">
                {isRunning ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs font-sans space-y-3">
                    <AIOrb state="generating" size={48} />
                    <p className="font-bold text-slate-700">{statusLabel}</p>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: outputCode }} />
                )}
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="p-4 px-6 bg-[#071325] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>
              Powered by Mastermind Aid Virtual Sandbox • Used in Web Development & WordPress Plugin
              Masterclasses
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition"
            >
              Close Editor
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
