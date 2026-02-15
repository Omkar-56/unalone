import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Email verification states
  const [verificationStep, setVerificationStep] = useState('form');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const res = await API.post("/auth/send-otp", { email: formData.email });
      console.log("OTP Sent:", res.data);
      setOtpSent(true);
      setVerificationStep('otp');
      setSuccess('OTP sent to your email!');
      setTimer(60);
      
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const res = await API.post("/auth/verify-otp", { 
        email: formData.email, 
        otp 
      });
      console.log("OTP Verified:", res.data);
      setIsVerified(true);
      setVerificationStep('verified');
      setSuccess('Email verified successfully!');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    if (!isVerified) {
      setError('Please verify your email first');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const result = await registerUser(formData);
    
    if (result.success) {
      setSuccess('Account created successfully! Redirecting...');
      
      // Redirect to home/dashboard after successful registration
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    return { strength: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Join Unalone and start connecting</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={verificationStep === 'otp'}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Full Name"
                />
              </div>
            </div>

            {/* Email Input with Verification */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={otpSent}
                  className="w-full pl-12 pr-32 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Email Address"
                />
                {!isVerified && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isLoading || !formData.email || timer > 0}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {timer > 0 ? `${timer}s` : otpSent ? 'Resend' : 'Verify'}
                  </button>
                )}
                {isVerified && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-2 bg-green-50 rounded-lg">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* OTP Input Section */}
            {verificationStep === 'otp' && !isVerified && (
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  <p className="text-sm font-medium text-indigo-900">Enter verification code</p>
                </div>
                <p className="text-xs text-indigo-700 mb-3">
                  We've sent a 6-digit code to {formData.email}
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setOtp(value);
                      setError('');
                    }}
                    placeholder="000000"
                    className="flex-1 px-4 py-3 bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg font-semibold tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Password Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={verificationStep === 'otp' && !isVerified}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                  agreedToTerms
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'border-gray-300 hover:border-indigo-400'
                }`}
              >
                {agreedToTerms && <Check className="h-3.5 w-3.5 text-white" />}
              </button>
              <label className="text-sm text-gray-600 leading-relaxed">
                I agree to the{' '}
                <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreedToTerms || !isVerified}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
