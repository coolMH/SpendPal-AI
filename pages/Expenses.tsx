
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, SwipeableRow } from '../components/UIComponents';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Modal } from '../components/Modal';

export const Expenses = () => {
  const { transactions, totalBalance, deleteTransaction, setCurrentView } = useApp();
  const [activeModal, setActiveModal] = useState<'EXPENSE' | 'INCOME' | null>(null);
  const [editItem, setEditItem] = useState<any>(null);

  // Mock Chart Data for Area Chart (Smoothed)
  const chartData = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 5000 },
    { name: 'Apr', amount: 7500 },
    { name: 'May', amount: 6200 },
    { name: 'Jun', amount: 8000 },
  ];

  const handleEdit = (transaction: any) => {
    setEditItem(transaction);
    setActiveModal(transaction.type === 'income' ? 'INCOME' : 'EXPENSE');
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditItem(null);
  };

  return (
    <div className="p-6 space-y-6 pb-24 animate-slide-up">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
         <button onClick={() => setCurrentView('HOME')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
         </button>
         <h1 className="text-lg font-bold text-slate-900 dark:text-white">Transaction History</h1>
         <div className="w-10"></div> {/* Spacer */}
      </header>

      {/* Main Balance */}
      <div className="flex justify-between items-end px-2">
         <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Balance</p>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">${totalBalance.toLocaleString()}</h2>
         </div>
         <span className="text-green-600 dark:text-green-500 font-bold text-sm bg-green-100 dark:bg-green-500/10 px-2 py-1 rounded-lg">+ $568 (Today)</span>
      </div>

      {/* Chart Card */}
      <Card variant="primary" className="!p-6 !bg-slate-900 dark:!bg-navy-800 border-none shadow-xl relative overflow-hidden">
         <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="font-bold text-white">Savings</h3>
            <div className="flex gap-2">
               <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-1 rounded-md">Chart</span>
               <span className="text-[10px] font-bold text-slate-400 px-2 py-1">Table</span>
            </div>
         </div>

         <div className="h-40 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                  <defs>
                     <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                     cursor={{stroke: 'rgba(255,255,255,0.2)'}}
                  />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                  <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>

         {/* Decoration Circles */}
         <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center px-1">
         <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transactions</h3>
         <button onClick={() => setCurrentView('REPORTS')} className="text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors">See all</button>
      </div>

      {/* Quick Action Buttons Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
         <button onClick={() => setActiveModal('EXPENSE')} className="bg-white dark:bg-navy-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors active:scale-95 shadow-sm border border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/20 text-red-500 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Expense</span>
         </button>

         <button onClick={() => setActiveModal('INCOME')} className="bg-white dark:bg-navy-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors active:scale-95 shadow-sm border border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/20 text-green-500 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Income</span>
         </button>

         <button onClick={() => setCurrentView('WALLETS')} className="bg-white dark:bg-navy-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors active:scale-95 shadow-sm border border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Wallet</span>
         </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map(t => (
            <SwipeableRow key={t.id} onDelete={() => deleteTransaction(t.id)} onEdit={() => handleEdit(t)}>
              <Card variant="default" className="!p-4 flex justify-between items-center">
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
                    <h4 className="font-bold text-slate-900 dark:text-white">{t.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{t.date}</p>
                  </div>
                </div>
                <span className={`font-bold ${t.type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-slate-900 dark:text-white'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(0)}
                </span>
              </Card>
            </SwipeableRow>
          ))
        ) : (
          <div className="text-center py-10 text-slate-500 text-sm">No transactions found.</div>
        )}
      </div>

      {activeModal && <Modal type={activeModal} onClose={closeModal} initialData={editItem} />}
    </div>
  );
};
