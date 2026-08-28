import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Smartphone, ShieldCheck } from 'lucide-react';
import { Course } from '../data/coursesData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Course[];
  onRemoveFromCart: (courseId: string) => void;
  onClearCart: () => void;
  onOpenPaymentModal: (total: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onClearCart,
  onOpenPaymentModal,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const totalPrice = Math.max(0, rawSubtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'COURSEKORI50') {
      setDiscountPercent(50);
      setCouponMessage('🎉 Promo Code COURSEKORI50 Applied! 50% OFF Unlocked.');
    } else {
      setCouponMessage('❌ Invalid coupon. Try using code: COURSEKORI50');
    }
  };

  const handleProceedToPayment = () => {
    onClose();
    onOpenPaymentModal(totalPrice);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black">Your Shopping Cart</h3>
                <p className="text-xs text-slate-300">{cartItems.length} item(s) selected</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Body Items */}
          {cartItems.length === 0 ? (
            <div className="flex-1 p-8 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-brand-50 rounded-full text-brand-500 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-[#0A192F]">Your Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Browse our free & premium courses to start building your skills today.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-600 transition"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-extrabold text-[#0A192F] truncate">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-brand-600 font-semibold">{item.category}</p>
                    <div className="text-xs font-black text-brand-600 mt-1">
                      {item.isFree ? 'FREE' : `৳${item.price.toLocaleString()} BDT`}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition"
                    title="Remove course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer Calculations & Payment Action */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              
              {/* Bangladeshi Gateways Notice Badge */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Supported Gateways:
                </span>
                <span className="text-brand-600 font-black">bKash • Nagad • Rocket • Card</span>
              </div>

              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. COURSEKORI50)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0A192F] hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition"
                >
                  Apply
                </button>
              </form>

              {couponMessage && (
                <div className={`text-xs font-semibold p-2 rounded-lg ${discountPercent > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {couponMessage}
                </div>
              )}

              {/* Price Totals */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">৳{rawSubtotal.toLocaleString()} BDT</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-৳{discountAmount.toLocaleString()} BDT</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-[#0A192F] pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-brand-600">৳{totalPrice.toLocaleString()} BDT</span>
                </div>
              </div>

              {/* Proceed to Payment Button */}
              <button
                onClick={handleProceedToPayment}
                className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition"
              >
                <Smartphone className="w-4 h-4" />
                <span>Pay via bKash / Nagad / Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
