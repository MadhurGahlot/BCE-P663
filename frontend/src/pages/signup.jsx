import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, Mail, Loader2, ShieldCheck, UserCircle, Shield, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'student',
        facultyKey: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔒 Faculty Verification
        if (formData.role === 'teacher' && formData.facultyKey !== 'GKV-FACULTY-2026') {
            toast.error('Invalid Institutional Key. Teacher access denied.');
            return;
        }

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
        <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-600/5 blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 border border-white/5 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 gradebook-gradient rounded-2xl mb-6 shadow-2xl shadow-orange-500/20 neon-border">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Access Key Setup</h1>
                    <p className="text-slate-500 mt-3 text-sm font-medium">Join @ Gurukul Kangri Institutional Network</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-800/30 rounded-2xl border border-white/5 mb-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'teacher' })}
                            className={`flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${formData.role === 'teacher'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Shield className="w-3.5 h-3.5 mr-2" />
                            Faculty
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'student' })}
                            className={`flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${formData.role === 'student'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <UserCircle className="w-3.5 h-3.5 mr-2" />
                            Student
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Legal Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-orange-400 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800/40 pl-12 pr-4 py-4 rounded-2xl border border-white/5 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-200 placeholder:text-slate-700 font-medium text-sm"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Institutional Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-orange-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-800/40 pl-12 pr-4 py-4 rounded-2xl border border-white/5 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-200 placeholder:text-slate-700 font-medium text-sm"
                                    placeholder="id@gkv.ac.in"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Secure Passkey</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-orange-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-800/40 pl-12 pr-4 py-4 rounded-2xl border border-white/5 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-200 placeholder:text-slate-700 font-medium text-sm"
                                    placeholder="Minimum 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {formData.role === 'teacher' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-2 ml-1">🔒 Institutional Faculty Key</label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400/50 group-focus-within:text-orange-400 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-orange-500/5 pl-12 pr-4 py-4 rounded-2xl border border-orange-500/10 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-200 placeholder:text-slate-700 font-medium text-sm"
                                            placeholder="Enter Teacher Secret Key"
                                            value={formData.facultyKey}
                                            onChange={(e) => setFormData({ ...formData, facultyKey: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full gradebook-gradient hover:scale-[1.02] text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center disabled:opacity-70 mt-6 active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                        Generate Identity
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-sm text-slate-500 font-medium">
                        Returning member?{' '}
                        <Link to="/login" className="text-orange-400 font-bold hover:text-orange-300 transition-colors inline-flex items-center group">
                            Sign In <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </p>
                </div>
            </motion.div>

            <div className="mt-12 flex items-center space-x-2 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 relative z-10">
                <GraduationCap className="w-3 h-3" />
                <span>Gurukul Kangri Academic Bank</span>
            </div>
        </div>
    );
};

export default Signup;
