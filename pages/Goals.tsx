
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, ProgressBar, Button, SwipeableRow } from '../components/UIComponents';
import { Modal } from '../components/Modal';

export const Goals = () => {
  const { goals, updateGoal, deleteGoal } = useApp();
  const [amountInput, setAmountInput] = useState<{ [key: string]: string }>({});
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  const handleDeposit = (id: string, targetAmount: number) => {
    const amount = parseFloat(amountInput[id]);
    if (amount > 0) {
      updateGoal(id, amount);
      setAmountInput(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleEdit = (goal: any) => {
    setEditItem(goal);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-slide-up">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Savings Goals</h1>
      </div>

      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none">
         <p className="text-purple-100 text-sm">Total Saved</p>
         <h2 className="text-4xl font-bold mt-1">${goals.reduce((acc, g) => acc + g.savedAmount, 0).toLocaleString()}</h2>
         <div className="flex gap-2 mt-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">{activeGoals.length} active</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">{completedGoals.length} completed</span>
         </div>
      </Card>

      <section className="space-y-4">
        {activeGoals.map(goal => (
          <SwipeableRow key={goal.id} onDelete={() => deleteGoal(goal.id)} onEdit={() => handleEdit(goal)}>
            <Card>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className={`w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl`}>
                      {goal.icon || '🎯'}
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-slate-900 dark:text-white">{goal.title}</h3>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Target: ${goal.targetAmount.toLocaleString()}</p>
                   </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xl text-blue-600 dark:text-blue-400">${goal.savedAmount.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 block">{Math.round((goal.savedAmount / goal.targetAmount) * 100)}%</span>
                </div>
              </div>
              
              <ProgressBar progress={(goal.savedAmount / goal.targetAmount) * 100} color="bg-blue-500" />
              
              <div className="mt-4 flex gap-2">
                 <input 
                   type="number"
                   placeholder="Amount"
                   className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                   value={amountInput[goal.id] || ''}
                   onChange={(e) => setAmountInput(prev => ({ ...prev, [goal.id]: e.target.value }))}
                 />
                 <Button variant="secondary" className="text-xs py-2 px-3 flex-1" onClick={() => handleDeposit(goal.id, goal.targetAmount)}>
                   + Deposit
                 </Button>
              </div>
            </Card>
          </SwipeableRow>
        ))}
        {activeGoals.length === 0 && completedGoals.length === 0 && (
           <div className="text-center py-10 text-slate-500">No goals set yet. Tap + to start saving!</div>
        )}
      </section>

      {completedGoals.length > 0 && (
        <section className="space-y-4 mt-8">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Completed</h3>
          {completedGoals.map(goal => (
            <SwipeableRow key={goal.id} onDelete={() => deleteGoal(goal.id)} onEdit={() => handleEdit(goal)}>
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="text-2xl">🎉</div>
                      <div>
                         <h3 className="font-bold text-slate-900 dark:text-white">{goal.title}</h3>
                         <p className="text-xs text-green-600 dark:text-green-400">${goal.targetAmount.toLocaleString()} saved</p>
                      </div>
                   </div>
                   <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-300"><polyline points="20 6 9 17 4 12"/></svg>
                   </div>
                </div>
              </Card>
            </SwipeableRow>
          ))}
        </section>
      )}

      {showModal && <Modal type="GOAL" onClose={closeModal} initialData={editItem} />}
    </div>
  );
};
