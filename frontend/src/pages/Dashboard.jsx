import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AddExpense from '../components/AddExpense';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);
  
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchData = async () => {
    try {
      const resSum = await axios.get('/api/expenses/summary', { withCredentials: true });
      setSummary(resSum.data);

      const resExp = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/get?search=${search}&sortBy=${sortBy}`, { withCredentials: true });
      setExpenses(resExp.data.expenses);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, sortBy]);

  const handleUpdateBudget = async () => {
    const newBudget = prompt("Enter your new monthly budget:", summary.monthlyBudget);
    
    if (newBudget && !isNaN(newBudget)) {
      try {
        await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/users/update-budget`, 
          { budget: Number(newBudget) }, 
          { withCredentials: true }
        );
        fetchData();
      } catch (err) {
        alert("Failed to update budget");
      }
    } else if (newBudget !== null) {
      alert("Please enter a valid number");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/delete/${id}`, { withCredentials: true });
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar fetchData={fetchData} />
      
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      
          <div className="bg-white p-5 rounded-2xl shadow-sm border-b-4 border-blue-500">
            <h3 className="text-gray-500 text-xs font-bold uppercase">Total Spent</h3>
            <p className="text-2xl font-black text-blue-600">₹{summary.totalExpenses || 0}</p>
          </div>

          {/* Card 2: Monthly Budget (Editable) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border-b-4 border-yellow-400 group relative">
            <h3 className="text-gray-500 text-xs font-bold uppercase">Monthly Budget</h3>
            <p className="text-2xl font-black text-yellow-600">₹{summary.monthlyBudget || 0}</p>
            <button 
              onClick={handleUpdateBudget}
              className="absolute top-2 right-2 text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition"
            >
              EDIT
            </button>
          </div>

          {/* Card 3: Remaining */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border-b-4 border-green-500">
            <h3 className="text-gray-500 text-xs font-bold uppercase">Remaining</h3>
            <p className="text-2xl font-black text-green-600">₹{summary.remainingBalance || 0}</p>
          </div>

          {/* Card 4: Status */}
          <div className={`bg-white p-5 rounded-2xl shadow-sm border-b-4 ${summary.status === 'Over Budget' ? 'border-red-500' : 'border-purple-500'}`}>
            <h3 className="text-gray-500 text-xs font-bold uppercase">Status</h3>
            <p className={`text-lg font-bold ${summary.status === 'Over Budget' ? 'text-red-600' : 'text-purple-600'}`}>
              {summary.status || "N/A"}
            </p>
          </div>
        </div>

        {/* Search & Add Section */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <div className="flex gap-2">
            <input 
              type="text" placeholder="Search title..." 
              className="p-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
            <select 
              className="p-2 border rounded-xl outline-none text-sm bg-white"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <button 
            onClick={() => { setCurrentEditData(null); setIsModalOpen(true); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            + Add Expense
          </button>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Title</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Category</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id} className="border-t hover:bg-gray-50/50 transition">
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{exp.title}</p>
                    {exp.description && <p className="text-[10px] text-gray-400 italic">{exp.description}</p>}
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-4 font-black text-red-500">₹{exp.amount}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => { setCurrentEditData(exp); setIsModalOpen(true); }}
                        className="text-blue-500 hover:text-blue-700 font-bold text-xs"
                      >EDIT</button>
                      <button 
                        onClick={() => handleDelete(exp._id)}
                        className="text-red-400 hover:text-red-600 font-bold text-xs"
                      >DELETE</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {expenses.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-medium">No expenses found. Start adding some!</p>
            </div>
          )}
        </div>
      </div>

      <AddExpense 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        refreshData={fetchData} 
        existingData={currentEditData} 
      />
    </div>
  );
};

export default Dashboard;