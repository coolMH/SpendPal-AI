
import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/UIComponents';
import { ViewState } from '../types';

export const More = () => {
  const { setCurrentView, userProfile } = useApp();

  const menuItems: { label: string; view?: ViewState; icon: React.ReactNode; color: string }[] = [
    { label: 'Income', view: 'INCOME', color: 'bg-green-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { label: 'Categories', view: 'CATEGORIES', color: 'bg-orange-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> },
    { label: 'Budgets', view: 'BUDGETS', color: 'bg-blue-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> },
    { label: 'Wallets', view: 'WALLETS', color: 'bg-indigo-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg> },
    { label: 'Subscriptions', view: 'SUBSCRIPTIONS', color: 'bg-pink-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> },
    { label: 'Reports', view: 'REPORTS', color: 'bg-purple-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg> },
    { label: 'Notifications', view: 'NOTIFICATIONS', color: 'bg-red-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> },
    { label: 'Settings', view: 'SETTINGS', color: 'bg-slate-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
    { label: 'Profile', view: 'PROFILE', color: 'bg-teal-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  return (
    <div className="p-4 pb-24 space-y-4 animate-slide-up">
      <div className="flex items-center gap-4 mb-6 cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-colors" onClick={() => setCurrentView('PROFILE')}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
           <img src={userProfile.avatar} className="w-full h-full rounded-full object-cover border-2 border-slate-900" alt="Profile" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{userProfile.name}</h1>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg inline-block mt-1">
             {userProfile.plan} Member
          </p>
        </div>
      </div>

      <Card onClick={() => setCurrentView('PLANS')} className="cursor-pointer bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-yellow-500">Upgrade to Pro</h3>
            <p className="text-xs text-yellow-200/70">Get unlimited AI insights & more</p>
          </div>
          <Button className="!py-2 !px-3 text-xs bg-yellow-500 hover:bg-yellow-400 text-black border-none">Upgrade</Button>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {menuItems.map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => item.view && setCurrentView(item.view)}
            className="bg-white dark:bg-navy-800 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center gap-2 text-center shadow-sm"
          >
            <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white shadow-lg`}>
              {React.cloneElement(item.icon as React.ReactElement, { width: 16, height: 16 })}
            </div>
            <span className="font-medium text-xs text-slate-700 dark:text-slate-200">{item.label}</span>
          </button>
        ))}
      </div>

      <Button variant="ghost" className="w-full mt-8 text-red-400 hover:bg-red-500/10 hover:text-red-300">
        Log Out
      </Button>
    </div>
  );
};
