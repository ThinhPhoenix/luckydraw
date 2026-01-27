import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';

interface Props {
  winner: string | null;
  rotatingName: string;
  isSpinning: boolean;
}

export function SpinDisplay({ winner, rotatingName, isSpinning }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-[300px] w-full max-w-3xl items-center justify-center rounded-3xl border-4 border-tet-gold bg-black/40 p-8 shadow-[0_0_50px_rgba(255,0,0,0.3)] backdrop-blur-md md:h-[400px] overflow-hidden transition-shadow hover:shadow-[0_0_80px_rgba(255,215,0,0.4)]"
    >
      {/* Decorative corners */}
      <div className="absolute -left-2 -top-2 h-16 w-16 border-l-4 border-t-4 border-tet-gold" />
      <div className="absolute -right-2 -top-2 h-16 w-16 border-r-4 border-t-4 border-tet-gold" />
      <div className="absolute -bottom-2 -left-2 h-16 w-16 border-b-4 border-l-4 border-tet-gold" />
      <div className="absolute -bottom-2 -right-2 h-16 w-16 border-b-4 border-r-4 border-tet-gold" />

      <div className="text-center w-full">
        <AnimatePresence mode="wait">
          {winner ? (
            <motion.div
              key="winner"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: [1, 1.2, 1], opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-2xl font-medium text-tet-cream uppercase tracking-widest font-playfair"
              >
                Người chiến thắng
              </motion.div>
              <div className="relative">
                <div className="text-6xl font-black font-dancing text-white drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] md:text-8xl text-gold-gradient animate-[pulse_3s_ease-in-out_infinite]">
                  {winner}
                </div>
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-[shimmer_2s_infinite]" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="rotating"
              className="flex flex-col items-center w-full"
            >
              <div className="mb-4 text-xl font-medium text-white/60 font-playfair">
                {isSpinning ? 'Đang quay số...' : 'Sẵn sàng...'}
              </div>

              {/* Slot Machine Effect Container */}
              <div className="relative h-32 w-full overflow-hidden flex items-center justify-center">
                <motion.div
                  key={rotatingName} // Triggers animation on name change
                  initial={{ y: 50, opacity: 0.5, filter: 'blur(5px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -50, opacity: 0.5, filter: 'blur(5px)' }}
                  transition={{ duration: 0.1 }} // Fast transition for slot effect
                  className={`
                      text-5xl font-bold font-dancing text-white md:text-7xl absolute
                      ${isSpinning ? 'text-tet-gold/90' : 'text-white'}
                    `}
                >
                  {rotatingName || 'Chúc Mừng Năm Mới'}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
