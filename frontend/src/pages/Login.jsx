import { useState } from 'react';
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