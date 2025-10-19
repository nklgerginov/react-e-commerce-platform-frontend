
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AppContext';
import { View } from '../App';
import api from '../services/api';
import Spinner from '../components/Spinner';

interface LoginPageProps {
  navigateTo: (view: View) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigateTo }) => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await api.login(email, password);
      login(user, token);
      navigateTo({ name: 'home' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Login</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
            Use <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">test@example.com</code> and <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">password</code> to sign in.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 disabled:bg-gray-400"
            >
              {loading ? <Spinner size="h-5 w-5" color="text-white" /> : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
