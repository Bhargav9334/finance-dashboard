import React from 'react';

export const TransactionRow = ({ transaction, isAdmin, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({ description: transaction.description, amount: transaction.amount, category: transaction.category, date: transaction.date, type: transaction.type });
  
  const handleSave = () => {
    if (editForm.amount <= 0) return;
    onEdit(transaction.id, editForm);
    setIsEditing(false);
  };
  
  if (isEditing && isAdmin) {
    return (
      <tr className="bg-gray-50 border-b">
        <td className="p-2"><input type="date" value={editForm.date} onChange={e=>setEditForm({...editForm, date:e.target.value})} className="border rounded p-1 text-sm w-28"/></td>
        <td className="p-2"><input value={editForm.description} onChange={e=>setEditForm({...editForm, description:e.target.value})} className="border rounded p-1 w-36"/></td>
        <td className="p-2"><input type="number" value={editForm.amount} onChange={e=>setEditForm({...editForm, amount:parseFloat(e.target.value)})} className="border rounded p-1 w-24"/></td>
        <td className="p-2"><select value={editForm.category} onChange={e=>setEditForm({...editForm, category:e.target.value})} className="border rounded p-1"><option>Food & Dining</option><option>Shopping</option><option>Transport</option><option>Entertainment</option><option>Bills & Utilities</option><option>Salary</option><option>Freelance</option></select></td>
        <td className="p-2"><select value={editForm.type} onChange={e=>setEditForm({...editForm, type:e.target.value})} className="border rounded p-1"><option>expense</option><option>income</option></select></td>
        <td className="p-2 flex gap-2"><button onClick={handleSave} className="text-green-600"><i className="fas fa-check"></i></button><button onClick={()=>setIsEditing(false)} className="text-gray-500"><i className="fas fa-times"></i></button></td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="py-3 px-2 text-sm text-gray-600">{transaction.date}</td>
      <td className="py-3 px-2 font-medium text-gray-800">{transaction.description}</td>
      <td className={`py-3 px-2 font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>${transaction.amount.toFixed(2)}</td>
      <td className="py-3 px-2 text-sm text-gray-500">{transaction.category}</td>
      <td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{transaction.type === 'income' ? 'Income' : 'Expense'}</span></td>
      {isAdmin && (
        <td className="py-3 px-2 flex gap-2">
          <button onClick={() => setIsEditing(true)} className="text-indigo-500 hover:text-indigo-700"><i className="fas fa-edit"></i></button>
          <button onClick={() => onDelete(transaction.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash-alt"></i></button>
        </td>
      )}
    </tr>
  );
};

export const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = React.useState({ description: '', amount: '', category: 'Food & Dining', type: 'expense', date: new Date().toISOString().split('T')[0] });
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || form.amount <=0) return;
    onAdd({ ...form, amount: parseFloat(form.amount) });
    setForm({ description: '', amount: '', category: 'Food & Dining', type: 'expense', date: new Date().toISOString().split('T')[0] });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-xl font-bold mb-4">➕ Add Transaction</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="w-full border rounded-lg p-2" required/>
          <input type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} className="w-full border rounded-lg p-2" required min="0.01" step="0.01"/>
          <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="w-full border rounded-lg p-2"><option>Food & Dining</option><option>Shopping</option><option>Transport</option><option>Entertainment</option><option>Bills & Utilities</option><option>Salary</option><option>Freelance</option></select>
          <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})} className="w-full border rounded-lg p-2"><option value="expense">Expense</option><option value="income">Income</option></select>
          <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="w-full border rounded-lg p-2"/>
          <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add</button></div>
        </form>
      </div>
    </div>
  );
};
