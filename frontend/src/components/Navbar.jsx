import React from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Navbar = () => {
  const navigate = useNavigate();
  const logout = async () => {
    await API.get('/api/users/logout', { withCredentials: true });
    navigate('/login');
  };
  return (
    <nav className="bg-white p-4 shadow-sm flex justify-between items-center px-10">
      <h2 className="font-bold text-xl text-blue-600">ExpenseTracker</h2>
      <button onClick={logout} className="text-red-500 font-bold">Logout</button>
    </nav>
  );
}
export default Navbar;