import type { AwardCategory, Employee } from '@/types/lucky-draw.types';
import { useEffect, useRef } from 'react';

interface Props {
    employees: Employee[];
    categories: AwardCategory[];
}

export function WinnersList({ employees, categories }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const winners = employees.filter(e => e.isWinner);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0; // Newest on top, or can scroll to bottom if reversed
        }
    }, [winners.length]);

    const getCategoryName = (id: string | null) => {
        return categories.find(c => c.id === id)?.name || 'Unknown';
    };

    // Sort by most recent winner first (implicitly, since we append, so we reverse for display)
    // Actually, let's just show them in order of winning, but we need to track that.
    // The 'winners' array here is just filter from full list. Order depends on Employee ID or list order. 
    // Ideally history would be better, but let's assume filtering preserves order if we update carefully or just use history from props if available. 
    // Let's just map and reverse for "Latest on top" feel.

    const displayWinners = [...winners].reverse();

    return (
        <div className="flex h-full max-h-[600px] w-full flex-col overflow-hidden rounded-2xl border border-yellow-500/30 bg-black/40 backdrop-blur-sm lg:w-96">
            <div className="border-b border-yellow-500/30 bg-red-900/50 p-4 text-center">
                <h3 className="text-xl font-bold text-yellow-400 uppercase">Danh Sách Trúng Thưởng</h3>
            </div>

            <div
                ref={scrollRef}
                className="winners-scroll flex-1 space-y-2 overflow-y-auto p-4"
            >
                {displayWinners.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-white/40 italic">
                        Chưa có người chiến thắng
                    </div>
                ) : (
                    displayWinners.map((winner, idx) => (
                        <div
                            key={winner.id}
                            className="group flex flex-col rounded-lg border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10"
                        >
                            <div className="mb-1 flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-red-900">
                                    {winners.length - idx}
                                </span>
                                <span className="font-bold text-white text-lg">{winner.name}</span>
                            </div>
                            <div className="pl-8 text-sm text-yellow-300">
                                🏆 {getCategoryName(winner.award)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
