import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/UIComponents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Reports = () => {
  const { transactions, setCurrentView, totalIncome, totalExpenses, totalBalance, categories } = useApp();

  // Process Data for Category Pie Chart
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(i => i.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  // Top Spending Categories (Top 3)
  const topCategories = categoryData.slice(0, 3);

  // Payment Methods Data
  const paymentMethodData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const method = t.paymentMethod || 'Other';
      const existing = acc.find(i => i.name === method);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: method, value: 1 });
      }
      return acc;
    }, []);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

  const monthlyData = [
    { name: 'Income', amount: totalIncome },
    { name: 'Expense', amount: totalExpenses },
  ];

  const highestExpense = Math.max(...transactions.filter(t => t.type === 'expense').map(t => t.amount), 0);
  const avgDaily = transactions.length > 0 ? totalExpenses / 30 : 0; // Simplified 30 day avg

  return (
    <div className="p-4 pb-24 space-y-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setCurrentView('MORE')} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center py-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Net Savings</p>
          <h2 className="text-2xl font-bold text-green-400 mt-1">${totalBalance.toFixed(0)}</h2>
        </Card>
        <Card className="text-center py-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Savings Rate</p>
          <h2 className="text-2xl font-bold text-blue-400 mt-1">{totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%</h2>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-4">Income vs Expenses</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50}>
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold mb-2">Expenses by Category</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {categoryData.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              <span className="text-xs text-slate-300">{entry.name}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
         <h3 className="font-semibold mb-3">Top Spending Categories</h3>
         <div className="space-y-3">
            {topCategories.map((cat, idx) => (
               <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <span className="text-slate-400 text-sm">#{idx + 1}</span>
                     <span className="font-medium">{cat.name}</span>
                  </div>
                  <span className="font-bold text-white">${cat.value.toLocaleString()}</span>
               </div>
            ))}
         </div>
      </Card>

      <Card>
        <h3 className="font-semibold mb-3">Payment Methods Used</h3>
        <div className="flex gap-2 flex-wrap">
           {paymentMethodData.map((m, idx) => (
              <span key={idx} className="bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-300 border border-slate-700">
                 {m.name} ({m.value})
              </span>
           ))}
        </div>
      </Card>

      <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
        <h3 className="font-semibold text-sm mb-3 text-slate-300">Period Summary</h3>
        <div className="space-y-2 text-sm">
           <div className="flex justify-between">
             <span className="text-slate-400">Total Transactions</span>
             <span>{transactions.length}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-slate-400">Avg. Daily Spending</span>
             <span>${avgDaily.toFixed(2)}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-slate-400">Highest Expense</span>
             <span>${highestExpense.toFixed(2)}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-slate-400">Categories Used</span>
             <span>{categoryData.length}</span>
           </div>
        </div>
      </div>
    </div>
  );
};