
import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge } from '../components/UIComponents';
import { PlanTier } from '../types';

export const Plans = () => {
  const { setCurrentView, userProfile, updateUserProfile } = useApp();

  const handleUpgrade = (plan: PlanTier) => {
    updateUserProfile({ plan });
  };

  const plans: {name: PlanTier, price: string, period: string, features: string[], color: string, button: string, recommended?: boolean}[] = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      features: ['Basic Expense Tracking', 'Standard Categories', 'Manual Budgeting', '7 Days History'],
      color: 'bg-slate-700',
      button: 'Current Plan',
    },
    {
      name: 'Pro',
      price: '$5',
      period: '/mo',
      features: ['Unlimited History', 'Smart AI Expense Input', 'Recurring Transactions', 'PDF Reports', 'Prioritized Support'],
      color: 'bg-blue-600',
      button: 'Upgrade to Pro',
      recommended: true,
    },
    {
      name: 'Advanced',
      price: '$10',
      period: '/mo',
      features: ['All Pro Features', 'Predictive AI Analytics', 'Financial Health Score', 'Investment Tracking', 'API Access'],
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      button: 'Upgrade to Advanced',
    }
  ];

  return (
    <div className="p-4 space-y-6 pb-24 animate-slide-up">
      <div className="flex items-center gap-2 mb-2">
         <button onClick={() => setCurrentView('SETTINGS')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
         </button>
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subscription Plans</h1>
      </div>
      
      <p className="text-slate-500 text-sm">Choose the plan that fits your financial journey. Upgrade anytime.</p>

      <div className="space-y-4">
        {plans.map((plan, idx) => {
          const isCurrent = userProfile.plan === plan.name;
          return (
            <div key={idx} className={`relative rounded-3xl p-6 border transition-all ${plan.recommended ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'} ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </span>
              )}
              
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${plan.name === 'Advanced' ? 'bg-purple-600' : plan.name === 'Pro' ? 'bg-green-500' : 'bg-slate-500'} text-white`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                   </div>
                   <h3 className="font-bold text-xl text-slate-900 dark:text-white">{plan.name}</h3>
                   <div className="flex items-baseline gap-1">
                     <span className="text-3xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                     <span className="text-sm text-slate-500">{plan.period}</span>
                   </div>
                 </div>
                 {isCurrent && <Badge color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">Active</Badge>}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <svg className="text-green-500 shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleUpgrade(plan.name)}
                disabled={isCurrent}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${isCurrent ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-default shadow-none' : plan.recommended ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/20' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'}`}
              >
                {isCurrent ? 'Current Plan' : plan.button}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
