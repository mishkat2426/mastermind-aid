import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Layout & Global Components
import { Navbar } from './components/Navbar';
import { Preloader } from './components/Preloader';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/courses/CoursesPage';
import { CourseDetailPage } from './pages/courses/CourseDetailPage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { ClassroomPage } from './pages/classroom/ClassroomPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Transactions Page
import { TransactionsPage } from './pages/transactions/TransactionsPage';

// Dashboards
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';

// Modals & Floating Tools
import { SearchModal } from './components/SearchModal';
import { CartDrawer } from './components/CartDrawer';
import { PathFinderModal } from './components/PathFinderModal';
import { FloatingAssistant } from './components/FloatingAssistant';

import { Course } from './types/platform';
import { DBService } from './services/db';

export function App() {
  const navigate = useNavigate();

  // Site Initial Preloader State
  const [isLoaded, setIsLoaded] = useState(false);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('mastermindaid_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPathFinderOpen, setIsPathFinderOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('mastermindaid_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (course: Course) => {
    if (!cart.some((item) => item.id === course.id)) {
      setCart([...cart, course]);
      showToast(`" ${course.title} " added to your cart!`);
    } else {
      showToast(`" ${course.title} " is already in your cart.`);
    }
  };

  const handleRemoveFromCart = (courseId: string) => {
    setCart(cart.filter((item) => item.id !== courseId));
    showToast('Course removed from cart.');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Cart cleared.');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative font-sans overflow-x-hidden">
      
      {/* Global Responsive Navbar */}
      <Navbar
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Site Entrance Preloader Splash */}
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0A192F] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-brand-400 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Application Route Engine */}
      <div className="flex-1">
        <Routes>
          {/* Public Marketing Homepage */}
          <Route
            path="/"
            element={
              <HomePage
                onOpenPathFinder={() => setIsPathFinderOpen(true)}
                onAddToCart={handleAddToCart}
                cartItemIds={cart.map((c) => c.id)}
              />
            }
          />

          {/* Dedicated Course Catalog Route */}
          <Route
            path="/courses"
            element={
              <CoursesPage
                onAddToCart={handleAddToCart}
                cartItemIds={cart.map((c) => c.id)}
              />
            }
          />

          {/* Dedicated Course Details Route */}
          <Route
            path="/courses/:courseId"
            element={
              <CourseDetailPage
                onAddToCart={handleAddToCart}
                cartItemIds={cart.map((c) => c.id)}
              />
            }
          />

          {/* Checkout & Payment Gateway Route */}
          <Route path="/checkout/:courseId" element={<CheckoutPage />} />

          {/* Protected Student Learning Classroom Route */}
          <Route
            path="/courses/:courseId/learn"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
                <ClassroomPage />
              </ProtectedRoute>
            }
          />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<LoginPage presetRole="ADMIN" />} />
          <Route path="/teacher/login" element={<LoginPage presetRole="TEACHER" />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Transactions Page (Protected) */}
          <Route
            path="/transactions"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Dashboards */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center space-y-4">
                <div>
                  <h2 className="text-3xl font-black text-[#0A192F]">404 - Page Not Found</h2>
                  <p className="text-xs text-slate-500 mt-1">The requested route does not exist.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-600 transition"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </div>

      {/* Global Modals & Overlay Components */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCourse={(course) => navigate(`/courses/${course.id}`)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenPayment={() => {
          setIsCartOpen(false);
          if (cart.length > 0) {
            navigate(`/checkout/${cart[0].id}`);
          } else {
            navigate('/courses');
          }
        }}
      />

      <PathFinderModal
        isOpen={isPathFinderOpen}
        onClose={() => setIsPathFinderOpen(false)}
        onSelectRecommendedCourse={(course: any) => navigate(`/courses/${course.id}`)}
      />

      {/* Live AI Floating Assistant Support */}
      <FloatingAssistant />

    </div>
  );
}

export default App;
