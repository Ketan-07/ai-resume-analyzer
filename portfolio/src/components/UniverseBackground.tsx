import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function UniverseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const starsRef = useRef<Star[]>([]);
  const nebulaRef = useRef<Nebula[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationIdRef = useRef<number>(0);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const initStars = useCallback((w: number, h: number) => {
    const stars: Star[] = [];
    const count = isDark ? 400 : 150;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 3 + 0.5,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  }, [isDark]);

  const initNebula = useCallback((w: number, h: number) => {
    const darkColors = [
      'rgba(79, 70, 229, OPACITY)',
      'rgba(124, 58, 237, OPACITY)',
      'rgba(6, 182, 212, OPACITY)',
      'rgba(236, 72, 153, OPACITY)',
    ];
    const lightColors = [
      'rgba(79, 70, 229, OPACITY)',
      'rgba(168, 85, 247, OPACITY)',
      'rgba(6, 182, 212, OPACITY)',
    ];
    const colors = isDark ? darkColors : lightColors;
    const nebulae: Nebula[] = [];
    const count = isDark ? 5 : 3;
    for (let i = 0; i < count; i++) {
      nebulae.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 250 + 150,
        color: colors[i % colors.length],
        opacity: isDark ? Math.random() * 0.04 + 0.02 : Math.random() * 0.06 + 0.03,
      });
    }
    nebulaRef.current = nebulae;
  }, [isDark]);

  const spawnShootingStar = useCallback((w: number, h: number) => {
    if (!isDark) return;
    const angle = Math.PI / 4 + Math.random() * Math.PI / 4;
    const speed = 4 + Math.random() * 6;
    shootingStarsRef.current.push({
      x: Math.random() * w * 1.5,
      y: Math.random() * h * 0.3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 40 + Math.random() * 30,
    });
    if (shootingStarsRef.current.length > 5) {
      shootingStarsRef.current.shift();
    }
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    initStars(w, h);
    initNebula(w, h);

    let lastShootingStar = 0;

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      initStars(w, h);
      initNebula(w, h);
    };

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / w - 0.5, y: e.clientY / h - 0.5 };
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x * 20;
      const my = mouseRef.current.y * 20;
      const scrollOffset = scrollRef.current * 30;

      // Nebulae
      for (const n of nebulaRef.current) {
        const grad = ctx.createRadialGradient(
          n.x + mx * 0.3, n.y + my * 0.3 - scrollOffset * 0.2, 0,
          n.x + mx * 0.3, n.y + my * 0.3 - scrollOffset * 0.2, n.radius
        );
        const c = n.color.replace('OPACITY', String(n.opacity));
        grad.addColorStop(0, c);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Stars
      const starColor = isDark ? '255, 255, 255' : '79, 70, 229';
      for (const star of starsRef.current) {
        const px = mx * (star.z * 0.5);
        const py = (my + scrollOffset * 0.1) * (star.z * 0.5);
        const x = star.x + px;
        const y = star.y + py - scrollOffset * star.speed;
        const wrappedX = ((x % w) + w) % w;
        const wrappedY = ((y % h) + h) % h;
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
        const opacity = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(wrappedX, wrappedY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starColor}, ${opacity})`;
        ctx.fill();

        if (star.size > 1.8 && isDark) {
          ctx.beginPath();
          ctx.arc(wrappedX, wrappedY, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 129, 255, ${opacity * 0.15})`;
          ctx.fill();
        }
      }

      // Shooting stars (dark mode only)
      if (isDark && time - lastShootingStar > 3000 + Math.random() * 5000) {
        spawnShootingStar(w, h);
        lastShootingStar = time;
      }

      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const ss = shootingStarsRef.current[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;
        const alpha = 1 - ss.life / ss.maxLife;
        if (alpha <= 0 || ss.x > w || ss.y > h) {
          shootingStarsRef.current.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 3, ss.y - ss.vy * 3);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [initStars, initNebula, spawnShootingStar, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2e 30%, #1a0a2e 60%, #0a0a1a 100%)'
          : 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 30%, #f5f0ff 60%, #f0f4ff 100%)',
      }}
    />
  );
}
