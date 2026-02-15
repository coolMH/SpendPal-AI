
import { GoogleGenAI, Type, FunctionDeclaration, Content, Part } from "@google/genai";
import { Transaction, Goal, Budget, Account } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

// --- Tool Definitions (Keep same tools) ---

const addTransactionTool: FunctionDeclaration = {
  name: "addTransaction",
  description: "Add a new financial transaction (expense or income).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Description or merchant name (e.g. 'Starbucks', 'Salary')" },
      amount: { type: Type.NUMBER, description: "The numeric amount" },
      type: { type: Type.STRING, description: "Type of transaction: 'expense' or 'income'", enum: ["expense", "income"] },
      category: { type: Type.STRING, description: "Category (e.g. Food, Transport, Salary, Entertainment, Health, Shopping, Utilities)" },
      date: { type: Type.STRING, description: "Date in YYYY-MM-DD format. Default to today if not specified." },
      paymentMethod: { type: Type.STRING, description: "Payment method (e.g. Credit Card, Cash, Bank Transfer)" },
      isRecurring: { type: Type.BOOLEAN, description: "True if this is a recurring monthly payment" }
    },
    required: ["title", "amount", "type", "category"]
  }
};

const addGoalTool: FunctionDeclaration = {
  name: "addGoal",
  description: "Create a new savings goal.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Name of the goal (e.g. 'New Laptop')" },
      targetAmount: { type: Type.NUMBER, description: "The target amount to save" }
    },
    required: ["title", "targetAmount"]
  }
};

const updateGoalTool: FunctionDeclaration = {
  name: "updateGoal",
  description: "Add funds (deposit) to an existing savings goal.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      goalName: { type: Type.STRING, description: "The name of the goal to update (fuzzy match)" },
      amount: { type: Type.NUMBER, description: "Amount to add to the saved total" }
    },
    required: ["goalName", "amount"]
  }
};

const addSubscriptionTool: FunctionDeclaration = {
  name: "addSubscription",
  description: "Add a new recurring subscription.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the service (e.g. 'Netflix')" },
      cost: { type: Type.NUMBER, description: "Monthly or yearly cost" },
      billingCycle: { type: Type.STRING, description: "'monthly' or 'yearly'", enum: ["monthly", "yearly"] }
    },
    required: ["name", "cost", "billingCycle"]
  }
};

const addBudgetTool: FunctionDeclaration = {
  name: "addBudget",
  description: "Set a monthly budget limit for a specific category.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: { type: Type.STRING, description: "Category name (e.g. Food, Dining)" },
      limit: { type: Type.NUMBER, description: "The maximum spending amount" }
    },
    required: ["category", "limit"]
  }
};

const addAccountTool: FunctionDeclaration = {
  name: "addAccount",
  description: "Add a new financial account (Wallet, Bank, Credit Card).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Account name (e.g. Chase Savings)" },
      type: { type: Type.STRING, description: "Type: 'Asset' (cash/bank) or 'Liability' (credit/debt)", enum: ["Asset", "Liability"] },
      balance: { type: Type.NUMBER, description: "Current balance" }
    },
    required: ["name", "type", "balance"]
  }
};

const addCategoryTool: FunctionDeclaration = {
  name: "addCategory",
  description: "Create a new expense category.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "New category name" }
    },
    required: ["name"]
  }
};

export const advisorTools = [
  addTransactionTool, 
  addGoalTool, 
  updateGoalTool, 
  addSubscriptionTool, 
  addBudgetTool, 
  addAccountTool, 
  addCategoryTool
];

// --- System Instruction ---

export const createSystemInstruction = (
  transactions: Transaction[],
  goals: Goal[],
  budgets: Budget[],
  categories: string[],
  accounts: Account[]
): string => {
  const contextData = JSON.stringify({
    recentTransactions: transactions.slice(0, 15),
    activeGoals: goals.filter(g => !g.completed),
    budgets: budgets,
    availableCategories: categories,
    accounts: accounts
  });

  return `You are SpendPal, an expert personal finance AI assistant.
  You have FULL control to manage the user's financial data.
  
  Tone: Friendly, professional, and precise.
  
  Context Data: ${contextData}
  
  Rules:
  - If user says "Add 20 at mcdonalds", infer expense, food, today.
  - If user says "Budget 500 for food", use addBudget.
  - If user says "New wallet Chase with 5000", use addAccount.
  `;
};

// --- API Request ---

export const sendAIRequest = async (
  history: Content[],
  systemInstruction: string
) => {
  try {
    const model = "gemini-3-flash-preview";
    const response = await ai.models.generateContent({
      model: model,
      contents: history,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: advisorTools }],
      }
    });
    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateChatTitle = async (message: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a very short, concise title (max 4 words) for a chat that starts with this message: "${message}". Return ONLY the title, no quotes.`,
    });
    return response.text?.trim() || "New Chat";
  } catch (e) {
    return "New Chat";
  }
};

export const autoCategorizeTransaction = async (title: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize this transaction title into one word (e.g., Food, Transport, Utilities, Entertainment, Shopping, Income, Health): "${title}". Return ONLY the category word.`,
    });
    return response.text?.trim() || "Uncategorized";
   } catch (e) {
     return "General";
   }
}

export const suggestBudgetAmount = async (category: string, transactions: Transaction[]): Promise<number> => {
  try {
    const history = transactions
      .filter(t => t.category.toLowerCase() === category.toLowerCase() && t.type === 'expense')
      .map(t => t.amount);
    
    if (history.length === 0) return 100;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on these expense amounts for ${category}: ${JSON.stringify(history)}, suggest a monthly budget limit as a single number.`,
    });
    const suggested = parseFloat(response.text?.replace(/[^0-9.]/g, '') || '0');
    return suggested > 0 ? suggested : 100;
  } catch (e) {
    return 200;
  }
}

export const parseSmartInput = async (input: string): Promise<any> => {
  try {
     const prompt = `
     Analyze this input: "${input}"
     Determine if it is adding an Expense, Income, Goal, Budget, Subscription, Account, or Category.
     Return a JSON object with:
     - type: 'EXPENSE' | 'INCOME' | 'GOAL' | 'SUBSCRIPTION' | 'BUDGET' | 'ACCOUNT' | 'CATEGORY'
     - data: The extracted fields for that type.
     
     Example: "20 at starbucks" -> { "type": "EXPENSE", "data": { "title": "Starbucks", "amount": 20, "category": "Food" } }
     `;

     const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
     });
     
     return JSON.parse(response.text || "{}");
  } catch(e) {
    console.error(e);
    return null;
  }
}
