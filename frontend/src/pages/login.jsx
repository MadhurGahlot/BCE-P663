import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Loader2, ShieldCheck, UserCircle, GraduationCap, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'teacher' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (formData.email && formData.password) {
        const mockUser = {
          id: '1',
          email: formData.email,
          name: formData.email === 'admin@gkv.ac.in' ? 'Dr. Gurukul' : formData.email.split('@')[0],
          role: formData.role
        };
        login(mockUser, 'mock-jwt-token');
        toast.success(`Welcome to Grade Book, ${mockUser.name}!`);
        navigate('/dashboard');
      } else {
        toast.error('Please fill in all fields');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-600/5 blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 border border-white/5 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 gradebook-gradient rounded-[2rem] mb-6 shadow-2xl shadow-orange-500/20 neon-border">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-200 to-orange-500 tracking-tight">GradeBook</h1>
          <p className="text-slate-500 mt-3 font-medium text-sm">Academic Integrity & Similarity Defence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-800/30 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'teacher' })}
              className={`flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold transition-all ${formData.role === 'teacher'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold transition-all ${formData.role === 'student'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              Student
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1">Email Domain</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-slate-800/40 pl-12 pr-4 py-4 rounded-2xl border border-white/5 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-200 placeholder:text-slate-700 font-medium"
                  placeholder="name@gkv.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-slate-800/40 pl-12 pr-4 py-4 rounded-2xl border border-white/5 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-200 placeholder:text-slate-700 font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradebook-gradient hover:scale-[1.02] text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center disabled:opacity-70 mt-4 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
            Access Platform
          </button>
        </form>

        <div className="text-center mt-10">
          <p className="text-sm text-slate-500 font-medium">
            New to the portal?{' '}
            <Link to="/signup" className="text-orange-400 font-bold hover:text-orange-300 transition-colors group inline-flex items-center">
              Enroll Now <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </p>
        </div>
      </motion.div>

      <div className="mt-16 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] opacity-50 relative z-10">
        Gurukul Kangri (Deemed to be University) • Haridwar
      </div>
    </div>
  );
};

export default Login;