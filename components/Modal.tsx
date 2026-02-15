
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { suggestBudgetAmount } from '../services/geminiService';
import { Button } from './UIComponents';
import { SmartExpenseInput } from './SmartExpenseInput';

interface ModalProps {
  type: 'EXPENSE' | 'INCOME' | 'GOAL' | 'SUBSCRIPTION' | 'BUDGET' | 'CATEGORY' | 'ACCOUNT';
  onClose: () => void;
  initialData?: any;
}

export const Modal: React.FC<ModalProps> = ({ type, onClose, initialData }) => {
  const { 
    addTransaction, editTransaction,
    addGoal, editGoal,
    addSubscription, editSubscription,
    addBudget, editBudget,
    addCategory, 
    addAccount, editAccount,
    transactions 
  } = useApp();

  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;
  
  // Generic State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(''); 
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  // Goal Specific
  const [targetAmount, setTargetAmount] = useState('');
  const [icon, setIcon] = useState('🎯');

  // Subscription Specific
  const [billingCycle, setBillingCycle] = useState('monthly');

  // Account Specific
  const [accountType, setAccountType] = useState('Asset');

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      if (type === 'EXPENSE' || type === 'INCOME') {
        setTitle(initialData.title);
        setAmount(initialData.amount.toString());
        setCategory(initialData.category);
        setPaymentMethod(initialData.paymentMethod || 'Other');
        setIsRecurring(initialData.isRecurring || false);
      } else if (type === 'GOAL') {
        setTitle(initialData.title);
        setAmount(initialData.savedAmount.toString());
        setTargetAmount(initialData.targetAmount.toString());
        setIcon(initialData.icon || '🎯');
      } else if (type === 'SUBSCRIPTION') {
        setTitle(initialData.name);
        setAmount(initialData.cost.toString());
        setBillingCycle(initialData.billingCycle);
      } else if (type === 'BUDGET') {
        setTitle(initialData.category); // Budget title acts as category
        setCategory(initialData.category);
        setAmount(initialData.limit.toString());
      } else if (type === 'ACCOUNT') {
        setTitle(initialData.name);
        setAmount(initialData.balance.toString());
        setAccountType(initialData.type);
      }
    }
  }, [initialData, type]);

  // Smart Input Handler
  const handleSmartParsed = (data: any) => {
    if (data.title) setTitle(data.title);
    if (data.name) setTitle(data.name); 
    if (data.amount) setAmount(data.amount.toString());
    if (data.cost) setAmount(data.cost.toString());
    if (data.limit) setAmount(data.limit.toString());
    if (data.balance) setAmount(data.balance.toString());
    if (data.targetAmount) setTargetAmount(data.targetAmount.toString());
    if (data.category) setCategory(data.category);
    if (data.paymentMethod) setPaymentMethod(data.paymentMethod);
    if (data.isRecurring !== undefined) setIsRecurring(data.isRecurring);
  };

  const handleAIAutoFill = async () => {
    if (type === 'BUDGET' && category) {
      setLoading(true);
      const suggested = await suggestBudgetAmount(category, transactions);
      setAmount(suggested.toString());
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const id = initialData?.id || Date.now().toString();
      
      if (type === 'EXPENSE' || type === 'INCOME') {
        const tData = {
          id,
          title,
          amount: parseFloat(amount),
          type: type === 'EXPENSE' ? 'expense' as const : 'income' as const,
          category: category || (type === 'INCOME' ? 'Income' : 'General'),
          date: initialData?.date || new Date().toISOString().split('T')[0],
          paymentMethod: paymentMethod || 'Other',
          isRecurring
        };
        isEditing ? editTransaction(tData) : addTransaction(tData);

      } else if (type === 'GOAL') {
        const gData = {
          id,
          title,
          targetAmount: parseFloat(targetAmount),
          savedAmount: parseFloat(amount) || 0,
          color: initialData?.color || 'bg-blue-500',
          icon: icon || '🎯',
          completed: (parseFloat(amount) || 0) >= parseFloat(targetAmount)
        };
        isEditing ? editGoal(gData) : addGoal(gData);

      } else if (type === 'SUBSCRIPTION') {
        const sData = {
          id,
          name: title,
          cost: parseFloat(amount),
          billingCycle: billingCycle as 'monthly' | 'yearly',
          nextBillingDate: initialData?.nextBillingDate || new Date().toISOString().split('T')[0]
        };
        isEditing ? editSubscription(sData) : addSubscription(sData);

      } else if (type === 'BUDGET') {
        const bData = {
          id,
          category: category || title, 
          limit: parseFloat(amount),
          spent: isEditing ? initialData.spent : 0, // Preserve spent amount on edit
          color: initialData?.color || '#3b82f6'
        };
        isEditing ? editBudget(bData) : addBudget(bData);

      } else if (type === 'CATEGORY') {
        addCategory(title); // Categories are strings, no edit logic simple needed here
      } else if (type === 'ACCOUNT') {
        const aData = {
          id,
          name: title,
          type: accountType as 'Asset' | 'Liability',
          balance: parseFloat(amount),
          icon: '🏦'
        };
        isEditing ? editAccount(aData) : addAccount(aData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative animate-slide-up max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 capitalize text-slate-800 dark:text-white">
          {isEditing ? 'Edit' : 'Add'} {type.toLowerCase()}
        </h2>

        {!isEditing && <SmartExpenseInput onParsed={handleSmartParsed} type={type} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {type === 'BUDGET' ? 'Category Name' : 'Title / Name'}
            </label>
            <input 
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder={type === 'BUDGET' ? 'e.g. Dining Out' : "e.g. Item Name"}
              value={type === 'BUDGET' ? category : title}
              onChange={(e) => type === 'BUDGET' ? setCategory(e.target.value) : setTitle(e.target.value)}
            />
          </div>

          {(type !== 'CATEGORY') && (
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                {type === 'BUDGET' ? 'Limit Amount' : type === 'ACCOUNT' ? 'Current Balance' : type === 'GOAL' ? (isEditing ? 'Current Saved Amount' : 'Initial Deposit') : 'Amount'}
              </label>
              <input 
                {...(type !== 'GOAL' ? { required: true } : {})}
                type="number"
                step="0.01"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {type === 'BUDGET' && category && !isEditing && (
                <button 
                  type="button" 
                  onClick={handleAIAutoFill}
                  className="absolute right-2 top-8 text-xs bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-200 transition"
                >
                  {loading ? '...' : 'Ask AI'}
                </button>
              )}
            </div>
          )}

          {type === 'GOAL' && (
             <>
               <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Target Amount</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="1000.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Icon (Emoji)</label>
                <input 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="🎯"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                />
              </div>
            </>
          )}

          {(type === 'EXPENSE' || type === 'INCOME') && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Category</label>
                <input 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. Food"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
               <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Payment Method</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                 <input 
                    type="checkbox" 
                    id="recurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                 />
                 <label htmlFor="recurring" className="text-sm text-slate-600 dark:text-slate-300">Recurring Transaction</label>
              </div>
            </>
          )}

          {type === 'SUBSCRIPTION' && (
             <div>
             <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Billing Cycle</label>
             <select 
               className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
               value={billingCycle}
               onChange={(e) => setBillingCycle(e.target.value)}
             >
               <option value="monthly">Monthly</option>
               <option value="yearly">Yearly</option>
             </select>
           </div>
          )}

          {type === 'ACCOUNT' && (
             <div>
             <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Type</label>
             <select 
               className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
               value={accountType}
               onChange={(e) => setAccountType(e.target.value)}
             >
               <option value="Asset">Asset (Bank, Cash, Investment)</option>
               <option value="Liability">Liability (Credit Card, Loan)</option>
             </select>
           </div>
          )}

          <Button type="submit" disabled={loading} className="mt-4">
            {loading ? 'Processing...' : (isEditing ? 'Update' : 'Save Item')}
          </Button>
        </form>
      </div>
    </div>
  );
};
