import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Course } from '../types/platform';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Course[];
  onRemoveItem: (courseId: string) => void;
  onClearCart: () => void;
  onOpenPayment: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  onOpenPayment,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = (rawSubtotal * appliedDiscount) / 100;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === 'MASTERMIND50' || cleanCode === 'COURSEKORI50') {
      setAppliedDiscount(50);
      setCouponSuccess('50% Discount Coupon Applied Successfully! 🎉');
    } else if (cleanCode === '') {
      setCouponError('Please enter a coupon code.');
    } else {
      setCouponError('Invalid coupon code. Try code: MASTERMIND50');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
        
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#0A192F] text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black">Your Shopping Cart</h3>
                <p className="text-xs text-slate-300">
                  {cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'} selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-brand-50 text-brand-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-black text-[#0A192F]">Your Cart is Empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our premium & free courses and start building your IT career today!
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex gap-4 items-center relative group"
                >
                  <img
                    src={item.thumbnail || (item as any).image}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#0F2B5A] truncate">
                      {item.title}
                    </h4>
                    <div className="text-[11px] font-extrabold text-brand-600 mt-1">
                      {item.isFree ? 'FREE' : `৳${item.price?.toLocaleString()}`}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
                    title="Remove course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Coupon & Total Summary Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Promo Code: MASTERMIND50"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0A192F] text-white rounded-xl text-xs font-extrabold hover:bg-brand-600 transition"
                  >
                    Apply
                  </button>
                </div>

                {couponError && <p className="text-[11px] text-red-500 font-bold">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-600 font-bold">{couponSuccess}</p>}
              </form>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-200 pt-3">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal Amount:</span>
                  <span className="font-bold text-slate-900">৳{rawSubtotal.toLocaleString()} BDT</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-extrabold">
                    <span>Discount (50% OFF):</span>
                    <span>-৳{discountAmount.toLocaleString()} BDT</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-[#0A192F] pt-2 border-t border-slate-200">
                  <span>Total Amount Payable:</span>
                  <span className="text-brand-600">৳{finalTotal.toLocaleString()} BDT</span>
                </div>
              </div>

              {/* Payment Gateway Action */}
              <button
                onClick={onOpenPayment}
                className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-center text-slate-400 font-semibold flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit Encrypted Secure Local Payment</span>
              </div>

            </div>
          )}

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
