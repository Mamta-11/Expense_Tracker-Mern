import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

const Register = () => {
  const [user, setUser] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Backend Register API call
      await API.post(`/api/users/register`, user);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 font-sans">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Register</h2>
        
        <input 
          type="text" placeholder="Username" required
          className="w-full p-3 mb-4 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setUser({...user, username: e.target.value})} 
        />
        
        <input 
          type="email" placeholder="Email Address" required
          className="w-full p-3 mb-4 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setUser({...user, email: e.target.value})} 
        />
        
        <input 
          type="password" placeholder="Password" required
          className="w-full p-3 mb-6 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setUser({...user, password: e.target.value})} 
        />
        
        <button className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md">
          Create Account
        </button>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-green-500 font-bold underline">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;