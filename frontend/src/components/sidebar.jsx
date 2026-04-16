import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import {
    LayoutDashboard,
    FileUp,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    History,
    GraduationCap,
    Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { user, logout } = useAuth();

    const teacherLinks = [
        { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Upload Files', icon: FileUp, path: '/upload' },
        { name: 'Similarity Reports', icon: BarChart3, path: '/reports' },
        { name: 'Grading Rules', icon: Scale, path: '/grading' },
        { name: 'Institution Settings', icon: Settings, path: '/settings' },
    ];

    const studentLinks = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Submit Work', icon: FileUp, path: '/submit' },
        { name: 'My History', icon: History, path: '/history' },
    ];

    const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <>
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg border border-slate-700"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        className="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-all lg:relative lg:translate-x-0"
                    >
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 gkv-gradient rounded-xl flex items-center justify-center shadow-lg shadow-maroon-900/20">
                                    <GraduationCap className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Grade Book</span>
                                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Gurukul Kangri</p>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 px-4 space-y-2 py-4">
                            {links.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group
                    ${isActive
                                            ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]'
                                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
                  `}
                                >
                                    <link.icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${link.path === '/dashboard' ? 'text-indigo-400' : ''}`} />
                                    {link.name}
                                </NavLink>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-slate-800/50">
                            <div className="mb-4 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <p className="text-xs text-slate-500 mb-1">Signed in as</p>
                                <p className="text-sm font-bold text-slate-200 truncate">{user?.name}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Logout
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
