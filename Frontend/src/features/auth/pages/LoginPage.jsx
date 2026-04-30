import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../authApi';
import { setCredentials } from '../authSlice';
import { GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setCredentials(response.data));
      toast.success('Login successful');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-12 flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-7 h-7 text-brand-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">CoachOps</h1>
            <p className="text-brand-100 text-sm mt-2">Institute Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8">
            <div className="mb-5">
              <label className="block text-sm font-medium text-surface-900 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-surface-900 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-600 text-white font-medium py-2 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="px-8 pb-8 text-center text-sm text-surface-600">
            <p>Demo: Use any credentials (backend will validate)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
