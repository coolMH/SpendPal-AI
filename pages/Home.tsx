
import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/UIComponents';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis } from 'recharts';

export const Home = () => {
  const { userProfile, totalBalance, transactions, setCurrentView } = useApp();

  // Mock Activity Data (Last 7 days)
  const activityData = [
    { day: 'Mon', val: 40 },
    { day: 'Tue', val: 70 },
    { day: 'Wed', val: 50 },
    { day: 'Thu', val: 90 },
    { day: 'Fri', val: 65 },
    { day: 'Sat', val: 30 },
    { day: 'Sun', val: 80 },
  ];

  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="p-6 space-y-8 animate-slide-up">
      {/* Top Header */}
      <header className="flex justify-between items-start pt-4">
         <div className="flex gap-4">
            <div 
              onClick={() => setCurrentView('PROFILE')}
              className="w-12 h-12 rounded-2xl bg-white dark:bg-navy-800 p-0.5 cursor-pointer hover:scale-105 transition-transform shadow-sm border border-slate-100 dark:border-white/5"
            >
               <img src={userProfile.avatar} className="w-full h-full rounded-[14px] object-cover" alt="User" />
            </div>
            <div>
               <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium mb-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  New York, USA
               </div>
               <h1 className="text-xl font-bold text-slate-900 dark:text-white">Hello {userProfile.name.split(' ')[0]}!</h1>
            </div>
         </div>
         <button onClick={() => setCurrentView('MORE')} className="p-3 bg-white dark:bg-navy-800 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
         </button>
      </header>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-2 gap-4">
         {/* Main Activity Chart - Large */}
         <Card variant="glass" className="col-span-1 row-span-2 !p-5 flex flex-col justify-between h-[280px]">
            <div>
               <h3 className="font-bold text-slate-900 dark:text-white mb-1">Activity</h3>
               <p className="text-xs text-slate-500 dark:text-slate-400">Of Current week</p>
            </div>
            
            <div className="h-32 w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                     <XAxis dataKey="day" hide />
                     <Bar dataKey="val" radius={[4, 4, 4, 4]} barSize={8}>
                        {activityData.map((entry, index) => (
                           <Cell 
                              key={`cell-${index}`} 
                              fill={entry.val > 60 ? '#3b82f6' : '#94a3b8'} 
                              className="dark:opacity-80"
                           />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
               <div className="flex justify-between text-[8px] text-slate-400 mt-2 px-1 font-bold uppercase tracking-wider">
                  <span>Mon</span><span>Sun</span>
               </div>
            </div>

            <div className="mt-2">
               <p className="text-2xl font-bold text-slate-900 dark:text-white">${totalBalance.toLocaleString()}</p>
               <p className="text-[10px] text-green-500 font-bold">+2.5% vs last week</p>
            </div>
         </Card>

         {/* Side Stat Card 1 */}
         <Card className="!p-4 flex flex-col justify-center gap-1 group hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors cursor-pointer border-slate-100 dark:border-white/5">
             <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-slate-900 dark:text-white mb-1">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
             <p className="text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-blue-100">Income Last Week</p>
             <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-white">$1,250</p>
         </Card>

         {/* Side Stat Card 2 */}
         <Card className="!p-4 flex flex-col justify-center gap-1 border-slate-100 dark:border-white/5">
             <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white mb-1">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
             </div>
             <p className="text-[10px] text-slate-500 dark:text-slate-400">Expense Last Week</p>
             <p className="text-lg font-bold text-slate-900 dark:text-white">$850.20</p>
         </Card>
      </div>

      {/* Transactions Section */}
      <div>
         <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transactions</h2>
            <button onClick={() => setCurrentView('EXPENSES')} className="text-xs font-bold text-slate-400 hover:text-blue-500">See all</button>
         </div>
         
         <div className="space-y-3">
            {recentTransactions.length > 0 ? recentTransactions.map((t, idx) => (
               <Card 
                  key={t.id} 
                  variant="default" 
                  className="!p-4 flex items-center justify-between"
               >
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center text-xl shadow-sm border border-slate-50 dark:border-white/5 ${
                        t.type === 'income' 
                           ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-500' 
                           : 'bg-white dark:bg-navy-800 text-slate-700 dark:text-white'
                     }`}>
                        {t.type === 'income' ? (
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        ) : (
                           t.category.charAt(0)
                        )}
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t.date} • {t.category}</p>
                     </div>
                  </div>
                  <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-slate-900 dark:text-white'}`}>
                     {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(0)}
                  </span>
               </Card>
            )) : (
               <div className="text-center py-10 text-slate-500 text-sm">No transactions yet</div>
            )}
         </div>
      </div>
    </div>
  );
};
