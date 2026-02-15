
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, SwipeableRow } from '../components/UIComponents';
import { Modal } from '../components/Modal';

export const Wallets = () => {
  const { accounts, netWorth, deleteAccount } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const totalAssets = accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0);

  const handleEdit = (account: any) => {
    setEditItem(account);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-slide-up">
      <h1 className="text-2xl font-bold mb-4">Wallets & Net Worth</h1>

      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700">
        <p className="text-sm text-slate-400">Total Net Worth</p>
        <h2 className="text-4xl font-bold text-white mt-1">${netWorth.toLocaleString()}</h2>
        <div className="grid grid-cols-2 gap-4 mt-6">
           <div>
             <p className="text-xs text-green-400 mb-1 uppercase tracking-wider">Assets</p>
             <p className="text-lg font-semibold">${totalAssets.toLocaleString()}</p>
           </div>
           <div>
             <p className="text-xs text-red-400 mb-1 uppercase tracking-wider">Liabilities</p>
             <p className="text-lg font-semibold">${totalLiabilities.toLocaleString()}</p>
           </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mt-6">
         <h2 className="text-lg font-semibold">Accounts</h2>
         <Button onClick={() => setShowModal(true)} variant="secondary" className="!py-1 !px-3 text-xs">+ Add Account</Button>
      </div>

      <div className="space-y-3">
        {accounts.map(account => (
          <SwipeableRow key={account.id} onDelete={() => deleteAccount(account.id)} onEdit={() => handleEdit(account)}>
            <Card className="flex justify-between items-center py-4 px-5">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{account.icon}</div>
                <div>
                  <h4 className="font-medium">{account.name}</h4>
                  <p className={`text-xs ${account.type === 'Asset' ? 'text-green-400' : 'text-red-400'}`}>
                    {account.type}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-white">
                ${account.balance.toLocaleString()}
              </span>
            </Card>
          </SwipeableRow>
        ))}
      </div>

      {showModal && <Modal type="ACCOUNT" onClose={closeModal} initialData={editItem} />}
    </div>
  );
};
