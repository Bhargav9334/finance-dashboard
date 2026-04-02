import React from 'react';
import { useStore } from '../store';
import { computeSummary, getSpendingByCategory, getMonthlyTrend, getInsights, useFilteredSortedTransactions } from '../utils';
import { SummaryCard, CategorySpendingChart, MonthlyTrendChart } from './Charts';
import { TransactionRow, AddTransactionModal } from './Transactions';

export const DashboardGlass = () => {
  const { role, setRole, addTransaction, deleteTransaction, editTransaction, searchQuery, setSearchQuery, typeFilter, setTypeFilter, sortBy, setSortBy, transactions } = useStore();
  const filteredTx = useFilteredSortedTransactions(transactions, searchQuery, typeFilter, sortBy);
  const { totalBalance, totalIncome, totalExpense } = computeSummary(transactions);
  const spendingByCat = getSpendingByCategory(transactions);
  const monthlyData = getMonthlyTrend(transactions);
  const insights = getInsights(transactions, spendingByCat);
  const isAdmin = role === 'admin';
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Glass Effect */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 mb-6">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                FinDash
              </h1>
              <p className="text-blue-200">Glassmorphism Finance Dashboard</p>
            </div>
            <div className="backdrop-blur-sm bg-white/20 rounded-full p-1 border border-white/30">
              <button
                onClick={()=>setRole('viewer')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                  role==='viewer'
                    ? 'bg-white/30 text-white shadow-lg border border-white/50'
                    : 'text-blue-200 hover:bg-white/10'
                }`}
              >
                👁️ Viewer
              </button>
              <button
                onClick={()=>setRole('admin')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                  role==='admin'
                    ? 'bg-white/30 text-white shadow-lg border border-white/50'
                    : 'text-blue-200 hover:bg-white/10'
                }`}
              >
                ⚙️ Admin
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards - Glass Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-blue-200 font-medium uppercase tracking-wide">Total Balance</p>
                <p className="text-3xl font-bold text-white">${totalBalance.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 backdrop-blur-sm bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                <i className="fas fa-wallet text-blue-300 text-xl"></i>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full w-3/4"></div>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-green-200 font-medium uppercase tracking-wide">Total Income</p>
                <p className="text-3xl font-bold text-green-300">${totalIncome.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 backdrop-blur-sm bg-green-500/20 rounded-full flex items-center justify-center border border-green-400/30">
                <i className="fas fa-arrow-up text-green-300 text-xl"></i>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full w-4/5"></div>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-red-200 font-medium uppercase tracking-wide">Total Expenses</p>
                <p className="text-3xl font-bold text-red-300">${totalExpense.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 backdrop-blur-sm bg-red-500/20 rounded-full flex items-center justify-center border border-red-400/30">
                <i className="fas fa-arrow-down text-red-300 text-xl"></i>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full w-2/3"></div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 backdrop-blur-sm bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-400/30 mr-3">
                <i className="fas fa-chart-pie text-purple-300"></i>
              </div>
              <h2 className="text-xl font-semibold text-white">Spending by Category</h2>
            </div>
            <CategorySpendingChart data={spendingByCat} />
          </div>

          <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 backdrop-blur-sm bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-400/30 mr-3">
                <i className="fas fa-chart-line text-indigo-300"></i>
              </div>
              <h2 className="text-xl font-semibold text-white">Monthly Trend</h2>
            </div>
            <MonthlyTrendChart data={monthlyData} />
            <p className="text-xs text-blue-200 mt-2 text-center">Last 6 months • Income vs Expense</p>
          </div>
        </div>

        {/* Insights Section */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 backdrop-blur-sm bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-400/30 mr-3">
              <i className="fas fa-lightbulb text-yellow-300"></i>
            </div>
            <h2 className="text-xl font-semibold text-white">Smart Insights</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="backdrop-blur-sm bg-orange-500/10 rounded-xl p-4 border border-orange-400/20">
              <h3 className="font-medium text-orange-200 mb-2">🔥 Top Spending</h3>
              <p className="text-2xl font-bold text-white">{insights.highestSpendingCat ? `$${insights.highestSpendingCat.amount}` : '—'}</p>
              <p className="text-sm text-orange-200">{insights.highestSpendingCat?.category || 'No data'}</p>
            </div>
            <div className="backdrop-blur-sm bg-blue-500/10 rounded-xl p-4 border border-blue-400/20">
              <h3 className="font-medium text-blue-200 mb-2">📊 Monthly Trend</h3>
              <p className="text-lg font-bold text-white">{insights.monthlyComparison}</p>
            </div>
            <div className="backdrop-blur-sm bg-green-500/10 rounded-xl p-4 border border-green-400/20">
              <h3 className="font-medium text-green-200 mb-2">💰 Avg Expense</h3>
              <p className="text-2xl font-bold text-white">${insights.avgExpense}</p>
            </div>
          </div>
        </div>

        {/* Add Transaction Button */}
        {isAdmin && (
          <div className="mb-8">
            <button
              onClick={()=>setModalOpen(true)}
              className="w-full backdrop-blur-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg border border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i> Add New Transaction
            </button>
          </div>
        )}

        {/* Transactions */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20 flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 backdrop-blur-sm bg-gray-500/20 rounded-full flex items-center justify-center border border-gray-400/30 mr-3">
                <i className="fas fa-list text-gray-300"></i>
              </div>
              <h2 className="text-xl font-semibold text-white">Transactions</h2>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-white/20 backdrop-blur-sm bg-white/5">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <select
                value={typeFilter}
                onChange={e=>setTypeFilter(e.target.value)}
                className="px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all" className="bg-gray-800">All Types</option>
                <option value="income" className="bg-gray-800">Income Only</option>
                <option value="expense" className="bg-gray-800">Expense Only</option>
              </select>
              <select
                value={sortBy}
                onChange={e=>setSortBy(e.target.value)}
                className="px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="date_desc" className="bg-gray-800">Newest First</option>
                <option value="date_asc" className="bg-gray-800">Oldest First</option>
                <option value="amount_desc" className="bg-gray-800">Highest Amount</option>
                <option value="amount_asc" className="bg-gray-800">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="backdrop-blur-sm bg-white/5">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-blue-200 border-b border-white/10">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-blue-200 border-b border-white/10">Description</th>
                  <th className="text-left py-4 px-6 font-medium text-blue-200 border-b border-white/10">Amount</th>
                  <th className="text-left py-4 px-6 font-medium text-blue-200 border-b border-white/10">Category</th>
                  <th className="text-left py-4 px-6 font-medium text-blue-200 border-b border-white/10">Type</th>
                  {isAdmin && <th className="py-4 px-6 font-medium text-blue-200 border-b border-white/10">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTx.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-blue-200">
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
        <div className="text-center text-xs text-blue-300 mt-8">Glassmorphism Design • Futuristic & Modern</div>
      </div>
    </div>
  );
};