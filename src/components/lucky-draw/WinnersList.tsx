import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { AwardCategory, Employee } from '@/types/lucky-draw.types';

interface Props {
  employees: Employee[];
  categories: AwardCategory[];
}

export function WinnersList({ employees, categories }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const winners = employees.filter((e) => e.isWinner);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0; // Newest on top
    }
  }, [winners.length]);

  const getCategoryName = (id: string | null) => {
    return categories.find((c) => c.id === id)?.name || 'Unknown';
  };

  const displayWinners = [...winners].reverse();

  return (
    <div className="flex h-full max-h-[600px] w-full flex-col overflow-hidden rounded-2xl border-2 border-tet-gold/50 bg-black/40 backdrop-blur-md lg:w-96 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
      <div className="border-b-2 border-tet-gold/50 bg-tet-deep-red/80 p-4 text-center">
        <h3 className="text-2xl font-bold font-dancing text-tet-gold uppercase tracking-wider drop-shadow-md">
          Danh Sách Trúng Thưởng
        </h3>
      </div>

      <div
        ref={scrollRef}
        className="winners-scroll flex-1 space-y-2 overflow-y-auto p-4"
      >
        <AnimatePresence initial={false}>
          {displayWinners.length === 0 ? (
            <div className="flex h-full items-center justify-center text-white/40 italic font-playfair text-lg">
              Chưa có người chiến thắng
            </div>
          ) : (
            displayWinners.map((winner, idx) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col rounded-lg border border-tet-gold/20 bg-white/5 p-3 transition-colors hover:bg-white/10"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tet-gold text-xs font-bold text-tet-deep-red shadow-sm">
                    {winners.length - idx}
                  </span>
                  <span className="font-bold text-white text-lg font-montserrat">
                    {winner.name}
                  </span>
                </div>
                <div className="pl-8 text-sm text-tet-amber font-playfair italic">
                  🏆 {getCategoryName(winner.award)}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
