
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Goal, Budget, Subscription, ViewState, Account, Notification, UserProfile, ChatMessage, ChatSession } from '../types';
import { generateChatTitle } from '../services/geminiService';

interface AppContextType {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  editTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  
  goals: Goal[];
  addGoal: (g: Goal) => void;
  updateGoal: (id: string, amount: number) => void; // Deposit funds
  editGoal: (g: Goal) => void; // Edit details
  deleteGoal: (id: string) => void;
  
  budgets: Budget[];
  addBudget: (b: Budget) => void;
  editBudget: (b: Budget) => void;
  deleteBudget: (id: string) => void;
  
  subscriptions: Subscription[];
  addSubscription: (s: Subscription) => void;
  editSubscription: (s: Subscription) => void;
  deleteSubscription: (id: string) => void;
  
  accounts: Account[];
  addAccount: (a: Account) => void;
  editAccount: (a: Account) => void;
  deleteAccount: (id: string) => void;
  
  notifications: Notification[];
  userProfile: UserProfile;
  updateUserProfile: (p: Partial<UserProfile>) => void;
  categories: string[];
  addCategory: (c: string) => void;
  deleteCategory: (c: string) => void;
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netWorth: number;
  
  // Chat Logic
  chatSessions: ChatSession[];
  currentChatId: string | null;
  createNewChat: () => void;
  selectChat: (id: string) => void;
  updateChatTitle: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  
  login: () => void;
  logout: () => void;
  deleteAccountData: () => void;
  exportData: () => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Data Initialization
const initialTransactions: Transaction[] = [
  { id: '1', title: 'Grocery Store', amount: 85.50, type: 'expense', category: 'Food', date: '2023-10-25', paymentMethod: 'Credit Card', isRecurring: false },
  { id: '2', title: 'Uber Ride', amount: 24.00, type: 'expense', category: 'Transport', date: '2023-10-24', paymentMethod: 'Apple Pay' },
  { id: '3', title: 'Freelance Payment', amount: 1200.00, type: 'income', category: 'Salary', date: '2023-10-23', paymentMethod: 'Bank Transfer' },
  { id: '4', title: 'Netflix', amount: 15.99, type: 'expense', category: 'Entertainment', date: '2023-10-22', paymentMethod: 'Credit Card', isRecurring: true },
];

const initialGoals: Goal[] = [
  { id: '1', title: 'New Laptop', targetAmount: 2000, savedAmount: 1250, color: 'bg-blue-500', icon: '💻', completed: false },
  { id: '2', title: 'Vacation', targetAmount: 5000, savedAmount: 800, color: 'bg-purple-500', icon: '🏖️', completed: false },
  { id: '3', title: 'Emergency Fund', targetAmount: 10000, savedAmount: 10000, color: 'bg-green-500', icon: '🏥', completed: true },
];

const initialBudgets: Budget[] = [
  { id: '1', category: 'Food', limit: 500, spent: 320, color: '#3b82f6' },
  { id: '2', category: 'Transport', limit: 200, spent: 150, color: '#8b5cf6' },
];

const initialSubscriptions: Subscription[] = [
  { id: '1', name: 'Netflix', cost: 15.99, billingCycle: 'monthly', nextBillingDate: '2023-11-22' },
  { id: '2', name: 'Spotify', cost: 9.99, billingCycle: 'monthly', nextBillingDate: '2023-11-15' },
];

const initialAccounts: Account[] = [
  { id: '1', name: 'Chase Checking', type: 'Asset', balance: 4500.00, icon: '🏦' },
  { id: '2', name: 'Savings', type: 'Asset', balance: 12000.00, icon: '💰' },
  { id: '3', name: 'Amex Gold', type: 'Liability', balance: 850.00, icon: '💳' },
];

const initialNotifications: Notification[] = [
  { id: '1', title: 'Budget Alert', message: 'You have reached 80% of your Food budget.', date: '2h ago', read: false, type: 'alert' },
  { id: '2', title: 'Subscription', message: 'Netflix payment of $15.99 is due tomorrow.', date: '5h ago', read: false, type: 'info' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [categories, setCategories] = useState<string[]>(['Food', 'Transport', 'Salary', 'Entertainment', 'Health', 'Shopping', 'Investment', 'Utilities']);
  
  // Chat State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    mainGoal: 'Financial Freedom',
    currency: 'USD',
    timezone: 'GMT-5',
    plan: 'Free',
    theme: 'light', 
    isLoggedIn: true,
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0F172A&color=fff'
  });

  // Theme handling
  useEffect(() => {
    const root = window.document.documentElement;
    if (userProfile.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [userProfile.theme]);

  // Initial Chat Creation
  useEffect(() => {
    if (chatSessions.length === 0) {
      createNewChat();
    }
  }, []);

  const toggleTheme = () => {
    setUserProfile(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    if (t.type === 'expense') {
      setBudgets(prev => prev.map(b => 
        b.category === t.category ? { ...b, spent: b.spent + t.amount } : b
      ));
    }
  };
  const editTransaction = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
    // Recalculate budgets not implemented for edit simplicity, but would go here in real app
  };
  const deleteTransaction = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));

  const addGoal = (g: Goal) => setGoals(prev => [...prev, g]);
  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));
  // Deposit funds
  const updateGoal = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const newSaved = g.savedAmount + amount;
        return { ...g, savedAmount: newSaved, completed: newSaved >= g.targetAmount };
      }
      return g;
    }));
  };
  // Edit full goal details
  const editGoal = (updated: Goal) => {
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
  };

  const addBudget = (b: Budget) => setBudgets(prev => [...prev, b]);
  const editBudget = (updated: Budget) => setBudgets(prev => prev.map(b => b.id === updated.id ? updated : b));
  const deleteBudget = (id: string) => setBudgets(prev => prev.filter(b => b.id !== id));
  
  const addSubscription = (s: Subscription) => setSubscriptions(prev => [...prev, s]);
  const editSubscription = (updated: Subscription) => setSubscriptions(prev => prev.map(s => s.id === updated.id ? updated : s));
  const deleteSubscription = (id: string) => setSubscriptions(prev => prev.filter(s => s.id !== id));
  
  const addAccount = (a: Account) => setAccounts(prev => [...prev, a]);
  const editAccount = (updated: Account) => setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
  const deleteAccount = (id: string) => setAccounts(prev => prev.filter(a => a.id !== id));
  
  const addCategory = (c: string) => setCategories(prev => [...prev, c]);
  const deleteCategory = (c: string) => setCategories(prev => prev.filter(cat => cat !== c));
  
  const updateUserProfile = (p: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...p }));
  };

  // Chat Functions
  const createNewChat = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      lastModified: Date.now()
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentChatId(newId);
  };

  const selectChat = (id: string) => {
    setCurrentChatId(id);
  };

  const updateChatTitle = (id: string, title: string) => {
    setChatSessions(prev => prev.map(s => s.id === id ? { ...s, title } : s));
  };

  const deleteChat = (id: string) => {
    setChatSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (currentChatId === id) {
        setCurrentChatId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
    if (chatSessions.length <= 1) {
       setTimeout(createNewChat, 0);
    }
  };

  const addChatMessage = async (msg: ChatMessage) => {
    if (!currentChatId) return;

    setChatSessions(prev => prev.map(s => {
      if (s.id === currentChatId) {
        return { 
          ...s, 
          messages: [...s.messages, msg],
          lastModified: Date.now()
        };
      }
      return s;
    }));

    const currentSession = chatSessions.find(s => s.id === currentChatId);
    if (currentSession && currentSession.messages.length === 0 && msg.role === 'user') {
       try {
         const autoTitle = await generateChatTitle(msg.text);
         updateChatTitle(currentChatId, autoTitle);
       } catch (e) {
         // ignore auto name failure
       }
    }
  };

  // Auth Functions
  const login = () => setUserProfile(prev => ({ ...prev, isLoggedIn: true }));
  const logout = () => {
    setUserProfile(prev => ({ ...prev, isLoggedIn: false }));
    setCurrentView('HOME');
  };

  const deleteAccountData = () => {
    setTransactions([]);
    setGoals([]);
    setBudgets([]);
    setSubscriptions([]);
    setAccounts([]);
    setChatSessions([]);
    logout();
  };

  const exportData = () => {
    const data = {
      userProfile,
      transactions,
      goals,
      budgets,
      subscriptions,
      accounts,
      chatSessions
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "spendpal_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  const totalAssets = accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0);
  const netWorth = totalAssets - totalLiabilities;

  const currentChatHistory = chatSessions.find(s => s.id === currentChatId)?.messages || [];

  return (
    <AppContext.Provider value={{
      transactions, addTransaction, editTransaction, deleteTransaction,
      goals, addGoal, updateGoal, editGoal, deleteGoal,
      budgets, addBudget, editBudget, deleteBudget,
      subscriptions, addSubscription, editSubscription, deleteSubscription,
      accounts, addAccount, editAccount, deleteAccount,
      notifications,
      userProfile, updateUserProfile,
      categories, addCategory, deleteCategory,
      currentView, setCurrentView,
      totalBalance, totalIncome, totalExpenses, netWorth,
      
      // Chat
      chatSessions, currentChatId,
      chatHistory: currentChatHistory,
      addChatMessage, createNewChat, selectChat, updateChatTitle, deleteChat,

      login, logout, deleteAccountData, exportData, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
