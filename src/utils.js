export const generateMockTransactions = () => {
  const categories = ['Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Bills & Utilities', 'Health', 'Salary', 'Freelance'];
  const types = ['expense', 'income'];
  const transactions = [];
  const startDate = new Date(2024, 8, 1);
  for (let i = 1; i <= 48; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const type = i % 5 === 0 ? 'income' : (i % 7 === 0 ? 'income' : 'expense');
    let amount;
    let category;
    if (type === 'income') {
      amount = Math.floor(Math.random() * 1200) + 400;
      category = i % 3 === 0 ? 'Freelance' : 'Salary';
    } else {
      amount = Math.floor(Math.random() * 180) + 15;
      category = categories[Math.floor(Math.random() * (categories.length - 2))];
    }
    transactions.push({
      id: i,
      date: date.toISOString().split('T')[0],
      description: type === 'income' ? (category === 'Salary' ? 'Monthly Salary' : 'Freelance Project') : `Purchase at ${category}`,
      amount: amount,
      category: category,
      type: type,
    });
  }
  return transactions.sort((a,b) => new Date(b.date) - new Date(a.date));
};

export const computeSummary = (transactions) => {
  let totalBalance = 0;
  let totalIncome = 0;
  let totalExpense = 0;
  transactions.forEach(t => {
    if (t.type === 'income') totalIncome += t.amount;
    else totalExpense += t.amount;
  });
  totalBalance = totalIncome - totalExpense;
  return { totalBalance, totalIncome, totalExpense };
};

export const getSpendingByCategory = (transactions) => {
  const expenseMap = new Map();
  transactions.forEach(t => {
    if (t.type === 'expense') {
      const prev = expenseMap.get(t.category) || 0;
      expenseMap.set(t.category, prev + t.amount);
    }
  });
  return Array.from(expenseMap.entries()).map(([category, amount]) => ({ category, amount })).sort((a,b) => b.amount - a.amount);
};

export const getMonthlyTrend = (transactions) => {
  const monthlyData = new Map();
  transactions.forEach(t => {
    const monthKey = t.date.slice(0,7);
    if (!monthlyData.has(monthKey)) monthlyData.set(monthKey, { income: 0, expense: 0 });
    const entry = monthlyData.get(monthKey);
    if (t.type === 'income') entry.income += t.amount;
    else entry.expense += t.amount;
  });
  return Array.from(monthlyData.entries()).map(([month, {income, expense}]) => ({ month, income, expense })).sort((a,b) => a.month.localeCompare(b.month)).slice(-6);
};

export const getInsights = (transactions, spendingByCat) => {
  const highestSpendingCat = spendingByCat.length > 0 ? spendingByCat[0] : null;
  const monthlyTrend = getMonthlyTrend(transactions);
  let monthlyComparison = "No enough data";
  if (monthlyTrend.length >= 2) {
    const last = monthlyTrend[monthlyTrend.length-1];
    const prev = monthlyTrend[monthlyTrend.length-2];
    const diff = last.expense - prev.expense;
    monthlyComparison = diff > 0 ? `📈 Expenses increased by $${diff.toFixed(0)} vs last month` : `📉 Expenses decreased by $${Math.abs(diff).toFixed(0)} vs last month`;
  }
  const totalExpenses = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const avgExpense = totalExpenses / transactions.filter(t=>t.type==='expense').length || 0;
  return { highestSpendingCat, monthlyComparison, avgExpense: Math.round(avgExpense) };
};

export const useFilteredSortedTransactions = (transactions, searchQuery, typeFilter, sortBy) => {
  let filtered = [...transactions];
  if (searchQuery.trim() !== '') {
    const lowerQuery = searchQuery.toLowerCase();
    filtered = filtered.filter(tx => tx.description.toLowerCase().includes(lowerQuery) || tx.category.toLowerCase().includes(lowerQuery));
  }
  if (typeFilter !== 'all') {
    filtered = filtered.filter(tx => tx.type === typeFilter);
  }
  switch(sortBy) {
    case 'date_desc': filtered.sort((a,b) => new Date(b.date) - new Date(a.date)); break;
    case 'date_asc': filtered.sort((a,b) => new Date(a.date) - new Date(b.date)); break;
    case 'amount_desc': filtered.sort((a,b) => b.amount - a.amount); break;
    case 'amount_asc': filtered.sort((a,b) => a.amount - b.amount); break;
    default: break;
  }
  return filtered;
};
