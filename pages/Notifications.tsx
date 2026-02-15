import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/UIComponents';

export const Notifications = () => {
  const { notifications } = useApp();

  return (
    <div className="p-4 space-y-4 pb-24 animate-slide-up">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      <div className="space-y-3">
        {notifications.map(n => (
          <Card key={n.id} className={`flex gap-4 p-4 ${n.read ? 'opacity-60' : 'border-l-4 border-l-blue-500'}`}>
            <div className={`mt-1 min-w-[10px] h-2.5 w-2.5 rounded-full ${n.type === 'alert' ? 'bg-red-500' : n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            <div>
              <div className="flex justify-between items-start w-full">
                 <h4 className="font-semibold text-sm text-white mb-1">{n.title}</h4>
                 <span className="text-[10px] text-slate-400 whitespace-nowrap ml-4">{n.date}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};