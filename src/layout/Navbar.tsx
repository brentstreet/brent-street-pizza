import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X, Phone, ShoppingCart } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const { cartTotalItems } = useCart();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bounce cart icon when count changes
  useEffect(() => {
    if (cartTotalItems > 0) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(t);
    }
  }, [cartTotalItems]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'MENU', path: '/menu' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      <nav
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-[#1a0a00]/98 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5'
          : 'bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm'
          }`}
        style={{ height: scrolled ? '68px' : '80px' }}
      >
        <div className="container-custom h-full flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center z-50 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5">
            <Logo className="w-16 h-16 md:w-20 md:h-20" innerClassName="scale-[1.1]" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, idx) => (
              <React.Fragment key={link.name}>
                <Link
                  to={link.path}
                  className={`font-barlow text-[15px] font-600 uppercase tracking-[0.1em] transition-all duration-300 px-3 py-1 rounded relative group ${currentPath === link.path
                    ? 'text-[#d4a017]'
                    : 'text-white/80 hover:text-white'
                    }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-3 right-3 h-[1px] bg-[#d4a017] transition-all duration-300 ${currentPath === link.path ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`} />
                </Link>
                {idx < navLinks.length - 1 && (
                  <span className="text-white/20 text-xs select-none">·</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Right: Phone + Cart + CTA */}
          <div className="flex items-center gap-4 md:gap-5">
            <a
              href="tel:0455123678"
              className="hidden md:flex items-center gap-2 text-white/70 hover:text-[#d4a017] transition-colors duration-300 group"
            >
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-barlow font-700 text-[15px] tracking-wider">0455 123 678</span>
            </a>

            <Link
              to="/menu"
              className={`relative flex items-center gap-1 cursor-pointer transition-all duration-300 text-white/80 hover:text-white ${cartBounce ? 'scale-125' : 'scale-100'}`}
              style={{ transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#C0392B] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(192,57,43,0.6)] border border-white/20">
                  {cartTotalItems}
                </span>
              )}
            </Link>

            <Link
              to="/menu"
              className="hidden sm:flex btn-primary text-[14px] px-5 py-2.5"
            >
              ORDER NOW <span className="text-lg leading-none">›</span>
            </Link>

            {/* Mobile Toggle */}
            <button
              id="mobile-menu-toggle"
              className="lg:hidden text-white p-1"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-[300px] bg-[#1a0a00] border-l border-white/10 transition-transform duration-500 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="p-6 flex justify-between items-center border-b border-white/10">
            <Logo className="w-14 h-14" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <X className="w-7 h-7" />
            </button>
          </div>
          <div className="flex flex-col gap-2 p-6 flex-grow">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-barlow text-[28px] font-700 tracking-widest uppercase transition-all px-2 py-3 border-b border-white/5 ${currentPath === link.path ? 'text-[#d4a017]' : 'text-white/70 hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="p-6 border-t border-white/10">
            <a href="tel:0455123678" className="flex items-center gap-3 text-white/60 hover:text-[#d4a017] transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-barlow text-[20px] font-700 tracking-wider">0455 123 678</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
