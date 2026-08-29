import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Upgraded CursorGlow with:
 * - Disabled on mobile/touch devices
 * - Respects prefers-reduced-motion
 * - Uses brand colors
 * - Smooth spring following
 * - Very low opacity for readability
 */
export const CursorGlow: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -500, y: -500 });
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Disable on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsEnabled(false);
      return;
    }

    // Disable on mobile viewport
    if (window.innerWidth < 768) {
      setIsEnabled(false);
      return;
    }

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setIsEnabled(false);
      return;
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsEnabled(!e.matches);
    };
    mq.addEventListener('change', handleMotionChange);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      mq.removeEventListener('change', handleMotionChange);
    };
  }, [isVisible]);

  if (!isEnabled || !isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-[28rem] h-[28rem] rounded-full pointer-events-none z-30 opacity-30 blur-3xl hidden md:block"
      style={{
        background: 'radial-gradient(circle, rgba(13, 95, 249, 0.2) 0%, rgba(82, 151, 255, 0.06) 50%, rgba(255,255,255,0) 80%)',
      }}
      animate={{
        x: mousePosition.x - 224,
        y: mousePosition.y - 224,
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 200,
        mass: 0.5,
      }}
    />
  );
};
