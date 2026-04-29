import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router';
import {
  LayoutDashboard, BookOpen, Users, BarChart3,
  LogOut, ChevronLeft, ChevronRight, BookOpenCheck, Bell, Menu, X
} from 'lucide-react';
import { useApp } from '../store/AppContext';

const navItems = [
  { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/teacher/assignments', label: 'Assignments', icon: BookOpen },
  { to: '/teacher/students', label: 'Students', icon: Users },
  { to: '/teacher/reports', label: 'Reports', icon: BarChart3 },
];

export function TeacherLayout() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-slate-900 text-white transition-all duration-300 ${mobile ? 'w-64' : collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700 ${collapsed && !mobile ? 'justify-center px-2' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
          <BookOpenCheck size={20} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <div className="text-white font-semibold leading-tight">Grade</div>
            <div className="text-blue-400 text-xs">Book</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
              ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              ${collapsed && !mobile ? 'justify-center' : ''}`
            }
            onClick={() => mobile && setMobileOpen(false)}
          >
            <Icon size={18} className="shrink-0" />
            {(!collapsed || mobile) && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-slate-700 space-y-1">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold">{currentUser?.name?.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{currentUser?.name}</div>
              <div className="text-xs text-slate-400 truncate">{currentUser?.department} Dept</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors ${collapsed && !mobile ? 'justify-center' : ''}`}
        >
          <LogOut size={18} className="shrink-0" />
          {(!collapsed || mobile) && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col relative shrink-0" style={{ width: collapsed ? 64 : 256 }}>
        <Sidebar />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-blue-600 transition-colors z-10 border-2 border-slate-100"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-64">
            <Sidebar mobile />
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
          <button className="md:hidden p-1 text-slate-500" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="hidden md:block">
            <h1 className="text-slate-800 font-semibold">Teacher Portal</h1>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{currentUser?.name?.charAt(0)}</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-slate-800">{currentUser?.name}</div>
                <div className="text-xs text-slate-500">{currentUser?.department}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
