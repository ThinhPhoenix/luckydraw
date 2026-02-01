import { useEffect, useRef } from 'react';

interface Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  scale: number;
}

interface CoinRainProps {
  isActive: boolean;
  coinCount?: number;
  duration?: number; // seconds
}

export function CoinRain({
  isActive,
  coinCount = 75,
  duration = 5,
}: CoinRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const coinsRef = useRef<Coin[]>([]);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize coins
    const initCoins = () => {
      coinsRef.current = [];
      for (let i = 0; i < coinCount; i++) {
        coinsRef.current.push({
          x: Math.random() * canvas.width,
          y: -50 - Math.random() * 500, // Start above screen at different heights
          vx: (Math.random() - 0.5) * 4, // Random horizontal velocity (-2 to 2)
          vy: 5 + Math.random() * 5, // Falling speed (5 to 10)
          radius: 12 + Math.random() * 8, // Random size (12 to 20)
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2, // Rotation speed
          opacity: 1,
          scale: 1,
        });
      }
    };

    // Draw coin with gold gradient and shine
    const drawCoin = (coin: Coin) => {
      ctx.save();
      ctx.translate(coin.x, coin.y);
      ctx.rotate(coin.rotation);
      ctx.scale(coin.scale, coin.scale);
      ctx.globalAlpha = coin.opacity;

      // Outer rim (darker gold)
      const rimGradient = ctx.createLinearGradient(
        -coin.radius,
        -coin.radius,
        coin.radius,
        coin.radius,
      );
      rimGradient.addColorStop(0, '#B8860B');
      rimGradient.addColorStop(0.5, '#FFD700');
      rimGradient.addColorStop(1, '#B8860B');
      ctx.beginPath();
      ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
      ctx.fillStyle = rimGradient;
      ctx.fill();

      // Inner face (brighter gold)
      const faceGradient = ctx.createLinearGradient(
        -coin.radius * 0.7,
        -coin.radius * 0.7,
        coin.radius * 0.7,
        coin.radius * 0.7,
      );
      faceGradient.addColorStop(0, '#FFE55C');
      faceGradient.addColorStop(0.5, '#FFD700');
      faceGradient.addColorStop(1, '#FFA500');
      ctx.beginPath();
      ctx.arc(0, 0, coin.radius * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = faceGradient;
      ctx.fill();

      // Inner ring
      ctx.beginPath();
      ctx.arc(0, 0, coin.radius * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Shine effect (moving highlight)
      const shineGradient = ctx.createLinearGradient(
        -coin.radius * 0.5,
        -coin.radius * 0.5,
        coin.radius * 0.5,
        coin.radius * 0.5,
      );
      shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
      shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, coin.radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = shineGradient;
      ctx.fill();

      // Decorative pattern (simple lines radiating from center)
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(
          Math.cos(angle) * coin.radius * 0.3,
          Math.sin(angle) * coin.radius * 0.3,
        );
        ctx.lineTo(
          Math.cos(angle) * coin.radius * 0.7,
          Math.sin(angle) * coin.radius * 0.7,
        );
        ctx.stroke();
      }

      ctx.restore();
    };

    // Animation loop
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw coins
      coinsRef.current.forEach((coin) => {
        // Update position
        coin.x += coin.vx;
        coin.y += coin.vy;
        coin.rotation += coin.rotationSpeed;

        // Gravity effect
        coin.vy += 0.1;

        // Bounce off bottom
        if (coin.y + coin.radius > canvas.height) {
          coin.y = canvas.height - coin.radius;
          coin.vy *= -0.6; // Bounce with energy loss
          coin.vx *= 0.8; // Friction
        }

        // Bounce off sides
        if (coin.x - coin.radius < 0) {
          coin.x = coin.radius;
          coin.vx *= -0.7;
        }
        if (coin.x + coin.radius > canvas.width) {
          coin.x = canvas.width - coin.radius;
          coin.vx *= -0.7;
        }

        // Fade out near end
        if (elapsed > duration - 1) {
          coin.opacity = Math.max(0, duration - elapsed);
        }

        // Scale effect
        coin.scale = 1 + Math.sin(coin.rotation * 2) * 0.1;

        drawCoin(coin);
      });

      // Continue animation if active and within duration
      if (isActive && elapsed < duration) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isActive) {
      initCoins();
      startTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, coinCount, duration]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-35 pointer-events-none"
      style={{ zIndex: 35 }}
    />
  );
}
