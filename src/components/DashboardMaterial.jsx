import React from 'react';
import { useStore } from '../store';
import { computeSummary, getSpendingByCategory, getMonthlyTrend, getInsights, useFilteredSortedTransactions } from '../utils';
import { SummaryCard, CategorySpendingChart, MonthlyTrendChart } from './Charts';
import { TransactionRow, AddTransactionModal } from './Transactions';

export const DashboardMaterial = () => {
  const { role, setRole, addTransaction, deleteTransaction, editTransaction, searchQuery, setSearchQuery, typeFilter, setTypeFilter, sortBy, setSortBy, transactions } = useStore();
  const filteredTx = useFilteredSortedTransactions(transactions, searchQuery, typeFilter, sortBy);
  const { totalBalance, totalIncome, totalExpense } = computeSummary(transactions);
  const spendingByCat = getSpendingByCategory(transactions);
  const monthlyData = getMonthlyTrend(transactions);
  const insights = getInsights(transactions, spendingByCat);
  const isAdmin = role === 'admin';
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Material Design */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 elevation-4">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-3xl font-medium text-gray-800 mb-1">FinDash</h1>
              <p className="text-gray-600">Material Design Finance Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 rounded-full p-1">
                <button
                  onClick={()=>setRole('viewer')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${role==='viewer' ? 'bg-blue-500 text-white shadow-lg elevation-2' : 'text-gray-600 hover:bg-gray-300'}`}
                >
                  👁️ Viewer
                </button>
                <button
                  onClick={()=>setRole('admin')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${role==='admin' ? 'bg-blue-500 text-white shadow-lg elevation-2' : 'text-gray-600 hover:bg-gray-300'}`}
                >
                  ⚙️ Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards - Material Design */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 elevation-2 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">TOTAL BALANCE</p>
                <p className="text-3xl font-bold text-gray-800">${totalBalance.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-wallet text-blue-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 h-1 bg-blue-200 rounded-full">
              <div className="h-1 bg-blue-500 rounded-full w-3/4"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 elevation-2 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">TOTAL INCOME</p>
                <p className="text-3xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-arrow-up text-green-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 h-1 bg-green-200 rounded-full">
              <div className="h-1 bg-green-500 rounded-full w-4/5"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 elevation-2 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">TOTAL EXPENSES</p>
                <p className="text-3xl font-bold text-red-600">${totalExpense.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fas fa-arrow-down text-red-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 h-1 bg-red-200 rounded-full">
              <div className="h-1 bg-red-500 rounded-full w-2/3"></div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 elevation-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-chart-pie text-purple-600"></i>
              </div>
              <h2 className="text-xl font-medium text-gray-800">Spending by Category</h2>
            </div>
            <CategorySpendingChart data={spendingByCat} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 elevation-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-chart-line text-indigo-600"></i>
              </div>
              <h2 className="text-xl font-medium text-gray-800">Monthly Trend</h2>
            </div>
            <MonthlyTrendChart data={monthlyData} />
            <p className="text-xs text-gray-500 mt-2 text-center">Income vs Expense over 6 months</p>
          </div>
        </div>

        {/* Insights Cards */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 elevation-2">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-lightbulb text-yellow-600"></i>
            </div>
            <h2 className="text-xl font-medium text-gray-800">Key Insights</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
              <h3 className="font-medium text-gray-800 mb-2">🔥 Highest Spending</h3>
              <p className="text-2xl font-bold text-gray-900">{insights.highestSpendingCat ? `$${insights.highestSpendingCat.amount}` : '—'}</p>
              <p className="text-sm text-gray-600">{insights.highestSpendingCat?.category || 'No data'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
              <h3 className="font-medium text-gray-800 mb-2">📊 Monthly Change</h3>
              <p className="text-lg font-bold text-gray-900">{insights.monthlyComparison}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
              <h3 className="font-medium text-gray-800 mb-2">💰 Average Expense</h3>
              <p className="text-2xl font-bold text-gray-900">${insights.avgExpense}</p>
            </div>
          </div>
        </div>

        {/* Add Transaction Button */}
        {isAdmin && (
          <div className="mb-8">
            <button
              onClick={()=>setModalOpen(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i> Add New Transaction
            </button>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden elevation-2">
          <div className="p-6 border-b border-gray-200 flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-list text-gray-600"></i>
              </div>
              <h2 className="text-xl font-medium text-gray-800">Transactions</h2>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={typeFilter}
                onChange={e=>setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
              <select
                value={sortBy}
                onChange={e=>setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 border-b">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 border-b">Description</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 border-b">Amount</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 border-b">Category</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 border-b">Type</th>
                  {isAdmin && <th className="py-4 px-6 font-medium text-gray-700 border-b">Actions</th>}
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
        <div className="text-center text-xs text-gray-500 mt-8">Material Design • Clean & Modern</div>
      </div>
    </div>
  );
};