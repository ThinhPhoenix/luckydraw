import Assets from '@/assets';
import { useEffect, useRef, useState } from 'react';

interface CloudConfig {
  id: number;
  path: string;
  x: number;
  y: number;
  scale: number;
  duration: number;
  delay: number;
  gradientId: string;
  strokeColor: string;
  detailStrokeColor: string;
  layer: 1 | 2;
  hasHorse?: boolean;
}

// Ruyi auspicious cloud body path
const RUYI_BODY_PATH =
  'M 40,80 C 10,80 0,50 30,35 C 30,10 70,0 90,25 C 100,5 150,5 160,35 C 190,20 200,60 150,85 Q 120,100 80,85 Q 60,110 40,80 Z';

// Internal decorative swirl patterns (3 curves)
const RUYI_DETAIL_PATHS = [
  'M 45,70 C 30,70 30,50 45,45 C 55,40 65,55 55,65', // Left swirl
  'M 90,35 C 80,30 80,50 95,55 C 110,60 115,40 100,30', // Center swirl
  'M 145,70 C 160,65 165,45 150,40 C 135,35 130,55 140,65', // Right swirl
];

// Ruyi cloud styles with appropriate stroke contrasts
const RUYI_STYLES = [
  {
    gradientId: 'grad-ruyi-rice-paper',
    strokeColor: '#851718', // Dark red stroke
    detailStrokeColor: '#851718', // Dark red details
    name: 'ricePaper',
  },
  {
    gradientId: 'grad-ruyi-gold',
    strokeColor: '#ffffff', // White stroke
    detailStrokeColor: '#ffffff', // White details
    name: 'gold',
  },
  {
    gradientId: 'grad-ruyi-cream',
    strokeColor: '#d4af37', // Gold stroke
    detailStrokeColor: '#d4af37', // Gold details
    name: 'cream',
  },
  {
    gradientId: 'grad-ruyi-beige',
    strokeColor: '#8b4513', // Saddle brown stroke
    detailStrokeColor: '#8b4513', // Saddle brown details
    name: 'beige',
  },
  {
    gradientId: 'grad-ruyi-linen',
    strokeColor: '#cd853f', // Peru stroke
    detailStrokeColor: '#cd853f', // Peru details
    name: 'linen',
  },
];

export function PaperCutClouds() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clouds, setClouds] = useState<CloudConfig[]>([]);
  const [isSafari, setIsSafari] = useState(false);
  const [useSimpleTexture, setUseSimpleTexture] = useState(false);

  // Detect Safari browser on mount
  useEffect(() => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent,
    );
    setIsSafari(isSafariBrowser);
    // Use simple CSS texture fallback for Safari
    setUseSimpleTexture(isSafariBrowser);
  }, []);

  // Generate clouds on mount
  useEffect(() => {
    const generateClouds = (): CloudConfig[] => {
      const newClouds: CloudConfig[] = [];
      let id = 0;

      // Determine number of horses (0-2)
      const horseCount = Math.floor(Math.random() * 5);
      const totalClouds = 14;
      const horseIndices = new Set<number>();

      // Randomly select unique cloud indices for horses
      while (
        horseIndices.size < horseCount &&
        horseIndices.size < totalClouds
      ) {
        horseIndices.add(Math.floor(Math.random() * totalClouds));
      }

      // Layer 1: Background giants (8 clouds) - full page coverage including header
      // Ruyi clouds are 10% larger: 0.9-1.5x (vs old 0.8-1.5x)
      for (let i = 0; i < 8; i++) {
        const style =
          RUYI_STYLES[Math.floor(Math.random() * RUYI_STYLES.length)];
        newClouds.push({
          id: id++,
          path: RUYI_BODY_PATH,
          x: Math.random() * 100,
          y: Math.random() * 85, // Full coverage 0-85% (includes header)
          scale: 0.9 + Math.random() * 0.6, // 0.9-1.5x
          duration: 35 + Math.random() * 10, // 35-45s
          delay: -(Math.random() * 45), // Random negative delay for spread
          gradientId: style.gradientId,
          strokeColor: style.strokeColor,
          detailStrokeColor: style.detailStrokeColor,
          layer: 1,
          hasHorse: horseIndices.has(i),
        });
      }

      // Layer 2: Midground detail (6 clouds) - overlapping coverage
      // Ruyi clouds are 10% larger: 0.5-0.9x (vs old 0.4-0.9x)
      for (let i = 0; i < 6; i++) {
        const style =
          RUYI_STYLES[Math.floor(Math.random() * RUYI_STYLES.length)];
        newClouds.push({
          id: id++,
          path: RUYI_BODY_PATH,
          x: Math.random() * 100,
          y: Math.random() * 80 + 5, // Coverage 5-85% (includes header area)
          scale: 0.5 + Math.random() * 0.4, // 0.5-0.9x
          duration: 25 + Math.random() * 10, // 25-35s (faster)
          delay: -(Math.random() * 35),
          gradientId: style.gradientId,
          strokeColor: style.strokeColor,
          detailStrokeColor: style.detailStrokeColor,
          layer: 2,
          hasHorse: horseIndices.has(8 + i),
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
      {/* SVG Filters and Gradients for paper texture and shadows */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Rice Paper: Light top-left, warm center, darker edge */}
          <radialGradient id="grad-ruyi-rice-paper" cx="45%" cy="40%" r="75%">
            <stop offset="0%" stopColor="#fffef5" />
            <stop offset="50%" stopColor="#f4e4bc" />
            <stop offset="100%" stopColor="#e0d0a0" />
          </radialGradient>

          {/* Gold: Bright center, rich gold, bronze edge */}
          <radialGradient id="grad-ruyi-gold" cx="30%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#fff8dc" />
            <stop offset="40%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#daa520" />
          </radialGradient>

          {/* Cream: Soft white center, creamy middle, warm edge */}
          <radialGradient id="grad-ruyi-cream" cx="45%" cy="45%" r="75%">
            <stop offset="0%" stopColor="#fffdf5" />
            <stop offset="60%" stopColor="#fff8dc" />
            <stop offset="100%" stopColor="#f0e68c" />
          </radialGradient>

          {/* Beige: Light top, natural beige, earthy edge */}
          <radialGradient id="grad-ruyi-beige" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fffdf0" />
            <stop offset="55%" stopColor="#f5f5dc" />
            <stop offset="100%" stopColor="#d4c4a8" />
          </radialGradient>

          {/* Linen: Soft white, linen tone, grayish edge */}
          <radialGradient id="grad-ruyi-linen" cx="35%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#fffdf5" />
            <stop offset="50%" stopColor="#faf0e6" />
            <stop offset="100%" stopColor="#e8e0d0" />
          </radialGradient>

          {/* Paper fiber texture pattern - 6-8% visibility */}
          <pattern
            id="paper-fiber"
            x="0"
            y="0"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <rect width="30" height="30" fill="transparent" />
            {/* Horizontal fibers */}
            <path
              d="M0,8 Q15,3 30,8"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M0,15 Q15,20 30,15"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="0.6"
              fill="none"
            />
            <path
              d="M0,22 Q15,17 30,22"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="0.8"
              fill="none"
            />
            {/* Vertical fibers */}
            <path
              d="M8,0 Q3,15 8,30"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="0.6"
              fill="none"
            />
            <path
              d="M15,0 Q20,15 15,30"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M22,0 Q27,15 22,30"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="0.6"
              fill="none"
            />
            {/* Cross fibers */}
            <path
              d="M0,0 Q15,15 30,0"
              stroke="rgba(0,0,0,0.03)"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M0,30 Q15,15 30,30"
              stroke="rgba(0,0,0,0.03)"
              strokeWidth="0.5"
              fill="none"
            />
          </pattern>

          {/* Inner vignette shadow (12% dark at edges) */}
          <radialGradient id="grad-inner-shadow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="85%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
          </radialGradient>

          {/* Top-left highlight stroke */}
          <linearGradient
            id="grad-highlight"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

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
          <RuyiCloud
            key={cloud.id}
            config={cloud}
            isSafari={isSafari}
            useSimpleTexture={useSimpleTexture}
          />
        ))}
      </div>

      {/* Layer 2: Midground clouds */}
      <div
        className="cloud-layer-2 absolute inset-0 will-change-transform"
        style={getParallaxStyle(2)}
      >
        {layer2Clouds.map((cloud) => (
          <RuyiCloud
            key={cloud.id}
            config={cloud}
            isSafari={isSafari}
            useSimpleTexture={useSimpleTexture}
          />
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

function RuyiCloud({
  config,
  isSafari,
  useSimpleTexture,
}: {
  config: CloudConfig;
  isSafari: boolean;
  useSimpleTexture: boolean;
}) {
  const {
    path,
    x,
    y,
    scale,
    duration,
    delay,
    gradientId,
    strokeColor,
    detailStrokeColor,
    hasHorse,
  } = config;

  const horseScale = scale * 0.85;

  return (
    <div
      className="absolute ruyi-cloud-wrapper"
      style={
        {
          left: `${x}%`,
          top: `${y}%`,
          '--drift-duration': `${duration}s`,
          '--drift-delay': `${delay}s`,
        } as React.CSSProperties
      }
    >
      <div
        className="ruyi-cloud-inner"
        style={
          {
            '--rotate-duration': `${duration * 1.5}s`,
            '--rotate-delay': `${delay - 5}s`,
          } as React.CSSProperties
        }
      >
        <svg
          viewBox="0 0 200 130"
          className="ruyi-cloud"
          style={{
            width: `${200 * scale}px`,
            height: `${130 * scale}px`,
            // "Lifted paper" shadow effect
            filter: isSafari
              ? 'drop-shadow(0px 8px 6px rgba(0, 0, 0, 0.25))'
              : 'url(#cloud-shadow)',
            shapeRendering: 'geometricPrecision',
          }}
          aria-hidden="true"
        >
          {/* Layer 1: Ruyi body with 3-stop radial gradient */}
          <path d={path} fill={`url(#${gradientId})`} />

          {/* Layer 2: Paper fiber texture (6-8% visibility with multiply blend) */}
          {!useSimpleTexture && (
            <path
              d={path}
              fill="url(#paper-fiber)"
              opacity="0.75"
              style={{ mixBlendMode: 'multiply' }}
            />
          )}

          {/* CSS fallback texture for Safari */}
          {useSimpleTexture && (
            <path
              d={path}
              fill="transparent"
              className="paper-fiber-css-fallback"
            />
          )}

          {/* Layer 3: Internal decorative swirl patterns (always visible, 90% opacity, 3px) */}
          <g
            fill="none"
            stroke={detailStrokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          >
            {RUYI_DETAIL_PATHS.map((detailPath) => (
              <path key={detailPath} d={detailPath} />
            ))}
          </g>

          {/* Layer 4: Inner vignette shadow */}
          <path d={path} fill="url(#grad-inner-shadow)" />

          {/* Layer 5: Main stroke outline (3px like reference) */}
          <path
            d={path}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Layer 6: Top-left gradient highlight for lifted paper effect */}
          <path
            d={path}
            fill="none"
            stroke="url(#grad-highlight)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </svg>

        {/* Horse SVG attached to cloud (if hasHorse is true) */}
        {hasHorse && (
          <img
            src={Assets.Horse}
            alt="Horse on cloud"
            className="absolute -scale-x-100"
            style={{
              width: `${(1080 * horseScale) / 8}px`,
              height: `${(1080 * horseScale) / 8}px`,
              left: '0%',
              top: '10%',
              transform: 'translate(-50%, -50%)',
              filter: isSafari
                ? 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2))'
                : 'url(#cloud-shadow)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}
