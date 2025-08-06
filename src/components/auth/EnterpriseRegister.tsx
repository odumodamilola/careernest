import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Eye, EyeOff, AlertCircle, Loader2, Shield, CheckCircle, Award, Users, Briefcase, GraduationCap } from 'lucide-react';

export function EnterpriseRegister() {
  const navigate = useNavigate();
  const { register, loading, error, clearError, isConfigured } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('trial');
  const [planTier, setPlanTier] = useState('free');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      errors.terms = 'You must agree to the Terms of Service';
    }
    
    if (!agreedToPrivacy) {
      errors.privacy = 'You must agree to the Privacy Policy';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(email.trim(), password, {
        fullName: fullName.trim(),
        role,
        planTier,
        acceptedTerms: agreedToTerms,
        acceptedPrivacy: agreedToPrivacy
      });
      navigate('/onboarding');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const roleOptions = [
    { 
      value: 'trial', 
      label: 'Student/Job Seeker', 
      description: 'Looking for career guidance and opportunities',
      icon: GraduationCap,
      color: 'bg-blue-50 border-blue-200 text-blue-900'
    },
    { 
      value: 'standard', 
      label: 'Professional', 
      description: 'Advancing your career and skills',
      icon: Briefcase,
      color: 'bg-green-50 border-green-200 text-green-900'
    },
    { 
      value: 'premium', 
      label: 'Mentor/Expert', 
      description: 'Sharing expertise and mentoring others',
      icon: Award,
      color: 'bg-purple-50 border-purple-200 text-purple-900'
    },
    { 
      value: 'admin', 
      label: 'Organization', 
      description: 'Educational institution or company',
      icon: Users,
      color: 'bg-orange-50 border-orange-200 text-orange-900'
    }
  ];

  const planOptions = [
    {
      value: 'free',
      label: 'Free Plan',
      description: '50 AI messages, 5 mentor matches',
      price: '$0/month',
      features: ['Basic AI mentorship', 'Limited matches', 'Community access']
    },
    {
      value: 'starter',
      label: 'Starter Plan',
      description: '200 AI messages, 20 mentor matches',
      price: '$19/month',
      features: ['Enhanced AI features', 'Priority matching', 'Video calls']
    },
    {
      value: 'pro',
      label: 'Pro Plan',
      description: '1000 AI messages, 100 mentor matches',
      price: '$49/month',
      features: ['Unlimited AI access', 'Premium mentors', 'Career analytics']
    }
  ];

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
            <img src="https://i.ibb.co/35dJPQYC/69b30072-b992-4df8-93fe-f1590f420033.png" alt="CareerNest" className="mx-auto h-8 w-auto mt-4" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Configuration Required
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please set up your Supabase environment variables to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <img src="https://i.ibb.co/35dJPQYC/69b30072-b992-4df8-93fe-f1590f420033.png" alt="CareerNest" className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join CareerNest
          </h2>
          <p className="text-gray-600">
            Start your journey with AI-powered career development
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (validationErrors.fullName) {
                          setValidationErrors(prev => ({ ...prev, fullName: undefined }));
                        }
                      }}
                      className={`input ${validationErrors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter your full name"
                      disabled={loading}
                    />
                    {validationErrors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationErrors.email) {
                          setValidationErrors(prev => ({ ...prev, email: undefined }));
                        }
                      }}
                      className={`input ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationErrors.password) {
                          setValidationErrors(prev => ({ ...prev, password: undefined }));
                        }
                      }}
                      className={`input pr-10 ${validationErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Create a password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    {validationErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                    Confirm Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (validationErrors.confirmPassword) {
                          setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
                        }
                      }}
                      className={`input pr-10 ${validationErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Confirm your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    {validationErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-3">
                  I am a:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRole(option.value)}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          role === option.value
                            ? option.color
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                        disabled={loading}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-6 w-6" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-3">
                  Choose your plan:
                </label>
                <div className="space-y-3">
                  {planOptions.map((plan) => (
                    <div
                      key={plan.value}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        planTier === plan.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setPlanTier(plan.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            checked={planTier === plan.value}
                            onChange={() => setPlanTier(plan.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{plan.label}</div>
                            <div className="text-sm text-gray-600">{plan.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{plan.price}</div>
                        </div>
                      </div>
                      <div className="mt-2 ml-7">
                        <div className="flex flex-wrap gap-2">
                          {plan.features.map((feature, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Terms and Privacy */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (validationErrors.terms) {
                        setValidationErrors(prev => ({ ...prev, terms: undefined }));
                      }
                    }}
                    className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 mt-1 ${
                      validationErrors.terms ? 'border-red-500' : ''
                    }`}
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
                      Terms of Service
                    </Link>
                  </label>
                </div>
                {validationErrors.terms && (
                  <p className="text-sm text-red-600 ml-6">{validationErrors.terms}</p>
                )}

                <div className="flex items-start">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    checked={agreedToPrivacy}
                    onChange={(e) => {
                      setAgreedToPrivacy(e.target.checked);
                      if (validationErrors.privacy) {
                        setValidationErrors(prev => ({ ...prev, privacy: undefined }));
                      }
                    }}
                    className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 mt-1 ${
                      validationErrors.privacy ? 'border-red-500' : ''
                    }`}
                    disabled={loading}
                  />
                  <label htmlFor="privacy" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {validationErrors.privacy && (
                  <p className="text-sm text-red-600 ml-6">{validationErrors.privacy}</p>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Create secure account
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>

          {/* Security Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-green-500" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-blue-500" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="h-3 w-3 text-purple-500" />
                <span>SOC 2 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}