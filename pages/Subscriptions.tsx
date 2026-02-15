
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, SwipeableRow } from '../components/UIComponents';
import { Modal } from '../components/Modal';

export const Subscriptions = () => {
  const { subscriptions, deleteSubscription } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const monthlyCost = subscriptions.reduce((sum, sub) => sub.billingCycle === 'monthly' ? sum + sub.cost : sum + (sub.cost/12), 0);
  const yearlyCost = monthlyCost * 12;

  const handleEdit = (sub: any) => {
    setEditItem(sub);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-slide-up">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold">Subscriptions</h1>
         <Button onClick={() => setShowModal(true)} className="!py-2 text-sm">+ Add</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-pink-900/20 border-pink-500/20">
           <p className="text-xs text-pink-300 mb-1">Monthly Cost</p>
           <h3 className="text-xl font-bold text-white">${monthlyCost.toFixed(2)}</h3>
        </Card>
        <Card className="bg-purple-900/20 border-purple-500/20">
           <p className="text-xs text-purple-300 mb-1">Yearly Cost</p>
           <h3 className="text-xl font-bold text-white">${yearlyCost.toFixed(2)}</h3>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center">
           <span className="text-slate-400">Total Active Subscriptions</span>
           <span className="font-bold text-white">{subscriptions.length}</span>
        </div>
      </Card>

      <div className="space-y-3">
        {subscriptions.map(sub => (
          <SwipeableRow key={sub.id} onDelete={() => deleteSubscription(sub.id)} onEdit={() => handleEdit(sub)}>
            <Card className="flex justify-between items-center py-4 px-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                  {sub.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium">{sub.name}</h4>
                  <p className="text-xs text-slate-400">Next bill: {sub.nextBillingDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">${sub.cost}</p>
                <p className="text-[10px] text-slate-500 uppercase">{sub.billingCycle}</p>
              </div>
            </Card>
          </SwipeableRow>
        ))}
      </div>

      {showModal && <Modal type="SUBSCRIPTION" onClose={closeModal} initialData={editItem} />}
    </div>
  );
};
