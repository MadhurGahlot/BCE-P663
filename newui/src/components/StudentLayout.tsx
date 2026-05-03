import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import AnimatedOutlet from './AnimatedOutlet';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <BookOpenCheck size={17} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">GradeBook</span>
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
                    ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button className="relative p-1.5 text-gray-500 hover:text-gray-700">
                <Bell size={17} />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-2 border-l border-gray-200 pl-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{currentUser?.name?.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800 leading-tight">{currentUser?.name}</div>
                  <div className="text-xs text-gray-500">{currentUser?.department} Student</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm ml-1 transition-colors"
              >
                <LogOut size={15} />
              </button>
              <button className="md:hidden text-gray-500" onClick={() => setMobileOpen(true)}>
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-white border-l border-gray-200 p-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-900 font-semibold">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-gray-700">
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
                    ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`
                  }
                >
                  <Icon size={18} /> {label}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 mt-4 w-full transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1">
        <AnimatedOutlet />
      </main>
    </div>
  );
}
