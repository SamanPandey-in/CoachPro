import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../authApi';
import { setCredentials } from '../authSlice';
import { GraduationCap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [form, setForm] = useState({ name: '', email: '', password: '', institute_name: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await toast.promise(register(form).unwrap(), {
        loading: 'Creating account...',
        success: 'Account created',
        error: (registerError) => registerError?.data?.error?.message || 'Unable to register',
      });
      if (response?.data?.user) {
        dispatch(setCredentials(response.data));
        navigate('/admin', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } catch (registerError) {
      setError(registerError?.data?.error?.message || 'Unable to register');
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_28%),linear-gradient(180deg,#F8FAFC_0%,#EEF2FF_100%)]">
      <div className="w-full max-w-6xl grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="page-hero hidden lg:block">
          <div className="hero-chip mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Set up your workspace
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-surface-900">Create an institute account</h1>
              <p className="text-sm text-surface-500 mt-1">Start with a clean workspace, then add batches and students.</p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="metric-card">
              <p className="text-sm font-semibold text-surface-900">Step 1</p>
              <p className="text-sm text-surface-500 mt-1">Create the owner account and institute record.</p>
            </div>
            <div className="metric-card">
              <p className="text-sm font-semibold text-surface-900">Step 2</p>
              <p className="text-sm text-surface-500 mt-1">Invite teachers and connect a biometric device.</p>
            </div>
            <div className="metric-card">
              <p className="text-sm font-semibold text-surface-900">Step 3</p>
              <p className="text-sm text-surface-500 mt-1">Seed your first batch and begin attendance tracking.</p>
            </div>
          </div>
        </div>

        <div className="panel self-center">
          <h1 className="text-2xl font-semibold text-surface-900">Create account</h1>
          <p className="text-sm text-surface-500 mt-1">Start a new institute workspace</p>

          <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
            <input className="input-field" name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
            <input className="input-field" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input className="input-field" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <input className="input-field" name="institute_name" placeholder="Institute name" value={form.institute_name} onChange={handleChange} />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-surface-500 mt-6">
            Already have an account? <Link to="/login" className="text-brand-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}