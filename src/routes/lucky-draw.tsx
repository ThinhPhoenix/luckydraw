import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { Button, message } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import { LuckyDrawStorage } from '@/helpers/lucky-draw-storage';
import type { LuckyDrawState } from '@/types/lucky-draw.types';

import { Header } from '@/components/lucky-draw/Header';
import { FestiveBackground } from '@/components/lucky-draw/FestiveBackground';
import { SpinDisplay } from '@/components/lucky-draw/SpinDisplay';
import { SpinButton } from '@/components/lucky-draw/SpinButton';
import { AwardSelector } from '@/components/lucky-draw/AwardSelector';
import { WinnersList } from '@/components/lucky-draw/WinnersList';
import { CelebrationEffects } from '@/components/lucky-draw/CelebrationEffects';
import { AdminPanel } from '@/components/lucky-draw/AdminPanel';

import '@/styles/lucky-draw.css';

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

    // Load initial state
    useEffect(() => {
        const loadedState = LuckyDrawStorage.getState();
        setState(loadedState);
        if (loadedState.employees.length === 0) {
            // Try to load sample data if empty
            fetch('/sample-employees.json')
                .then(res => res.json())
                .then(data => {
                    const newState = LuckyDrawStorage.initializeWithEmployees(data);
                    setState(newState);
                })
                .catch(err => console.error("Failed to load sample data", err));
        }
    }, []);

    const handleUpdate = () => {
        setState(LuckyDrawStorage.getState());
    };

    const handleSelectCategory = (id: string) => {
        setState(prev => prev ? { ...prev, currentCategory: id } : null);
    };

    const spin = () => {
        if (!state || !state.currentCategory) return;

        // 1. Validation
        const category = state.categories.find(c => c.id === state.currentCategory);
        if (!category || category.remaining <= 0) {
            message.warning('Giải thưởng này đã hết!');
            return;
        }

        const eligibles = state.employees.filter(e => !e.isWinner);
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
            const randomName = eligibles[Math.floor(Math.random() * eligibles.length)].name;
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
        const empIndex = newState.employees.findIndex(e => e.id === winner.id);
        newState.employees[empIndex].isWinner = true;
        newState.employees[empIndex].award = categoryId;

        // Update category
        const catIndex = newState.categories.findIndex(c => c.id === categoryId);
        newState.categories[catIndex].remaining--;
        newState.categories[catIndex].winners.push(winner);

        newState.history.push({
            timestamp: Date.now(),
            winnerId: winner.id,
            categoryId: categoryId
        });

        LuckyDrawStorage.saveState(newState);
        setState(newState);
        setCurrentWinner(winner.name);

        setIsSpinning(false);
        setShowCelebration(true);

        // Stop celebration after 15s
        setTimeout(() => setShowCelebration(false), 15000);
    };

    if (!state) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-red-950 font-sans text-white">
            <FestiveBackground />
            <CelebrationEffects isActive={showCelebration} />

            <div className="relative z-10 mx-auto flex h-screen max-w-7xl flex-col p-4">
                <Header />

                <div className="flex flex-1 flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:pt-10">

                    {/* Left/Center Column - Main Display */}
                    <div className="flex flex-1 flex-col items-center justify-center gap-8 w-full">
                        <SpinDisplay
                            winner={currentWinner}
                            rotatingName={rotatingName}
                            isSpinning={isSpinning}
                        />

                        <SpinButton
                            onClick={spin}
                            disabled={isSpinning || !state.currentCategory}
                            loading={isSpinning}
                        />

                        <AwardSelector
                            categories={state.categories}
                            currentId={state.currentCategory}
                            onSelect={handleSelectCategory}
                            disabled={isSpinning}
                        />
                    </div>

                    {/* Right Column - Winners List */}
                    <div className="h-64 w-full lg:h-[600px] lg:w-96">
                        <WinnersList
                            employees={state.employees}
                            categories={state.categories}
                        />
                    </div>
                </div>
            </div>

            {/* Admin Toggle */}
            <Button
                icon={<SettingOutlined color='white' className="text-white text-xl" />}
                className="fixed -top-4 -right-4 z-50 hover:bg-white/10"
                onClick={() => setIsAdminOpen(true)}
            >
            </Button>

            <AdminPanel
                isOpen={isAdminOpen}
                onClose={() => setIsAdminOpen(false)}
                onUpdate={handleUpdate}
            />
        </div>
    );
}
