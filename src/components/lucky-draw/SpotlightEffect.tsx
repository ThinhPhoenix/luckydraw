import { motion } from 'framer-motion';

interface SpotlightEffectProps {
  isActive: boolean;
  intensity?: 'subtle' | 'dramatic';
}

export function SpotlightEffect({
  isActive,
  intensity = 'dramatic',
}: SpotlightEffectProps) {
  const opacity = intensity === 'dramatic' ? 0.85 : 0.5;

  return (
    <motion.div
      className="fixed inset-0 z-40 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isActive ? 1 : 0,
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Radial vignette - dark edges, bright center */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 20%, rgba(0,0,0,${opacity}) 60%, rgba(0,0,0,${opacity}) 100%)`,
        }}
      />

      {/* Pulsing center glow */}
      {isActive && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, rgba(255,215,0,0.15) 0%, transparent 50%)`,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
}
