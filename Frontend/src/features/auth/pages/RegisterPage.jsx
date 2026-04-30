import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../authApi';
import { setCredentials } from '../authSlice';

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
      const response = await register(form).unwrap();
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
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-surface-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-surface-900">Create account</h1>
        <p className="text-sm text-surface-500 mt-1">Start a new institute workspace</p>

        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          <input className="input-field" name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input className="input-field" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input className="input-field" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input className="input-field" name="institute_name" placeholder="Institute name" value={form.institute_name} onChange={handleChange} />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button disabled={isLoading} className="w-full btn-primary justify-center">
            {isLoading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-surface-500 mt-6">
          Already have an account? <Link to="/login" className="text-brand-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}