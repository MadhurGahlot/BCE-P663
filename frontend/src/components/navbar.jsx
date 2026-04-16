import React from 'react';
import { useAuth } from '../context/authcontext';
import { Bell, Search, ChevronDown, User as UserIcon, Globe } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-18 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search academic records, students, or reports..."
            className="w-full bg-slate-800/50 pl-11 pr-4 py-2.5 rounded-xl border border-slate-700 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm outline-none text-slate-200 placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center space-x-5">
        <div className="hidden md:flex items-center space-x-1 text-slate-500 px-3 py-1.5 rounded-full bg-slate-800/30 border border-slate-700/30">
          <Globe className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">GKV Network</span>
        </div>

        <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></span>
        </button>

        <div className="h-8 w-px bg-slate-800 mx-1"></div>

        <button className="flex items-center space-x-3 pl-2 py-1.5 pr-3 hover:bg-slate-800 rounded-xl transition-all group border border-transparent hover:border-slate-700">
          <div className="w-9 h-9 rounded-xl gkv-gradient flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-maroon-900/20 group-hover:scale-105 transition-transform">
            {user?.name?.[0]?.toUpperCase() || 'G'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-bold text-slate-200 leading-tight tracking-tight">{user?.name || 'Academic User'}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user?.role || 'Guest'}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
