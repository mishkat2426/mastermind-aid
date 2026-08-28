import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { CursorGlow } from './components/CursorGlow';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarqueePartners } from './components/MarqueePartners';
import { CategoryGrid } from './components/CategoryGrid';
import { CourseGrid } from './components/CourseGrid';
import { HowItWorks } from './components/HowItWorks';
import { CourseComparisonTable } from './components/CourseComparisonTable';
import { StudentProjectsGallery } from './components/StudentProjectsGallery';
import { StatsCounter } from './components/StatsCounter';
import { TestimonialSection } from './components/TestimonialSection';
import { SeoContentSection } from './components/SeoContentSection';
import { Footer } from './components/Footer';
import { CourseDetailModal } from './components/CourseDetailModal';
import { SearchModal } from './components/SearchModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { CertificateShowcase } from './components/CertificateShowcase';
import { DashboardPreviewModal } from './components/DashboardPreviewModal';
import { InteractiveCodePlayground } from './components/InteractiveCodePlayground';
import { PathFinderModal } from './components/PathFinderModal';
import { FloatingAssistant } from './components/FloatingAssistant';
import { Course, COURSES } from './data/coursesData';

export function App() {
  // Preloader State
  const [isLoaded, setIsLoaded] = useState(false);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('mastermindaid_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // UI Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [isPathFinderOpen, setIsPathFinderOpen] = useState(false);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('mastermindaid_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Keyboard Shortcuts (Ctrl+K or Cmd+K to open Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show Temporary Toast Message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cart Operations
  const handleAddToCart = (course: Course) => {
    const exists = cart.some((item) => item.id === course.id);
    if (!exists) {
      setCart((prev) => [...prev, course]);
      triggerToast(`🛒 "${course.title}" added to shopping cart!`);
    } else {
      triggerToast(`ℹ️ "${course.title}" is already in your cart.`);
    }
  };

  const handleRemoveFromCart = (courseId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== courseId));
    triggerToast('🗑️ Item removed from cart.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenPayment = (total: number) => {
    setPaymentTotal(total);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    handleClearCart();
    triggerToast('🎉 Enrollment Successful! Welcome to Mastermind Aid.');
  };

  const handleScrollToCourses = () => {
    const el = document.getElementById('courses');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative font-sans">
      
      {/* Ambient Radial Cursor Follower Light */}
      <CursorGlow />

      {/* Site Entrance Preloader Splash */}
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0A192F] text-[#FFFFFF] px-5 py-3.5 rounded-2xl shadow-2xl border border-brand-400 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Navbar */}
      <Navbar
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Body Content */}
      <main className="flex-1">
        {/* Hero Banner */}
        <HeroSection
          onExploreCourses={handleScrollToCourses}
          onOpenPreview={() => setActiveCourseModal(COURSES[0])}
          onOpenCodeEditor={() => setIsCodeEditorOpen(true)}
          onOpenPathFinder={() => setIsPathFinderOpen(true)}
        />

        {/* Animated Marquee Partner Ticker */}
        <MarqueePartners />

        {/* Category Grid */}
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            handleScrollToCourses();
          }}
        />

        {/* Popular Courses Grid */}
        <CourseGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onViewCourse={(course) => setActiveCourseModal(course)}
          onAddToCart={handleAddToCart}
          cartItemIds={cart.map((item) => item.id)}
        />

        {/* 3-Step Learning Process */}
        <HowItWorks />

        {/* Pricing & Tier Comparison Table */}
        <CourseComparisonTable
          onSelectPlan={(planName, price) => {
            if (price > 0) {
              handleOpenPayment(price);
            } else {
              handleScrollToCourses();
            }
          }}
        />

        {/* Real Student Graduate Portfolio Showcase */}
        <StudentProjectsGallery />

        {/* Achievements Counter */}
        <StatsCounter />

        {/* Verified Student Reviews */}
        <TestimonialSection />

        {/* SEO Informational Text & FAQ */}
        <SeoContentSection />
      </main>

      {/* Footer */}
      <Footer onSelectCategory={setSelectedCategory} />

      {/* Floating Support Assistant Chat Widget */}
      <FloatingAssistant />

      {/* Interactive Overlay Modals */}
      <CourseDetailModal
        course={activeCourseModal}
        onClose={() => setActiveCourseModal(null)}
        onAddToCart={handleAddToCart}
        onOpenPayment={() => {
          if (activeCourseModal) {
            handleOpenPayment(activeCourseModal.price);
          }
        }}
        isInCart={activeCourseModal ? cart.some((item) => item.id === activeCourseModal.id) : false}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCourse={(course) => setActiveCourseModal(course)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenPaymentModal={handleOpenPayment}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        cartItems={cart}
        totalAmount={paymentTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <CertificateShowcase
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      <DashboardPreviewModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />

      <InteractiveCodePlayground
        isOpen={isCodeEditorOpen}
        onClose={() => setIsCodeEditorOpen(false)}
      />

      <PathFinderModal
        isOpen={isPathFinderOpen}
        onClose={() => setIsPathFinderOpen(false)}
        onSelectRecommendedCourse={(course) => setActiveCourseModal(course)}
      />

    </div>
  );
}

export default App;
