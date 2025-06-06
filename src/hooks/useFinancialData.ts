
import { useState, useEffect } from 'react';
import { FinancialData, Transaction, Debt, Settings } from '@/types/financial';

const DEFAULT_SETTINGS: Settings = {
  currentBalance: 0,
  cardBill: 0,
  expectedRevenue: 0,
  finalGoal: 0,
};

const DEFAULT_DATA: FinancialData = {
  transactions: [],
  debts: [],
  settings: DEFAULT_SETTINGS,
};

export const useFinancialData = () => {
  const [data, setData] = useState<FinancialData>(DEFAULT_DATA);

  useEffect(() => {
    const savedData = localStorage.getItem('financial-data');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  const saveData = (newData: FinancialData) => {
    setData(newData);
    localStorage.setItem('financial-data', JSON.stringify(newData));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const newData = {
      ...data,
      transactions: [...data.transactions, newTransaction],
    };
    saveData(newData);
  };

  const removeTransaction = (id: string) => {
    const newData = {
      ...data,
      transactions: data.transactions.filter(t => t.id !== id),
    };
    saveData(newData);
  };

  const addDebt = (debt: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const newData = {
      ...data,
      debts: [...data.debts, newDebt],
    };
    saveData(newData);
  };

  const updateDebtStatus = (id: string, status: 'pendente' | 'quitado') => {
    const newData = {
      ...data,
      debts: data.debts.map(debt => 
        debt.id === id ? { ...debt, status } : debt
      ),
    };
    saveData(newData);
  };

  const removeDebt = (id: string) => {
    const newData = {
      ...data,
      debts: data.debts.filter(d => d.id !== id),
    };
    saveData(newData);
  };

  const updateSettings = (settings: Settings) => {
    const newData = {
      ...data,
      settings,
    };
    saveData(newData);
  };

  const clearAllData = () => {
    localStorage.removeItem('financial-data');
    setData(DEFAULT_DATA);
  };

  // Cálculos derivados
  const calculations = {
    totalOwed: data.debts
      .filter(d => d.type === 'devo' && d.status === 'pendente')
      .reduce((sum, debt) => sum + debt.value, 0),
    
    totalOwing: data.debts
      .filter(d => d.type === 'me_devem' && d.status === 'pendente')
      .reduce((sum, debt) => sum + debt.value, 0),
    
    canSpend: data.settings.currentBalance + 
              data.settings.expectedRevenue + 
              data.debts.filter(d => d.type === 'me_devem' && d.status === 'pendente').reduce((sum, debt) => sum + debt.value, 0) -
              data.settings.cardBill -
              data.debts.filter(d => d.type === 'devo' && d.status === 'pendente').reduce((sum, debt) => sum + debt.value, 0) -
              data.settings.finalGoal,
    
    expensesByCategory: data.transactions
      .filter(t => t.type === 'despesa')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.value;
        return acc;
      }, {} as Record<string, number>),
  };

  return {
    data,
    addTransaction,
    removeTransaction,
    addDebt,
    updateDebtStatus,
    removeDebt,
    updateSettings,
    clearAllData,
    calculations,
  };
};
