import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.classList.contains('cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Hide on mobile touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;
  if (!isVisible) return null;

  return (
    <>
      {/* Outer Glowing Cursor Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border-2 border-brand-500/60 mix-blend-difference hidden lg:block"
        animate={{
          x: mousePosition.x - (isHovered ? 24 : 16),
          y: mousePosition.y - (isHovered ? 24 : 16),
          width: isHovered ? 48 : 32,
          height: isHovered ? 48 : 32,
          backgroundColor: isHovered ? 'rgba(13, 95, 249, 0.15)' : 'rgba(13, 95, 249, 0)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.3 }}
      />

      {/* Inner Solid Glow Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 w-2.5 h-2.5 rounded-full bg-brand-500 shadow-lg shadow-brand-500/80 hidden lg:block"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 450 }}
      />
    </>
  );
};
