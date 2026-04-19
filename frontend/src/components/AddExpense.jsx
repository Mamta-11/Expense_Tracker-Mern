import React, { useState, useEffect } from 'react';
import API from '../utils/api'; // Tumhara naya axios instance

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
      setData({ 
        title: '', 
        amount: '', 
        category: 'Food', 
        description: '', 
        date: new Date().toISOString().split('T')[0] 
      });
    }
  }, [existingData, isOpen, isEditMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: data.title,
      amount: Number(data.amount),
      category: data.category,
      date: data.date,
      description: data.description.trim() || undefined 
    };

    try {
      if (isEditMode) {
        await API.patch(`/api/expenses/update/${existingData._id}`, payload);
      } else {
        await API.post('/api/expenses/add', payload);
      }
      
      refreshData();
      onClose();
    } catch (err) {
      console.error("Submit Error:", err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? 'Update Expense' : 'Add Expense'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Title</label>
            <input type="text" placeholder="What did you buy?" required value={data.title} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setData({...data, title: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Amount</label>
              <input type="number" placeholder="₹" required value={data.amount} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setData({...data, amount: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Date</label>
              <input type="date" required value={data.date} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setData({...data, date: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Category</label>
            <select value={data.category} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" onChange={(e) => setData({...data, category: e.target.value})}>
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Description (Optional)</label>
            <textarea placeholder="Add details..." value={data.description} className="w-full p-3 border rounded-xl h-20 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setData({...data, description: e.target.value})} />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={onClose} className="px-6 py-2 text-gray-400 font-bold hover:text-gray-600 transition">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition">
            {isEditMode ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;