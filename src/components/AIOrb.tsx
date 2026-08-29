import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export type OrbState = 'idle' | 'thinking' | 'generating' | 'success' | 'error';

interface AIOrbProps {
  state?: OrbState;
  size?: number;
  className?: string;
}

export const AIOrb: React.FC<AIOrbProps> = ({ state = 'idle', size = 48, className = '' }) => {
  const half = size / 2;

  const config = useMemo(() => {
    switch (state) {
      case 'thinking':
        return { core: '#5297FF', glow: 'rgba(82,151,255,0.35)', pulse: 1.2, particles: 5, ringSpeed: 4 };
      case 'generating':
        return { core: '#0D5FF9', glow: 'rgba(13,95,249,0.4)', pulse: 0.8, particles: 8, ringSpeed: 2.5 };
      case 'success':
        return { core: '#34D399', glow: 'rgba(52,211,153,0.35)', pulse: 0.6, particles: 0, ringSpeed: 0 };
      case 'error':
        return { core: '#EF4444', glow: 'rgba(239,68,68,0.3)', pulse: 0.6, particles: 0, ringSpeed: 0 };
      default:
        return { core: '#0D5FF9', glow: 'rgba(13,95,249,0.2)', pulse: 3, particles: 0, ringSpeed: 0 };
    }
  }, [state]);

  const orbParticles = useMemo(() => {
    return Array.from({ length: config.particles }, (_, i) => ({
      id: i,
      angle: (360 / config.particles) * i,
      size: Math.random() * 2.5 + 1.5,
      radius: half * 0.82,
    }));
  }, [config.particles, half]);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow pulse */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: config.pulse, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Core sphere */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: half,
          height: half,
          background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.45), ${config.core} 65%, rgba(0,0,0,0.15))`,
          boxShadow: `0 0 ${size * 0.35}px ${config.glow}, inset 0 0 ${size * 0.12}px rgba(255,255,255,0.2)`,
        }}
        animate={{
          scale: state === 'success' ? [1, 1.35, 1] : [1, 1.08, 1],
        }}
        transition={{
          duration: state === 'success' ? 0.5 : config.pulse,
          repeat: state === 'success' ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Orbiting particles ring */}
      {config.particles > 0 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: config.ringSpeed, repeat: Infinity, ease: 'linear' }}
        >
          {orbParticles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: config.core,
                boxShadow: `0 0 5px ${config.glow}`,
                left: half + Math.cos((p.angle * Math.PI) / 180) * p.radius - p.size / 2,
                top: half + Math.sin((p.angle * Math.PI) / 180) * p.radius - p.size / 2,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Inner shimmer for generating state */}
      {state === 'generating' && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: half * 0.6,
            height: half * 0.6,
            background: `radial-gradient(circle, rgba(255,255,255,0.3), transparent)`,
          }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
};
