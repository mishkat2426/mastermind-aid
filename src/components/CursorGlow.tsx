import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CursorGlow: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-[28rem] h-[28rem] rounded-full pointer-events-none z-30 opacity-40 blur-3xl hidden md:block"
      style={{
        background: 'radial-gradient(circle, rgba(13, 95, 249, 0.25) 0%, rgba(82, 151, 255, 0.08) 50%, rgba(255,255,255,0) 80%)',
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
