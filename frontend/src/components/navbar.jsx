import React from 'react';
import { useAuth } from '../context/authcontext';
import { Bell, Search, ChevronDown, User as UserIcon, Globe } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-[#020617]/50 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-600 group-focus-within:text-orange-400 transition-colors" />
          <input
            type="text"
            placeholder="Analyse records, students, or reports..."
            className="w-full bg-white/5 pl-12 pr-4 py-2.5 rounded-2xl border border-white/5 focus:border-orange-500/30 focus:ring-4 focus:ring-orange-500/5 transition-all text-sm outline-none text-slate-200 placeholder:text-slate-700 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-2 text-slate-500 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
          <Globe className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Internal Node</span>
        </div>

        <button className="p-3 text-slate-500 hover:text-orange-400 hover:bg-white/5 rounded-2xl transition-all relative group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#020617] shadow-[0_0_15px_rgba(249,115,22,0.6)] group-hover:scale-125 transition-transform"></span>
        </button>

        <div className="h-8 w-px bg-white/5 mx-1"></div>

        <button className="flex items-center space-x-4 pl-2 py-2 pr-4 hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-white/5">
          <div className="w-10 h-10 rounded-xl gradebook-gradient flex items-center justify-center text-white text-xs font-black shadow-lg shadow-orange-500/10 group-hover:scale-105 transition-transform neon-border">
            {user?.name?.[0]?.toUpperCase() || 'G'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-extrabold text-slate-200 leading-tight tracking-tight">{user?.name || 'Academic User'}</p>
            <p className="text-[9px] text-orange-500 font-black uppercase tracking-[0.2em] opacity-80">{user?.role || 'Guest'}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
