import { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); 
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isAdmin ? '/auth/login-admin' : '/auth/login';
      const { data } = await API.post(endpoint, { email, password });
      
      login(data);
      alert(isAdmin ? 'Admin Login Successful!' : 'Login Successful!');
      navigate('/dashboard'); 
    } catch (error) {
      alert(error.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-800 dark:text-white">
          {isAdmin ? 'Admin Login' : 'Login'}
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Email</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-700 dark:text-white" required />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Password</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-700 dark:text-white" required />
        </div>

        <div className="mb-6 flex items-center">
          <input type="checkbox" id="adminCheck" onChange={(e) => setIsAdmin(e.target.checked)} className="mr-2" />
          <label htmlFor="adminCheck" className="text-sm text-slate-600 dark:text-slate-300">Login as Admin</label>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition duration-300">
          Login
        </button>
        
        <p className="mt-4 text-center text-sm text-slate-500">
          Don't have an account? <a href="/signup" className="text-indigo-600 font-bold hover:underline">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;