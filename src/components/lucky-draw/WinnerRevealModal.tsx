import { Button } from 'antd';
import { motion } from 'framer-motion';
import type { AwardCategory } from '@/types/lucky-draw.types';

interface WinnerRevealModalProps {
  isOpen: boolean;
  winnerName: string | null;
  category: AwardCategory | null;
  onClose: () => void;
}

const TIER_NAMES: Record<number, string> = {
  1: 'Vàng',
  2: 'Bạc',
  3: 'Đồng',
  4: 'Khuyến khích',
};

interface TierTheme {
  borderColor: string;
  shimmerColor: string;
  textGlowColor: string;
  buttonGradient: string;
  buttonTextColor: string;
  medalIcon: string;
  accentTextColor: string;
}

function getTierTheme(tier: number): TierTheme {
  switch (tier) {
    case 1: // Gold
      return {
        borderColor: '#FFD700',
        shimmerColor: 'rgba(255, 215, 0, 0.3)',
        textGlowColor: 'rgba(255, 215, 0, 0.8)',
        buttonGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        buttonTextColor: '#8B4513',
        medalIcon: '🥇',
        accentTextColor: '#FFD700',
      };
    case 2: // Silver
      return {
        borderColor: '#C0C0C0',
        shimmerColor: 'rgba(192, 192, 192, 0.3)',
        textGlowColor: 'rgba(192, 192, 192, 0.8)',
        buttonGradient: 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 100%)',
        buttonTextColor: '#4A5568',
        medalIcon: '🥈',
        accentTextColor: '#E8E8E8',
      };
    case 3: // Bronze
      return {
        borderColor: '#CD7F32',
        shimmerColor: 'rgba(205, 127, 50, 0.3)',
        textGlowColor: 'rgba(205, 127, 50, 0.8)',
        buttonGradient: 'linear-gradient(135deg, #D2691E 0%, #8B4513 100%)',
        buttonTextColor: '#FFF8DC',
        medalIcon: '🥉',
        accentTextColor: '#DEB887',
      };
    default: // Tier 4 - Blue
      return {
        borderColor: '#3B82F6',
        shimmerColor: 'rgba(59, 130, 246, 0.3)',
        textGlowColor: 'rgba(59, 130, 246, 0.8)',
        buttonGradient: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)',
        buttonTextColor: '#FFFFFF',
        medalIcon: '🏅',
        accentTextColor: '#93C5FD',
      };
  }
}

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

export function WinnerRevealModal({
  isOpen,
  winnerName,
  category,
  onClose,
}: WinnerRevealModalProps) {
  if (!isOpen || !winnerName) return null;

  const tier = category?.tier || 4;
  const theme = getTierTheme(tier);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop with blur */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        className="relative z-10 mx-4 w-full max-w-2xl"
        initial={{ y: 100, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 100, scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Main card container */}
        <div
          className="relative overflow-hidden rounded-3xl border-4 p-10 text-center"
          style={{
            background:
              'linear-gradient(135deg, #8b0000 0%, #d2042d 50%, #8b0000 100%)',
            borderColor: theme.borderColor,
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${theme.shimmerColor}`,
          }}
        >
          {/* Animated shimmer overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.shimmerColor}, transparent)`,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Medal icon with glow */}
          <motion.div
            className="mb-6 text-9xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 200,
              delay: 0.2,
            }}
          >
            <motion.span
              animate={{
                textShadow: [
                  `0 0 20px ${theme.textGlowColor}`,
                  `0 0 50px ${theme.textGlowColor}`,
                  `0 0 20px ${theme.textGlowColor}`,
                ],
                filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {theme.medalIcon}
            </motion.span>
          </motion.div>

          {/* Winner announcement text */}
          <motion.div
            className="mb-6 text-2xl font-playfair uppercase tracking-[0.2em]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ color: theme.accentTextColor }}
          >
            ✨ Chúc Mừng Người Chiến Thắng ✨
          </motion.div>

          {/* Winner name in large display - FIXED: removed bg-clip-text to prevent clipping */}
          <motion.div
            className="mb-8 px-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 200,
              delay: 0.5,
            }}
          >
            <div
              className="font-dancing text-7xl md:text-8xl font-bold leading-tight break-words px-2"
              style={{
                color: theme.accentTextColor,
                textShadow: `0 0 30px ${theme.textGlowColor}, 0 4px 8px rgba(0,0,0,0.5)`,
                WebkitTextStroke: `1px ${theme.borderColor}`,
              }}
            >
              {winnerName}
            </div>
          </motion.div>

          {/* Award information */}
          {category && (
            <motion.div
              className="mb-10 flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white shadow-lg ${getTierBadgeColor(category.tier)}`}
                style={{
                  boxShadow: `0 4px 12px rgba(0,0,0,0.4), 0 0 20px ${theme.shimmerColor}`,
                  border: `2px solid ${theme.borderColor}`,
                }}
              >
                {category.tier}
              </span>
              <div className="text-left">
                <div
                  className="font-playfair text-xl"
                  style={{ color: theme.accentTextColor }}
                >
                  {getTierName(category.tier)}
                </div>
                <div className="text-base text-white/90">{category.name}</div>
              </div>
            </motion.div>
          )}

          {/* Close button with tier-specific styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              onClick={onClose}
              size="large"
              className="font-semibold hover:scale-105 transition-transform"
              style={{
                background: theme.buttonGradient,
                border: `2px solid ${theme.borderColor}`,
                color: theme.buttonTextColor,
                padding: '0 56px',
                height: '52px',
                fontSize: '20px',
                fontWeight: 'bold',
                boxShadow: `0 4px 20px ${theme.shimmerColor}`,
                borderRadius: '9999px',
              }}
            >
              Tiếp Tục 🎊
            </Button>
          </motion.div>

          {/* Decorative corner elements - tier colored */}
          <div
            className="absolute left-3 top-3 text-4xl opacity-70"
            style={{ filter: `drop-shadow(0 0 10px ${theme.shimmerColor})` }}
          >
            🏮
          </div>
          <div
            className="absolute right-3 top-3 text-4xl opacity-70"
            style={{ filter: `drop-shadow(0 0 10px ${theme.shimmerColor})` }}
          >
            🏮
          </div>
          <div
            className="absolute bottom-3 left-3 text-4xl opacity-70"
            style={{ filter: `drop-shadow(0 0 10px ${theme.shimmerColor})` }}
          >
            🎊
          </div>
          <div
            className="absolute bottom-3 right-3 text-4xl opacity-70"
            style={{ filter: `drop-shadow(0 0 10px ${theme.shimmerColor})` }}
          >
            🎊
          </div>
        </div>

        {/* Subtle confetti burst animation behind modal */}
        <motion.div
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div
            className="text-7xl"
            style={{ filter: `drop-shadow(0 0 20px ${theme.shimmerColor})` }}
          >
            ✨
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
