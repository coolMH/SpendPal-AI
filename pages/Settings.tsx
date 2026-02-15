
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/UIComponents';

export const Settings = () => {
  const { userProfile, setCurrentView, deleteAccountData, toggleTheme, exportData } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  const handleDelete = () => {
    deleteAccountData();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-slide-up">
      <div className="flex items-center gap-2">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">General</h1>
      </div>
      <p className="text-sm text-slate-500">Customize your experience</p>

      <section className="space-y-4">
         <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Currency</label>
            <div className="relative">
               <select className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 appearance-none text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option className="text-slate-900 dark:text-white bg-white dark:bg-[#1E293B]">US Dollar ($)</option>
                  <option className="text-slate-900 dark:text-white bg-white dark:bg-[#1E293B]">Euro (€)</option>
                  <option className="text-slate-900 dark:text-white bg-white dark:bg-[#1E293B]">GBP (£)</option>
                  <option className="text-slate-900 dark:text-white bg-white dark:bg-[#1E293B]">Yen (¥)</option>
               </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
            </div>
         </div>

         <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Timezone</label>
            <div className="relative">
               <select className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 appearance-none text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option className="text-slate-900 dark:text-white bg-white dark:bg-[#1E293B]">UTC</option>
                  <option className="text-slate-900 dark:text-white bg-white dark:bg-[#1E293B]">EST (New York)</option>
                  <option className="text-slate-900 dark:text-white bg-white dark:bg-[#1E293B]">PST (Los Angeles)</option>
                  <option className="text-slate-900 dark:text-white bg-white dark:bg-[#1E293B]">GMT (London)</option>
               </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
            </div>
         </div>
      </section>

      <section className="space-y-3 pt-4">
         <h3 className="font-bold text-lg text-slate-900 dark:text-white">App Theme</h3>
         <div className="flex gap-4">
            <button onClick={toggleTheme} className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${userProfile.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
               <div className="w-8 h-8 rounded-full bg-white border shadow-sm"></div>
               <span className="text-sm font-medium text-slate-900">Light</span>
            </button>
            <button onClick={toggleTheme} className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${userProfile.theme === 'dark' ? 'border-blue-500 bg-slate-800' : 'border-slate-700 bg-slate-900'}`}>
               <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600"></div>
               <span className="text-sm font-medium text-white">Dark</span>
            </button>
         </div>
      </section>

      <section className="space-y-4 pt-4">
         <h3 className="font-bold text-lg text-slate-900 dark:text-white">Notifications</h3>
         
         <div className="flex items-center justify-between">
            <div>
               <h4 className="font-medium text-slate-900 dark:text-white">Push Notifications</h4>
               <p className="text-xs text-slate-500">Receive notifications about your finances</p>
            </div>
            <button 
               onClick={() => setPushEnabled(!pushEnabled)}
               className={`w-12 h-7 rounded-full transition-colors relative ${pushEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
               <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${pushEnabled ? 'left-6' : 'left-1'}`}></div>
            </button>
         </div>

         <div className="flex items-center justify-between">
            <div>
               <h4 className="font-medium text-slate-900 dark:text-white">Budget Alerts</h4>
               <p className="text-xs text-slate-500">Get notified when approaching limits</p>
            </div>
            <button 
               onClick={() => setBudgetAlerts(!budgetAlerts)}
               className={`w-12 h-7 rounded-full transition-colors relative ${budgetAlerts ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
               <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${budgetAlerts ? 'left-6' : 'left-1'}`}></div>
            </button>
         </div>
      </section>

      <section className="space-y-4 pt-4">
         <h3 className="font-bold text-lg text-slate-900 dark:text-white">Data & Security</h3>
         <Button variant="secondary" onClick={exportData} className="w-full justify-between group">
            <span className="flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
               Export Data
            </span>
            <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white">→</span>
         </Button>

         {!showDeleteConfirm ? (
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(true)} className="w-full justify-between text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 border border-red-100 dark:border-red-900/30">
               <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  Delete Account
               </span>
            </Button>
         ) : (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
               <h4 className="font-bold text-red-600 dark:text-red-400 mb-1">Are you sure?</h4>
               <p className="text-xs text-red-500/80 mb-3">This action cannot be undone. All your data will be lost.</p>
               <div className="flex gap-2">
                  <Button variant="danger" onClick={handleDelete} className="flex-1 py-2 text-sm">Yes, Delete</Button>
                  <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 text-sm">Cancel</Button>
               </div>
            </div>
         )}
      </section>

      <p className="text-center text-xs text-slate-400 mt-8">SpendPal v2.0.0</p>
    </div>
  );
};
