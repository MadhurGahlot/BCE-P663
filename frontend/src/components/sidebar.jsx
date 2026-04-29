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
                        className="fixed inset-y-0 left-0 z-40 w-64 bg-[#020617] border-r border-white/5 flex flex-col transition-all lg:relative lg:translate-x-0"
                    >
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 gradebook-gradient rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20 neon-border">
                                    <GraduationCap className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-400 tracking-tighter">GradeBook</span>
                                    <p className="text-[9px] text-slate-500 font-black tracking-[0.2em] uppercase">Gurukul Kangri</p>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 px-4 space-y-2 py-4">
                            {links.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) => `
                    flex items-center px-4 py-3.5 rounded-2xl text-xs font-bold transition-all group
                    ${isActive
                                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                                            : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}
                  `}
                                >
                                    <link.icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${link.path === '/dashboard' ? 'text-orange-400' : ''}`} />
                                    {link.name}
                                </NavLink>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-white/5">
                            <div className="mb-4 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-widest">Operator</p>
                                <p className="text-sm font-bold text-slate-200 truncate">{user?.name}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center w-full px-4 py-3.5 text-xs font-bold text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 rounded-2xl transition-all"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Terminate Session
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
