import '../../index.css';
import Logo from '../icons/Logo';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
      <div className="flex items-center gap-2">
        {/* Logo Section */}
        <div className="bg-white/15 backdrop-blur-sm p-3 rounded-lg">
          <Logo className="w-10 h-10" />
        </div>

        {/* Content Section */}
        <div className="bg-white/15 backdrop-blur-sm p-2 flex items-center gap-16 rounded-lg ps-6 text-white">
          <h2 className="text-lg  whitespace-nowrap">Shop Sphere Auth Hub</h2>

          <button className="px-8 py-3 bg-[#756FB3] rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
