import { Button } from 'antd';
import type { AwardCategory } from '@/types/lucky-draw.types';

interface Props {
  categories: AwardCategory[];
  currentId: string | null;
  onSelect: (id: string) => void;
  disabled: boolean;
}

export function AwardSelector({
  categories,
  currentId,
  onSelect,
  disabled,
}: Props) {
  return (
    <div className="flex w-full flex-wrap justify-center gap-3 px-4 py-3">
      {categories.map((cat) => {
        const isActive = cat.id === currentId;
        const isFull = cat.remaining === 0;

        return (
          <Button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            disabled={disabled || (isFull && !isActive)}
            className={`
              !h-auto !min-w-[120px] !rounded-xl !border-2 !px-4 !py-2 !text-base !font-semibold transition-all duration-300 font-playfair relative overflow-hidden group
              ${
                isActive
                  ? '!border-tet-gold !bg-tet-deep-red !text-tet-gold shadow-[0_0_20px_rgba(255,215,0,0.6)] scale-105 animate-[pulse_2s_infinite]'
                  : '!border-tet-gold/20 !bg-white/10 !text-white hover:!bg-white/20 hover:!border-tet-gold/80 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:-translate-y-1'
              }
              ${isFull ? '!opacity-60 grayscale' : ''}
            `}
          >
            <div className="flex flex-col items-center relative z-10">
              <span>{cat.name}</span>
              <span
                className={`text-xs font-montserrat mt-1 ${isActive ? 'text-tet-cream' : 'text-gray-300'}`}
              >
                {isFull ? 'Đã đủ' : `${cat.remaining} còn lại`}
              </span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
