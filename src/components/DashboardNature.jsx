import React from 'react';
import { useStore } from '../store';
import { computeSummary, getSpendingByCategory, getMonthlyTrend, getInsights, useFilteredSortedTransactions } from '../utils';
import { SummaryCard, CategorySpendingChart, MonthlyTrendChart } from './Charts';
import { TransactionRow, AddTransactionModal } from './Transactions';

export const DashboardNature = () => {
  const { role, setRole, addTransaction, deleteTransaction, editTransaction, searchQuery, setSearchQuery, typeFilter, setTypeFilter, sortBy, setSortBy, transactions } = useStore();
  const filteredTx = useFilteredSortedTransactions(transactions, searchQuery, typeFilter, sortBy);
  const { totalBalance, totalIncome, totalExpense } = computeSummary(transactions);
  const spendingByCat = getSpendingByCategory(transactions);
  const monthlyData = getMonthlyTrend(transactions);
  const insights = getInsights(transactions, spendingByCat);
  const isAdmin = role === 'admin';
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🌿</div>
        <div className="absolute top-20 right-20 text-4xl">🌸</div>
        <div className="absolute bottom-20 left-20 text-5xl">🌳</div>
        <div className="absolute bottom-10 right-10 text-3xl">🌻</div>
        <div className="absolute top-1/2 left-1/4 text-4xl">🍃</div>
        <div className="absolute top-1/3 right-1/3 text-3xl">🌱</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-green-800 mb-2 flex items-center justify-center gap-3">
            <span>🌿</span>
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              FinDash
            </span>
            <span>🌿</span>
          </h1>
          <p className="text-emerald-700 text-lg">Sustainable Finance Management</p>
          <div className="flex justify-center mt-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-full p-2 shadow-lg border border-green-200">
              <button
                onClick={()=>setRole('viewer')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  role==='viewer'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-green-700 hover:bg-green-100'
                }`}
              >
                🌱 Viewer
              </button>
              <button
                onClick={()=>setRole('admin')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  role==='admin'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-green-700 hover:bg-green-100'
                }`}
              >
                🌳 Admin
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards - Nature Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">💧</span>
              </div>
              <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">Total Balance</h3>
              <p className="text-3xl font-bold text-blue-800">${totalBalance.toLocaleString()}</p>
              <div className="mt-4 w-full bg-blue-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">Total Income</h3>
              <p className="text-3xl font-bold text-emerald-800">${totalIncome.toLocaleString()}</p>
              <div className="mt-4 w-full bg-emerald-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-400 to-green-600 h-2 rounded-full w-4/5"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-orange-800">${totalExpense.toLocaleString()}</p>
              <div className="mt-4 w-full bg-orange-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <span className="text-xl">📊</span>
              </div>
              <h2 className="text-xl font-semibold text-purple-800">Spending by Category</h2>
            </div>
            <CategorySpendingChart data={spendingByCat} />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <span className="text-xl">📈</span>
              </div>
              <h2 className="text-xl font-semibold text-teal-800">Monthly Trend</h2>
            </div>
            <MonthlyTrendChart data={monthlyData} />
            <p className="text-sm text-teal-600 mt-2 text-center">Sustainable growth over 6 months</p>
          </div>
        </div>

        {/* Insights - Nature Theme */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <span className="text-xl">💡</span>
            </div>
            <h2 className="text-xl font-semibold text-amber-800">Eco Insights</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <span>🔥</span> Highest Impact
              </h3>
              <p className="text-2xl font-bold text-orange-900">{insights.highestSpendingCat ? `$${insights.highestSpendingCat.amount}` : '—'}</p>
              <p className="text-sm text-orange-700">{insights.highestSpendingCat?.category || 'No data'}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <span>🌊</span> Monthly Flow
              </h3>
              <p className="text-lg font-bold text-blue-900">{insights.monthlyComparison}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <span>🌱</span> Average Spend
              </h3>
              <p className="text-2xl font-bold text-green-900">${insights.avgExpense}</p>
            </div>
          </div>
        </div>

        {/* Add Transaction Button */}
        {isAdmin && (
          <div className="mb-8">
            <button
              onClick={()=>setModalOpen(true)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>🌱</span> Add New Transaction
            </button>
          </div>
        )}

        {/* Transactions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 overflow-hidden">
          <div className="p-6 border-b border-green-200 flex items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <span className="text-xl">📋</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Transaction Garden</h2>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-green-200 bg-green-50/50">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search your transactions..."
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white/70"
                />
              </div>
              <select
                value={typeFilter}
                onChange={e=>setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white/70"
              >
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
              <select
                value={sortBy}
                onChange={e=>setSortBy(e.target.value)}
                className="px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white/70"
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
              <thead className="bg-green-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-green-800 border-b border-green-200">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-green-800 border-b border-green-200">Description</th>
                  <th className="text-left py-4 px-6 font-semibold text-green-800 border-b border-green-200">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-green-800 border-b border-green-200">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-green-800 border-b border-green-200">Type</th>
                  {isAdmin && <th className="py-4 px-6 font-semibold text-green-800 border-b border-green-200">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTx.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-green-600">
                      <span className="text-4xl mb-2 block">🌱</span>
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
        <div className="text-center text-sm text-green-700 mt-8 flex items-center justify-center gap-2">
          <span>🌿</span>
          <span>Eco-Friendly Finance • Sustainable Living</span>
          <span>🌿</span>
        </div>
      </div>
    </div>
  );
};