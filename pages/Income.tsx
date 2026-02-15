
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, SwipeableRow } from '../components/UIComponents';
import { Modal } from '../components/Modal';

export const Income = () => {
  const { transactions, deleteTransaction } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const incomes = transactions.filter(t => t.type === 'income');
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

  const handleEdit = (item: any) => {
    setEditItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  return (
    <div className="p-4 space-y-4 pb-24 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Income Sources</h1>
         <Button onClick={() => setShowModal(true)} className="!py-2 text-sm">+ Add Income</Button>
      </div>

      <Card className="bg-gradient-to-br from-[#064E3B] to-[#065F46] dark:from-green-900 dark:to-emerald-950 border-green-500/20 shadow-xl shadow-green-900/10">
        <p className="text-sm text-white/80 mb-1 font-medium">Total Received (This Month)</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">${totalIncome.toLocaleString()}</h2>
      </Card>

      <div className="space-y-3">
        {incomes.length > 0 ? (
          incomes.map(t => (
            <SwipeableRow key={t.id} onDelete={() => deleteTransaction(t.id)} onEdit={() => handleEdit(t)}>
              <Card className="flex justify-between items-center py-4 px-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center text-lg font-bold">
                    $
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{t.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.category} • {t.date}</p>
                  </div>
                </div>
                <span className="font-bold text-green-600 dark:text-green-400">
                  +${t.amount.toFixed(2)}
                </span>
              </Card>
            </SwipeableRow>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400">
            No income records yet.
          </div>
        )}
      </div>

      {showModal && <Modal type="INCOME" onClose={closeModal} initialData={editItem} />}
    </div>
  );
};
