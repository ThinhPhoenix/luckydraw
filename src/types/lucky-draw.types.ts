export interface Employee {
  id: string | number;
  name: string;
  isWinner: boolean;
  award: string | null; // Award category ID
}

export interface AwardCategory {
  id: string;
  name: string;
  tier: number; // 1 = highest priority (gold), 2 = silver, 3 = bronze, 4+ = consolation
  total: number;
  remaining: number;
  winners: Employee[];
}

export interface LuckyDrawState {
  employees: Employee[];
  categories: AwardCategory[];
  currentCategory: string | null;
  history: {
    timestamp: number;
    winnerId: string | number;
    categoryId: string;
  }[];
  hasSpun: boolean;
}

export const DEFAULT_CATEGORIES: AwardCategory[] = [
  {
    id: 'giai-nhat',
    name: 'Giải Nhất',
    tier: 1,
    total: 1,
    remaining: 1,
    winners: [],
  },
  {
    id: 'giai-nhi',
    name: 'Giải Nhì',
    tier: 2,
    total: 2,
    remaining: 2,
    winners: [],
  },
  {
    id: 'giai-ba',
    name: 'Giải Ba',
    tier: 3,
    total: 3,
    remaining: 3,
    winners: [],
  },
  {
    id: 'giai-khuyen-khich',
    name: 'Giải Khuyến Khích',
    tier: 4,
    total: 5,
    remaining: 5,
    winners: [],
  },
];
