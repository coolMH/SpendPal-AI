
export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  paymentMethod?: string;
  isRecurring?: boolean;
  tags?: string[];
  notes?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  color: string;
  icon?: string; // Emoji
  deadline?: string;
  completed: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  logo?: string;
}

export interface FinancialHealth {
  score: number;
  status: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  insights: string[];
}

export interface Account {
  id: string;
  name: string;
  type: 'Asset' | 'Liability';
  balance: number;
  icon: string; // emoji or url
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

export type PlanTier = 'Free' | 'Pro' | 'Advanced';

export interface UserProfile {
  name: string;
  email: string;
  mainGoal: string;
  currency: string;
  timezone: string;
  plan: PlanTier;
  theme: 'dark' | 'light';
  isLoggedIn: boolean;
  avatar?: string;
}

export type ViewState = 
  | 'HOME' 
  | 'EXPENSES' 
  | 'GOALS' 
  | 'AI' 
  | 'MORE'
  | 'INCOME'
  | 'CATEGORIES'
  | 'BUDGETS'
  | 'WALLETS'
  | 'SUBSCRIPTIONS'
  | 'REPORTS'
  | 'NOTIFICATIONS'
  | 'SETTINGS'
  | 'PROFILE'
  | 'PLANS';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  lastModified: number;
}
