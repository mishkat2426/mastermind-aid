import React, { useEffect, useState } from 'react';

export const ScrollProgress: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollTop(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-brand-400 via-brand-500 to-emerald-400 shadow-md shadow-brand-500/50 transition-all duration-75"
        style={{ width: `${scrollTop}%` }}
      />
    </div>
  );
};
