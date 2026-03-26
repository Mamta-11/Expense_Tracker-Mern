import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddExpense = ({ isOpen, onClose, refreshData, existingData }) => {
  const isEditMode = !!existingData;
  const [data, setData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0] 
  });

  useEffect(() => {
    if (isEditMode && isOpen) {
      setData({
        title: existingData.title,
        amount: existingData.amount,
        category: existingData.category,
        description: existingData.description || '',
        date: existingData.date ? existingData.date.split('T')[0] : ''
      });
    } else if (isOpen) {
      setData({ title: '', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });
    }
  }, [existingData, isOpen, isEditMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: data.title,
      amount: Number(data.amount),
      category: data.category,
      date: data.date
    };
    if (data.description.trim()) payload.description = data.description;

    try {
      const url = isEditMode 
        ? `http://localhost:5000/api/expenses/update/${existingData._id}`
        : 'http://localhost:5000/api/expenses/add';
      
      const method = isEditMode ? 'patch' : 'post';
      await axios[method](url, payload, { withCredentials: true });
      refreshData();
      onClose();
    } catch (err) {
    
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? 'Update Expense' : 'Add Expense'}</h2>
        
        <div className="space-y-4">
          <input type="text" placeholder="Title" required value={data.title} className="w-full p-3 border rounded-xl" onChange={(e) => setData({...data, title: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Amount" required value={data.amount} className="w-full p-3 border rounded-xl" onChange={(e) => setData({...data, amount: e.target.value})} />
            <input type="date" required value={data.date} className="w-full p-3 border rounded-xl" onChange={(e) => setData({...data, date: e.target.value})} />
          </div>

          <select value={data.category} className="w-full p-3 border rounded-xl" onChange={(e) => setData({...data, category: e.target.value})}>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>

          <textarea placeholder="Description (Optional)" value={data.description} className="w-full p-3 border rounded-xl h-24" onChange={(e) => setData({...data, description: e.target.value})} />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-200">Save</button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;