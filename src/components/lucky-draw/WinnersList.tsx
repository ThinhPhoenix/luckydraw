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
    cardClass:
      'winner-card border-2 border-tet-gold/30 bg-white/10 hover:bg-white/15',
    badge: 'bg-white text-yellow-700',
    textColor: 'text-white',
    icon: '🎁',
    hasSparkles: false,
    hasRibbon: false,
  },
};

// Get award tier based on tier number (1=gold, 2=silver, 3=bronze, 4+=consolation)
function getAwardTierByNumber(tier: number): AwardTier {
  switch (tier) {
    case 1:
      return 'gold';
    case 2:
      return 'silver';
    case 3:
      return 'bronze';
    default:
      return 'consolation';
  }
}

function getTierStylesByNumber(tier: number): TierStyles {
  const awardTier = getAwardTierByNumber(tier);
  return TIER_STYLES[awardTier];
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
      <div
        className={`floating-particle ${tier}`}
        style={{ left: '10%', animationDelay: '0s' }}
      />
      <div
        className={`floating-particle ${tier}`}
        style={{ left: '30%', animationDelay: '1s' }}
      />
      <div
        className={`floating-particle ${tier}`}
        style={{ left: '70%', animationDelay: '2s' }}
      />
      <div
        className={`floating-particle ${tier}`}
        style={{ left: '90%', animationDelay: '0.5s' }}
      />
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

  const getCategory = (id: string | null) => {
    return categories.find((c) => c.id === id);
  };

  // Sort winners by tier priority: gold (1) > silver (2) > bronze (3) > consolation (4+)
  const displayWinners = [...winners].sort((a, b) => {
    const catA = getCategory(a.award);
    const catB = getCategory(b.award);
    const tierA = catA?.tier ?? 999;
    const tierB = catB?.tier ?? 999;
    return tierA - tierB;
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
              Chưa có người chiến thắng
            </div>
          ) : (
            displayWinners.map((winner, idx) => {
              const category = getCategory(winner.award);
              const tierNumber = category?.tier ?? 4;
              const styles = getTierStylesByNumber(tierNumber);
              const tier = getAwardTierByNumber(tierNumber);
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
                  <div
                    className={`relative z-10 flex items-center gap-3 ${isGold ? 'mb-2' : 'mb-1'}`}
                  >
                    <span
                      className={`flex items-center justify-center rounded-full font-bold shadow-sm ring-2 ring-white/20 ${isGold ? 'h-9 w-9 text-base' : 'h-7 w-7 text-sm'} ${styles.badge}`}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={`font-bold text-white font-montserrat flex-1 drop-shadow-md ${isGold ? 'text-2xl' : 'text-lg'}`}
                    >
                      {winner.name}
                    </span>
                    <span
                      className={`${isGold ? 'crown-icon text-2xl' : 'text-lg'} drop-shadow-md`}
                      title={category?.name || 'Unknown'}
                    >
                      {styles.icon}
                    </span>
                  </div>

                  <div
                    className={`relative z-10 pl-12 font-playfair font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${isGold ? 'text-lg' : 'text-sm'} ${styles.textColor}`}
                  >
                    {category?.name || 'Unknown'}
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
