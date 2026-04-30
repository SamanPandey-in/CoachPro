import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validators, composeValidators } from '../../utils/validation';
import ErrorMessage from '../../components/UI/ErrorMessage';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { login, profile, loading } = useAuth();
  
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect based on role once profile is loaded
  useEffect(() => {
    if (profile?.role) {
      navigate(`/${profile.role}/dashboard`, { replace: true });
    }
  }, [profile, navigate]);

  // Form validation schema
  const validationSchema = {
    email: composeValidators(validators.required, validators.email),
    password: composeValidators(validators.required, validators.minLength(6)),
  };

  // Form hook with validation
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '' },
    (values) => {
      const errors = {};
      Object.keys(validationSchema).forEach((field) => {
        const error = validationSchema[field](values[field]);
        if (error) errors[field] = error;
      });
      return errors;
    }
  );

  // Submit handler
  const onSubmit = handleSubmit(async (formValues) => {
    setLoginError('');
    setIsSubmitting(true);
    try {
      await login(formValues.email, formValues.password);
      // Redirect happens in useEffect when profile is set
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  });

  const isLoading = loading || isSubmitting;

  return (
    <div className="min-h-screen bg-linear-to-br from-surface via-bg to-surface dark:from-surface-dark dark:via-bg-dark dark:to-surface-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-brand/5 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-brand to-brand dark:from-brand-light dark:to-brand rounded-3xl mb-6 shadow-2xl shadow-brand/30 transform hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-11 h-11 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-3 tracking-tight">
            Welcome to CoachPro
          </h1>
          <p className="text-text-muted dark:text-text-muted-dark text-lg">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-8 shadow-lg">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-text-muted dark:text-text-muted-dark group-focus-within:text-brand transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your.email@coachpro.com"
                  className={`w-full bg-bg dark:bg-bg-dark border ${
                    touched.email && errors.email 
                      ? 'border-danger dark:border-danger-dark focus:ring-danger dark:focus:ring-danger-dark' 
                      : 'border-border dark:border-border-dark focus:border-brand dark:focus:border-brand-light focus:ring-brand dark:focus:ring-brand-light'
                  } rounded-lg pl-12 pr-4 py-3.5 text-text-primary dark:text-text-primary-dark placeholder-text-muted dark:placeholder-text-muted-dark focus:outline-none focus:ring-2 transition-all duration-200`}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-danger dark:text-danger-dark text-sm mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-danger dark:bg-danger-dark"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-text-muted dark:text-text-muted-dark group-focus-within:text-brand transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full bg-bg dark:bg-bg-dark border ${
                    touched.password && errors.password 
                      ? 'border-danger dark:border-danger-dark focus:ring-danger dark:focus:ring-danger-dark' 
                      : 'border-border dark:border-border-dark focus:border-brand dark:focus:border-brand-light focus:ring-brand dark:focus:ring-brand-light'
                  } rounded-lg pl-12 pr-4 py-3.5 text-text-primary dark:text-text-primary-dark placeholder-text-muted dark:placeholder-text-muted-dark focus:outline-none focus:ring-2 transition-all duration-200`}
                />
              </div>
              {touched.password && errors.password && (
                <p className="text-danger dark:text-danger-dark text-sm mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-danger dark:bg-danger-dark"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Error Message */}
            {loginError && (
              <ErrorMessage 
                message={loginError} 
                onClose={() => setLoginError('')} 
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand dark:bg-brand-light hover:bg-brand/90 dark:hover:bg-brand text-white font-bold py-3.5 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-3 border-t border-border dark:border-border-dark pt-6">
            <p className="text-text-muted dark:text-text-muted-dark text-sm">
              Need an account?{' '}
              <Link to="#" className="text-brand dark:text-brand-light hover:underline font-medium transition-colors">
                Contact your administrator
              </Link>
            </p>
            <Link 
              to="/" 
              className="inline-block text-text-muted dark:text-text-muted-dark hover:text-text-primary dark:hover:text-text-primary-dark text-sm transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
