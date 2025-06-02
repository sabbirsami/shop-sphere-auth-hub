import { Eye, EyeOff, Lock, LogIn, Shield, User, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  username: string;
  password: string;
  rememberMe: boolean;
};

type SignInProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
};

const SignIn = ({ isOpen, onClose, onSwitchToRegister }: SignInProps) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setServerError('');
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Login data:', data);

      // Simulate successful login
      onClose();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-all duration-200"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <LogIn size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome Back</h2>
              <p className="text-emerald-100 text-sm">Sign in to your account</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Server Error */}
          {serverError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
              <X size={16} />
              {serverError}
            </div>
          )}

          <div className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User size={16} />
                Username
              </label>
              <div className="relative">
                <input
                  {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' },
                  })}
                  className={`w-full p-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                    errors.username
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <X size={14} />
                    {errors.username.message}
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock size={16} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className={`w-full p-3 pr-12 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <X size={14} />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register('rememberMe')}
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-700 flex items-center gap-1"
                >
                  <Shield size={14} />
                  Remember me (7 days)
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  Sign In
                </div>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">New to our platform?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <button
                onClick={() => {
                  onClose();
                  onSwitchToRegister();
                }}
                className="w-full py-3 px-4 border-2 border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-all duration-200"
              >
                Create New Account
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Shield size={14} />
              <span>Your data is protected with end-to-end encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
