import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { useDemo } from '../../hooks/useDemo';
import { validators, composeValidators } from '../../utils/validation';
import { logDemoStatus } from '../../utils/demo';
import RoleTabs from '../../components/UI/RoleTabs';
import ErrorMessage from '../../components/UI/ErrorMessage';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { isDemoEnabled, handleDemoLogin } = useDemo();
  
  const [selectedRole, setSelectedRole] = useState('student');
  const [loginError, setLoginError] = useState('');

  // Log demo status on mount
  useEffect(() => {
    logDemoStatus();
  }, []);

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
    const result = await login(formValues.email, formValues.password);

    if (result.success) {
      navigate(`/${result.user.role}/dashboard`);
    } else {
      setLoginError(result.error);
    }
  });

  // Quick demo login handler
  const handleQuickLogin = async (role) => {
    setLoginError('');
    const result = await handleDemoLogin(role);

    if (!result.success) {
      setLoginError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-100 to-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold via-[#FFE55C] to-primary rounded-3xl mb-6 shadow-2xl shadow-gold/30 transform hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-11 h-11 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Welcome to CoachPro
          </h1>
          <p className="text-gray-400 text-lg">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-dark-100/80 backdrop-blur-xl border border-dark-300/50 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Login As
              </label>
              <RoleTabs
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-gold transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your.email@coachpro.com"
                  className={`w-full bg-dark-200/50 border ${
                    touched.email && errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-dark-300 focus:border-gold focus:ring-gold'
                  } rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200`}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-gold transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full bg-dark-200/50 border ${
                    touched.password && errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-dark-300 focus:border-gold focus:ring-gold'
                  } rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200`}
                />
              </div>
              {touched.password && errors.password && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400"></span>
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
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold via-[#FFE55C] to-gold hover:from-[#FFE55C] hover:to-gold text-dark font-bold py-4 px-6 rounded-xl hover:shadow-2xl hover:shadow-gold/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="border-dark" />
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

          {/* Demo Quick Login - Development Only */}
          {isDemoEnabled && (
            <div className="mt-8 pt-6 border-t border-dark-300/50">
              <div className="text-center mb-4">
                <span className="text-sm text-gray-400">Quick Login (Demo)</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleQuickLogin('admin')}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 bg-dark-200/50 hover:bg-dark-200 border border-dark-300 hover:border-gold/50 rounded-xl py-4 px-3 transition-all duration-200 disabled:opacity-50 group"
                >
                  <div className="w-10 h-10 bg-gold/10 group-hover:bg-gold/20 rounded-full flex items-center justify-center transition-colors">
                    <User className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-white text-sm font-medium">Admin</span>
                </button>

                <button
                  onClick={() => handleQuickLogin('teacher')}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 bg-dark-200/50 hover:bg-dark-200 border border-dark-300 hover:border-gold/50 rounded-xl py-4 px-3 transition-all duration-200 disabled:opacity-50 group"
                >
                  <div className="w-10 h-10 bg-primary/10 group-hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-white text-sm font-medium">Teacher</span>
                </button>

                <button
                  onClick={() => handleQuickLogin('student')}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 bg-dark-200/50 hover:bg-dark-200 border border-dark-300 hover:border-gold/50 rounded-xl py-4 px-3 transition-all duration-200 disabled:opacity-50 group"
                >
                  <div className="w-10 h-10 bg-green-500/10 group-hover:bg-green-500/20 rounded-full flex items-center justify-center transition-colors">
                    <User className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-white text-sm font-medium">Student</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="#" className="text-gold hover:text-[#FFE55C] font-medium transition-colors">
                Contact Admin
              </Link>
            </p>
            <Link 
              to="/" 
              className="inline-block text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Dev Mode Indicator */}
        {isDemoEnabled && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-2 text-xs text-gold/60 bg-gold/5 px-3 py-1.5 rounded-full border border-gold/10">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              Development Mode
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
