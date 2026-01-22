
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User as UserIcon, Store, Mail, Lock, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500">Sign in to your Pawfect Match account</p>
          </div>

          <div className="flex p-1 bg-gray-50 rounded-2xl gap-1">
            <button 
              onClick={() => setRole(UserRole.CUSTOMER)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === UserRole.CUSTOMER ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <UserIcon size={18} /> Customer
            </button>
            <button 
              onClick={() => setRole(UserRole.SELLER)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === UserRole.SELLER ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Store size={18} /> Seller
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
                <a href="#" className="text-xs text-orange-500 font-bold hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2 group"
            >
              Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <span className="relative bg-white px-4 text-xs font-medium text-gray-400 uppercase">New to Pawfect Match?</span>
          </div>

          <button className="w-full bg-white border-2 border-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:border-orange-200 transition-all">
            Create Free Account
          </button>

          <div className="flex items-center gap-2 justify-center text-[10px] text-gray-400 font-medium">
            <ShieldCheck size={12} className="text-emerald-500" /> Your data is encrypted and secure
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
