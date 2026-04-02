import React from 'react';
import { useStore } from '../store';
import { computeSummary, getSpendingByCategory, getMonthlyTrend, getInsights, useFilteredSortedTransactions } from '../utils';
import { SummaryCard, CategorySpendingChart, MonthlyTrendChart } from './Charts';
import { TransactionRow, AddTransactionModal } from './Transactions';

export const DashboardCompact = () => {
  const { role, setRole, addTransaction, deleteTransaction, editTransaction, searchQuery, setSearchQuery, typeFilter, setTypeFilter, sortBy, setSortBy, transactions } = useStore();
  const filteredTx = useFilteredSortedTransactions(transactions, searchQuery, typeFilter, sortBy);
  const { totalBalance, totalIncome, totalExpense } = computeSummary(transactions);
  const spendingByCat = getSpendingByCategory(transactions);
  const monthlyData = getMonthlyTrend(transactions);
  const insights = getInsights(transactions, spendingByCat);
  const isAdmin = role === 'admin';
  const [modalOpen, setModalOpen] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-md mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-800 mb-1">FinDash</h1>
          <p className="text-green-600 text-sm">Your finances, simplified</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={()=>setRole('viewer')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${role==='viewer' ? 'bg-green-500 text-white' : 'text-gray-600'}`}
          >
            👁️ Viewer
          </button>
          <button
            onClick={()=>setRole('admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${role==='admin' ? 'bg-green-500 text-white' : 'text-gray-600'}`}
          >
            ⚙️ Admin
          </button>
        </div>

        {/* Summary Cards - Compact */}
        <div className="space-y-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Balance</p>
                <p className="text-xl font-bold text-gray-900">${totalBalance.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-wallet text-blue-600"></i>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-arrow-up text-green-600 text-sm"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Income</p>
                  <p className="font-bold text-green-600">${totalIncome.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-arrow-down text-red-600 text-sm"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expenses</p>
                  <p className="font-bold text-red-600">${totalExpense.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-green-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fas fa-lightbulb text-yellow-500"></i>
            Quick Insights
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Top category:</span>
              <span className="font-medium">{insights.highestSpendingCat?.category || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg expense:</span>
              <span className="font-medium">${insights.avgExpense}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">This month:</span>
              <span className="font-medium text-sm">{insights.monthlyComparison}</span>
            </div>
          </div>
        </div>

        {/* Charts - Compact */}
        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <h3 className="font-semibold text-gray-800 mb-3">Spending by Category</h3>
            <div className="h-48">
              <CategorySpendingChart data={spendingByCat} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <h3 className="font-semibold text-gray-800 mb-3">Monthly Trend</h3>
            <div className="h-48">
              <MonthlyTrendChart data={monthlyData} />
            </div>
          </div>
        </div>

        {/* Add Transaction Button */}
        {isAdmin && (
          <div className="mb-6">
            <button
              onClick={()=>setModalOpen(true)}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i> Add New Transaction
            </button>
          </div>
        )}

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Transactions</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-filter"></i>
              </button>
            </div>
          </div>

          {/* Filters - Collapsible */}
          {showFilters && (
            <div className="p-4 border-b border-gray-100 bg-gray-50 space-y-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <select
                  value={typeFilter}
                  onChange={e=>setTypeFilter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select
                  value={sortBy}
                  onChange={e=>setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="date_desc">Newest</option>
                  <option value="date_asc">Oldest</option>
                  <option value="amount_desc">Highest</option>
                  <option value="amount_asc">Lowest</option>
                </select>
              </div>
            </div>
          )}

          {/* Transaction List - Card style */}
          <div className="max-h-96 overflow-y-auto">
            {filteredTx.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <i className="fas fa-inbox text-3xl mb-2"></i>
                <p>No transactions</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredTx.map(tx => (
                  <div key={tx.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{tx.description}</p>
                        <p className="text-sm text-gray-500">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amount}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {tx.type}
                        </span>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2 mt-2">
                        <button className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                        <button className="text-xs text-red-600 hover:text-red-800">Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <AddTransactionModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} onAdd={addTransaction} />
        <div className="text-center text-xs text-gray-400 mt-6">Mobile-First Design • Touch Friendly</div>
      </div>
    </div>
  );
};