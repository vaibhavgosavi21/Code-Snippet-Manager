import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Code2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: 'admin@example.com', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting admin login with:', formData.email);
      const user = await login(formData.email, formData.password);
      console.log('Login successful, user:', user);
      
      if (user.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        console.log('User role is not admin:', user.role);
        return;
      }
      
      console.log('Admin role verified, redirecting to /admin');
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {/* Back to User Login */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
          >
            <ArrowLeft size={16} />
            Back to User Login
          </button>
        </div>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
            <Code2 className="w-4 h-4" />
            Administrative Access Only
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Sign In
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Enter your administrator credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Admin Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="relative">
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Admin Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {/* Admin Credentials Hint */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-3">
              <p className="text-xs text-purple-600 dark:text-purple-400 text-center">
                <Shield className="w-3 h-3 inline mr-1" />
                Default password: admin123
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg"
            >
              Admin Sign In
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center gap-4">
            <p className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Secure Admin Access
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;