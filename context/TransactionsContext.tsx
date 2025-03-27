import React, { createContext, useContext, useState, useEffect } from 'react';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
};

type TransactionsContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id' | 'date'>>) => void;
  deleteTransaction: (id: string) => void;
  getMonthlyRevenue: () => number;
};

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      id: String(transactions.length + 1),
      date: new Date().toLocaleDateString('pt-BR'),
      ...transaction,
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updatedFields: Partial<Omit<Transaction, 'id' | 'date'>>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, ...updatedFields }
          : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const getMonthlyRevenue = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions
      .filter(transaction => {
        const [day, month, year] = transaction.date.split('/').map(Number);
        return month - 1 === currentMonth && year === currentYear && transaction.type === 'income';
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  return (
    <TransactionsContext.Provider value={{ 
      transactions, 
      addTransaction, 
      updateTransaction,
      deleteTransaction,
      getMonthlyRevenue 
    }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
}