
export interface Transaction {
  id: string;
  type: 'receita' | 'despesa';
  value: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: 'credito' | 'pix';
  createdAt: string;
}

export interface Debt {
  id: string;
  type: 'devo' | 'me_devem';
  category: string;
  value: number;
  date: string;
  person: string;
  description: string;
  status: 'pendente' | 'quitado';
  createdAt: string;
}

export interface Settings {
  currentBalance: number;
  cardBill: number;
  expectedRevenue: number;
  finalGoal: number;
}

export interface FinancialData {
  transactions: Transaction[];
  debts: Debt[];
  settings: Settings;
}

export const CATEGORIES = [
  'Transporte',
  'Alimentação', 
  'Lazer',
  'Saúde',
  'Educação',
  'Doação/Presentes',
  'Confidencial',
  'Outros'
] as const;

export type Category = typeof CATEGORIES[number];
