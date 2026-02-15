
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BottomNav, FloatingActionMenu } from './components/Navigation';

// Pages
import { Home } from './pages/Home';
import { Expenses } from './pages/Expenses';
import { Goals } from './pages/Goals';
import { AIAssistant } from './pages/AIAssistant';
import { More } from './pages/More';
import { Reports } from './pages/Reports';
import { Income } from './pages/Income';
import { Categories } from './pages/Categories';
import { Budgets } from './pages/Budgets';
import { Wallets } from './pages/Wallets';
import { Subscriptions } from './pages/Subscriptions';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Plans } from './pages/Plans';

const LoginScreen = () => {
  const { login } = useApp();
  return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-surface-50 dark:bg-navy-950 p-6 animate-slide-up relative overflow-hidden transition-colors duration-300">
        {/* Abstract shapes for login */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="w-24 h-24 bg-white dark:bg-blue-600 rounded-[28px] flex items-center justify-center shadow-soft dark:shadow-glow mb-8 rotate-3 z-10 border border-slate-100 dark:border-transparent">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-900 dark:text-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight z-10">SpendPal</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-12 max-w-xs leading-relaxed font-medium z-10">Friendly digital banking to make you feel better to manage your financial matter.</p>
        
        <button 
           onClick={login}
           className="w-full max-w-xs bg-slate-900 dark:bg-blue-600 text-white font-bold text-lg py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform active:scale-[0.98] z-10"
        >
           Get Started
        </button>
     </div>
  );
};

const MainLayout = () => {
  const { currentView, userProfile } = useApp();

  if (!userProfile.isLoggedIn) {
     return <LoginScreen />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'HOME': return <Home />;
      case 'EXPENSES': return <Expenses />;
      case 'GOALS': return <Goals />;
      case 'AI': return <AIAssistant />;
      case 'MORE': return <More />;
      case 'REPORTS': return <Reports />;
      case 'INCOME': return <Income />;
      case 'CATEGORIES': return <Categories />;
      case 'BUDGETS': return <Budgets />;
      case 'WALLETS': return <Wallets />;
      case 'SUBSCRIPTIONS': return <Subscriptions />;
      case 'NOTIFICATIONS': return <Notifications />;
      case 'SETTINGS': return <Settings />;
      case 'PROFILE': return <Profile />;
      case 'PLANS': return <Plans />;
      default: return <Home />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-surface-50 dark:bg-navy-950 transition-colors duration-300 overflow-hidden font-sans selection:bg-blue-500/30 border-x border-slate-200 dark:border-white/5">
       <main className="relative z-10 min-h-screen pb-24">
         {renderView()}
       </main>
       <FloatingActionMenu />
       <BottomNav />
    </div>
  );
};

const App = () => (
  <AppProvider>
    <MainLayout />
  </AppProvider>
);

export default App;
