import React from 'react';
import { useStore } from '../store';
import { computeSummary, getSpendingByCategory, getMonthlyTrend, getInsights, useFilteredSortedTransactions } from '../utils';
import { SummaryCard, CategorySpendingChart, MonthlyTrendChart } from './Charts';
import { TransactionRow, AddTransactionModal } from './Transactions';

export const Dashboard = () => {
  const { role, setRole, addTransaction, deleteTransaction, editTransaction, searchQuery, setSearchQuery, typeFilter, setTypeFilter, sortBy, setSortBy, transactions } = useStore();
  const filteredTx = useFilteredSortedTransactions(transactions, searchQuery, typeFilter, sortBy);
  const { totalBalance, totalIncome, totalExpense } = computeSummary(transactions);
  const spendingByCat = getSpendingByCategory(transactions);
  const monthlyData = getMonthlyTrend(transactions);
  const insights = getInsights(transactions, spendingByCat);
  const isAdmin = role === 'admin';
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Header + Role Toggle */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">FinDash</h1>
          <p className="text-gray-500 text-sm">Smart financial overview</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-full shadow-sm border">
          <span className="text-sm font-medium px-2">🔐 Role:</span>
          <button onClick={()=>setRole('viewer')} className={`px-4 py-1.5 rounded-full text-sm transition ${role==='viewer' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Viewer</button>
          <button onClick={()=>setRole('admin')} className={`px-4 py-1.5 rounded-full text-sm transition ${role==='admin' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Admin</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <SummaryCard title="Total Balance" amount={totalBalance} icon="fas fa-wallet" color="bg-blue-500" />
        <SummaryCard title="Total Income" amount={totalIncome} icon="fas fa-arrow-up" color="bg-emerald-500" />
        <SummaryCard title="Total Expenses" amount={totalExpense} icon="fas fa-arrow-down" color="bg-rose-500" />
      </div>

      {/* Charts Row: Categorical + Monthly Trend */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><i className="fas fa-chart-pie text-indigo-500"></i> Spending by Category</h2>
          <CategorySpendingChart data={spendingByCat} />
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><i className="fas fa-chart-line text-indigo-500"></i> Monthly Trend (Income vs Expense)</h2>
          <MonthlyTrendChart data={monthlyData} />
          <div className="text-xs text-gray-400 text-center mt-2">Last 6 months | Green: Income, Red: Expense</div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-2xl mb-8 border border-indigo-100">
        <h2 className="font-bold text-gray-800 flex items-center gap-2"><i className="fas fa-lightbulb text-amber-500"></i> Insights</h2>
        <div className="grid sm:grid-cols-3 gap-3 mt-2">
          <div className="bg-white/60 p-3 rounded-xl"><span className="text-sm text-gray-500">🔥 Highest spending</span><p className="font-bold">{insights.highestSpendingCat ? `${insights.highestSpendingCat.category} ($${insights.highestSpendingCat.amount})` : '—'}</p></div>
          <div className="bg-white/60 p-3 rounded-xl"><span className="text-sm text-gray-500">📉 Monthly comparison</span><p className="font-medium text-sm">{insights.monthlyComparison}</p></div>
          <div className="bg-white/60 p-3 rounded-xl"><span className="text-sm text-gray-500">💸 Avg expense per transaction</span><p className="font-bold">${insights.avgExpense}</p></div>
        </div>
      </div>

      {/* Add Transaction Button */}
      {isAdmin && (
        <div className="mb-6">
          <button onClick={()=>setModalOpen(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg"><i className="fas fa-plus"></i> Add New Transaction</button>
        </div>
      )}

      {/* Transactions Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b flex items-center gap-2">
          <h2 className="text-xl font-bold flex items-center gap-2"><i className="fas fa-list-ul text-gray-700"></i> Transactions</h2>
        </div>
        <div className="p-4 flex flex-wrap gap-3 border-b bg-gray-50">
          <div className="flex-1 min-w-[180px]"><i className="fas fa-search text-gray-400 mr-2"></i><input type="text" placeholder="Search description or category" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="bg-white border rounded-xl px-3 py-2 w-full text-sm"/></div>
          <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="border rounded-xl px-3 py-2 text-sm bg-white"><option value="all">All types</option><option value="income">Income only</option><option value="expense">Expense only</option></select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="border rounded-xl px-3 py-2 text-sm bg-white"><option value="date_desc">Newest first</option><option value="date_asc">Oldest first</option><option value="amount_desc">Highest amount</option><option value="amount_asc">Lowest amount</option></select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
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
      <div className="text-center text-xs text-gray-400 mt-8">FinDash demo • Role-based UI (Admin can add/edit/delete) • Data persists in memory</div>
    </div>
  );
};
