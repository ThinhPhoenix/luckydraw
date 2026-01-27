import { motion } from 'framer-motion';

interface Props {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function SpinButton({ onClick, disabled, loading }: Props) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      animate={
        !disabled && !loading
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 20px rgba(255,0,0,0.5)',
                '0 0 30px rgba(255,215,0,0.6)',
                '0 0 20px rgba(255,0,0,0.5)',
              ],
            }
          : {}
      }
      transition={
        !disabled && !loading
          ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          : {}
      }
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative flex h-32 w-32 items-center justify-center rounded-full 
        bg-gradient-to-br from-tet-red to-tet-deep-red shadow-[0_0_20px_rgba(255,0,0,0.5)] 
        transition-all duration-300
        ${disabled ? 'cursor-not-allowed opacity-50 grayscale' : 'cursor-pointer'}
      `}
    >
      {/* Paddle Handle Look (Stylized) */}
      <div className="absolute -bottom-8 h-16 w-8 rounded-b-lg bg-[#3E2723] shadow-md border-x-2 border-b-2 border-tet-gold/30" />

      {/* Paddle Face */}
      <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-tet-gold to-tet-cream shadow-inner border-2 border-tet-amber">
        {/* Inner Text/Icon */}
        <span
          className={`text-2xl font-black font-playfair tracking-widest text-tet-deep-red ${loading ? 'animate-spin' : ''}`}
        >
          {loading ? '...' : 'QUAY'}
        </span>
      </div>

      {/* Decorative Ring - Only show ping on hover to avoid distraction with the main pulse */}
      <div className="absolute inset-0 rounded-full border-4 border-tet-gold opacity-50 group-hover:animate-ping" />
    </motion.button>
  );
}
