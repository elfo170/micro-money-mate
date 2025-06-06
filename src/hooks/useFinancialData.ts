
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
    
    let newSettings = { ...data.settings };

    // Aplicar lógica conforme especificação
    if (transaction.type === 'despesa') {
      if (transaction.paymentMethod === 'pix') {
        // Despesa PIX: diminui saldo atual
        newSettings.currentBalance -= transaction.value;
      } else if (transaction.paymentMethod === 'credito') {
        // Despesa Crédito: aumenta fatura do cartão
        newSettings.cardBill += transaction.value;
      }
    } else if (transaction.type === 'receita') {
      if (transaction.paymentMethod === 'pix') {
        // Receita PIX: aumenta saldo atual
        newSettings.currentBalance += transaction.value;
      } else if (transaction.paymentMethod === 'credito') {
        // Receita Crédito (estorno): diminui fatura do cartão
        newSettings.cardBill -= transaction.value;
      }
    }
    
    const newData = {
      ...data,
      transactions: [...data.transactions, newTransaction],
      settings: newSettings,
    };
    saveData(newData);
  };

  const removeTransaction = (id: string) => {
    const transactionToRemove = data.transactions.find(t => t.id === id);
    if (!transactionToRemove) return;

    let newSettings = { ...data.settings };

    // Reverter os efeitos da transação
    if (transactionToRemove.type === 'despesa') {
      if (transactionToRemove.paymentMethod === 'pix') {
        // Reverter despesa PIX: aumenta saldo atual
        newSettings.currentBalance += transactionToRemove.value;
      } else if (transactionToRemove.paymentMethod === 'credito') {
        // Reverter despesa Crédito: diminui fatura do cartão
        newSettings.cardBill -= transactionToRemove.value;
      }
    } else if (transactionToRemove.type === 'receita') {
      if (transactionToRemove.paymentMethod === 'pix') {
        // Reverter receita PIX: diminui saldo atual
        newSettings.currentBalance -= transactionToRemove.value;
      } else if (transactionToRemove.paymentMethod === 'credito') {
        // Reverter receita Crédito: aumenta fatura do cartão
        newSettings.cardBill += transactionToRemove.value;
      }
    }

    const newData = {
      ...data,
      transactions: data.transactions.filter(t => t.id !== id),
      settings: newSettings,
    };
    saveData(newData);
  };

  const addDebt = (debt: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    let newSettings = { ...data.settings };

    // Aplicar lógica conforme especificação
    if (debt.type === 'devo') {
      // Eu devo: implica entrada de dinheiro no saldo atual
      newSettings.currentBalance += debt.value;
    } else if (debt.type === 'me_devem') {
      // Me devem: implica saída de dinheiro do saldo atual
      newSettings.currentBalance -= debt.value;
    }
    
    const newData = {
      ...data,
      debts: [...data.debts, newDebt],
      settings: newSettings,
    };
    saveData(newData);
  };

  const updateDebtStatus = (id: string, status: 'pendente' | 'quitado') => {
    const debt = data.debts.find(d => d.id === id);
    if (!debt) return;

    let newSettings = { ...data.settings };

    if (debt.status === 'pendente' && status === 'quitado') {
      // Quitando dívida
      if (debt.type === 'devo') {
        // Eu paguei o que devia: sai dinheiro do saldo
        newSettings.currentBalance -= debt.value;
      } else if (debt.type === 'me_devem') {
        // Alguém me pagou: entra dinheiro no saldo
        newSettings.currentBalance += debt.value;
      }
    } else if (debt.status === 'quitado' && status === 'pendente') {
      // Revertendo quitação
      if (debt.type === 'devo') {
        // Reverter pagamento: dinheiro volta ao saldo
        newSettings.currentBalance += debt.value;
      } else if (debt.type === 'me_devem') {
        // Reverter recebimento: dinheiro sai do saldo
        newSettings.currentBalance -= debt.value;
      }
    }

    const newData = {
      ...data,
      debts: data.debts.map(d => 
        d.id === id ? { ...d, status } : d
      ),
      settings: newSettings,
    };
    saveData(newData);
  };

  const removeDebt = (id: string) => {
    const debtToRemove = data.debts.find(d => d.id === id);
    if (!debtToRemove) return;

    let newSettings = { ...data.settings };

    // Reverter efeitos baseado no status da dívida
    if (debtToRemove.status === 'pendente') {
      if (debtToRemove.type === 'devo') {
        // Reverter criação de "eu devo": dinheiro que entrou sai do saldo
        newSettings.currentBalance -= debtToRemove.value;
      } else if (debtToRemove.type === 'me_devem') {
        // Reverter criação de "me devem": dinheiro que saiu volta ao saldo
        newSettings.currentBalance += debtToRemove.value;
      }
    }
    // Se estava quitada, o efeito líquido é nulo no saldo (conforme especificação)

    const newData = {
      ...data,
      debts: data.debts.filter(d => d.id !== id),
      settings: newSettings,
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
    
    expensesByCategory: (() => {
      const categoryTotals: Record<string, number> = {};
      
      // Somar despesas das transações
      data.transactions
        .filter(t => t.type === 'despesa')
        .forEach(transaction => {
          categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.value;
        });
      
      // Somar dívidas "me devem" (gastos de criação)
      data.debts
        .filter(d => d.type === 'me_devem')
        .forEach(debt => {
          categoryTotals[debt.category] = (categoryTotals[debt.category] || 0) + debt.value;
        });
      
      // Somar dívidas "devo" quitadas (gastos de quitação)
      data.debts
        .filter(d => d.type === 'devo' && d.status === 'quitado')
        .forEach(debt => {
          categoryTotals[debt.category] = (categoryTotals[debt.category] || 0) + debt.value;
        });
      
      return categoryTotals;
    })(),
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
