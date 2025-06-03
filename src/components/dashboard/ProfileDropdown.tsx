'use client';

import { ChevronDown, LogOut, Store, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEV_FRONTEND_URL, FRONTEND_URL, isDevelopment } from '../../config/constants';
import { useAuth } from '../../providers/AuthProvider/AuthContext';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
      setIsOpen(false);
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Main Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 transform hover:shadow-2xl hover:shadow-blue-500/25"
        >
          {/* Background Gradient Animation */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.3) 0%, transparent 70%)`,
            }}
          />

          {/* Avatar with Glow Effect */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
          </div>

          {/* User Info */}
          <div className="hidden md:block text-left relative z-10">
            <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
              {user.username}
            </p>
            <p className="text-xs text-slate-400 group-hover:text-purple-300 transition-colors duration-300">
              {user.role}
            </p>
          </div>

          {/* Chevron with Animation */}
          <ChevronDown
            size={16}
            className={`text-slate-400 group-hover:text-blue-400 transition-all duration-300 ${
              isOpen ? 'rotate-180 text-blue-400' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Animated Background */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50" />
            <div className="absolute top-4 left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />

            {/* User Info Section */}
            <div className="relative px-6 py-4 border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-blue-500/30">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-sm" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-lg">{user.username}</p>
                  <p className="text-sm text-slate-300">{user.email || 'No email provided'}</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/30 mt-2">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Shop Names Section */}
            <div className="relative px-6 py-4 border-b border-white/10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 rounded-lg flex items-center justify-center">
                  <Store size={16} className="text-cyan-400" />
                </div>
                <span className="text-sm font-semibold text-white">Your Shops</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 border border-slate-500/30">
                  {user.shops.length}
                </span>
              </div>
              <div className="space-y-2 overflow-y-auto custom-scrollbar">
                {user.shops.map((shop, index) => {
                  const shopName = typeof shop === 'string' ? shop : shop.name || shop.displayName;
                  const baseUrl = isDevelopment ? DEV_FRONTEND_URL : FRONTEND_URL;
                  const shopUrl = `https://${shopName}.${new URL(baseUrl).host}`;

                  return (
                    <button
                      key={index}
                      onClick={() => window.open(shopUrl, '_blank')}
                      className="group w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white bg-gradient-to-r from-white/5 to-white/5 hover:from-blue-500/20 hover:to-purple-500/20 rounded-xl transition-all duration-300 flex items-center justify-between border border-transparent hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <span className="font-medium">
                        {typeof shop === 'string' ? shop : shop.displayName || shop.name}
                      </span>
                      <svg
                        className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menu Items */}
            <div className="relative px-6 py-2">
              <button
                onClick={() => setIsOpen(false)}
                className="group w-full px-4 py-3 text-left text-sm text-slate-300 hover:text-white bg-gradient-to-r from-white/5 to-white/5 hover:from-green-500/20 hover:to-emerald-500/20 rounded-xl flex items-center space-x-3 transition-all duration-300 border border-transparent hover:border-green-400/30 hover:shadow-lg hover:shadow-green-500/20"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <User size={14} className="text-green-400" />
                </div>
                <span>Profile Settings</span>
              </button>
            </div>

            {/* Logout Button */}
            <div className="relative border-t border-white/10 px-6 py-2 mt-2">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="group w-full px-4 py-3 text-left text-sm text-slate-300 hover:text-white bg-gradient-to-r from-white/5 to-white/5 hover:from-red-500/20 hover:to-red-600/20 rounded-xl flex items-center space-x-3 transition-all duration-300 border border-transparent hover:border-red-400/30 hover:shadow-lg hover:shadow-red-500/20"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-red-500/30 to-red-600/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <LogOut size={14} className="text-red-400" />
                </div>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            {/* Background Effects */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-red-600/5 opacity-50" />
            <div className="absolute top-4 right-4 w-20 h-20 bg-red-500/10 rounded-full blur-xl" />

            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/30 to-red-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
                <LogOut className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Sign Out</h3>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Are you sure you want to sign out of your account?
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 text-slate-200 rounded-xl hover:from-slate-600 hover:to-slate-500 transition-all duration-300 font-medium border border-slate-500/30 hover:border-slate-400/50 hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 transform"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;
