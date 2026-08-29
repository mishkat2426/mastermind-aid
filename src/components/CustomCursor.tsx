import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium AI Custom Cursor with:
 * - Inner sharp precision dot
 * - Outer glowing spring ring that expands on hover over buttons/links/cards
 * - Dynamic pulse & ripple effect on mouse click
 * - Respects prefers-reduced-motion and touch device settings
 */
export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    // Disable on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || window.innerWidth < 1024) {
      setIsEnabled(false);
      return;
    }

    // Disable on reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setIsEnabled(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isEnabled || !isVisible) return null;

  return (
    <>
      {/* Outer Spring Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border-2 border-brand-500/70 hidden lg:block"
        style={{
          boxShadow: isHovered
            ? '0 0 20px rgba(13, 95, 249, 0.4), inset 0 0 10px rgba(13, 95, 249, 0.2)'
            : '0 0 10px rgba(13, 95, 249, 0.2)',
        }}
        animate={{
          x: mousePosition.x - (isHovered ? 26 : 18),
          y: mousePosition.y - (isHovered ? 26 : 18),
          width: isHovered ? 52 : 36,
          height: isHovered ? 52 : 36,
          scale: isClicked ? 0.85 : 1,
          backgroundColor: isHovered ? 'rgba(13, 95, 249, 0.1)' : 'rgba(13, 95, 249, 0)',
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 320,
          mass: 0.2,
        }}
      />

      {/* Inner Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 w-2.5 h-2.5 rounded-full bg-brand-500 shadow-md shadow-brand-500 hidden lg:block"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: isHovered ? 1.6 : isClicked ? 0.6 : 1,
          backgroundColor: isHovered ? '#34D399' : '#0D5FF9',
        }}
        transition={{ type: 'spring', damping: 32, stiffness: 500 }}
      />

      {/* Click Ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0.8, scale: 0.2 }}
            animate={{ opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-0 left-0 pointer-events-none z-50 w-12 h-12 rounded-full border border-brand-400 hidden lg:block"
            style={{
              left: r.x - 24,
              top: r.y - 24,
              boxShadow: '0 0 15px rgba(13, 95, 249, 0.5)',
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );
};
