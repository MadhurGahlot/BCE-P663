import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, Mail, Loader2, ShieldCheck, UserCircle, Shield, GraduationCap, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (formData.fullName && formData.email && formData.password) {
                toast.success(`Welcome to the Grade Book community! Please sign in.`);
                navigate('/login');
            } else {
                toast.error('Please fill in all academic headers');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-maroon-600/5 blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/5 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 gkv-gradient rounded-2xl mb-4 shadow-xl shadow-maroon-900/30">
                        <UserPlus className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Create Academic Identity</h1>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Join the Grade Book Network @ Gurukul Kangri</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 p-1 bg-slate-800/50 rounded-2xl border border-slate-700/50 mb-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'teacher' })}
                            className={`flex items-center justify-center py-2 px-4 rounded-xl text-xs font-bold transition-all ${formData.role === 'teacher'
                                    ? 'bg-slate-700 text-white shadow-lg'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Shield className="w-3.5 h-3.5 mr-2" />
                            Facultly
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'student' })}
                            className={`flex items-center justify-center py-2 px-4 rounded-xl text-xs font-bold transition-all ${formData.role === 'student'
                                    ? 'bg-slate-700 text-white shadow-lg'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <UserCircle className="w-3.5 h-3.5 mr-2" />
                            Student
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800/50 pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-200 placeholder:text-slate-600 text-sm"
                                    placeholder="Enter your official name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Academic Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-800/50 pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-200 placeholder:text-slate-600 text-sm"
                                    placeholder="yourid@gkv.ac.in"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-800/50 pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-200 placeholder:text-slate-600 text-sm"
                                    placeholder="Minimum 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full gradebook-gradient hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-900/20 transition-all flex items-center justify-center disabled:opacity-70 mt-4 active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                        Enroll in Grade Book
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-500 font-medium">
                        Already have an identity?{' '}
                        <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>

            <div className="mt-8 flex items-center space-x-2 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
                <GraduationCap className="w-3 h-3" />
                <span>Gurukul Kangri Academic Bank</span>
            </div>
        </div>
    );
};

export default Signup;
