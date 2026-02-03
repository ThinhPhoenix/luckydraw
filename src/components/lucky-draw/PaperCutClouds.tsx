import { useEffect, useRef, useState } from 'react';

interface CloudConfig {
  id: number;
  path: string;
  x: number;
  y: number;
  scale: number;
  duration: number;
  delay: number;
  color: string;
  layer: 1 | 2;
}

// Redesigned with smooth cubic Bezier curves for paper-cut aesthetic
const CLOUD_PATHS = [
  // Cloud 1: Classic fluffy - smooth continuous curves
  'M30,75 C45,55 65,50 85,55 C105,45 130,40 155,50 C180,45 205,55 220,75 C235,90 230,110 215,120 C195,135 165,130 145,125 C125,135 95,130 75,125 C55,130 35,125 25,115 C15,105 15,90 30,75Z',

  // Cloud 2: Elegant layered - gentle waves
  'M40,70 C55,50 80,55 100,50 C125,42 155,48 180,55 C205,50 225,65 230,85 C235,105 220,120 200,125 C175,132 145,128 120,130 C95,128 65,132 45,125 C25,118 20,100 30,85 C35,78 38,73 40,70Z',

  // Cloud 3: Organic flow - Asian paper-cut inspired
  'M35,80 C50,60 75,65 95,58 C120,50 150,55 175,60 C200,55 225,70 235,90 C240,108 225,125 205,130 C180,138 150,132 125,135 C100,132 70,138 50,130 C30,122 20,105 25,88 C28,82 32,78 35,80Z',

  // Cloud 4: Artistic layered - multiple soft peaks
  'M45,75 C60,58 85,62 105,55 C130,48 160,52 185,58 C210,52 235,68 240,88 C245,108 230,122 210,128 C185,135 155,130 130,132 C105,130 75,135 55,128 C35,120 25,102 30,85 C33,78 40,75 45,75Z',
];

const CLOUD_COLORS = [
  '#f4e4bc', // Rice paper
  '#ffd700', // Gold
  '#fff8dc', // Cream
  '#f5f5dc', // Beige
  '#faf0e6', // Linen
];

export function PaperCutClouds() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clouds, setClouds] = useState<CloudConfig[]>([]);
  const [isSafari, setIsSafari] = useState(false);

  // Detect Safari browser on mount
  useEffect(() => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent,
    );
    setIsSafari(isSafariBrowser);
  }, []);

  // Generate clouds on mount
  useEffect(() => {
    const generateClouds = (): CloudConfig[] => {
      const newClouds: CloudConfig[] = [];
      let id = 0;

      // Layer 1: Background giants (8 clouds) - full page coverage including header
      for (let i = 0; i < 8; i++) {
        newClouds.push({
          id: id++,
          path: CLOUD_PATHS[Math.floor(Math.random() * CLOUD_PATHS.length)],
          x: Math.random() * 100,
          y: Math.random() * 85, // Full coverage 0-85% (includes header)
          scale: 0.8 + Math.random() * 0.7, // 0.8-1.5x
          duration: 35 + Math.random() * 10, // 35-45s
          delay: -(Math.random() * 45), // Random negative delay for spread
          color: CLOUD_COLORS[Math.floor(Math.random() * CLOUD_COLORS.length)],
          layer: 1,
        });
      }

      // Layer 2: Midground detail (6 clouds) - overlapping coverage
      for (let i = 0; i < 6; i++) {
        newClouds.push({
          id: id++,
          path: CLOUD_PATHS[Math.floor(Math.random() * CLOUD_PATHS.length)],
          x: Math.random() * 100,
          y: Math.random() * 80 + 5, // Coverage 5-85% (includes header area)
          scale: 0.4 + Math.random() * 0.5, // 0.4-0.9x
          duration: 25 + Math.random() * 10, // 25-35s (faster)
          delay: -(Math.random() * 35),
          color: CLOUD_COLORS[Math.floor(Math.random() * CLOUD_COLORS.length)],
          layer: 2,
        });
      }

      return newClouds;
    };

    setClouds(generateClouds());
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate parallax offset for each layer
  const getParallaxStyle = (layer: 1 | 2) => {
    const multiplier = layer === 1 ? 0.5 : 1.5; // Layer 1: subtle, Layer 2: pronounced
    return {
      transform: `translate(${mousePosition.x * 30 * multiplier}px, ${mousePosition.y * 20 * multiplier}px)`,
    };
  };

  const layer1Clouds = clouds.filter((c) => c.layer === 1);
  const layer2Clouds = clouds.filter((c) => c.layer === 2);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
    >
      {/* SVG Filters for paper texture and shadows */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="paper-texture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0"
              in="noise"
              result="coloredNoise"
            />
            <feComposite
              operator="in"
              in="coloredNoise"
              in2="SourceGraphic"
              result="composite"
            />
            <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
          </filter>

          {/* Enhanced drop shadow filter with better cross-browser compatibility */}
          <filter
            id="cloud-shadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feOffset in="blur" dx="6" dy="6" result="offsetBlur" />
            <feComponentTransfer in="offsetBlur" result="shadowMatrix">
              <feFuncA type="linear" slope="0.25" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="shadowMatrix" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Background clouds */}
      <div
        className="cloud-layer-1 absolute inset-0 will-change-transform"
        style={getParallaxStyle(1)}
      >
        {layer1Clouds.map((cloud) => (
          <PaperCutCloud key={cloud.id} config={cloud} isSafari={isSafari} />
        ))}
      </div>

      {/* Layer 2: Midground clouds */}
      <div
        className="cloud-layer-2 absolute inset-0 will-change-transform"
        style={getParallaxStyle(2)}
      >
        {layer2Clouds.map((cloud) => (
          <PaperCutCloud key={cloud.id} config={cloud} isSafari={isSafari} />
        ))}
      </div>

      {/* Paper grain overlay with mix-blend-mode fallback */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none grain-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

function PaperCutCloud({
  config,
  isSafari,
}: {
  config: CloudConfig;
  isSafari: boolean;
}) {
  const { path, x, y, scale, duration, delay, color } = config;

  return (
    <div
      className="absolute cloud-drift"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `cloud-drift ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg
        viewBox="0 0 250 150"
        className="paper-cut-cloud"
        style={{
          width: `${250 * scale}px`,
          height: `${150 * scale}px`,
          // Use CSS drop-shadow for Safari, SVG filter for others
          filter: isSafari
            ? 'drop-shadow(6px 6px 3px rgba(0, 0, 0, 0.25))'
            : 'url(#cloud-shadow)',
          shapeRendering: 'geometricPrecision',
        }}
        aria-hidden="true"
      >
        {/* Main cloud shape with smooth paper-cut styling */}
        <path
          d={path}
          fill={color}
          stroke="#851718"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner highlight for depth */}
        <path
          d={path}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
          strokeLinecap="round"
          transform="translate(-2,-2)"
          opacity="0.7"
        />

        {/* Subtle inner shadow layer */}
        <path
          d={path}
          fill="rgba(0,0,0,0.08)"
          transform="translate(3,3)"
          style={{ mixBlendMode: 'multiply' }}
        />
      </svg>
    </div>
  );
}
