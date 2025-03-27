import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Plus, TrendingUp, TrendingDown, Pencil, Trash } from 'lucide-react-native';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { EditTransactionModal } from '../../components/EditTransactionModal';
import { useTransactions } from '../../context/TransactionsContext';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function CashflowScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();

  const calculateBalance = () => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      total: income - expenses,
      income,
      expenses,
    };
  };

  const balance = calculateBalance();

  const handleAddTransaction = (transaction: {
    type: 'income' | 'expense';
    description: string;
    amount: string;
    category: string;
  }) => {
    addTransaction({
      type: transaction.type,
      description: transaction.description,
      amount: Number(transaction.amount),
      category: transaction.category,
    });
    setModalVisible(false);
  };

  const handleUpdateTransaction = (transaction: {
    type: 'income' | 'expense';
    description: string;
    amount: string;
    category: string;
  }) => {
    if (!selectedTransaction) return;
    
    updateTransaction(selectedTransaction.id, {
      type: transaction.type,
      description: transaction.description,
      amount: Number(transaction.amount),
      category: transaction.category,
    });
    
    setEditModalVisible(false);
    setSelectedTransaction(null);
  };

  const renderRightActions = (transaction) => {
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setSelectedTransaction(transaction);
            setEditModalVisible(true);
          }}>
          <Pencil size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteTransaction(transaction.id)}>
          <Trash size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Financeiro</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Saldo Total</Text>
            <Text style={styles.balanceValue}>R$ {balance.total.toFixed(2)}</Text>
            <View style={styles.balanceStats}>
              <View style={styles.balanceStat}>
                <Text style={styles.statLabel}>Receitas</Text>
                <Text style={styles.incomeValue}>R$ {balance.income.toFixed(2)}</Text>
              </View>
              <View style={styles.balanceStat}>
                <Text style={styles.statLabel}>Despesas</Text>
                <Text style={styles.expenseValue}>R$ {balance.expenses.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Transações Recentes</Text>
          {transactions.map((transaction) => (
            <Swipeable
              key={transaction.id}
              renderRightActions={() => renderRightActions(transaction)}
              overshootRight={false}>
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={styles.transaction}>
                {transaction.type === 'income' ? (
                  <View style={[styles.iconContainer, styles.incomeIcon]}>
                    <TrendingUp size={20} color="#34C759" />
                  </View>
                ) : (
                  <View style={[styles.iconContainer, styles.expenseIcon]}>
                    <TrendingDown size={20} color="#FF3B30" />
                  </View>
                )}
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text
                    style={[
                      styles.amount,
                      transaction.type === 'income' ? styles.incomeText : styles.expenseText,
                    ]}>
                    {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                  </Text>
                  <Text style={styles.date}>{transaction.date}</Text>
                </View>
              </Animated.View>
            </Swipeable>
          ))}
        </View>

        <AddTransactionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleAddTransaction}
        />

        <EditTransactionModal
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedTransaction(null);
          }}
          onUpdate={handleUpdateTransaction}
          transaction={selectedTransaction}
        />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 34,
    color: '#000000',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceContainer: {
    padding: 20,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  balanceValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#000000',
    marginTop: 4,
  },
  balanceStats: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  },
  balanceStat: {
    flex: 1,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  incomeValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#34C759',
  },
  expenseValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FF3B30',
  },
  transactionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: '#000000',
    marginBottom: 16,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: '#34C75920',
  },
  expenseIcon: {
    backgroundColor: '#FF3B3020',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#000000',
  },
  transactionCategory: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  incomeText: {
    color: '#34C759',
  },
  expenseText: {
    color: '#FF3B30',
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionButton: {
    width: 48,
    height: '86%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});