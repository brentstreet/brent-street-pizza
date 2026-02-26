import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Facebook, Instagram } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="w-full bg-white relative">
      {/* Red Top Bar */}
      <div className="bg-brand-red py-2">
        <div className="container-custom flex justify-end gap-6">
          <a href="tel:0452135367" className="text-white font-oswald text-[12px] flex items-center gap-2 hover:text-brand-gold transition-colors tracking-widest">
            <Phone className="w-3 h-3" /> 0452 135 367
          </a>
          <div className="flex gap-4">
            <a href="https://facebook.com" className="text-white hover:text-brand-gold transition-colors">
              <Facebook className="w-3 h-3" />
            </a>
            <a href="https://instagram.com" className="text-white hover:text-brand-gold transition-colors">
              <Instagram className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="container-custom py-2 flex items-center justify-between">

        {/* Left: Logo */}
        <Link to="/" className="flex flex-col items-start">
          <div className="flex items-end gap-1 font-bangers text-2xl md:text-3xl tracking-heading text-gray-900 leading-none">
            BRENT STREET <span className="text-brand-red ml-1">🍕</span>
          </div>
          <div className="font-bangers text-2xl md:text-3xl tracking-heading text-brand-red leading-none">
            PIZZA
          </div>
        </Link>

        {/* Center: Nav links */}
        <nav className="hidden lg:flex items-center gap-8 text-[14px] font-oswald uppercase text-gray-800 tracking-wider">
          <Link to="/" className={`transition-colors ${currentPath === '/' ? 'text-brand-red font-bold' : 'hover:text-brand-red'}`}>Home</Link>
          <Link to="/menu" className={`transition-colors ${currentPath === '/menu' ? 'text-brand-red font-bold' : 'hover:text-brand-red'}`}>Menu</Link>
          <Link to="/trading-hours" className={`transition-colors ${currentPath === '/trading-hours' ? 'text-brand-red font-bold' : 'hover:text-brand-red'}`}>Trading Hours</Link>
          <Link to="/contact" className={`transition-colors ${currentPath === '/contact' ? 'text-brand-red font-bold' : 'hover:text-brand-red'}`}>Contact Us</Link>
        </nav>

        {/* Right: Order Now Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link to="/menu" className="hidden sm:block bg-brand-gold text-brand-darkred font-oswald font-bold uppercase py-2 px-6 rounded-full text-[14px] hover:bg-yellow-400 hover:scale-105 transition-all shadow-md">
            ORDER NOW
          </Link>
          <button
            className="text-gray-800 hover:text-brand-red transition-colors lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-brand-dark flex flex-col items-center justify-center animate-in fade-in duration-300">
          <button
            className="absolute top-6 right-6 text-white hover:text-brand-red transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>

          <nav className="flex flex-col items-center gap-8 text-2xl font-bangers tracking-widest text-white">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`transition-colors ${currentPath === '/' ? 'text-brand-red' : 'hover:text-brand-red'}`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`transition-colors ${currentPath === '/menu' ? 'text-brand-red' : 'hover:text-brand-red'}`}
            >
              Menu
            </Link>
            <Link
              to="/trading-hours"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`transition-colors ${currentPath === '/trading-hours' ? 'text-brand-red' : 'hover:text-brand-red'}`}
            >
              Trading Hours
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`transition-colors ${currentPath === '/contact' ? 'text-brand-red' : 'hover:text-brand-red'}`}
            >
              Contact Us
            </Link>
          </nav>

          <div className="mt-12 flex flex-col items-center gap-4 border-t border-gray-700 pt-8 w-64">
            <a href="tel:0452135367" className="flex items-center gap-2 text-brand-gold font-oswald text-xl tracking-wider hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
              0452 135 367
            </a>

            <div className="flex gap-4 mt-2">
              <a href="https://www.facebook.com/share/174d5Ujnn1/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-brand-red transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/brentstreetstore?igsh=MXNkd3F1cnBqeTFjbw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-brand-red transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Navbar;
