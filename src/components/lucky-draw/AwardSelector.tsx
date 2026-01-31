import { Button } from 'antd';
import type { AwardCategory } from '@/types/lucky-draw.types';

interface Props {
  categories: AwardCategory[];
  currentId: string | null;
  onSelect: (id: string) => void;
  disabled: boolean;
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

export function AwardSelector({
  categories,
  currentId,
  onSelect,
  disabled,
}: Props) {
  // Sort categories by tier (ascending - lower tier = higher priority)
  const sortedCategories = [...categories].sort((a, b) => a.tier - b.tier);

  return (
    <div className="flex w-full flex-wrap justify-center gap-3 px-4 py-3">
      {sortedCategories.map((cat) => {
        const isActive = cat.id === currentId;
        const isFull = cat.remaining === 0;

        return (
          <Button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            disabled={disabled || (isFull && !isActive)}
            className={`
              !h-auto !min-w-[160px] !rounded-xl !border-2 !px-4 !py-2 !text-base !font-semibold transition-all duration-300 font-playfair relative overflow-hidden group
              ${
                isActive
                  ? '!border-tet-gold !bg-tet-deep-red !text-tet-gold shadow-[0_0_20px_rgba(255,215,0,0.6)] scale-105 animate-[pulse_2s_infinite]'
                  : '!border-tet-gold/20 !bg-white/10 !text-white hover:!bg-white/20 hover:!border-tet-gold/80 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:-translate-y-1'
              }
              ${isFull ? '!opacity-60 grayscale' : ''}
            `}
          >
            <div className="flex flex-col items-center relative z-10">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${getTierBadgeColor(cat.tier)}`}
                >
                  {cat.tier}
                </span>
                <span className="text-sm font-medium">{cat.name}</span>
              </div>
              <span
                className={`text-xs font-montserrat mt-1 ${isActive ? 'text-tet-cream' : 'text-gray-300'}`}
              >
                {getTierName(cat.tier)} •{' '}
                {isFull ? 'Đã đủ' : `${cat.remaining} còn lại`}
              </span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
