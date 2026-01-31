import { createFileRoute } from '@tanstack/react-router';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { PresentationModeView } from '@/components/lucky-draw/PresentationModeView';
import { SetupModeView } from '@/components/lucky-draw/SetupModeView';
import { LuckyDrawStorage } from '@/helpers/lucky-draw-storage';
import type { LuckyDrawState } from '@/types/lucky-draw.types';

export const Route = createFileRoute('/lucky-draw')({
  component: LuckyDrawPage,
});

function LuckyDrawPage() {
  // Application State
  const [state, setState] = useState<LuckyDrawState | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotatingName, setRotatingName] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);

  // Load initial state
  useEffect(() => {
    const loadedState = LuckyDrawStorage.getState();
    setState(loadedState);
    if (loadedState.employees.length === 0) {
      // Try to load sample data if empty
      fetch('/sample-employees.json')
        .then((res) => res.json())
        .then((data) => {
          const newState = LuckyDrawStorage.initializeWithEmployees(data);
          setState(newState);
        })
        .catch((err) => console.error('Failed to load sample data', err));
    }
  }, []);

  const handleUpdate = () => {
    setState(LuckyDrawStorage.getState());
  };

  const handleSelectCategory = (id: string) => {
    setState((prev) => (prev ? { ...prev, currentCategory: id } : null));
  };

  const spin = () => {
    if (!state) return;

    // 1. Validation
    if (state.categories.length === 0) {
      message.error(
        'Chưa có giải thưởng nào! Vui lòng thêm giải thưởng trong phần Admin.',
      );
      return;
    }

    if (!state.currentCategory) {
      message.warning('Vui lòng chọn giải thưởng trước khi quay!');
      return;
    }

    const category = state.categories.find(
      (c) => c.id === state.currentCategory,
    );
    if (!category || category.remaining <= 0) {
      message.warning('Giải thưởng này đã hết!');
      return;
    }

    const eligibles = state.employees.filter((e) => !e.isWinner);
    if (eligibles.length === 0) {
      message.error('Không còn nhân viên nào để quay!');
      return;
    }

    // 2. Start Spin
    setIsSpinning(true);
    setShowCelebration(false);
    setCurrentWinner(null);

    // 3. Animation Loop
    let speed = 50;
    const duration = 4000;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;

      // Random name for display
      const randomName =
        eligibles[Math.floor(Math.random() * eligibles.length)].name;
      setRotatingName(randomName);

      if (elapsed < duration) {
        // Slow down at the end
        if (elapsed > duration * 0.7) speed += 10;
        setTimeout(tick, speed);
      } else {
        // 4. Determine Winner
        finalizeWinner(eligibles, state.currentCategory!);
      }
    };

    tick();
  };

  const finalizeWinner = (eligibles: any[], categoryId: string) => {
    // True random selection
    const randomIndex = Math.floor(Math.random() * eligibles.length);
    const winner = eligibles[randomIndex];

    // Update State
    const newState = { ...state! };

    // Update employee
    const empIndex = newState.employees.findIndex((e) => e.id === winner.id);
    newState.employees[empIndex].isWinner = true;
    newState.employees[empIndex].award = categoryId;

    // Update category
    const catIndex = newState.categories.findIndex((c) => c.id === categoryId);
    newState.categories[catIndex].remaining--;
    newState.categories[catIndex].winners.push(winner);

    // Mark as having spun at least once
    newState.hasSpun = true;

    newState.history.push({
      timestamp: Date.now(),
      winnerId: winner.id,
      categoryId: categoryId,
    });

    LuckyDrawStorage.saveState(newState);
    setState(newState);
    setCurrentWinner(winner.name);

    setIsSpinning(false);
    setShowCelebration(true);

    // Stop celebration after 15s
    setTimeout(() => setShowCelebration(false), 15000);
  };

  if (!state)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-red-950 font-sans text-white">
      {presentationMode ? (
        <PresentationModeView
          winner={currentWinner}
          rotatingName={rotatingName}
          isSpinning={isSpinning}
          currentCategory={state?.currentCategory || null}
          categories={state?.categories || []}
          onExitPresentation={() => setPresentationMode(false)}
        />
      ) : (
        <SetupModeView
          state={state}
          isSpinning={isSpinning}
          rotatingName={rotatingName}
          showCelebration={showCelebration}
          currentWinner={currentWinner}
          isAdminOpen={isAdminOpen}
          onSpin={spin}
          onUpdate={handleUpdate}
          onSelectCategory={handleSelectCategory}
          onAdminOpen={() => setIsAdminOpen(true)}
          onAdminClose={() => setIsAdminOpen(false)}
          onStartPresentation={() => setPresentationMode(true)}
        />
      )}
    </div>
  );
}
