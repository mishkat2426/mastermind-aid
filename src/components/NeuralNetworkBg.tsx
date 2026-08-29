import React, { useEffect, useRef, useCallback } from 'react';

interface NeuralNetworkBgProps {
  className?: string;
}

/**
 * Enhanced neural network background with:
 * - Glowing nodes with varying sizes
 * - Thin connecting lines
 * - Particles traveling along connections
 * - Subtle mouse parallax on desktop
 * - Simplified rendering on mobile
 */
export const NeuralNetworkBg: React.FC<NeuralNetworkBgProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Respect reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Fewer nodes on mobile for performance
    const nodeCount = isMobile ? 18 : Math.min(Math.floor((width * height) / 22000), 60);
    const connectionDist = isMobile ? 100 : 130;
    const particleTravelCount = isMobile ? 0 : 5;

    // Create nodes
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.25),
      vy: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.25),
      radius: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.3 + 0.15,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    // Traveling particles along edges
    interface TravelParticle {
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
      alpha: number;
    }

    const travelParticles: TravelParticle[] = [];

    const spawnTravelParticle = () => {
      if (travelParticles.length >= particleTravelCount) return;
      const i = Math.floor(Math.random() * nodeCount);
      let j = Math.floor(Math.random() * nodeCount);
      if (i === j) j = (j + 1) % nodeCount;

      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < connectionDist * 1.3) {
        travelParticles.push({
          fromIdx: i,
          toIdx: j,
          progress: 0,
          speed: 0.005 + Math.random() * 0.008,
          alpha: 0.5 + Math.random() * 0.5,
        });
      }
    };

    // Mouse tracking for parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1, y: -1 };
    };

    if (!isMobile) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update & draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off edges
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));

        // Slight mouse repulsion/attraction on desktop
        if (mx > 0 && my > 0) {
          const dx = n.x - mx;
          const dy = n.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 0) {
            const force = 0.15 / dist;
            n.x += dx * force;
            n.y += dy * force;
          }
        }

        // Pulsing alpha
        const pulse = Math.sin(time * 2 + n.pulseOffset) * 0.15;
        const alpha = Math.max(0.05, n.baseAlpha + pulse);

        // Draw node glow
        const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 3);
        gradient.addColorStop(0, `rgba(82, 151, 255, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(13, 95, 249, ${alpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(13, 95, 249, 0)');

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw node core
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(82, 151, 255, ${alpha})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const lineAlpha = 0.08 * (1 - dist / connectionDist);
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(82, 151, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Spawn and render travel particles
      if (!isMobile && Math.random() < 0.03) {
        spawnTravelParticle();
      }

      for (let k = travelParticles.length - 1; k >= 0; k--) {
        const tp = travelParticles[k];
        tp.progress += tp.speed;

        if (tp.progress >= 1) {
          travelParticles.splice(k, 1);
          continue;
        }

        const from = nodes[tp.fromIdx];
        const to = nodes[tp.toIdx];
        const px = from.x + (to.x - from.x) * tp.progress;
        const py = from.y + (to.y - from.y) * tp.progress;

        const fadeAlpha = tp.alpha * Math.sin(tp.progress * Math.PI);

        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(82, 151, 255, ${fadeAlpha * 0.8})`;
        ctx.fill();

        // Small glow trail
        const trailGrad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        trailGrad.addColorStop(0, `rgba(82, 151, 255, ${fadeAlpha * 0.3})`);
        trailGrad.addColorStop(1, 'rgba(82, 151, 255, 0)');
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = trailGrad;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      if (!isMobile) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto z-0 ${className}`}
      style={{ opacity: 0.55 }}
    />
  );
};
