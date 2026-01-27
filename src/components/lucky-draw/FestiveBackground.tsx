import { useEffect, useRef } from 'react';

export function FestiveBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Basic petal generator
        const container = containerRef.current;
        if (!container) return;

        const createPetal = () => {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = `${Math.random() * 100}vw`;
            petal.style.animationDuration = `${Math.random() * 3 + 4}s`; // 4-7s
            petal.style.width = `${Math.random() * 10 + 10}px`;
            petal.style.height = petal.style.width;

            container.appendChild(petal);

            // Remove after animation
            setTimeout(() => {
                if (container.contains(petal)) {
                    container.removeChild(petal);
                }
            }, 7000);
        };

        const interval = setInterval(createPetal, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-red-900 via-red-800 to-red-950">
            {/* Background Patterns */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, #ffd700 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }}
            />

            {/* Clouds (SVG) - Top Corners */}
            <div className="absolute top-0 left-0 w-64 h-64 opacity-20 text-yellow-500 transform -translate-x-10 -translate-y-10">
                <CloudSvg />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 opacity-20 text-yellow-500 transform translate-x-10 -translate-y-10 scale-x-[-1]">
                <CloudSvg />
            </div>

            {/* Lanterns - Hanging from top */}
            <div className="absolute top-0 left-20 animate-[float_4s_ease-in-out_infinite]">
                <div className="h-20 w-[2px] bg-yellow-600 mx-auto"></div>
                <LanternNew />
            </div>
            <div className="absolute top-0 right-20 animate-[float_5s_ease-in-out_infinite_1s]">
                <div className="h-32 w-[2px] bg-yellow-600 mx-auto"></div>
                <LanternNew />
            </div>

            {/* Petals Container */}
            <div ref={containerRef} className="absolute inset-0 z-0" />
        </div>
    );
}

function CloudSvg() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.001 14.5C6.001 12.015 8.016 10 10.501 10C10.743 10 10.979 10.02 11.209 10.058C11.758 6.657 14.706 4 18.001 4C21.867 4 25.001 7.134 25.001 11C25.001 11.087 24.996 11.173 24.988 11.258C24.998 11.258 25.001 11.259 25.001 11.264V14.5C25.001 16.985 22.986 19 20.501 19H6.001C3.516 19 1.501 16.985 1.501 14.5C1.501 12.015 3.516 10 6.001 10V14.5Z" />
        </svg>
    )
}

function LanternNew() {
    return (
        <div className="w-16 h-20 bg-red-600 rounded-lg relative shadow-[0_0_20px_rgba(255,165,0,0.6)] flex items-center justify-center border-t-4 border-b-4 border-yellow-500">
            <div className="text-yellow-400 font-bold text-2xl">福</div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1">
                <div className="w-1 h-6 bg-yellow-500"></div>
                <div className="w-1 h-6 bg-yellow-500"></div>
                <div className="w-1 h-6 bg-yellow-500"></div>
            </div>
        </div>
    )
}
