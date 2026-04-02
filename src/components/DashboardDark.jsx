import React from 'react';
import { useStore } from '../store';
import { computeSummary, getSpendingByCategory, getMonthlyTrend, getInsights, useFilteredSortedTransactions } from '../utils';
import { SummaryCard, CategorySpendingChart, MonthlyTrendChart } from './Charts';
import { TransactionRow, AddTransactionModal } from './Transactions';

export const DashboardDark = () => {
  const { role, setRole, addTransaction, deleteTransaction, editTransaction, searchQuery, setSearchQuery, typeFilter, setTypeFilter, sortBy, setSortBy, transactions } = useStore();
  const filteredTx = useFilteredSortedTransactions(transactions, searchQuery, typeFilter, sortBy);
  const { totalBalance, totalIncome, totalExpense } = computeSummary(transactions);
  const spendingByCat = getSpendingByCategory(transactions);
  const monthlyData = getMonthlyTrend(transactions);
  const insights = getInsights(transactions, spendingByCat);
  const isAdmin = role === 'admin';
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Header + Role Toggle */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">FinDash</h1>
          <p className="text-gray-400 text-sm">Smart financial overview</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-800 p-1.5 rounded-full shadow-lg border border-gray-700">
          <span className="text-sm font-medium px-2">🔐 Role:</span>
          <button onClick={()=>setRole('viewer')} className={`px-4 py-1.5 rounded-full text-sm transition ${role==='viewer' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Viewer</button>
          <button onClick={()=>setRole('admin')} className={`px-4 py-1.5 rounded-full text-sm transition ${role==='admin' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Admin</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-5 hover:bg-gray-750 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400 font-medium tracking-wide">Total Balance</p>
              <p className="text-2xl md:text-3xl font-bold mt-2 text-white">${totalBalance.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/20">
              <i className="fas fa-wallet text-blue-400"></i>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-5 hover:bg-gray-750 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400 font-medium tracking-wide">Total Income</p>
              <p className="text-2xl md:text-3xl font-bold mt-2 text-green-400">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500/20">
              <i className="fas fa-arrow-up text-green-400"></i>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-5 hover:bg-gray-750 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400 font-medium tracking-wide">Total Expenses</p>
              <p className="text-2xl md:text-3xl font-bold mt-2 text-red-400">${totalExpense.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-red-500/20">
              <i className="fas fa-arrow-down text-red-400"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white"><i className="fas fa-chart-pie text-purple-400"></i> Spending by Category</h2>
          <CategorySpendingChart data={spendingByCat} />
        </div>
        <div className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-white"><i className="fas fa-chart-line text-purple-400"></i> Monthly Trend</h2>
          <MonthlyTrendChart data={monthlyData} />
          <div className="text-xs text-gray-400 text-center mt-2">Last 6 months | Green: Income, Red: Expense</div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-5 rounded-2xl mb-8 border border-purple-700/50">
        <h2 className="font-bold text-white flex items-center gap-2"><i className="fas fa-lightbulb text-yellow-400"></i> Insights</h2>
        <div className="grid sm:grid-cols-3 gap-3 mt-2">
          <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700"><span className="text-sm text-gray-400">🔥 Highest spending</span><p className="font-bold text-white">{insights.highestSpendingCat ? `${insights.highestSpendingCat.category} ($${insights.highestSpendingCat.amount})` : '—'}</p></div>
          <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700"><span className="text-sm text-gray-400">📉 Monthly comparison</span><p className="font-medium text-sm text-white">{insights.monthlyComparison}</p></div>
          <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700"><span className="text-sm text-gray-400">💸 Avg expense per transaction</span><p className="font-bold text-white">${insights.avgExpense}</p></div>
        </div>
      </div>

      {/* Add Transaction Button */}
      {isAdmin && (
        <div className="mb-6">
          <button onClick={()=>setModalOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg hover:shadow-2xl"><i className="fas fa-plus"></i> Add New Transaction</button>
        </div>
      )}

      {/* Transactions Section */}
      <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-700 flex items-center gap-2">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white"><i className="fas fa-list-ul text-gray-300"></i> Transactions</h2>
        </div>
        <div className="p-4 flex flex-wrap gap-3 border-b border-gray-700 bg-gray-900">
          <div className="flex-1 min-w-[180px]"><i className="fas fa-search text-gray-400 mr-2"></i><input type="text" placeholder="Search description or category" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 w-full text-sm text-white placeholder-gray-400"/></div>
          <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="border border-gray-600 rounded-xl px-3 py-2 text-sm bg-gray-700 text-white"><option value="all">All types</option><option value="income">Income only</option><option value="expense">Expense only</option></select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="border border-gray-600 rounded-xl px-3 py-2 text-sm bg-gray-700 text-white"><option value="date_desc">Newest first</option><option value="date_asc">Oldest first</option><option value="amount_desc">Highest amount</option><option value="amount_asc">Lowest amount</option></select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-gray-400 border-b border-gray-700">
              <tr><th className="text-left py-3 px-2">Date</th><th className="text-left py-3 px-2">Description</th><th className="text-left py-3 px-2">Amount</th><th className="text-left py-3 px-2">Category</th><th className="text-left py-3 px-2">Type</th>{isAdmin && <th className="py-3 px-2">Actions</th>}</tr>
            </thead>
            <tbody>
              {filteredTx.length === 0 ? (
                <tr><td colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-gray-400">No transactions match. Add or adjust filters.</td></tr>
              ) : (
                filteredTx.map(tx => <TransactionRow key={tx.id} transaction={tx} isAdmin={isAdmin} onEdit={editTransaction} onDelete={deleteTransaction} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddTransactionModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} onAdd={addTransaction} />
      <div className="text-center text-xs text-gray-500 mt-8">FinDash Dark Theme • Role-based UI (Admin can add/edit/delete) • Data persists in memory</div>
    </div>
  );
};