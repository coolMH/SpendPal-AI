
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, ProgressBar, SwipeableRow } from '../components/UIComponents';
import { Modal } from '../components/Modal';

export const Budgets = () => {
  const { budgets, deleteBudget } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const handleEdit = (budget: any) => {
    setEditItem(budget);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-slide-up">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Budgets</h1>
         <Button onClick={() => setShowModal(true)} className="!py-2 text-sm flex items-center gap-1">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
           Add
         </Button>
      </div>

      <div className="space-y-4">
        {budgets.map(b => {
          const percentage = Math.min((b.spent / b.limit) * 100, 100);
          const isOver = b.spent > b.limit;

          return (
            <SwipeableRow key={b.id} onDelete={() => deleteBudget(b.id)} onEdit={() => handleEdit(b)}>
              <Card>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: b.color}}></div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{b.category}</h3>
                  </div>
                  <span className={`text-sm font-medium ${isOver ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    ${b.spent.toLocaleString()} / ${b.limit.toLocaleString()}
                  </span>
                </div>
                
                <ProgressBar progress={percentage} color={isOver ? 'bg-red-500' : 'bg-orange-500'} />
                
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>{percentage.toFixed(0)}% Used</span>
                  <span>${Math.max(0, b.limit - b.spent).toLocaleString()} Remaining</span>
                </div>
              </Card>
            </SwipeableRow>
          );
        })}

        {budgets.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No budgets set. Create one to track spending!
          </div>
        )}
      </div>

      {showModal && <Modal type="BUDGET" onClose={closeModal} initialData={editItem} />}
    </div>
  );
};
