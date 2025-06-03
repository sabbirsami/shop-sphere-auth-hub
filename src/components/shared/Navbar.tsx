'use client';

import { LogOut, Store } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider/AuthContext';
import Register from '../auth/Register';
import SignIn from '../auth/SignIn';
import Logo from '../icons/Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfile(false);
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
        <div className="flex items-center space-x-3">
          {/* Logo Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl">
            <Logo className="w-10 h-10" />
          </div>

          {/* Content Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 ps-6 pe-3 py-3 flex items-center space-x-16 rounded-xl text-white relative">
            <h2 className="text-lg font-semibold whitespace-nowrap">ShopSphere</h2>

            {!user && <div className="h-[1px] w-40 bg-white/20 rounded-full"></div>}
            {user && <div className="h-[1px] w-16 bg-white/20 rounded-full"></div>}

            {user ? (
              <div className="flex items-center space-x-4">
                <div
                  className="flex items-center space-x-3 px-4 py-2 bg-white/20 rounded-lg text-white cursor-pointer hover:bg-white/30 transition-all duration-200 border border-white/20"
                  onClick={() => setShowProfile((prev) => !prev)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user.username}</span>
                </div>
                <NavLink
                  to={'/dashboard'}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  Dashboard
                </NavLink>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Get Started
              </button>
            )}

            {/* Profile dropdown */}
            {user && showProfile && (
              <div className="absolute right-0 top-16 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 text-black overflow-hidden">
                {/* User Info */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.email || 'No email provided'}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mt-1">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shop Names */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <Store size={16} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">Your Shops</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {user.shops.length}
                    </span>
                  </div>
                </div>

                {/* Logout */}
                <div className="p-6">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center space-x-3 text-red-600 hover:text-red-700 w-full p-3 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Out</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to sign out of your account?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <SignIn
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSwitchToRegister={() => {
          setIsSignInModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <Register
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToSignIn={() => {
          setIsRegisterModalOpen(false);
          setIsSignInModalOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;
