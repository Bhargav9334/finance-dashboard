import React from 'react';

export const SummaryCard = ({ title, amount, icon, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 card-hover">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 font-medium tracking-wide">{title}</p>
        <p className="text-2xl md:text-3xl font-bold mt-2 text-gray-800">${amount.toLocaleString()}</p>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <i className={`${icon} text-xl ${color.replace('bg-','text-')}`}></i>
      </div>
    </div>
  </div>
);

export const CategorySpendingChart = ({ data }) => {
  const maxAmount = data.length ? Math.max(...data.map(d => d.amount)) : 1;
  return (
    <div className="space-y-3">
      {data.slice(0,5).map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className="w-28 text-sm font-medium text-gray-600 truncate">{item.category}</div>
          <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full flex items-center justify-end pr-2 text-xs text-white font-medium" style={{ width: `${(item.amount / maxAmount) * 100}%` }}>
              {item.amount > maxAmount*0.15 && `$${item.amount}`}
            </div>
          </div>
          <div className="w-16 text-right text-sm font-semibold text-gray-700">${item.amount}</div>
        </div>
      ))}
      {data.length === 0 && <p className="text-center text-gray-400 py-4">No expense data</p>}
    </div>
  );
};

export const MonthlyTrendChart = ({ data }) => {
  if (!data.length) return <p className="text-center text-gray-400">No trend data</p>;
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]), 1);
  return (
    <div className="flex justify-around items-end gap-2 h-48 mt-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center w-12">
          <div className="relative w-full flex flex-col items-center gap-1 h-36 justify-end">
            <div style={{ height: `${(item.expense / maxVal) * 80}px` }} className="w-5 bg-rose-400 rounded-t-md transition-all"></div>
            <div style={{ height: `${(item.income / maxVal) * 80}px` }} className="w-5 bg-emerald-400 rounded-t-md transition-all"></div>
          </div>
          <span className="text-xs text-gray-500 mt-2 rotate-45 origin-left translate-x-2">{item.month.slice(5)}</span>
        </div>
      ))}
    </div>
  );
};
