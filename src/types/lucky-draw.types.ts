export interface Employee {
  id: string | number;
  name: string;
  isWinner: boolean;
  award: string | null; // Award category ID
}

export interface AwardCategory {
  id: string;
  name: string;
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
}

export const DEFAULT_CATEGORIES: AwardCategory[] = [
  {
    id: 'giai-nhat',
    name: 'Giải Nhất',
    total: 1,
    remaining: 1,
    winners: [],
  },
  {
    id: 'giai-nhi',
    name: 'Giải Nhì',
    total: 2,
    remaining: 2,
    winners: [],
  },
  {
    id: 'giai-ba',
    name: 'Giải Ba',
    total: 3,
    remaining: 3,
    winners: [],
  },
  {
    id: 'giai-khuyen-khich',
    name: 'Giải Khuyến Khích',
    total: 5,
    remaining: 5,
    winners: [],
  },
];
