'use client';

import { Check, Eye, EyeOff, Lock, Plus, Store, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useAuth } from '../../providers/AuthProvider/AuthContext';
import toast from 'react-hot-toast';

type FormValues = {
  username: string;
  password: string;
  shops: { name: string }[];
};

type RegisterProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
};

const Register = ({ isOpen, onClose, onSwitchToSignIn }: RegisterProps) => {
  const { userRegister, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [duplicateErrors, setDuplicateErrors] = useState<{ [key: number]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: { shops: [{ name: '' }, { name: '' }, { name: '' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'shops' });
  const shops = watch('shops');

  // Watch password field for real-time validation
  const password = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  // Update password strength when password changes
  useEffect(() => {
    if (password) {
      const strength = {
        length: password.length >= 8,
        number: /\d/.test(password),
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        specialChar: /[^a-zA-Z0-9]/.test(password),
      };
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({
        length: false,
        number: false,
        uppercase: false,
        lowercase: false,
        specialChar: false,
      });
    }
  }, [password]);

  // Enhanced real-time duplicate validation
  useEffect(() => {
    if (shops) {
      const newDuplicateErrors: { [key: number]: string } = {};
      const shopNamesMap = new Map<string, number[]>();

      // Build a map of shop names to their indices
      shops.forEach((shop, index) => {
        const trimmedName = shop.name.trim().toLowerCase();
        if (trimmedName) {
          if (!shopNamesMap.has(trimmedName)) {
            shopNamesMap.set(trimmedName, []);
          }
          shopNamesMap.get(trimmedName)?.push(index);
        }
      });

      // Mark all duplicate indices
      shopNamesMap.forEach((indices) => {
        if (indices.length > 1) {
          indices.forEach((index) => {
            newDuplicateErrors[index] = `"${shops[index].name.trim()}" is already used`;
          });
        }
      });

      setDuplicateErrors(newDuplicateErrors);
    }
  }, [shops]);

  const onSubmit = async (data: FormValues) => {
    try {
      clearError();
      const shopNames = data.shops.map((s) => s.name.trim()).filter(Boolean);

      if (shopNames.length < 3) {
        return;
      }

      const lowerCaseNames = shopNames.map((name) => name.toLowerCase());
      if (new Set(lowerCaseNames).size !== lowerCaseNames.length) {
        return;
      }

      const result = await userRegister({
        username: data.username,
        password: data.password,
        shops: shopNames,
      });

      if (result.success) {
        reset();
        setRegistrationSuccess(true);
        onClose();
        toast('Successfully registered! Please log in.', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#4caf50',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '10px 20px',
          },
          className: 'font-semibold text-center',
          icon: '🎉',
          iconTheme: {
            primary: '#fff',
            secondary: '#4caf50',
          },
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
          removeDelay: 1000,
        });
        // window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrengthScore = () => {
    return Object.values(passwordStrength).filter(Boolean).length;
  };

  const getPasswordStrengthColor = () => {
    const score = getPasswordStrengthScore();
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    const score = getPasswordStrengthScore();
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-all duration-200"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <Store size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create Account</h2>
              <p className="text-blue-100 text-sm">Join our platform today</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {registrationSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
              <Check size={16} />
              Successfully registered! Please log in.
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Server Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                <X size={16} />
                {error}
              </div>
            )}

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
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    validate: {
                      hasNumber: (value) =>
                        /[0-9]/.test(value) || 'Password must contain at least one number',
                      hasSpecialChar: (value) =>
                        /[^A-Za-z0-9]/.test(value) ||
                        'Password must contain at least one special character',
                    },
                  })}
                  className={`w-full p-3 pr-12 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Password Strength</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${getPasswordStrengthColor()}`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(getPasswordStrengthScore() / 5) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {[
                      { key: 'length', text: '8+ characters', check: passwordStrength.length },
                      { key: 'number', text: 'Number', check: passwordStrength.number },
                      {
                        key: 'specialChar',
                        text: 'Special character',
                        check: passwordStrength.specialChar,
                      },
                    ].map(({ key, text, check }) => (
                      <div key={key} className="flex items-center gap-2">
                        {check ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-gray-400" />
                        )}
                        <span className={check ? 'text-green-600' : 'text-gray-500'}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.password && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <X size={14} />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Shop Names Field */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Store size={16} />
                  Shop Names
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    Min 3 required
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => append({ name: '' })}
                  disabled={fields.length >= 4}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors duration-200"
                >
                  <Plus size={16} />
                  Add Shop
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <div className="flex-1 space-y-1">
                      <div className="relative">
                        <input
                          {...register(`shops.${index}.name`, {
                            required: index < 3 ? `Shop ${index + 1} name is required` : false,
                            pattern: {
                              value: /^[a-zA-Z0-9\s-]+$/,
                              message: 'Only letters, numbers, spaces, and hyphens allowed',
                            },
                            minLength: {
                              value: 2,
                              message: 'Shop name must be at least 2 characters',
                            },
                          })}
                          className={`w-full p-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                            duplicateErrors[index] || errors.shops?.[index]?.name
                              ? 'border-red-300 focus:border-red-500 bg-red-50'
                              : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                          }`}
                          placeholder={`Shop ${index + 1} name`}
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Show field-specific errors */}
                      {errors.shops?.[index]?.name && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <X size={12} />
                          {errors.shops[index]?.name?.message}
                        </div>
                      )}

                      {/* Show duplicate error with enhanced styling */}
                      {duplicateErrors[index] && (
                        <div className="flex items-center gap-1 text-red-600 text-xs bg-red-50 p-2 rounded border border-red-200">
                          <X size={12} />
                          {duplicateErrors[index]}
                        </div>
                      )}
                    </div>

                    {fields.length > 3 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-3 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                        title="Remove shop"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || Object.keys(duplicateErrors).length > 0}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                loading || Object.keys(duplicateErrors).length > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToSignIn();
                }}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
