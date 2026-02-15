
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, SwipeableRow } from '../components/UIComponents';
import { Modal } from '../components/Modal';

export const Categories = () => {
  const { categories, transactions, deleteCategory } = useApp();
  const [showModal, setShowModal] = useState(false);

  // Calculate spend per category
  const spendByCategory = categories.map(cat => {
    const total = transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, total };
  }).sort((a, b) => b.total - a.total);

  return (
    <div className="p-4 space-y-4 pb-24 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
         <Button onClick={() => setShowModal(true)} className="!py-2 text-sm flex items-center gap-1">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
           Add
         </Button>
      </div>

      <div className="space-y-3">
        {spendByCategory.map((item, idx) => (
           <SwipeableRow key={idx} onDelete={() => deleteCategory(item.name)}>
             <Card className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                     <span className="text-lg font-bold">{item.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                    <p className="text-xs text-slate-400">${item.total.toLocaleString()} spent</p>
                  </div>
                </div>
                <div className="h-1 w-24 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, item.total / 1000 * 100)}%` }}></div>
                </div>
             </Card>
           </SwipeableRow>
        ))}
      </div>

      {showModal && <Modal type="CATEGORY" onClose={() => setShowModal(false)} />}
    </div>
  );
};
