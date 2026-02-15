
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/UIComponents';

export const Profile = () => {
  const { userProfile, updateUserProfile, transactions, goals, budgets } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempGoal, setTempGoal] = useState(userProfile.mainGoal);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateUserProfile({ name: tempName, mainGoal: tempGoal });
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-5 space-y-8 pb-24 animate-slide-up">
      <div className="flex items-center gap-2 mb-2">
         <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Profile</h1>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-800 p-1 mb-4 shadow-2xl overflow-hidden border-4 border-white dark:border-[#1E293B]">
              <img src={userProfile.avatar} className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-105" alt="Profile" />
            </div>
            <div className="absolute bottom-4 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-white dark:border-[#0F172A] shadow-lg">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.5l-3 9 9-3a2 2 0 0 0 .5-.5Z"/></svg>
            </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleImageUpload}
        />

        {!isEditing ? (
           <>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {userProfile.name}
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border ${userProfile.plan === 'Pro' ? 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : userProfile.plan === 'Advanced' ? 'bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                   {userProfile.plan}
                </span>
              </h2>
              <p className="text-slate-500 font-medium">{userProfile.email}</p>
           </>
        ) : (
           <input 
             className="bg-transparent border-b-2 border-blue-500 text-center text-2xl font-bold text-slate-900 dark:text-white focus:outline-none pb-1"
             value={tempName}
             onChange={(e) => setTempName(e.target.value)}
           />
        )}
      </div>

      <div className="space-y-5">
         <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
            <div className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 text-slate-900 dark:text-white font-medium shadow-sm">
               {isEditing ? (
                  <input className="bg-transparent w-full outline-none" value={tempName} onChange={(e) => setTempName(e.target.value)} />
               ) : (
                  userProfile.name
               )}
            </div>
         </div>

         <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
            <div className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-500 dark:text-slate-400 font-medium">
               {userProfile.email}
            </div>
         </div>

         <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Financial Goal</label>
             <div className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 text-slate-900 dark:text-white font-medium shadow-sm">
               {isEditing ? (
                  <input className="bg-transparent w-full outline-none" value={tempGoal} onChange={(e) => setTempGoal(e.target.value)} />
               ) : (
                  userProfile.mainGoal
               )}
            </div>
         </div>
      </div>

      <div className="pt-6">
         {!isEditing ? (
            <Button className="w-full py-4 text-base" onClick={() => setIsEditing(true)}>Edit Profile</Button>
         ) : (
            <div className="flex gap-3">
               <Button className="flex-1 py-4 text-base" onClick={handleSave}>Save Changes</Button>
               <Button variant="secondary" className="flex-1 py-4 text-base" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
         )}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
         <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Account Statistics</h3>
         <div className="grid grid-cols-2 gap-3">
            <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30">
               <h4 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{transactions.length}</h4>
               <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Transactions</p>
            </Card>
            <Card className="bg-violet-50 dark:bg-violet-900/10 border-violet-100 dark:border-violet-900/30">
               <h4 className="text-3xl font-bold text-violet-600 dark:text-violet-400">{goals.length}</h4>
               <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Goals Set</p>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
               <h4 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{budgets.length}</h4>
               <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Budgets</p>
            </Card>
            <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
               <h4 className="text-3xl font-bold text-amber-600 dark:text-amber-400">{transactions.filter(t => t.type === 'income').length}</h4>
               <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Income Sources</p>
            </Card>
         </div>
      </div>
    </div>
  );
};
