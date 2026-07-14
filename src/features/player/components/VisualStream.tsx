import { useEffect, useRef } from 'react';

interface VisualStreamProps {
  color: string;
  name: string;
}

export function VisualStream({ color, name }: VisualStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 60;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // radial gradient for ambient lighting
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, `${color}25`);
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Primary wave
      ctx.strokeStyle = `${color}40`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < width; x += 10) {
        const y =
          height / 2 +
          Math.sin(x * 0.005 + phase) * 80 * Math.sin(x * 0.001 + phase * 0.5) +
          Math.cos(x * 0.01 - phase) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary wave
      ctx.strokeStyle = `${color}20`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 10) {
        const y =
          height / 2 +
          Math.sin(x * 0.008 - phase * 0.7) * 50 * Math.cos(x * 0.002 + phase * 0.3) +
          Math.sin(x * 0.015 + phase) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });

      // Scanlines effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.007)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`SIMULACIÓN EN VIVO · ${name.toUpperCase()}`, 32, height - 32);

      phase += 0.015;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [color, name]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />;
}

export default VisualStream;
