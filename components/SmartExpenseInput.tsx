
import React, { useState } from 'react';
import { parseSmartInput } from '../services/geminiService';
import { Button } from './UIComponents';

interface SmartExpenseInputProps {
  onParsed: (data: any) => void;
  type: string;
}

export const SmartExpenseInput: React.FC<SmartExpenseInputProps> = ({ onParsed, type }) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    try {
      // Use the generic parser
      const result = await parseSmartInput(input);
      if (result && result.data) {
        onParsed(result.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-4 rounded-2xl border border-blue-200 dark:border-blue-500/30 mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5c0-5.523 0-10 0-10z"/><path d="m8 14 6 6"/><path d="m16 14-6 6"/></svg>
          Smart AI Input
        </label>
        <span className="text-[10px] text-slate-500 dark:text-slate-400">
           {type === 'EXPENSE' ? 'Ex: "Dinner 45"' : 'Ex: "Salary 5000"'}
        </span>
      </div>
      
      <div className="relative">
        <textarea
          rows={2}
          className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
          placeholder={type === 'EXPENSE' ? "e.g. Netflix 15.99, Uber 32..." : "Describe it naturally..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAnalyze();
            }
          }}
        />
        <div className="absolute bottom-2 right-2">
           <Button 
             type="button" 
             onClick={handleAnalyze} 
             disabled={isAnalyzing || !input.trim()}
             className={`!py-1 !px-3 text-xs ${isAnalyzing ? 'animate-pulse' : ''}`}
           >
             {isAnalyzing ? 'Thinking...' : 'Auto-Fill'}
           </Button>
        </div>
      </div>
    </div>
  );
};
