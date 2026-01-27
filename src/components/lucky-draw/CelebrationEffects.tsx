import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface Props {
    isActive: boolean;
}

export function CelebrationEffects({ isActive }: Props) {
    const triggerFireworks = useCallback(() => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }, []);

    useEffect(() => {
        if (isActive) {
            // 1. Initial burst
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#DC143C', '#FFFFFF']
            });

            // 2. Fireworks after slight delay
            setTimeout(() => {
                triggerFireworks();
            }, 500);
        }
    }, [isActive, triggerFireworks]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Dragon Animation (Css) */}
            <div className="absolute top-1/4 -left-40 animate-[flyRight_10s_linear_forward] opacity-80">
                <DragonSvg />
            </div>

            {/* Phoenix Animation (Css) */}
            <div className="absolute top-1/3 -right-40 animate-[flyLeft_12s_linear_forward] opacity-80">
                <PhoenixSvg />
            </div>

            {/* Golden Coins Rain (Simulated with simple CSS if needed, or included in background) */}
        </div>
    );
}

// Simple SVGs for Dragon/Phoenix
function DragonSvg() {
    return (
        <svg width="200" height="100" viewBox="0 0 200 100" fill="#FFD700">
            {/* Stylized Dragon Silhouette */}
            <path d="M20,50 Q50,20 100,50 T180,50" stroke="#DC143C" strokeWidth="5" fill="none" />
            <circle cx="20" cy="50" r="10" fill="#FFD700" />
            <text x="30" y="45" fontSize="20" fill="red">🐉</text>
            {/* Placeholder for complex dragon */}
        </svg>
    )
}

function PhoenixSvg() {
    return (
        <svg width="200" height="100" viewBox="0 0 200 100" fill="#FFD700">
            {/* Stylized Phoenix Silhouette */}
            <path d="M180,50 Q150,80 100,50 T20,50" stroke="#FF4500" strokeWidth="5" fill="none" />
            <text x="150" y="45" fontSize="20" fill="red">🦅</text>
        </svg>
    )
}
