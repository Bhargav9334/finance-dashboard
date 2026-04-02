import React from 'react';
import { useStore } from '../store';
import { computeSummary, getSpendingByCategory, getMonthlyTrend, getInsights, useFilteredSortedTransactions } from '../utils';
import { SummaryCard, CategorySpendingChart, MonthlyTrendChart } from './Charts';
import { TransactionRow, AddTransactionModal } from './Transactions';

export const DashboardRetro = () => {
  const { role, setRole, addTransaction, deleteTransaction, editTransaction, searchQuery, setSearchQuery, typeFilter, setTypeFilter, sortBy, setSortBy, transactions } = useStore();
  const filteredTx = useFilteredSortedTransactions(transactions, searchQuery, typeFilter, sortBy);
  const { totalBalance, totalIncome, totalExpense } = computeSummary(transactions);
  const spendingByCat = getSpendingByCategory(transactions);
  const monthlyData = getMonthlyTrend(transactions);
  const insights = getInsights(transactions, spendingByCat);
  const isAdmin = role === 'admin';
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header - Retro Style */}
        <div className="bg-black text-green-400 p-6 mb-6 border-4 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 animate-pulse">
                <span className="text-pink-400">F</span>
                <span className="text-yellow-400">I</span>
                <span className="text-blue-400">N</span>
                <span className="text-green-400">D</span>
                <span className="text-purple-400">A</span>
                <span className="text-red-400">S</span>
                <span className="text-orange-400">H</span>
              </h1>
              <p className="text-cyan-400 text-sm">RETRO FINANCE SYSTEM v2.0</p>
              <p className="text-yellow-400 text-xs">LOADING... ██████████ 100%</p>
            </div>
            <div className="bg-gray-900 border-2 border-green-400 p-2">
              <button
                onClick={()=>setRole('viewer')}
                className={`px-4 py-2 mx-1 border-2 font-bold text-sm transition-all ${
                  role==='viewer'
                    ? 'bg-green-400 text-black border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)]'
                    : 'border-gray-600 text-gray-400 hover:border-green-400 hover:text-green-400'
                }`}
              >
                [VIEWER]
              </button>
              <button
                onClick={()=>setRole('admin')}
                className={`px-4 py-2 mx-1 border-2 font-bold text-sm transition-all ${
                  role==='admin'
                    ? 'bg-green-400 text-black border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)]'
                    : 'border-gray-600 text-gray-400 hover:border-green-400 hover:text-green-400'
                }`}
              >
                [ADMIN]
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards - Retro Style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-black border-4 border-blue-400 p-6 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-all">
            <div className="text-center">
              <div className="text-4xl mb-2 text-blue-400 animate-pulse">💰</div>
              <p className="text-blue-400 font-bold text-sm mb-2">TOTAL BALANCE</p>
              <p className="text-3xl font-bold text-white">${totalBalance.toLocaleString()}</p>
              <div className="mt-4 bg-gray-800 rounded-full h-3 border border-blue-400">
                <div className="bg-blue-400 h-3 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-black border-4 border-green-400 p-6 shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] transition-all">
            <div className="text-center">
              <div className="text-4xl mb-2 text-green-400 animate-pulse">📈</div>
              <p className="text-green-400 font-bold text-sm mb-2">TOTAL INCOME</p>
              <p className="text-3xl font-bold text-white">${totalIncome.toLocaleString()}</p>
              <div className="mt-4 bg-gray-800 rounded-full h-3 border border-green-400">
                <div className="bg-green-400 h-3 rounded-full w-4/5 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-black border-4 border-red-400 p-6 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] transition-all">
            <div className="text-center">
              <div className="text-4xl mb-2 text-red-400 animate-pulse">📉</div>
              <p className="text-red-400 font-bold text-sm mb-2">TOTAL EXPENSES</p>
              <p className="text-3xl font-bold text-white">${totalExpense.toLocaleString()}</p>
              <div className="mt-4 bg-gray-800 rounded-full h-3 border border-red-400">
                <div className="bg-red-400 h-3 rounded-full w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black border-4 border-purple-400 p-6 shadow-[0_0_20px_rgba(147,51,234,0.5)]">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3 text-purple-400 animate-pulse">📊</div>
              <h2 className="text-xl font-bold text-purple-400">SPENDING BY CATEGORY</h2>
            </div>
            <div className="border-2 border-purple-400 p-2 bg-gray-900">
              <CategorySpendingChart data={spendingByCat} />
            </div>
          </div>

          <div className="bg-black border-4 border-cyan-400 p-6 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3 text-cyan-400 animate-pulse">📈</div>
              <h2 className="text-xl font-bold text-cyan-400">MONTHLY TREND</h2>
            </div>
            <div className="border-2 border-cyan-400 p-2 bg-gray-900">
              <MonthlyTrendChart data={monthlyData} />
            </div>
            <p className="text-cyan-400 text-xs mt-2 text-center font-bold">&gt;&gt;&gt; 6 MONTH HISTORY &lt;&lt;&lt;</p>
          </div>
        </div>

        {/* Insights - Retro Style */}
        <div className="bg-black border-4 border-yellow-400 p-6 mb-8 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3 text-yellow-400 animate-pulse">💡</div>
            <h2 className="text-xl font-bold text-yellow-400">SYSTEM ANALYSIS</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-900 border-2 border-orange-400 p-4 text-center">
              <h3 className="font-bold text-orange-400 mb-2">MAX SPENDING</h3>
              <p className="text-2xl font-bold text-white">{insights.highestSpendingCat ? `$${insights.highestSpendingCat.amount}` : '—'}</p>
              <p className="text-sm text-orange-400">{insights.highestSpendingCat?.category || 'NO DATA'}</p>
            </div>
            <div className="bg-gray-900 border-2 border-blue-400 p-4 text-center">
              <h3 className="font-bold text-blue-400 mb-2">MONTHLY Δ</h3>
              <p className="text-lg font-bold text-white">{insights.monthlyComparison}</p>
            </div>
            <div className="bg-gray-900 border-2 border-green-400 p-4 text-center">
              <h3 className="font-bold text-green-400 mb-2">AVG EXPENSE</h3>
              <p className="text-2xl font-bold text-white">${insights.avgExpense}</p>
            </div>
          </div>
        </div>

        {/* Add Transaction Button */}
        {isAdmin && (
          <div className="mb-6">
            <button
              onClick={()=>setModalOpen(true)}
              className="w-full bg-black text-green-400 border-4 border-green-400 px-6 py-3 font-bold hover:bg-green-400 hover:text-black transition-all shadow-[0_0_20px_rgba(34,197,94,0.8)] text-lg"
            >
              [+] ADD NEW RECORD
            </button>
          </div>
        )}

        {/* Transactions - Retro Terminal Style */}
        <div className="bg-black border-4 border-green-400 shadow-[0_0_25px_rgba(34,197,94,0.6)] overflow-hidden">
          <div className="bg-green-400 text-black p-4 font-bold">
            <div className="flex items-center">
              <span className="text-xl mr-2">📋</span>
              <span>TRANSACTION DATABASE</span>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-900 p-4 border-b-2 border-green-400">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="SEARCH RECORDS..."
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-black border-2 border-green-400 text-green-400 font-mono focus:outline-none focus:shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                />
              </div>
              <select
                value={typeFilter}
                onChange={e=>setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-black border-2 border-green-400 text-green-400 font-mono focus:outline-none focus:shadow-[0_0_10px_rgba(34,197,94,0.5)]"
              >
                <option value="all" className="bg-black">ALL TYPES</option>
                <option value="income" className="bg-black">INCOME ONLY</option>
                <option value="expense" className="bg-black">EXPENSE ONLY</option>
              </select>
              <select
                value={sortBy}
                onChange={e=>setSortBy(e.target.value)}
                className="px-3 py-2 bg-black border-2 border-green-400 text-green-400 font-mono focus:outline-none focus:shadow-[0_0_10px_rgba(34,197,94,0.5)]"
              >
                <option value="date_desc" className="bg-black">NEWEST FIRST</option>
                <option value="date_asc" className="bg-black">OLDEST FIRST</option>
                <option value="amount_desc" className="bg-black">HIGHEST AMOUNT</option>
                <option value="amount_asc" className="bg-black">LOWEST AMOUNT</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-gray-900">
            <table className="w-full font-mono">
              <thead className="bg-green-400 text-black">
                <tr>
                  <th className="text-left py-3 px-4 font-bold border-r border-black">DATE</th>
                  <th className="text-left py-3 px-4 font-bold border-r border-black">DESCRIPTION</th>
                  <th className="text-left py-3 px-4 font-bold border-r border-black">AMOUNT</th>
                  <th className="text-left py-3 px-4 font-bold border-r border-black">CATEGORY</th>
                  <th className="text-left py-3 px-4 font-bold border-r border-black">TYPE</th>
                  {isAdmin && <th className="py-3 px-4 font-bold">ACTIONS</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTx.length === 0 ? (
                  <tr className="bg-black">
                    <td colSpan={isAdmin ? 6 : 5} className="text-center py-8 text-green-400 font-mono">
                      &gt; NO RECORDS FOUND
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
        <div className="text-center text-xs text-green-400 mt-6 font-mono bg-black border border-green-400 p-2 inline-block">
          RETRO SYSTEM v2.0 • READY • PRESS ANY KEY TO CONTINUE...
        </div>
      </div>
    </div>
  );
};