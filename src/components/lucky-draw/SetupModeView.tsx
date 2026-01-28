import { Button } from 'antd';
import { AdminPanel } from '@/components/lucky-draw/AdminPanel';
import { AwardSelector } from '@/components/lucky-draw/AwardSelector';
import { CelebrationEffects } from '@/components/lucky-draw/CelebrationEffects';
import { FestiveBackground } from '@/components/lucky-draw/FestiveBackground';
import { Header } from '@/components/lucky-draw/Header';
import { SpinButton } from '@/components/lucky-draw/SpinButton';
import { SpinDisplay } from '@/components/lucky-draw/SpinDisplay';
import { WinnersList } from '@/components/lucky-draw/WinnersList';
import type { LuckyDrawState } from '@/types/lucky-draw.types';
import '@/styles/lucky-draw.css';

interface Props {
  state: LuckyDrawState | null;
  isSpinning: boolean;
  rotatingName: string;
  showCelebration: boolean;
  currentWinner: string | null;
  isAdminOpen: boolean;
  onSpin: () => void;
  onUpdate: () => void;
  onSelectCategory: (id: string) => void;
  onAdminOpen: () => void;
  onAdminClose: () => void;
  onStartPresentation: () => void;
}

export function SetupModeView({
  state,
  isSpinning,
  rotatingName,
  showCelebration,
  currentWinner,
  isAdminOpen,
  onSpin,
  onUpdate,
  onSelectCategory,
  onAdminOpen,
  onAdminClose,
  onStartPresentation,
}: Props) {
  if (!state)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-red-950 font-sans text-white">
      <FestiveBackground />
      <CelebrationEffects isActive={showCelebration} />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col overflow-hidden p-4 pb-8">
        <Header />

        <div className="flex flex-1 flex-col items-center gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:pt-2">
          <div className="flex flex-1 flex-col items-center justify-center gap-3 w-full">
            <SpinDisplay
              winner={currentWinner}
              rotatingName={rotatingName}
              isSpinning={isSpinning}
            />

            <SpinButton
              onClick={onSpin}
              disabled={isSpinning || !state.currentCategory}
              loading={isSpinning}
            />

            <AwardSelector
              categories={state.categories}
              currentId={state.currentCategory}
              onSelect={onSelectCategory}
              disabled={isSpinning}
            />
          </div>

          <div className="h-64 w-full lg:h-full lg:w-96 overflow-y-auto">
            <WinnersList
              employees={state.employees}
              categories={state.categories}
            />
          </div>
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        onClick={onStartPresentation}
        className="!fixed !bottom-8 !right-8 !z-50 !rounded-full !w-16 !h-16 !shadow-2xl !bg-tet-gold !hover:!bg-yellow-400 !border-4 !border-white !flex !items-center !justify-center"
      >
        🎬
      </Button>

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={onAdminClose}
        onUpdate={onUpdate}
      />
    </div>
  );
}
