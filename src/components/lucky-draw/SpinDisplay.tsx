import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { AwardCategory } from '@/types/lucky-draw.types';

interface Props {
  winner: string | null;
  rotatingName: string;
  isSpinning: boolean;
  currentCategory: AwardCategory | null;
}

const TIER_NAMES: Record<number, string> = {
  1: 'Vàng',
  2: 'Bạc',
  3: 'Đồng',
  4: 'Khuyến khích',
};

function getTierBadgeColor(tier: number) {
  switch (tier) {
    case 1:
      return 'bg-yellow-500';
    case 2:
      return 'bg-gray-400';
    case 3:
      return 'bg-orange-600';
    default:
      return 'bg-blue-500';
  }
}

function getTierName(tier: number): string {
  return TIER_NAMES[tier] || `Tier ${tier}`;
}

const springConfig = {
  stiffness: 150,
  damping: 25,
  mass: 0.5,
};

const shadowSpringConfig = {
  stiffness: 80,
  damping: 35,
  mass: 0.3,
};

export function SpinDisplay({
  winner,
  rotatingName,
  isSpinning,
  currentCategory,
}: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glareX = useMotionValue(0);
  const glareY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(y, [-100, 100], [8, -8]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(x, [-100, 100], [-8, 8]),
    springConfig,
  );
  const scale = useSpring(useTransform(y, [-100, 100], [1.02, 1.02]), {
    ...springConfig,
    stiffness: 100,
    damping: 30,
  });

  const glareOpacity = useSpring(
    useTransform(y, [-100, 100], [0.3, 0.1]),
    shadowSpringConfig,
  );
  const shadowIntensity = useSpring(
    useTransform(y, [-100, 100], [80, 50]),
    shadowSpringConfig,
  );

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);

    glareX.set((event.clientX - rect.left) / rect.width);
    glareY.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    glareX.set(0.5);
    glareY.set(0.5);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;

    const touch = event.touches[0];
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(touch.clientX - centerX);
    y.set(touch.clientY - centerY);
    glareX.set((touch.clientX - rect.left) / rect.width);
    glareY.set((touch.clientY - rect.top) / rect.height);
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;

    const touch = event.touches[0];
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(touch.clientX - centerX);
    y.set(touch.clientY - centerY);
    glareX.set((touch.clientX - rect.left) / rect.width);
    glareY.set((touch.clientY - rect.top) / rect.height);
  }

  function handleTouchEnd() {
    x.set(0);
    y.set(0);
    glareX.set(0.5);
    glareY.set(0.5);
  }

  return (
    <motion.div
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        scale: prefersReducedMotion ? 1 : scale,
        perspective: 1200,
        boxShadow: `0 0 ${shadowIntensity.get()}px rgba(255,215,0,${0.3 + Math.abs(y.get()) / 200})`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative flex h-[300px] w-full max-w-3xl items-center justify-center rounded-3xl border-4 border-tet-gold bg-black/40 p-8 backdrop-blur-md md:h-[400px] overflow-hidden will-change-transform [transform-style:preserve-3d]"
    >
      {/* Glare effect */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none [transform:translateZ(40px)]"
          style={{
            background: `radial-gradient(circle at ${glareX.get() * 100}% ${glareY.get() * 100}%, rgba(255,255,255,${glareOpacity.get()}), transparent 60%)`,
            opacity: glareOpacity,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Decorative corners with 3D depth */}
      <motion.div
        className="absolute -left-2 -top-2 h-16 w-16 border-l-4 border-t-4 border-tet-gold [transform:translateZ(20px)]"
        style={{ opacity: 0.9 + Math.abs(y.get()) / 500 }}
      />
      <motion.div
        className="absolute -right-2 -top-2 h-16 w-16 border-r-4 border-t-4 border-tet-gold [transform:translateZ(20px)]"
        style={{ opacity: 0.9 + Math.abs(y.get()) / 500 }}
      />
      <motion.div
        className="absolute -bottom-2 -left-2 h-16 w-16 border-b-4 border-l-4 border-tet-gold [transform:translateZ(20px)]"
        style={{ opacity: 0.9 + Math.abs(y.get()) / 500 }}
      />
      <motion.div
        className="absolute -bottom-2 -right-2 h-16 w-16 border-b-4 border-r-4 border-tet-gold [transform:translateZ(20px)]"
        style={{ opacity: 0.9 + Math.abs(y.get()) / 500 }}
      />

      {/* Inner shadow for depth */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none [transform:translateZ(10px)]"
        style={{
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.4)',
        }}
      />

      <div className="text-center w-full relative [transform:translateZ(30px)]">
        <AnimatePresence mode="wait">
          {winner ? (
            <motion.div
              key="winner"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: [1, 1.2, 1], opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center [transform-style:preserve-3d]"
            >
              {/* Award Info */}
              {currentCategory && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-2 flex items-center gap-2 [transform:translateZ(15px)]"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white ${getTierBadgeColor(currentCategory.tier)}`}
                  >
                    {currentCategory.tier}
                  </span>
                  <span className="text-sm font-medium text-tet-cream">
                    {getTierName(currentCategory.tier)}
                  </span>
                  <span className="text-lg font-medium text-tet-gold font-playfair">
                    {currentCategory.name}
                  </span>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-2xl font-medium text-tet-cream uppercase tracking-widest font-playfair [transform:translateZ(20px)]"
              >
                Người chiến thắng
              </motion.div>
              <motion.div
                className="relative [transform:translateZ(40px)]"
                animate={{
                  textShadow: `0 0 ${15 + Math.abs(y.get()) / 10}px rgba(255,215,0,${0.8 + Math.abs(y.get()) / 500})`,
                }}
              >
                <div className="text-6xl font-black font-dancing text-white md:text-8xl text-gold-gradient animate-[pulse_3s_ease-in-out_infinite]">
                  {winner}
                </div>
                {/* Enhanced shimmer overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-[shimmer_2s_infinite]"
                  style={{ mixBlendMode: 'screen' }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="rotating"
              className="flex flex-col items-center w-full [transform-style:preserve-3d]"
            >
              {/* Award Info during spin */}
              {currentCategory && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-2 flex items-center gap-2 [transform:translateZ(15px)]"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white ${getTierBadgeColor(currentCategory.tier)}`}
                  >
                    {currentCategory.tier}
                  </span>
                  <span className="text-sm font-medium text-tet-cream">
                    {getTierName(currentCategory.tier)}
                  </span>
                  <span className="text-lg font-medium text-tet-gold font-playfair">
                    {currentCategory.name}
                  </span>
                </motion.div>
              )}
              <motion.div
                className="mb-4 text-xl font-medium text-white/60 font-playfair [transform:translateZ(15px)]"
                animate={{ opacity: isSpinning ? 0.8 : 0.6 }}
              >
                {isSpinning ? 'Đang quay số...' : 'Sẵn sàng...'}
              </motion.div>

              {/* Slot Machine Effect Container */}
              <div className="relative h-32 w-full overflow-hidden flex items-center justify-center [transform:translateZ(25px)]">
                <motion.div
                  key={rotatingName}
                  initial={{ y: 50, opacity: 0.5, filter: 'blur(5px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -50, opacity: 0.5, filter: 'blur(5px)' }}
                  transition={{ duration: 0.1 }}
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
