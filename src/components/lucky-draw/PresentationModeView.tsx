import { Button } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import type { AwardCategory } from '@/types/lucky-draw.types';

interface Props {
  winner: string | null;
  rotatingName: string;
  isSpinning: boolean;
  currentCategory: string | null;
  categories: AwardCategory[];
  onExitPresentation: () => void;
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

export function PresentationModeView({
  winner,
  rotatingName,
  isSpinning,
  currentCategory,
  categories,
  onExitPresentation,
}: Props) {
  const getCurrentCategory = () => {
    return categories.find((c) => c.id === currentCategory);
  };

  const currentCat = getCurrentCategory();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-red-950">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-red-900 to-red-950" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-[80vh] w-full max-w-7xl items-center justify-center"
        >
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            style={{ perspective: 1200 }}
          >
            <motion.div className="relative h-full w-full max-h-[700px] flex items-center justify-center rounded-3xl border-[8px] border-tet-gold bg-black/50 backdrop-blur-xl shadow-[0_0_100px_rgba(255,215,0,0.4)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-tet-gold/10 via-transparent to-tet-gold/10" />

              <div className="relative z-10 text-center w-full h-full flex flex-col items-center justify-center p-12">
                <AnimatePresence mode="wait">
                  {winner ? (
                    <motion.div
                      key="winner"
                      initial={{ scale: 0.3, opacity: 0, y: 100 }}
                      animate={{ scale: [1, 1.3, 1], opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="flex flex-col items-center"
                    >
                      {currentCat && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="mb-4 flex items-center gap-3"
                        >
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold text-white ${getTierBadgeColor(currentCat.tier)}`}
                          >
                            {currentCat.tier}
                          </span>
                          <span className="text-xl font-medium text-tet-cream">
                            {getTierName(currentCat.tier)}
                          </span>
                          <span className="text-3xl font-medium text-tet-gold font-playfair">
                            {currentCat.name}
                          </span>
                        </motion.div>
                      )}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8 text-4xl font-medium text-tet-cream uppercase tracking-[0.3em] font-playfair"
                      >
                        Người Chiến Thắng
                      </motion.div>
                      <motion.div
                        className="relative"
                        animate={{
                          textShadow: `0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,215,0,0.4)`,
                        }}
                      >
                        <div className="text-[9rem] md:text-[10rem] font-black font-dancing text-white drop-shadow-[0_0_30px_rgba(255,215,0,1)] leading-none">
                          {winner}
                        </div>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          style={{ mixBlendMode: 'screen' }}
                        />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="rotating"
                      className="flex flex-col items-center w-full"
                    >
                      {currentCat && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mb-4 flex items-center gap-3"
                        >
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold text-white ${getTierBadgeColor(currentCat.tier)}`}
                          >
                            {currentCat.tier}
                          </span>
                          <span className="text-xl font-medium text-tet-cream">
                            {getTierName(currentCat.tier)}
                          </span>
                          <span className="text-3xl font-medium text-tet-gold font-playfair">
                            {currentCat.name}
                          </span>
                        </motion.div>
                      )}
                      <motion.div
                        className="mb-8 text-3xl font-medium text-white/70 font-playfair"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {isSpinning ? 'ĐANG QUAY SỐ...' : 'SẴN SÀNG...'}
                      </motion.div>

                      <div className="relative h-[300px] w-full overflow-hidden flex items-center justify-center">
                        <motion.div
                          key={rotatingName}
                          initial={{ y: 100, opacity: 0, filter: 'blur(10px)' }}
                          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                          exit={{ y: -100, opacity: 0, filter: 'blur(10px)' }}
                          transition={{ duration: 0.08 }}
                          className="text-[8rem] md:text-[9rem] font-bold font-dancing text-white"
                        >
                          {rotatingName || 'Chúc Mừng Năm Mới'}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {currentCat && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-[20vh] w-full max-w-7xl flex items-center justify-center"
          >
            <div className="flex items-center gap-4 rounded-2xl border-4 border-tet-gold bg-black/60 backdrop-blur-xl px-8 py-4 shadow-[0_0_50px_rgba(255,215,0,0.3)]">
              <span className="text-5xl">🏆</span>
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-white ${getTierBadgeColor(currentCat.tier)}`}
                >
                  {currentCat.tier}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-tet-cream font-medium">
                      {getTierName(currentCat.tier)}
                    </span>
                  </div>
                  <div className="text-2xl font-medium text-tet-gold font-playfair uppercase tracking-wider">
                    {currentCat.name}
                  </div>
                  <div className="text-xl text-white/80 font-montserrat">
                    {currentCat.remaining > 0
                      ? `${currentCat.remaining} còn lại`
                      : 'Đã đủ'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <Button
          type="text"
          onClick={onExitPresentation}
          className="absolute top-4 left-4 !text-white/50 !hover:!text-white !transition-colors !z-50"
        >
          <span className="text-sm">⚙️ Exit Presentation</span>
        </Button>
      </div>
    </div>
  );
}
