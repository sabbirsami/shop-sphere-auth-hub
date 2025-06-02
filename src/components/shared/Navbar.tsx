import { useState } from 'react';
import '../../index.css';
import { useAuth } from '../../providers/AuthProvider/AuthContext';
import Register from '../auth/Register';
import SignIn from '../auth/SignIn';
import Logo from '../icons/Logo';

const Navbar = () => {
  const { user } = useAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          {/* Logo Section */}
          <div className="bg-white/15 backdrop-blur-sm p-3 rounded-lg">
            <Logo className="w-10 h-10" />
          </div>

          {/* Content Section */}
          <div className="bg-white/15 backdrop-blur-sm p-2 flex items-center gap-16 rounded-lg ps-6 text-white">
            <h2 className="text-lg whitespace-nowrap">Shop Sphere Auth Hub</h2>

            {user ? (
              <div className="flex items-center gap-4 px-6 py-2 bg-[#756FB3]/50 rounded-lg text-white">
                <div className="w-8 h-8 rounded-full  bg-purple-500 flex items-center justify-center text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span>{user.username}</span>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInModalOpen(true)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600  rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </header>

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
