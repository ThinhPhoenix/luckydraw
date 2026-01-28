import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { AwardCategory, Employee } from '@/types/lucky-draw.types';

interface Props {
  employees: Employee[];
  categories: AwardCategory[];
}

// Award tier styling configuration
type AwardTier = 'gold' | 'silver' | 'bronze' | 'consolation';

interface TierStyles {
  cardClass: string;
  badge: string;
  textColor: string;
  icon: string;
  hasSparkles: boolean;
  hasRibbon: boolean;
}

const TIER_STYLES: Record<AwardTier, TierStyles> = {
  gold: {
    cardClass: 'winner-card winner-card-gold',
    badge: 'bg-white text-yellow-700',
    textColor: 'text-white',
    icon: '👑',
    hasSparkles: true,
    hasRibbon: true,
  },
  silver: {
    cardClass: 'winner-card winner-card-silver',
    badge: 'bg-white text-gray-700',
    textColor: 'text-white',
    icon: '🥈',
    hasSparkles: true,
    hasRibbon: true,
  },
  bronze: {
    cardClass: 'winner-card winner-card-bronze',
    badge: 'bg-white text-orange-700',
    textColor: 'text-white',
    icon: '🥉',
    hasSparkles: true,
    hasRibbon: true,
  },
  consolation: {
    cardClass: 'winner-card border-2 border-tet-gold/30 bg-white/10 hover:bg-white/15',
    badge: 'bg-white text-yellow-700',
    textColor: 'text-white',
    icon: '🎁',
    hasSparkles: false,
    hasRibbon: false,
  },
};

function getAwardTier(awardId: string | null): AwardTier {
  switch (awardId) {
    case 'giai-nhat':
      return 'gold';
    case 'giai-nhi':
      return 'silver';
    case 'giai-ba':
      return 'bronze';
    default:
      return 'consolation';
  }
}

// Priority order for sorting: gold (0) > silver (1) > bronze (2) > consolation (3)
function getTierPriority(awardId: string | null): number {
  switch (awardId) {
    case 'giai-nhat':
      return 0;
    case 'giai-nhi':
      return 1;
    case 'giai-ba':
      return 2;
    default:
      return 3;
  }
}

function getTierStyles(awardId: string | null): TierStyles {
  const tier = getAwardTier(awardId);
  return TIER_STYLES[tier];
}

// Sparkle component for top tiers
function Sparkles() {
  return (
    <div className="sparkle-container">
      <div className="sparkle" />
      <div className="sparkle" />
      <div className="sparkle" />
      <div className="sparkle" />
      <div className="sparkle" />
    </div>
  );
}

// Floating particles component
function FloatingParticles({ tier }: { tier: AwardTier }) {
  if (tier === 'consolation') return null;

  return (
    <>
      <div className={`floating-particle ${tier}`} style={{ left: '10%', animationDelay: '0s' }} />
      <div className={`floating-particle ${tier}`} style={{ left: '30%', animationDelay: '1s' }} />
      <div className={`floating-particle ${tier}`} style={{ left: '70%', animationDelay: '2s' }} />
      <div className={`floating-particle ${tier}`} style={{ left: '90%', animationDelay: '0.5s' }} />
    </>
  );
}

// Medal ribbon component
function MedalRibbon({ tier }: { tier: AwardTier }) {
  if (tier === 'consolation') return null;
  return <div className={`medal-ribbon ${tier}`} />;
}

export function WinnersList({ employees, categories }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const winners = employees.filter((e) => e.isWinner);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  const getCategoryName = (id: string | null) => {
    return categories.find((c) => c.id === id)?.name || 'Unknown';
  };

  // Sort winners by tier priority: gold > silver > bronze > consolation
  const displayWinners = [...winners].sort((a, b) => {
    const priorityA = getTierPriority(a.award);
    const priorityB = getTierPriority(b.award);
    return priorityA - priorityB;
  });

  return (
    <div className="flex h-full max-h-[600px] w-full flex-col overflow-hidden rounded-2xl border-2 border-tet-gold/50 bg-black/40 backdrop-blur-md lg:w-96 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
      <div className="border-b-2 border-tet-gold/50 bg-tet-deep-red/80 p-4 text-center">
        <h3 className="text-2xl font-bold font-dancing text-tet-gold uppercase tracking-wider drop-shadow-md">
          Danh Sách Trúng Thưởng
        </h3>
      </div>

      <div
        ref={scrollRef}
        className="winners-scroll flex-1 space-y-4 overflow-y-auto p-4"
      >
        <AnimatePresence initial={false}>
          {displayWinners.length === 0 ? (
            <div className="flex h-full items-center justify-center text-white/40 italic font-playfair text-lg">
              Chưa có ngườii chiến thắng
            </div>
          ) : (
            displayWinners.map((winner, idx) => {
              const styles = getTierStyles(winner.award);
              const tier = getAwardTier(winner.award);
              const isGold = tier === 'gold';

              return (
                <motion.div
                  key={winner.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.05,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  className={`group relative flex flex-col rounded-lg ${styles.cardClass} ${isGold ? 'p-5' : 'p-3'}`}
                >
                  {/* Spotlight effect for gold */}
                  {isGold && <div className="spotlight-effect" />}

                  {/* Sparkles for top tiers */}
                  {styles.hasSparkles && <Sparkles />}

                  {/* Medal ribbon for top 3 */}
                  {styles.hasRibbon && <MedalRibbon tier={tier} />}

                  {/* Floating particles */}
                  <FloatingParticles tier={tier} />

                  {/* Content */}
                  <div className={`relative z-10 flex items-center gap-3 ${isGold ? 'mb-2' : 'mb-1'}`}>
                    <span className={`flex items-center justify-center rounded-full font-bold shadow-sm ring-2 ring-white/20 ${isGold ? 'h-9 w-9 text-base' : 'h-7 w-7 text-sm'} ${styles.badge}`}>
                      {idx + 1}
                    </span>
                    <span className={`font-bold text-white font-montserrat flex-1 drop-shadow-md ${isGold ? 'text-2xl' : 'text-lg'}`}>
                      {winner.name}
                    </span>
                    <span className={`${isGold ? 'crown-icon text-2xl' : 'text-lg'} drop-shadow-md`} title={getCategoryName(winner.award)}>
                      {styles.icon}
                    </span>
                  </div>

                  <div className={`relative z-10 pl-12 font-playfair font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${isGold ? 'text-lg' : 'text-sm'} ${styles.textColor}`}>
                    {getCategoryName(winner.award)}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
