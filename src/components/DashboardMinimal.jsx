import React from 'react';
import { useStore } from '../store';
import { computeSummary, getSpendingByCategory, getMonthlyTrend, getInsights, useFilteredSortedTransactions } from '../utils';
import { SummaryCard, CategorySpendingChart, MonthlyTrendChart } from './Charts';
import { TransactionRow, AddTransactionModal } from './Transactions';

export const DashboardMinimal = () => {
  const { role, setRole, addTransaction, deleteTransaction, editTransaction, searchQuery, setSearchQuery, typeFilter, setTypeFilter, sortBy, setSortBy, transactions } = useStore();
  const filteredTx = useFilteredSortedTransactions(transactions, searchQuery, typeFilter, sortBy);
  const { totalBalance, totalIncome, totalExpense } = computeSummary(transactions);
  const spendingByCat = getSpendingByCategory(transactions);
  const monthlyData = getMonthlyTrend(transactions);
  const insights = getInsights(transactions, spendingByCat);
  const isAdmin = role === 'admin';
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light text-gray-800 mb-2">FinDash</h1>
        <p className="text-gray-500 text-sm">Financial Overview</p>
        <div className="flex justify-center mt-4">
          <div className="inline-flex bg-gray-100 p-1 rounded-lg">
            <button onClick={()=>setRole('viewer')} className={`px-6 py-2 rounded-md text-sm font-medium transition ${role==='viewer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Viewer</button>
            <button onClick={()=>setRole('admin')} className={`px-6 py-2 rounded-md text-sm font-medium transition ${role==='admin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Admin</button>
          </div>
        </div>
      </div>

      {/* Summary Cards - Large centered */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-md transition">
          <div className="text-5xl mb-4 text-blue-500"><i className="fas fa-wallet"></i></div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Balance</h3>
          <p className="text-3xl font-light text-gray-900 mt-2">${totalBalance.toLocaleString()}</p>
        </div>
        <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-md transition">
          <div className="text-5xl mb-4 text-green-500"><i className="fas fa-arrow-up"></i></div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Income</h3>
          <p className="text-3xl font-light text-gray-900 mt-2">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-md transition">
          <div className="text-5xl mb-4 text-red-500"><i className="fas fa-arrow-down"></i></div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Expenses</h3>
          <p className="text-3xl font-light text-gray-900 mt-2">${totalExpense.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts - Side by side */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-light text-gray-800 mb-6 text-center">Spending by Category</h2>
          <CategorySpendingChart data={spendingByCat} />
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-light text-gray-800 mb-6 text-center">Monthly Trend</h2>
          <MonthlyTrendChart data={monthlyData} />
          <p className="text-xs text-gray-400 text-center mt-4">Income vs Expense over last 6 months</p>
        </div>
      </div>

      {/* Insights - Simple list */}
      <div className="border border-gray-200 rounded-lg p-6 mb-12">
        <h2 className="text-xl font-light text-gray-800 mb-6 text-center">Key Insights</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl mb-2">🔥</div>
            <p className="text-sm text-gray-500">Highest Spending</p>
            <p className="font-medium">{insights.highestSpendingCat ? `${insights.highestSpendingCat.category}` : '—'}</p>
            <p className="text-lg font-light">${insights.highestSpendingCat ? insights.highestSpendingCat.amount : '—'}</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm text-gray-500">Monthly Change</p>
            <p className="font-medium text-sm">{insights.monthlyComparison}</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-sm text-gray-500">Avg Transaction</p>
            <p className="text-lg font-light">${insights.avgExpense}</p>
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      {isAdmin && (
        <div className="mb-8">
          <button onClick={()=>setModalOpen(true)} className="w-full bg-black text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-800 transition shadow-md">
            + Add New Transaction
          </button>
        </div>
      )}

      {/* Transactions - Clean table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-light text-gray-800">Transactions</h2>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <select
              value={typeFilter}
              onChange={e=>setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={sortBy}
              onChange={e=>setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-medium text-gray-700">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Description</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Amount</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Category</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Type</th>
                {isAdmin && <th className="py-4 px-6 font-medium text-gray-700">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTx.map(tx => <TransactionRow key={tx.id} transaction={tx} isAdmin={isAdmin} onEdit={editTransaction} onDelete={deleteTransaction} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddTransactionModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} onAdd={addTransaction} />
      <div className="text-center text-xs text-gray-400 mt-8">Minimalist Design • Clean & Simple</div>
    </div>
  );
};