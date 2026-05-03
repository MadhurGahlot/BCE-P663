import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router';
import { motion, LayoutGroup } from 'motion/react';
import AnimatedOutlet from './AnimatedOutlet';
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
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ${mobile ? 'w-64' : collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-200 ${collapsed && !mobile ? 'justify-center px-2' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
          <BookOpenCheck size={20} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <div className="text-gray-900 font-semibold leading-tight">GradeBook</div>
            <div className="text-blue-600 text-xs">Teacher Portal</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <LayoutGroup id={mobile ? 'nav-mobile' : 'nav-desktop'}>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => {
          const isActive = end
            ? location.pathname === to
            : location.pathname.startsWith(to + '/') || location.pathname === to;

          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="relative block"
              onClick={() => mobile && setMobileOpen(false)}
            >
              <motion.div
                className={`relative z-10 flex items-center gap-3 px-3 py-2.5 rounded-xl
                  ${isActive ? 'text-white' : 'text-gray-600'}
                  ${collapsed && !mobile ? 'justify-center' : ''}`}
                whileHover={!isActive ? { x: 4, backgroundColor: 'rgba(239, 246, 255, 0.8)' } : {}}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <Icon size={18} className="shrink-0" />
                {(!collapsed || mobile) && <span className="text-sm font-medium">{label}</span>}
              </motion.div>

              {/* Animated active pill — slides between items */}
              {isActive && (
                <motion.div
                  layoutId={mobile ? 'nav-pill-mobile' : 'nav-pill'}
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm"
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>
      </LayoutGroup>

      {/* User & Logout */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">{currentUser?.name?.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">{currentUser?.name}</div>
              <div className="text-xs text-gray-500 truncate">{currentUser?.department} Dept</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors ${collapsed && !mobile ? 'justify-center' : ''}`}
        >
          <LogOut size={18} className="shrink-0" />
          {(!collapsed || mobile) && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col relative shrink-0" style={{ width: collapsed ? 64 : 256 }}>
        <Sidebar />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white text-gray-500 flex items-center justify-center hover:text-blue-600 hover:bg-blue-50 transition-colors z-10 border border-gray-200 shadow-sm"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-64 shadow-xl">
            <Sidebar mobile />
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
          <button className="md:hidden p-1 text-gray-500" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="hidden md:block">
            <h1 className="text-gray-800 font-semibold">Teacher Portal</h1>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{currentUser?.name?.charAt(0)}</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-800">{currentUser?.name}</div>
                <div className="text-xs text-gray-500">{currentUser?.department}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  );
}
