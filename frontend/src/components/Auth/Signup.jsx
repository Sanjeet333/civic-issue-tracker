import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../lib/api';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'citizen'
  });
  
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/signup', formData);
      login(data);
      alert('Signup Successful!');
      window.location.href = '/dashboard';
    } catch (error) {
      alert(error.response?.data?.message || 'Signup Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-800 dark:text-white">
          Create Account
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Username</label>
          <input 
            type="text" 
            placeholder="John Doe" 
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Email</label>
          <input 
            type="email" 
            placeholder="you@example.com" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account? <a href="/login" className="text-indigo-600 font-bold hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;