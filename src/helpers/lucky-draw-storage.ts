import {
  DEFAULT_CATEGORIES,
  type Employee,
  type LuckyDrawState,
} from '@/types/lucky-draw.types';

const STORAGE_KEY = 'djoy_lucky_draw_state';

const defaultState: LuckyDrawState = {
  employees: [],
  categories: DEFAULT_CATEGORIES,
  currentCategory: DEFAULT_CATEGORIES[0].id,
  history: [],
};

export const LuckyDrawStorage = {
  getState: (): LuckyDrawState => {
    if (typeof window === 'undefined') return defaultState;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultState;
    } catch (e) {
      console.error('Failed to load state', e);
      return defaultState;
    }
  },

  saveState: (state: LuckyDrawState) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  },

  resetState: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  },

  initializeWithEmployees: (employees: Employee[]) => {
    const currentState = LuckyDrawStorage.getState();
    const newState = { ...currentState, employees };
    LuckyDrawStorage.saveState(newState);
    return newState;
  },

  exportWinnersCSV: () => {
    const state = LuckyDrawStorage.getState();
    const winners = state.employees.filter((e) => e.isWinner);

    const csvContent = [
      ['ID', 'Name', 'Award Category'],
      ...winners.map((w) => {
        const category = state.categories.find((c) => c.id === w.award);
        return [w.id, w.name, category?.name || 'Unknown'];
      }),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'lucky_draw_winners.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
