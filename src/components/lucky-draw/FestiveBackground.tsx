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

      const size = Math.random() * 10 + 10; // 10-20px
      const startLeft = Math.random() * 100;
      const duration = Math.random() * 5 + 5; // 5-10s
      const animationName = `fall-sway-${Math.floor(Math.random() * 3) + 1}`;

      // Random colors (Yellow/Gold for Apricot, Pink/Red for Peach)
      const colors = [
        '#FFD700',
        '#FFECB3',
        '#FFC107', // Yellows
        '#FFB7C5',
        '#FF80AB',
        '#F06292', // Pinks
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // SVG Petal
      petal.innerHTML = `
                <svg viewBox="0 0 24 24" width="${size}" height="${size}" style="fill: ${color}; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));">
                    <path d="M12 2C8 6 3 10 3 15C3 19 8 22 12 22C16 22 21 19 21 15C21 10 16 6 12 2Z" />
                    <path d="M12 22V10" stroke="rgba(0,0,0,0.1)" stroke-width="1" />
                </svg>
            `;

      petal.style.left = `${startLeft}vw`;
      petal.style.animation = `${animationName} ${duration}s linear infinite`;

      container.appendChild(petal);

      // Remove after animation
      setTimeout(() => {
        if (container.contains(petal)) {
          container.removeChild(petal);
        }
      }, duration * 1000);
    };

    const interval = setInterval(createPetal, 400); // Slightly fewer petals for better performance
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-red-900 via-red-800 to-red-950">
      {/* Background Patterns */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #ffd700 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
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

      {/* Trees */}
      <div className="absolute bottom-0 left-[-50px] w-96 h-96 opacity-90 transform -scale-x-100 pointer-events-none">
        <TreeSvg type="apricot" />
      </div>
      <div className="absolute bottom-0 right-[-50px] w-96 h-96 opacity-90 pointer-events-none">
        <TreeSvg type="peach" />
      </div>
    </div>
  );
}

function CloudSvg() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.001 14.5C6.001 12.015 8.016 10 10.501 10C10.743 10 10.979 10.02 11.209 10.058C11.758 6.657 14.706 4 18.001 4C21.867 4 25.001 7.134 25.001 11C25.001 11.087 24.996 11.173 24.988 11.258C24.998 11.258 25.001 11.259 25.001 11.264V14.5C25.001 16.985 22.986 19 20.501 19H6.001C3.516 19 1.501 16.985 1.501 14.5C1.501 12.015 3.516 10 6.001 10V14.5Z" />
    </svg>
  );
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
  );
}

function TreeSvg({
  type,
  className,
}: {
  type: 'apricot' | 'peach';
  className?: string;
}) {
  const flowerColor = type === 'apricot' ? '#ffe033' : '#ff99cc'; // Yellow for Apricot, Pink for Peach

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Trunk */}
      <path
        d="M150 400 C150 350 140 300 140 250 C140 200 160 150 160 100"
        stroke="#3E2723"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M140 250 C120 220 80 200 60 180"
        stroke="#3E2723"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M140 280 C170 260 210 240 230 220"
        stroke="#3E2723"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M160 150 C190 130 220 100 230 80"
        stroke="#3E2723"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M160 120 C130 100 100 80 90 60"
        stroke="#3E2723"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />

      {/* Flowers - Clusters */}
      <g fill={flowerColor}>
        {/* Left Branch */}
        <circle cx="60" cy="180" r="6" /> <circle cx="50" cy="170" r="5" />{' '}
        <circle cx="70" cy="190" r="5" />
        <circle cx="80" cy="200" r="4" /> <circle cx="40" cy="175" r="4" />
        {/* Right Branch */}
        <circle cx="230" cy="220" r="6" /> <circle cx="240" cy="210" r="5" />{' '}
        <circle cx="220" cy="230" r="5" />
        <circle cx="210" cy="240" r="4" /> <circle cx="250" cy="215" r="4" />
        {/* Top Branches */}
        <circle cx="230" cy="80" r="6" /> <circle cx="220" cy="70" r="5" />{' '}
        <circle cx="240" cy="90" r="5" />
        <circle cx="90" cy="60" r="6" /> <circle cx="80" cy="50" r="5" />{' '}
        <circle cx="100" cy="70" r="5" />
        <circle cx="160" cy="100" r="7" /> <circle cx="150" cy="90" r="5" />{' '}
        <circle cx="170" cy="110" r="5" />
        {/* Scattered */}
        <circle cx="120" cy="150" r="4" /> <circle cx="180" cy="180" r="4" />
        <circle cx="140" cy="40" r="5" /> <circle cx="100" cy="120" r="4" />
        <circle cx="190" cy="160" r="4" /> <circle cx="110" cy="200" r="4" />
      </g>
    </svg>
  );
}
