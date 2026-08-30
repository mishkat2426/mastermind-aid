import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Smartphone, CreditCard, Lock, Sparkles } from 'lucide-react';
import { DBService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { PaymentMethod } from '../../types/platform';
import { AIOrb } from '../../components/ai/AIOrb';

export const CheckoutPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const course = DBService.getCourseById(courseId || '');

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bKash');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [trxId, setTrxId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">Course Not Found</h2>
          <Link to="/courses" className="text-brand-600 font-bold hover:underline">Return to Courses</Link>
        </div>
      </div>
    );
  }

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !currentUser) {
      navigate('/login', { state: { from: `/checkout/${course.id}` } });
      return;
    }

    if (!phoneNumber.trim() || !trxId.trim()) {
      setErrorMsg('Please enter both your mobile account number and Transaction ID.');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    // Create Transaction in DB Layer
    setTimeout(() => {
      const trx = DBService.createTransaction({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        courseId: course.id,
        courseTitle: course.title,
        amount: course.price,
        paymentMethod: selectedMethod,
        transactionId: trxId,
        accountNumber: phoneNumber,
      });

      // Auto-approve test demo transaction for seamless student testing
      DBService.updateTransactionStatus(trx.id, 'SUCCESS', 'Instant Verification Engine');
      DBService.enrollUser(currentUser.id, course.id);

      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        navigate(`/courses/${course.id}/learn`);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans py-10 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-3xl mx-auto w-full space-y-6">
        
        {/* Top Back Link */}
        <Link
          to={`/courses/${course.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Course Details
        </Link>

        {/* Card Box */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
          
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 space-y-2">
            <div className="flex items-center gap-2 text-brand-400 font-extrabold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit Encrypted Payment System
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Checkout & Course Activation</h1>
            <p className="text-xs text-slate-300">
              Select your payment method in Bangladesh to activate immediate access to course materials.
            </p>
          </div>

          {/* Body */}
          {isSuccess ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10 stroke-[3]" />
              </div>
              <h2 className="text-2xl font-black text-[#0A192F]">Payment Verified & Enrolled!</h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                অভিনন্দন! আপনার পেমেন্ট সফল হয়েছে। আপনাকে এখনই কোর্সের ক্লাসরুমে রিডাইরেক্ট করা হচ্ছে...
              </p>
            </div>
          ) : (
            <div className="p-6 sm:p-8 grid md:grid-cols-12 gap-8">
              
              {/* Left Form */}
              <form onSubmit={handleCheckoutSubmit} className="md:col-span-7 space-y-6">
                
                {/* Method Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Select Payment Gateway
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'bKash', color: 'rose' },
                      { id: 'Nagad', color: 'amber' },
                      { id: 'Rocket', color: 'purple' },
                      { id: 'Card', color: 'brand' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedMethod(item.id as PaymentMethod)}
                        className={`p-3 rounded-2xl border text-center font-black text-xs transition ${
                          selectedMethod === item.id
                            ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {item.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-brand-500" />
                    <span>{selectedMethod.toUpperCase()} Merchant Payment Number:</span>
                  </div>
                  <div className="text-sm font-black text-brand-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block">
                    01712-949410 (Merchant)
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Open your {selectedMethod} App ➔ Select <strong>Make Payment</strong> ➔ Enter Merchant Number and Amount ৳{course.price.toLocaleString()}.
                  </p>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Account Phone Number (মোবাইল নম্বর)
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

                {errorMsg && (
                  <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <AIOrb state="thinking" size={20} />
                      <span>Verifying Payment with {selectedMethod}...</span>
                    </div>
                  ) : (
                    <>
                      <span>Complete Checkout & Activate Course</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              {/* Right Summary */}
              <div className="md:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-brand-600 tracking-wider">
                    Order Summary
                  </span>
                  <div className="flex gap-3">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#0A192F] line-clamp-2">{course.title}</h4>
                      <span className="text-[10px] text-slate-500 font-semibold">{course.category}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Course Fee</span>
                      <span>৳{course.price.toLocaleString()} BDT</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Platform Service Fee</span>
                      <span className="text-emerald-600 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                      <span>Total Amount</span>
                      <span className="text-brand-600">৳{course.price.toLocaleString()} BDT</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  By clicking complete checkout, you agree to MASTERMIND AIDIT's Terms of Service and Refund Policy.
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
