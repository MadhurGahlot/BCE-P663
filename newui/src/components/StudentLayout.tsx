import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router';
import { BookOpenCheck, BookOpen, Star, Bell, Menu, X, LogOut } from 'lucide-react';
import { useApp } from '../store/AppContext';

const navItems = [
  { to: '/student', label: 'My Assignments', icon: BookOpen, end: true },
  { to: '/student/grades', label: 'My Grades', icon: Star },
];

export function StudentLayout() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-slate-900 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <BookOpenCheck size={17} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-white">Grade</span>
                <span className="text-blue-400 text-xs ml-1">Book</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button className="relative p-1.5 text-slate-400 hover:text-white">
                <Bell size={17} />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-2 border-l border-slate-700 pl-3">
                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center">
                  <span className="text-xs font-bold">{currentUser?.name?.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm font-medium leading-tight">{currentUser?.name}</div>
                  <div className="text-xs text-slate-400">{currentUser?.department} Student</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm ml-1"
              >
                <LogOut size={15} />
              </button>
              <button className="md:hidden text-slate-400" onClick={() => setMobileOpen(true)}>
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-slate-900 p-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-semibold">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`
                  }
                >
                  <Icon size={18} /> {label}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 mt-4 w-full"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
