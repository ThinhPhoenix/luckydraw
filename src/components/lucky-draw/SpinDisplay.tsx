import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  winner: string | null;
  rotatingName: string;
  isSpinning: boolean;
}

export function SpinDisplay({ winner, rotatingName, isSpinning }: Props) {
  return (
    <div className="relative flex h-[300px] w-full max-w-3xl items-center justify-center rounded-3xl border-4 border-tet-gold bg-black/40 p-8 shadow-[0_0_50px_rgba(255,0,0,0.3)] backdrop-blur-md md:h-[400px]">
      {/* Decorative corners */}
      <div className="absolute -left-2 -top-2 h-16 w-16 border-l-4 border-t-4 border-tet-gold" />
      <div className="absolute -right-2 -top-2 h-16 w-16 border-r-4 border-t-4 border-tet-gold" />
      <div className="absolute -bottom-2 -left-2 h-16 w-16 border-b-4 border-l-4 border-tet-gold" />
      <div className="absolute -bottom-2 -right-2 h-16 w-16 border-b-4 border-r-4 border-tet-gold" />

      <div className="text-center">
        <AnimatePresence mode="wait">
          {winner ? (
            <motion.div
              key="winner"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <div className="mb-4 text-2xl font-medium text-tet-cream uppercase tracking-widest font-playfair">
                Người chiến thắng
              </div>
              <div className="text-6xl font-black font-dancing text-white drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] md:text-8xl text-gold-gradient">
                {winner}
              </div>
            </motion.div>
          ) : (
            <motion.div key="rotating" className="flex flex-col items-center">
              <div className="mb-4 text-xl font-medium text-white/60 font-playfair">
                {isSpinning ? 'Đang quay số...' : 'Sẵn sàng...'}
              </div>
              <div
                className={`
                  text-5xl font-bold font-dancing text-white transition-all duration-100 md:text-7xl
                  ${isSpinning ? 'blur-sm opacity-80 scale-95' : 'opacity-100'}
                `}
              >
                {rotatingName || 'Chúc Mừng Năm Mới'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
