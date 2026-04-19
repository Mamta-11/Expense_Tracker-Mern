import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AddExpense from '../components/AddExpense';
import API from '../utils/api';
const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);
  
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchData = async () => {
    try {
      const resSum = await API.get('/api/expenses/summary');
      setSummary(resSum.data);

      const resExp = await API.get(`/api/expenses/get?search=${search}&sortBy=${sortBy}`);
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
        await API.patch('/api/users/update-budget', 
          { budget: Number(newBudget) }
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
      await API.delete(`/api/expenses/delete/${id}`);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar fetchData={fetchData} />
      
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
   
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          
          <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-blue-500">
            <h3 className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase">Total Spent</h3>
            <p className="text-lg sm:text-2xl font-black text-blue-600 truncate">₹{summary.totalExpenses || 0}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-yellow-400 group relative">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase">Budget</h3>
              <button 
                onClick={handleUpdateBudget}
                className="text-[9px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold"
              >
                EDIT
              </button>
            </div>
            <p className="text-lg sm:text-2xl font-black text-yellow-600 truncate">₹{summary.monthlyBudget || 0}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-green-500">
            <h3 className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase">Remaining</h3>
            <p className="text-lg sm:text-2xl font-black text-green-600 truncate">₹{summary.remainingBalance || 0}</p>
          </div>

          <div className={`bg-white p-4 rounded-xl shadow-sm border-b-4 ${summary.status === 'Over Budget' ? 'border-red-500' : 'border-purple-500'}`}>
            <h3 className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase">Status</h3>
            <p className={`text-[12px] sm:text-lg font-bold truncate ${summary.status === 'Over Budget' ? 'text-red-600' : 'text-purple-600'}`}>
              {summary.status || "N/A"}
            </p>
          </div>
        </div>

      
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-6">
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="text" placeholder="Search..." 
              className="flex-1 sm:w-64 p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
            <select 
              className="p-2.5 border rounded-xl outline-none text-sm bg-white cursor-pointer"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">New</option>
              <option value="oldest">Old</option>
            </select>
          </div>
          <button 
            onClick={() => { setCurrentEditData(null); setIsModalOpen(true); }}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md active:scale-95"
          >
            + Add Expense
          </button>
        </div>

    
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800 text-sm line-clamp-1">{exp.title}</p>
                      {exp.description && <p className="text-[10px] text-gray-400 italic line-clamp-1">{exp.description}</p>}
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-4 font-black text-red-500 text-sm whitespace-nowrap">₹{exp.amount}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => { setCurrentEditData(exp); setIsModalOpen(true); }}
                          className="text-blue-500 hover:text-blue-700 font-bold text-[10px]"
                        >EDIT</button>
                        <button 
                          onClick={() => handleDelete(exp._id)}
                          className="text-red-400 hover:text-red-600 font-bold text-[10px]"
                        >DEL</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {expenses.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm font-medium">No expenses found.</p>
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

export default Dashboard;import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/api/users/login', { email, password });

      if (res.status === 200) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-blue-600">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-2">Log in to manage your expenses</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              className="w-full p-3 mt-1 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 mt-1 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;