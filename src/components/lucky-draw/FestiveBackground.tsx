import { useEffect, useRef } from 'react';
import { PaperCutClouds } from './PaperCutClouds';

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
      const animationName = 'fall';

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

    // Create floating particles (fireflies/gold dust)
    const createParticle = () => {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 2; // 2-6px

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = '#FFD700';
      particle.style.position = 'absolute';
      particle.style.borderRadius = '50%';
      particle.style.opacity = '0';
      particle.style.boxShadow = '0 0 10px #FFD700';
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite, fade ${Math.random() * 3 + 2}s ease-in-out infinite alternate`;

      container.appendChild(particle);

      // Keep particles for a while but maybe recycle or just let them float indefinitely if we manage count
      // For simplicity, let's remove them after long duration to prevent DOM bloat
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, 20000);
    };

    const interval = setInterval(createPetal, 400); // Slightly fewer petals for better performance
    const particleInterval = setInterval(createParticle, 300); // Add particles frequently

    return () => {
      clearInterval(interval);
      clearInterval(particleInterval);
    };
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

      {/* Paper-Cut Clouds - Full Background System */}
      <PaperCutClouds />

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
        <TreeSvg type="apricot" animationDelay="0s" />
      </div>
      <div className="absolute bottom-0 right-[-50px] w-96 h-96 opacity-90 pointer-events-none">
        <TreeSvg type="peach" animationDelay="3s" />
      </div>
    </div>
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
  animationDelay = '0s',
}: {
  type: 'apricot' | 'peach';
  className?: string;
  animationDelay?: string;
}) {
  const isApricot = type === 'apricot';
  const flowerGradient = isApricot
    ? { from: '#FFD700', to: '#FFECB3', center: '#FFA000' }
    : { from: '#FF69B4', to: '#FFB6C1', center: '#FF1493' };

  // Generate random positions for flowers and buds
  const flowers = [
    // LEFT BRANCH - dense cluster at tip
    { x: 50, y: 160, size: 1, type: 'flower' },
    { x: 65, y: 175, size: 0.9, type: 'flower' },
    { x: 40, y: 185, size: 0.8, type: 'bud' },
    { x: 75, y: 195, size: 0.7, type: 'flower' },
    { x: 30, y: 175, size: 0.6, type: 'bud' },
    { x: 55, y: 165, size: 0.85, type: 'flower' },
    { x: 45, y: 190, size: 0.75, type: 'flower' },
    { x: 35, y: 170, size: 0.65, type: 'bud' },

    // RIGHT BRANCH - dense cluster at tip
    { x: 220, y: 200, size: 1, type: 'flower' },
    { x: 235, y: 215, size: 0.9, type: 'flower' },
    { x: 245, y: 205, size: 0.8, type: 'bud' },
    { x: 210, y: 225, size: 0.7, type: 'flower' },
    { x: 255, y: 195, size: 0.6, type: 'flower' },
    { x: 230, y: 210, size: 0.85, type: 'bud' },
    { x: 250, y: 215, size: 0.75, type: 'flower' },
    { x: 215, y: 205, size: 0.65, type: 'flower' },

    // UPPER RIGHT BRANCH - dense cluster
    { x: 225, y: 65, size: 1, type: 'flower' },
    { x: 240, y: 80, size: 0.9, type: 'bud' },
    { x: 215, y: 85, size: 0.8, type: 'flower' },
    { x: 235, y: 55, size: 0.7, type: 'flower' },
    { x: 245, y: 70, size: 0.85, type: 'flower' },
    { x: 220, y: 75, size: 0.75, type: 'bud' },
    { x: 250, y: 60, size: 0.65, type: 'flower' },
    { x: 230, y: 50, size: 0.9, type: 'flower' },

    // UPPER LEFT BRANCH - dense cluster
    { x: 85, y: 45, size: 1, type: 'flower' },
    { x: 70, y: 60, size: 0.9, type: 'flower' },
    { x: 95, y: 55, size: 0.8, type: 'bud' },
    { x: 60, y: 50, size: 0.7, type: 'flower' },
    { x: 80, y: 65, size: 0.85, type: 'bud' },
    { x: 75, y: 40, size: 0.75, type: 'flower' },
    { x: 90, y: 70, size: 0.65, type: 'flower' },
    { x: 55, y: 55, size: 0.9, type: 'flower' },

    // CENTER TOP BRANCH - dense cluster
    { x: 155, y: 85, size: 1.1, type: 'flower' },
    { x: 145, y: 100, size: 0.9, type: 'flower' },
    { x: 170, y: 95, size: 0.8, type: 'bud' },
    { x: 140, y: 75, size: 0.7, type: 'flower' },
    { x: 165, y: 70, size: 0.9, type: 'flower' },
    { x: 150, y: 95, size: 0.85, type: 'bud' },
    { x: 160, y: 80, size: 0.75, type: 'flower' },
    { x: 175, y: 90, size: 0.95, type: 'flower' },
    { x: 135, y: 90, size: 0.7, type: 'bud' },
    { x: 165, y: 105, size: 0.8, type: 'flower' },

    // Mid-branch scattered - LEFT
    { x: 75, y: 220, size: 0.65, type: 'flower' },
    { x: 90, y: 230, size: 0.55, type: 'bud' },
    { x: 85, y: 205, size: 0.6, type: 'flower' },
    { x: 100, y: 240, size: 0.5, type: 'bud' },
    { x: 65, y: 235, size: 0.55, type: 'flower' },
    { x: 105, y: 220, size: 0.6, type: 'flower' },
    { x: 80, y: 245, size: 0.5, type: 'bud' },

    // Mid-branch scattered - RIGHT
    { x: 200, y: 230, size: 0.65, type: 'flower' },
    { x: 215, y: 240, size: 0.55, type: 'bud' },
    { x: 190, y: 245, size: 0.6, type: 'flower' },
    { x: 225, y: 230, size: 0.5, type: 'bud' },
    { x: 205, y: 255, size: 0.55, type: 'flower' },
    { x: 185, y: 235, size: 0.6, type: 'flower' },
    { x: 215, y: 250, size: 0.5, type: 'bud' },

    // Mid-branch scattered - UPPER LEFT
    { x: 100, y: 100, size: 0.6, type: 'flower' },
    { x: 115, y: 85, size: 0.5, type: 'bud' },
    { x: 95, y: 115, size: 0.55, type: 'flower' },
    { x: 110, y: 125, size: 0.5, type: 'bud' },
    { x: 80, y: 95, size: 0.6, type: 'flower' },

    // Mid-branch scattered - UPPER RIGHT
    { x: 195, y: 105, size: 0.6, type: 'flower' },
    { x: 210, y: 90, size: 0.5, type: 'bud' },
    { x: 200, y: 115, size: 0.55, type: 'flower' },
    { x: 185, y: 100, size: 0.5, type: 'bud' },
    { x: 215, y: 100, size: 0.6, type: 'flower' },

    // Main trunk mid area
    { x: 130, y: 180, size: 0.7, type: 'flower' },
    { x: 165, y: 175, size: 0.65, type: 'bud' },
    { x: 145, y: 195, size: 0.6, type: 'flower' },
    { x: 155, y: 165, size: 0.55, type: 'bud' },
    { x: 140, y: 155, size: 0.65, type: 'flower' },
    { x: 160, y: 185, size: 0.6, type: 'flower' },

    // Background filler - tiny flowers for depth
    { x: 120, y: 120, size: 0.4, type: 'bud' },
    { x: 180, y: 140, size: 0.35, type: 'flower' },
    { x: 140, y: 40, size: 0.45, type: 'bud' },
    { x: 105, y: 150, size: 0.4, type: 'flower' },
    { x: 195, y: 160, size: 0.35, type: 'bud' },
    { x: 125, y: 60, size: 0.4, type: 'flower' },
    { x: 175, y: 50, size: 0.45, type: 'bud' },
    { x: 110, y: 200, size: 0.35, type: 'flower' },
    { x: 190, y: 190, size: 0.4, type: 'bud' },
    { x: 150, y: 25, size: 0.45, type: 'flower' },
    { x: 100, y: 80, size: 0.4, type: 'bud' },
    { x: 200, y: 70, size: 0.35, type: 'flower' },
    { x: 130, y: 130, size: 0.4, type: 'bud' },
    { x: 170, y: 120, size: 0.35, type: 'flower' },
    { x: 115, y: 45, size: 0.4, type: 'bud' },
    { x: 185, y: 55, size: 0.45, type: 'flower' },
    { x: 145, y: 110, size: 0.4, type: 'bud' },
    { x: 155, y: 135, size: 0.35, type: 'flower' },

    // Additional cluster flowers on secondary branches
    { x: 65, y: 210, size: 0.75, type: 'flower' },
    { x: 75, y: 200, size: 0.65, type: 'bud' },
    { x: 55, y: 200, size: 0.7, type: 'flower' },
    { x: 80, y: 215, size: 0.6, type: 'bud' },

    { x: 235, y: 210, size: 0.75, type: 'flower' },
    { x: 225, y: 200, size: 0.65, type: 'bud' },
    { x: 245, y: 200, size: 0.7, type: 'flower' },
    { x: 220, y: 215, size: 0.6, type: 'bud' },

    { x: 85, y: 80, size: 0.75, type: 'flower' },
    { x: 75, y: 90, size: 0.65, type: 'bud' },
    { x: 95, y: 85, size: 0.7, type: 'flower' },
    { x: 70, y: 75, size: 0.6, type: 'bud' },

    { x: 245, y: 80, size: 0.75, type: 'flower' },
    { x: 255, y: 90, size: 0.65, type: 'bud' },
    { x: 235, y: 85, size: 0.7, type: 'flower' },
    { x: 260, y: 75, size: 0.6, type: 'bud' },

    { x: 155, y: 50, size: 0.8, type: 'flower' },
    { x: 165, y: 40, size: 0.7, type: 'bud' },
    { x: 145, y: 45, size: 0.75, type: 'flower' },
    { x: 170, y: 55, size: 0.65, type: 'bud' },

    // Extra scattered flowers for fullness
    { x: 115, y: 165, size: 0.55, type: 'flower' },
    { x: 185, y: 180, size: 0.5, type: 'bud' },
    { x: 135, y: 200, size: 0.45, type: 'flower' },
    { x: 160, y: 215, size: 0.5, type: 'bud' },
    { x: 125, y: 150, size: 0.55, type: 'flower' },
    { x: 175, y: 155, size: 0.5, type: 'bud' },
    { x: 145, y: 145, size: 0.6, type: 'flower' },
    { x: 155, y: 205, size: 0.55, type: 'flower' },
    { x: 130, y: 210, size: 0.45, type: 'bud' },
    { x: 165, y: 200, size: 0.5, type: 'flower' },
  ];

  const leaves = [
    { x: 90, y: 130, rotation: 45 },
    { x: 200, y: 120, rotation: -30 },
    { x: 120, y: 70, rotation: 60 },
    { x: 180, y: 60, rotation: -45 },
    { x: 55, y: 155, rotation: 20 },
    { x: 245, y: 185, rotation: -60 },
    { x: 130, y: 170, rotation: 30 },
    { x: 160, y: 120, rotation: -20 },
    { x: 190, y: 90, rotation: 50 },
    { x: 110, y: 100, rotation: -40 },
    { x: 235, y: 40, rotation: 25 },
    { x: 80, y: 80, rotation: -55 },
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        overflow: 'visible',
        animation: `gentle-sway 6s ease-in-out infinite`,
        animationDelay,
        transformOrigin: '150px 380px',
      }}
    >
      <defs>
        {/* Flower gradient */}
        <radialGradient id={`flowerGrad-${type}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={flowerGradient.center} />
          <stop offset="60%" stopColor={flowerGradient.from} />
          <stop offset="100%" stopColor={flowerGradient.to} />
        </radialGradient>

        {/* Leaf gradient */}
        <linearGradient
          id={`leafGrad-${type}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#228B22" />
          <stop offset="100%" stopColor="#90EE90" />
        </linearGradient>

        {/* Single petal shape */}
        <path id={`petal-${type}`} d="M0,-10 Q-5,-5 0,0 Q5,-5 0,-10" />

        {/* Full flower */}
        <g id={`flower-${type}`}>
          <g fill={`url(#flowerGrad-${type})`}>
            <use href={`#petal-${type}`} transform="rotate(0)" />
            <use href={`#petal-${type}`} transform="rotate(72)" />
            <use href={`#petal-${type}`} transform="rotate(144)" />
            <use href={`#petal-${type}`} transform="rotate(216)" />
            <use href={`#petal-${type}`} transform="rotate(288)" />
          </g>
          <circle cx="0" cy="0" r="3" fill="#FFD700" opacity="0.8" />
        </g>

        {/* Bud shape */}
        <g id={`bud-${type}`}>
          <ellipse
            cx="0"
            cy="-3"
            rx="4"
            ry="6"
            fill={`url(#flowerGrad-${type})`}
          />
          <path
            d="M-4,-3 Q0,-8 4,-3"
            stroke={`url(#flowerGrad-${type})`}
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Leaf shape */}
        <path
          id={`leaf-${type}`}
          d="M0,0 Q8,-5 16,0 Q8,5 0,0"
          fill={`url(#leafGrad-${type})`}
        />
      </defs>

      {/* Trunk - organic curved shape */}
      <path
        d="M150 400 
           C145 380, 142 360, 145 340
           C148 320, 145 300, 140 280
           C138 260, 142 240, 148 220
           C152 200, 155 180, 158 160
           C160 140, 162 120, 160 100"
        stroke="#4A2511"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
      />

      {/* Trunk highlight */}
      <path
        d="M150 400 
           C147 380, 144 360, 147 340
           C150 320, 147 300, 142 280
           C140 260, 144 240, 150 220
           C154 200, 157 180, 160 160
           C162 140, 164 120, 162 100"
        stroke="#6B4423"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Main branches - curved and organic */}
      {/* Left branch - main */}
      <path
        d="M142 280 
           C130 270, 110 260, 95 250
           C80 240, 65 230, 50 210
           C40 200, 35 185, 30 175"
        stroke="#4A2511"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left sub-branches */}
      <path
        d="M95 250 C85 235, 75 220, 65 210"
        stroke="#4A2511"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 210 C45 195, 40 180, 35 165"
        stroke="#4A2511"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Right branch - main */}
      <path
        d="M148 280 
           C165 270, 185 260, 205 245
           C220 235, 235 225, 250 215
           C260 205, 265 195, 270 185"
        stroke="#4A2511"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      {/* Right sub-branches */}
      <path
        d="M205 245 C215 230, 225 220, 235 210"
        stroke="#4A2511"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M250 215 C260 200, 265 185, 270 170"
        stroke="#4A2511"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Upper left branch */}
      <path
        d="M158 160 
           C145 150, 130 135, 115 120
           C100 105, 90 90, 80 75
           C75 65, 70 55, 65 45"
        stroke="#4A2511"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M115 120 C105 100, 95 85, 85 70"
        stroke="#4A2511"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Upper right branch */}
      <path
        d="M160 160 
           C175 150, 195 135, 210 115
           C225 95, 235 80, 245 65
           C250 55, 255 45, 260 35"
        stroke="#4A2511"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M210 115 C225 100, 235 85, 245 70"
        stroke="#4A2511"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Center top branch */}
      <path
        d="M162 140 
           C168 125, 175 110, 175 95
           C175 80, 172 65, 170 50
           C168 40, 165 30, 160 20"
        stroke="#4A2511"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M175 95 C182 85, 188 75, 192 65"
        stroke="#4A2511"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Render leaves */}
      <g>
        {leaves.map((leaf) => (
          <use
            key={`${type}-leaf-${leaf.x}-${leaf.y}`}
            href={`#leaf-${type}`}
            x={leaf.x}
            y={leaf.y}
            transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y}) scale(0.8)`}
          />
        ))}
      </g>

      {/* Render flowers */}
      <g>
        {flowers.map((flower) => (
          <use
            key={`${type}-${flower.type}-${flower.x}-${flower.y}`}
            href={flower.type === 'bud' ? `#bud-${type}` : `#flower-${type}`}
            x={flower.x}
            y={flower.y}
            transform={`translate(${flower.x} ${flower.y}) scale(${flower.size}) translate(-${flower.x} -${flower.y})`}
          />
        ))}
      </g>
    </svg>
  );
}

// CSS for the swaying animation is defined in lucky-draw.css
