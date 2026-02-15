
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ViewState } from '../types';
import { Modal } from './Modal'; 

// Icons (Unchanged)
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ExpenseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const GoalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IncomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const SubscriptionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;

export const BottomNav = () => {
  const { currentView, setCurrentView } = useApp();

  const navItems: { view: ViewState; icon: React.ReactNode; label: string }[] = [
    { view: 'HOME', icon: <HomeIcon />, label: 'Home' },
    { view: 'EXPENSES', icon: <ExpenseIcon />, label: 'History' },
    { view: 'GOALS', icon: <GoalIcon />, label: 'Goals' },
    { view: 'AI', icon: <AIIcon />, label: 'AI' },
    { view: 'MORE', icon: <MenuIcon />, label: 'More' },
  ];

  return (
    <div className="fixed bottom-6 w-full px-6 z-40 pointer-events-none">
      <div className="max-w-[360px] mx-auto bg-[#1E293B]/90 dark:bg-[#12122a]/90 backdrop-blur-xl rounded-[24px] shadow-2xl border border-white/10 dark:border-white/5 px-2 py-3 pointer-events-auto">
        <div className="flex justify-between items-end h-12 relative">
          {navItems.map((item) => {
            const isActive = currentView === item.view || (item.view === 'MORE' && ['INCOME', 'CATEGORIES', 'REPORTS', 'SETTINGS', 'PROFILE', 'PLANS'].includes(currentView));
            return (
              <button
                key={item.label}
                onClick={() => setCurrentView(item.view)}
                className="group flex flex-col items-center justify-end w-14 h-full relative"
              >
                <div 
                  className={`
                    absolute bottom-0
                    flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out z-10
                    ${isActive 
                      ? 'bg-blue-600 shadow-lg shadow-blue-600/30 -translate-y-5' 
                      : 'hover:bg-white/5'
                    }
                  `}
                >
                   <div className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                     {React.cloneElement(item.icon as React.ReactElement, { 
                        width: 20, 
                        height: 20, 
                        strokeWidth: 2.5
                     })}
                   </div>
                </div>
                
                <span className={`
                  text-[10px] font-bold tracking-wide transition-all duration-300 absolute -bottom-0.5
                  ${isActive ? 'text-white opacity-100 translate-y-0' : 'text-slate-500 opacity-0 translate-y-2'}
                `}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const FloatingActionMenu = () => {
  const { currentView } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'EXPENSE' | 'INCOME' | 'GOAL' | 'SUBSCRIPTION' | null>(null);

  if (currentView === 'AI') return null;

  const actions = [
    { label: 'Add Subscription', color: 'bg-pink-600', icon: <SubscriptionIcon />, onClick: () => setActiveModal('SUBSCRIPTION') },
    { label: 'Add Goal', color: 'bg-violet-600', icon: <GoalIcon />, onClick: () => setActiveModal('GOAL') },
    { label: 'Add Income', color: 'bg-emerald-600', icon: <IncomeIcon />, onClick: () => setActiveModal('INCOME') },
    { label: 'Add Expense', color: 'bg-blue-600', icon: <ExpenseIcon />, onClick: () => setActiveModal('EXPENSE') },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" onClick={() => setIsOpen(false)} />}
      <div className="fixed bottom-32 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
        {isOpen && (
          <div className="flex flex-col gap-4 mb-2 animate-slide-up items-end pointer-events-auto">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="flex items-center justify-end gap-3 group active:scale-95 transition-transform"
              >
                <span className="bg-white dark:bg-navy-800 text-slate-900 dark:text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-xl border border-slate-100 dark:border-white/10">
                  {action.label}
                </span>
                <div className={`${action.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl text-white border-2 border-white dark:border-navy-900`}>
                  {React.cloneElement(action.icon as React.ReactElement, { width: 20, height: 20 })}
                </div>
              </button>
            ))}
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-2xl shadow-2xl shadow-blue-500/30 flex items-center justify-center text-white transition-all duration-300 pointer-events-auto active:scale-90 border-2 border-white dark:border-navy-900 ${
            isOpen ? 'bg-slate-900 rotate-45' : 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:brightness-110'
          }`}
        >
          <PlusIcon />
        </button>
      </div>

      {activeModal && (
        <Modal type={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
};
