import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../authApi';
import { setCredentials } from '../authSlice';
import { CheckCircle2, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const quickLogins = [
    { label: 'Admin', email: 'admin@coachpro.local', password: 'Coach@1234' },
    { label: 'Owner', email: 'owner@coachpro.local', password: 'Coach@1234' },
    { label: 'Teacher', email: 'teacher@coachpro.local', password: 'Coach@1234' },
    { label: 'Parent', email: 'parent@coachpro.local', password: 'Coach@1234' },
  ];

  const authenticate = async (credentials) => {
    const response = await toast.promise(login(credentials).unwrap(), {
      loading: 'Signing you in...',
      success: 'Welcome back',
      error: (err) => err?.data?.error?.message || 'Login failed',
    });

    dispatch(setCredentials(response.data));
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authenticate({ email, password });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.14),transparent_24%),linear-gradient(180deg,#F8FAFC_0%,#EAF2FF_100%)] px-4 py-8 flex items-center justify-center">
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      <div className="relative z-10 w-full max-w-6xl grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="page-hero relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-brand-100/70 blur-3xl" />
          <div className="absolute -left-8 bottom-0 w-48 h-48 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative">
            <div className="hero-chip mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Smarter institute operations
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-linear-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/25">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-surface-900">CoachOps</h1>
                <p className="text-surface-500 text-sm">Attendance, tests, parents, and reports in one flow</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="metric-card bg-white/85">
                <CheckCircle2 className="w-5 h-5 text-success mb-3" />
                <p className="text-sm font-semibold text-surface-900">Live backend</p>
                <p className="text-xs text-surface-500 mt-1">Real PostgreSQL data and JWT auth</p>
              </div>
              <div className="metric-card bg-white/85">
                <ShieldCheck className="w-5 h-5 text-brand-600 mb-3" />
                <p className="text-sm font-semibold text-surface-900">Role-based access</p>
                <p className="text-xs text-surface-500 mt-1">Admin, teacher, parent, and student views</p>
              </div>
              <div className="metric-card bg-white/85">
                <Sparkles className="w-5 h-5 text-gold mb-3" />
                <p className="text-sm font-semibold text-surface-900">Fast demo sign-in</p>
                <p className="text-xs text-surface-500 mt-1">One click to enter any role</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {quickLogins.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => authenticate({ email: account.email, password: account.password })}
                  className="badge transition-all duration-200 hover:bg-brand-50 hover:text-brand-700"
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="panel self-center">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-surface-900">Sign in</h2>
            <p className="text-sm text-surface-500 mt-1">Use your institute account or one of the quick-login demos.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-surface-200 bg-surface-50/80 p-4 text-sm text-surface-600">
            <p className="font-medium text-surface-900">Quick login tip</p>
            <p className="mt-1">Click any role above to instantly sign in with the seeded demo users.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
