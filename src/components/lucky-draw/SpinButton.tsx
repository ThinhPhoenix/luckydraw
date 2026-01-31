import { motion } from 'framer-motion';

interface Props {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

// Roulette wheel segments
const ROULETTE_SEGMENTS = [
  { color: '#d2042d', number: '1' },
  { color: '#000000', number: '2' },
  { color: '#d2042d', number: '3' },
  { color: '#000000', number: '4' },
  { color: '#d2042d', number: '5' },
  { color: '#000000', number: '6' },
  { color: '#d2042d', number: '7' },
  { color: '#000000', number: '8' },
];

export function SpinButton({ onClick, disabled, loading }: Props) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ perspective: '1000px' }}
    >
      {/* Outer rotating gradient ring - only when not loading */}
      {!disabled && !loading && (
        <>
          {/* First rotating ring - slow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              width: '140px',
              height: '140px',
              left: '50%',
              top: '50%',
              x: '-50%',
              y: '-50%',
              background:
                'conic-gradient(from 0deg, #ffd700, #ff0000, #ffd700, #ff0000, #ffd700)',
              padding: '4px',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <div className="h-full w-full rounded-full bg-transparent" />
          </motion.div>

          {/* Second rotating ring - faster, opposite direction */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              width: '152px',
              height: '152px',
              left: '50%',
              top: '50%',
              x: '-50%',
              y: '-50%',
              background:
                'conic-gradient(from 180deg, transparent, rgba(255,215,0,0.8), transparent, rgba(255,0,0,0.8), transparent)',
              padding: '2px',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="h-full w-full rounded-full bg-transparent" />
          </motion.div>

          {/* Sparkle particles around the button */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#ffd700' : '#ff0000',
                  boxShadow: `0 0 10px ${i % 2 === 0 ? '#ffd700' : '#ff0000'}`,
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, Math.cos((i * 60 * Math.PI) / 180) * 80, 0],
                  y: [0, Math.sin((i * 60 * Math.PI) / 180) * 80, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Loading roulette wheel effect */}
      {loading && (
        <>
          {/* Outer spinning blur ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '160px',
              height: '160px',
              left: '50%',
              top: '50%',
              x: '-50%',
              y: '-50%',
              background: `conic-gradient(${ROULETTE_SEGMENTS.map((s, i) => `${s.color} ${i * 45}deg ${(i + 1) * 45}deg`).join(', ')})`,
              filter: 'blur(2px)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Middle spinning ring - faster */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '145px',
              height: '145px',
              left: '50%',
              top: '50%',
              x: '-50%',
              y: '-50%',
              background: `conic-gradient(from 22.5deg, ${ROULETTE_SEGMENTS.map((s, i) => `${s.color === '#d2042d' ? '#ffd700' : '#ffffff'} ${i * 45}deg ${(i + 1) * 45}deg`).join(', ')})`,
              opacity: 0.7,
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Particle burst effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`burst-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#ffd700' : '#ff0000',
                  boxShadow: `0 0 8px ${i % 2 === 0 ? '#ffd700' : '#ff0000'}`,
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, Math.cos((i * 30 * Math.PI) / 180) * 90],
                  y: [0, Math.sin((i * 30 * Math.PI) / 180) * 90],
                  opacity: [1, 0],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        </>
      )}

      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.08 }}
        whileTap={{ scale: disabled ? 1 : 0.92 }}
        animate={
          !disabled && !loading
            ? {
                rotateY: [0, 360],
                scale: [1, 1.03, 1],
                boxShadow: [
                  '0 0 20px rgba(255,0,0,0.5), 0 0 40px rgba(255,215,0,0.3)',
                  '0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,0,0,0.4)',
                  '0 0 20px rgba(255,0,0,0.5), 0 0 40px rgba(255,215,0,0.3)',
                ],
              }
            : loading
              ? {
                  scale: [1, 0.95, 1],
                  boxShadow: [
                    '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,0,0,0.5)',
                    '0 0 50px rgba(255,215,0,1), 0 0 80px rgba(255,0,0,0.7)',
                    '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,0,0,0.5)',
                  ],
                }
              : {}
        }
        transition={
          !disabled && !loading
            ? {
                rotateY: { duration: 4, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                boxShadow: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
            : loading
              ? {
                  scale: { duration: 0.2, repeat: Infinity, ease: 'easeInOut' },
                  boxShadow: {
                    duration: 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }
              : {}
        }
        onClick={onClick}
        disabled={disabled}
        className={`
          group relative flex h-32 w-32 items-center justify-center rounded-full 
          bg-gradient-to-br from-tet-red to-tet-deep-red
          transition-all duration-300
          ${disabled ? 'cursor-not-allowed opacity-50 grayscale' : 'cursor-pointer'}
          ${loading ? 'animate-pulse' : ''}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Paddle Handle Look (Stylized) */}
        <div className="absolute -bottom-8 h-16 w-8 rounded-b-lg bg-[#3E2723] shadow-md border-x-2 border-b-2 border-tet-gold/30" />

        {/* Paddle Face with inner rotation */}
        <motion.div
          className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-tet-gold to-tet-cream shadow-inner border-2 border-tet-amber overflow-hidden"
          animate={
            !disabled && !loading
              ? { rotate: 360 }
              : loading
                ? { rotate: 720 }
                : {}
          }
          transition={
            !disabled && !loading
              ? { duration: 8, repeat: Infinity, ease: 'linear' }
              : loading
                ? { duration: 1, repeat: Infinity, ease: 'linear' }
                : {}
          }
        >
          {/* Inner decorative rings */}
          <div className="absolute inset-2 rounded-full border border-tet-red/20" />
          <div className="absolute inset-4 rounded-full border border-tet-red/10" />

          {/* Loading roulette numbers */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-3xl font-black text-tet-deep-red"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              >
                ?
              </motion.div>
            </div>
          )}

          {/* Inner Text/Icon with counter-rotation to stay readable */}
          {!loading && (
            <motion.span
              className="relative z-10 text-2xl font-black font-playfair tracking-widest text-tet-deep-red"
              animate={!disabled ? { rotate: -360 } : {}}
              transition={
                !disabled
                  ? { duration: 8, repeat: Infinity, ease: 'linear' }
                  : {}
              }
            >
              QUAY
            </motion.span>
          )}

          {/* Shine effect - faster when loading */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"
            animate={
              !disabled && !loading
                ? { x: ['-100%', '100%'] }
                : loading
                  ? { x: ['-100%', '100%'] }
                  : {}
            }
            transition={
              !disabled && !loading
                ? { duration: 2, repeat: Infinity, ease: 'linear' }
                : loading
                  ? { duration: 0.5, repeat: Infinity, ease: 'linear' }
                  : {}
            }
          />
        </motion.div>

        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-tet-gold"
          animate={
            !disabled && !loading
              ? {
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.1, 1],
                }
              : loading
                ? {
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.2, 1],
                    borderColor: ['#ffd700', '#ff0000', '#ffd700'],
                  }
                : {}
          }
          transition={
            !disabled && !loading
              ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              : loading
                ? { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }
                : {}
          }
        />
      </motion.button>
    </div>
  );
}
