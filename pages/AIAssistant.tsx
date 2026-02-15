
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { createSystemInstruction, sendAIRequest } from '../services/geminiService';
import { Button } from '../components/UIComponents';
import { Content, Part } from '@google/genai';

export const AIAssistant = () => {
  const { 
    transactions, goals, budgets, categories, accounts,
    addTransaction, addGoal, addSubscription, 
    addBudget, addAccount, addCategory, updateGoal,
    chatHistory, addChatMessage, chatSessions, currentChatId, 
    createNewChat, selectChat, deleteChat, updateChatTitle
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Local history for API context mapping - reset when chat changes
  const apiHistoryRef = useRef<Content[]>([]);

  useEffect(() => {
    apiHistoryRef.current = [];
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, loading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    setInput('');
    setLoading(true);

    // 1. Update UI & Context
    const userMsg = { id: Date.now().toString(), role: 'user' as const, text: text, timestamp: new Date() };
    addChatMessage(userMsg);

    // 2. Update API History
    apiHistoryRef.current.push({ role: 'user', parts: [{ text: text }] });

    try {
      await processTurn();
    } catch (error) {
      console.error(error);
      const errorMsg = { id: Date.now().toString(), role: 'model' as const, text: "I encountered an error. Please try again.", timestamp: new Date() };
      addChatMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const processTurn = async () => {
    const systemInstruction = createSystemInstruction(transactions, goals, budgets, categories, accounts);
    const response = await sendAIRequest(apiHistoryRef.current, systemInstruction);
    const modelParts = response.candidates?.[0]?.content?.parts || [];
    
    // Add to API History
    apiHistoryRef.current.push({ role: 'model', parts: modelParts });

    const toolCalls = modelParts.filter(part => part.functionCall);
    const textParts = modelParts.filter(part => part.text);

    if (textParts.length > 0) {
      const text = textParts.map(p => p.text).join('\n');
      if (text.trim()) {
         addChatMessage({ id: Date.now().toString(), role: 'model', text: text, timestamp: new Date() });
      }
    }

    if (toolCalls.length > 0) {
      const functionResponses: Part[] = [];

      for (const call of toolCalls) {
        const fc = call.functionCall;
        if (!fc) continue;
        
        console.log("Tool Call:", fc.name, fc.args);
        let result: Record<string, any> = { status: "ok" };

        try {
          // Execute tools (same logic as before)
          if (fc.name === 'addTransaction') {
            const args = fc.args as any;
            addTransaction({
              id: Date.now().toString(),
              title: args.title,
              amount: args.amount,
              type: args.type,
              category: args.category || 'General',
              date: args.date || new Date().toISOString().split('T')[0],
              paymentMethod: args.paymentMethod || 'Other',
              isRecurring: args.isRecurring || false
            });
            result = { status: "success", message: `${args.type === 'income' ? 'Income' : 'Expense'} '${args.title}' of $${args.amount} added.` };
          } else if (fc.name === 'addGoal') {
            const args = fc.args as any;
            addGoal({
              id: Date.now().toString(),
              title: args.title,
              targetAmount: args.targetAmount,
              savedAmount: 0,
              color: 'bg-purple-500',
              icon: '🎯',
              completed: false
            });
            result = { status: "success", message: `Goal '${args.title}' created.` };
          } else if (fc.name === 'updateGoal') {
             const args = fc.args as any;
             const goal = goals.find(g => g.title.toLowerCase().includes(args.goalName.toLowerCase()));
             if (goal) {
                updateGoal(goal.id, args.amount);
                result = { status: "success", message: `Added $${args.amount} to goal '${goal.title}'. New total: $${goal.savedAmount + args.amount}.` };
             } else {
                result = { status: "error", message: `Goal '${args.goalName}' not found.` };
             }
          } else if (fc.name === 'addSubscription') {
            const args = fc.args as any;
            addSubscription({
              id: Date.now().toString(),
              name: args.name,
              cost: args.cost,
              billingCycle: args.billingCycle,
              nextBillingDate: new Date().toISOString().split('T')[0]
            });
            result = { status: "success", message: `Subscription '${args.name}' added.` };
          } else if (fc.name === 'addBudget') {
            const args = fc.args as any;
            addBudget({
              id: Date.now().toString(),
              category: args.category,
              limit: args.limit,
              spent: 0, 
              color: '#3b82f6'
            });
            result = { status: "success", message: `Budget for ${args.category} set to $${args.limit}.` };
          } else if (fc.name === 'addAccount') {
             const args = fc.args as any;
             addAccount({
               id: Date.now().toString(),
               name: args.name,
               type: args.type,
               balance: args.balance,
               icon: '🏦'
             });
             result = { status: "success", message: `Account '${args.name}' added with balance $${args.balance}.` };
          } else if (fc.name === 'addCategory') {
             const args = fc.args as any;
             addCategory(args.name);
             result = { status: "success", message: `Category '${args.name}' added.` };
          }
        } catch (e) {
          result = { status: "error", message: String(e) };
        }
        functionResponses.push({
          functionResponse: {
            name: fc.name,
            response: { result: result }
          }
        });
      }

      apiHistoryRef.current.push({ role: 'user', parts: functionResponses });
      await processTurn();
    }
  };

  const startNewChat = () => {
    createNewChat();
    setIsSidebarOpen(false);
  };

  const handleEditTitle = (session: any) => {
    setEditingChatId(session.id);
    setEditTitle(session.title);
  };

  const saveTitle = (id: string) => {
    updateChatTitle(id, editTitle);
    setEditingChatId(null);
  };

  const prompts = [
    { icon: '📊', text: 'Analyze my spending' },
    { icon: '💰', text: 'How can I save $500?' },
    { icon: '📉', text: 'Show my budget status' },
    { icon: '🏦', text: 'What\'s my financial health?' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-navy-900 relative overflow-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="absolute inset-0 bg-black/50 z-20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`absolute inset-y-0 left-0 w-72 bg-slate-100 dark:bg-[#050511] border-r border-slate-200 dark:border-white/5 z-30 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl`}>
        <div className="p-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
           <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
             <span className="text-xl">🤖</span> SpendPal AI
           </h2>
           <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
           </button>
        </div>
        
        <div className="p-3">
           <Button onClick={startNewChat} className="w-full !py-3 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white shadow-lg border border-white/10 flex items-center justify-start gap-3 px-4">
             <span className="text-lg">+</span> New Chat
           </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
           {chatSessions.map(session => (
             <div 
               key={session.id} 
               className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                 currentChatId === session.id 
                 ? 'bg-white dark:bg-white/10 shadow-sm border border-slate-200 dark:border-transparent text-slate-900 dark:text-white' 
                 : 'hover:bg-slate-200 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
               }`}
               onClick={() => { selectChat(session.id); setIsSidebarOpen(false); }}
             >
                <div className="flex items-center gap-3 overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {editingChatId === session.id ? (
                    <input 
                      className="w-full bg-transparent border-b border-blue-500 outline-none text-sm text-slate-900 dark:text-white"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => saveTitle(session.id)}
                      onKeyDown={(e) => e.key === 'Enter' && saveTitle(session.id)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="truncate text-sm font-medium">
                        {session.title}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={(e) => { e.stopPropagation(); handleEditTitle(session); }} className="p-1.5 hover:bg-slate-300 dark:hover:bg-white/20 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); deleteChat(session.id); }} className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full h-full relative">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 h-16 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 z-10 flex items-center px-4 justify-between">
            <div className="flex items-center gap-3">
               <button 
                 onClick={() => setIsSidebarOpen(true)}
                 className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
               </button>
               <h1 className="font-bold text-slate-900 dark:text-white text-lg">SpendPal Assistant <span className="text-xs bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full ml-2">Beta</span></h1>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10"></div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-32 pt-20">
          {chatHistory.length === 0 ? (
             <div className="h-full flex flex-col justify-center items-center gap-8 animate-fade-in">
                <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-[32px] flex items-center justify-center shadow-xl shadow-slate-200 dark:shadow-black/20 ring-1 ring-slate-100 dark:ring-white/10">
                   <span className="text-5xl">🤖</span>
                </div>
                <div className="text-center space-y-2">
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How can I help you today?</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full max-w-lg mt-4 px-4">
                   {prompts.map((p, i) => (
                      <button key={i} onClick={() => handleSend(p.text)} className="bg-white dark:bg-navy-800 p-4 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left flex flex-col gap-2 hover:shadow-lg hover:-translate-y-1">
                         <span className="text-2xl">{p.icon}</span>
                         <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{p.text}</span>
                      </button>
                   ))}
                </div>
             </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {chatHistory.map((msg, idx) => (
                <div key={`${msg.id}-${idx}`} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {msg.role === 'model' && (
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mt-1 shadow-lg">
                        <span className="text-xs text-white font-bold">AI</span>
                     </div>
                   )}
                   
                   <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
                      <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-slate-900 dark:bg-blue-600 text-white rounded-tr-sm' 
                          : 'bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-white/5'
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`text-[10px] text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left'} px-1`}>
                         {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                   </div>

                   {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                   )}
                </div>
              ))}
              
              {loading && (
                 <div className="flex gap-4 justify-start animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mt-1 shadow-lg opacity-50">
                        <span className="text-xs text-white font-bold">AI</span>
                    </div>
                    <div className="bg-white dark:bg-navy-800 p-4 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-white/5 shadow-sm flex gap-1.5 items-center">
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                   </div>
                 </div>
              )}
              <div ref={scrollRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-20 left-0 right-0 p-4 z-20 flex justify-center">
          <div className="w-full max-w-3xl bg-white/90 dark:bg-navy-800/90 backdrop-blur-xl rounded-[28px] border border-slate-200 dark:border-white/10 shadow-2xl p-2 flex items-end gap-2 relative">
             <button className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
             </button>
             
             <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything..."
                rows={1}
                disabled={loading}
                className="flex-1 bg-transparent border-0 text-slate-900 dark:text-white focus:ring-0 resize-none py-3.5 max-h-32 text-base font-medium placeholder:text-slate-400"
                style={{ minHeight: '50px' }}
             />
             
             <button 
               onClick={() => handleSend()} 
               disabled={!input.trim() || loading} 
               className={`p-3 rounded-2xl transition-all duration-300 mb-0.5 ${
                 input.trim() 
                 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg hover:scale-105 active:scale-95' 
                 : 'bg-slate-100 dark:bg-white/10 text-slate-400 cursor-not-allowed'
               }`}
             >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
