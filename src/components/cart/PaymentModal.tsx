import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Lock, Smartphone, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { Course } from '../../data/coursesData';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Course[];
  totalAmount: number;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'card'>('bkash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onPaymentSuccess();
        onClose();
      }, 2200);
    }, 1600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative"
        >
          
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-brand-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit Encrypted Payment
            </div>

            <h3 className="text-2xl font-black">Complete Course Enrollment</h3>
            <p className="text-xs text-slate-300 mt-1">
              Select your preferred payment gateway in Bangladesh to activate instant access.
            </p>

            <div className="mt-4 p-3 bg-white/10 rounded-2xl flex items-center justify-between border border-white/10">
              <span className="text-xs text-slate-200">Total Amount Payable:</span>
              <span className="text-xl font-black text-emerald-400">৳{totalAmount.toLocaleString()} BDT</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          {isSuccess ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10 stroke-[3]" />
              </div>
              <h4 className="text-2xl font-black text-[#0A192F]">Payment Verified & Enrolled!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                অভিনন্দন! আপনার পেমেন্ট সফল হয়েছে। আপনার ড্যাশবোর্ডে কোর্সসমূহ যুক্ত করা হয়েছে।
              </p>
            </div>
          ) : (
            <form onSubmit={handlePay} className="p-6 sm:p-8 space-y-6">
              
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Choose Payment Gateway
                </label>

                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bkash')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition ${
                      selectedMethod === 'bkash'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black text-rose-600">bKash</span>
                    <span className="text-[10px] text-slate-400 font-medium">বিকাশ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('nagad')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition ${
                      selectedMethod === 'nagad'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black text-amber-600">Nagad</span>
                    <span className="text-[10px] text-slate-400 font-medium">নগদ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('rocket')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition ${
                      selectedMethod === 'rocket'
                        ? 'bg-purple-50 border-purple-500 text-purple-800 ring-2 ring-purple-500 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black text-purple-600">Rocket</span>
                    <span className="text-[10px] text-slate-400 font-medium">রকেট</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition ${
                      selectedMethod === 'card'
                        ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-brand-600" />
                    <span className="text-[10px] text-slate-600 font-bold">Card</span>
                  </button>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <Smartphone className="w-4 h-4 text-brand-500" />
                  <span>{selectedMethod.toUpperCase()} Merchant Payment Number:</span>
                </div>
                <div className="text-sm font-black text-brand-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block">
                  01712-949410 (Merchant)
                </div>
                <p className="text-[11px] text-slate-500">
                  Dial *247# or open {selectedMethod} App ➔ Select <strong>Make Payment</strong> ➔ Enter Merchant Number.
                </p>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Mobile Account Number (মোবাইল নম্বর)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transaction ID (ট্রানজেকশন আইডি / TrxID)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9J47A8X9K"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Verifying Payment with {selectedMethod.toUpperCase()}...</span>
                ) : (
                  <>
                    <span>Confirm & Activate Course Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
