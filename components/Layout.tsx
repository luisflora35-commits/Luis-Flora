
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  PawPrint, 
  ShoppingCart, 
  User as UserIcon, 
  Search, 
  Menu, 
  X,
  LogOut,
  LayoutDashboard,
  MapPin,
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { VoiceAssistant } from './VoiceAssistant';
import { AIChatbot } from './AIChatbot';

const Navbar = () => {
  const { user, cart, logout } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Browse', path: '/browse' },
    { name: 'Home', path: '/' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-orange-400 p-2 rounded-xl">
              <PawPrint className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">Pawfect Match</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user?.role === UserRole.CUSTOMER && (
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 p-1 px-3 bg-gray-50 rounded-full border border-gray-200 hover:bg-gray-100 transition-all"
                >
                  <img src={user.avatar} className="w-8 h-8 rounded-full border border-orange-200" alt="avatar" />
                  <span className="text-xs font-semibold text-gray-700 hidden sm:inline">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-all shadow-md shadow-orange-200">
                Sign In
              </Link>
            )}

            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-600 font-medium py-2"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-orange-400 p-2 rounded-xl">
                <PawPrint className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-800">Pawfect Match</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Connecting pets with their forever families since 2024. The most trusted platform for pet adoption and sales in India.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <MapPin size={16} className="text-orange-500 flex-shrink-0" />
                <span><span className="font-bold">Head Office:</span> Nalgonda, Telangana, India</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Mail size={16} className="text-orange-500 flex-shrink-0" />
                <span>pawmart745@gmail.com</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link to="/browse" className="hover:text-orange-500">Find a Pet</Link></li>
              <li><Link to="/auth" className="hover:text-orange-500">Sell a Pet</Link></li>
              <li><a href="#" className="hover:text-orange-500">Success Stories</a></li>
              <li><a href="#" className="hover:text-orange-500">Pet Care Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><a href="#" className="hover:text-orange-500">Safety Tips</a></li>
              <li><a href="#" className="hover:text-orange-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-500">Terms of Service</a></li>
              <li><a href="#" className="hover:text-orange-500">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-6">Newsletter</h4>
            <p className="text-sm text-gray-500 mb-4">Get updates on new arrivals and pet care tips.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm flex-1 outline-none focus:ring-2 focus:ring-orange-200"
              />
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">© 2024 Pawfect Match Marketplace. Registered Office: Nalgonda. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Search size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><ShoppingCart size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><UserIcon size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50/30">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <VoiceAssistant />
      <AIChatbot />
    </div>
  );
};
