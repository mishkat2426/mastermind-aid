import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Smartphone, 
  CreditCard, 
  Clock, 
  Sparkles,
  AlertCircle,
  LayoutDashboard,
  ReceiptText
} from 'lucide-react';
import { DBService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { PaymentMethod, Transaction } from '../../types/platform';
import { AIOrb } from '../../components/ai/AIOrb';

export const CheckoutPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const course = DBService.getCourseById(courseId || '');

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bKash');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [trxId, setTrxId] = useState('');
  const [studentNote, setStudentNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedTrx, setSubmittedTrx] = useState<Transaction | null>(null);
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

  // Check if student is already enrolled or already submitted a pending request
  const isAlreadyEnrolled = currentUser ? DBService.isUserEnrolled(currentUser.id, course.id) : false;
  const hasPendingRequest = currentUser ? DBService.hasPendingEnrollment(currentUser.id, course.id) : false;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !currentUser) {
      navigate('/login', { state: { from: `/checkout/${course.id}` } });
      return;
    }

    if (!phoneNumber.trim() || !trxId.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার মোবাইল নম্বর এবং ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    // Create Enrollment Request Transaction in DB Layer (Status: PENDING)
    setTimeout(() => {
      const trx = DBService.createTransaction({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        courseId: course.id,
        courseTitle: course.title,
        amount: course.price,
        paymentMethod: selectedMethod,
        transactionId: trxId.trim().toUpperCase(),
        accountNumber: phoneNumber.trim(),
      });

      setSubmittedTrx(trx);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
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

        {/* Existing Status Notice Banner */}
        {isAlreadyEnrolled ? (
          <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-sm font-black text-emerald-900">You are already enrolled in this course!</h3>
                <p className="text-xs text-emerald-700">You have full access to all video lessons and learning material.</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate(`/courses/${course.id}/learn`)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Go to Classroom Now
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold text-xs rounded-xl transition"
              >
                View in Dashboard
              </button>
            </div>
          </div>
        ) : hasPendingRequest && !isSuccess ? (
          <div className="bg-amber-50 border border-amber-300 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="text-sm font-black text-amber-900">Enrollment Request Already Pending!</h3>
                <p className="text-xs text-amber-700">
                  You already submitted an enrollment request for <strong>{course.title}</strong>. Admin verification is in progress.
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Check Request in Dashboard
              </button>
              <button
                type="button"
                onClick={() => navigate('/transactions')}
                className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold text-xs rounded-xl transition"
              >
                View Transaction Records
              </button>
            </div>
          </div>
        ) : null}

        {/* Card Box */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
          
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 space-y-2">
            <div className="flex items-center gap-2 text-brand-400 font-extrabold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Course Enrollment System
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Course Enrollment & Verification</h1>
            <p className="text-xs text-slate-300">
              Fill up your payment details below. Your enrollment request will be sent to the Admin for approval.
            </p>
          </div>

          {/* Body */}
          {isSuccess ? (
            <div className="p-6 sm:p-10 space-y-6 text-center">
              
              {/* Success Badge */}
              <div className="w-20 h-20 bg-amber-100 rounded-full text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-50">
                <Clock className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-300">
                  Request Submitted • Awaiting Admin Approval
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0A192F]">
                  কোর্স এনরোলমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে!
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  আপনার পেমেন্ট তথ্য ও ট্রানজেকশন আইডি অ্যাডমিনের কাছে পাঠানো হয়েছে। অ্যাডমিন ভেরিফাই করে অনুমোদন (Approve) করলেই আপনার কোর্সটি স্বয়ংক্রিয়ভাবে চালু হয়ে যাবে।
                </p>
              </div>

              {/* Request Receipt Details */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 max-w-lg mx-auto text-left space-y-3 text-xs">
                <div className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-200">
                  Request Summary & Receipt
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-slate-500 font-semibold">Course:</span>
                  <span className="font-black text-[#0A192F] text-right max-w-xs">{course.title}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Payment Gateway:</span>
                  <span className="font-black text-brand-600">{selectedMethod}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Sender Account:</span>
                  <span className="font-mono font-bold text-slate-800">{phoneNumber}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Transaction ID (TrxID):</span>
                  <span className="font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {submittedTrx?.transactionId || trxId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Amount:</span>
                  <span className="font-black text-slate-900">৳{course.price.toLocaleString()} BDT</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold">Status:</span>
                  <span className="font-black text-amber-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> PENDING ADMIN APPROVAL
                  </span>
                </div>
              </div>

              {/* Action Buttons - 100% Workable */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3 px-5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to Student Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/transactions')}
                  className="flex-1 py-3 px-5 bg-[#0A192F] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ReceiptText className="w-4 h-4 text-emerald-400" /> View Transactions
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Back to Course
                </button>
              </div>

            </div>
          ) : (
            <div className="p-6 sm:p-8 grid md:grid-cols-12 gap-8">
              
              {/* Left Form */}
              <form onSubmit={handleCheckoutSubmit} className="md:col-span-7 space-y-6">
                
                {/* Method Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Select Payment Gateway (পেমেন্ট মেথড নির্বাচন করুন)
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
                        className={`p-3 rounded-2xl border text-center font-black text-xs transition cursor-pointer ${
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
                  <div className="text-sm font-black text-brand-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block font-mono">
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
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Note / Batch Preference (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Joining Evening Batch / SEO specialization"
                      value={studentNote}
                      onChange={(e) => setStudentNote(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <AIOrb state="thinking" size={20} />
                      <span>Sending Request to Admin...</span>
                    </div>
                  ) : (
                    <>
                      <span>Submit Enrollment Request (রিকোয়েস্ট পাঠান)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center font-medium">
                  🔒 রিকোয়েস্ট পাঠানোর পর অ্যাডমিন তথ্য যাচাই করে আপনার কোর্স অ্যাক্সেস চালু করবেন।
                </p>

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
