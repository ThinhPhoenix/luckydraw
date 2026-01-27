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
    <div className="flex w-full flex-wrap justify-center gap-4 px-4 py-6">
      {categories.map((cat) => {
        const isActive = cat.id === currentId;
        const isFull = cat.remaining === 0;

        return (
          <Button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            disabled={disabled || (isFull && !isActive)}
            className={`
              !h-auto !min-w-[140px] !rounded-xl !border-2 !px-6 !py-3 !text-lg !font-semibold transition-all font-playfair
              ${
                isActive
                  ? '!border-tet-gold !bg-tet-deep-red !text-tet-gold shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-105'
                  : '!border-tet-gold/20 !bg-white/10 !text-white hover:!bg-white/20 hover:!border-tet-gold/50'
              }
              ${isFull ? '!opacity-60 grayscale' : ''}
            `}
          >
            <div className="flex flex-col items-center">
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
