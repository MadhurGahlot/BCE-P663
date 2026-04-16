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
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-maroon-600/5 blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/5 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 gkv-gradient rounded-2xl mb-5 shadow-xl shadow-maroon-900/30">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">Grade Book</h1>
          <p className="text-slate-500 mt-2 font-medium">Academic Integrity & Similarity Detection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4 p-1 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'teacher' })}
              className={`flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${formData.role === 'teacher'
                  ? 'bg-slate-700 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${formData.role === 'student'
                  ? 'bg-slate-700 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              Student
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Domain</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-slate-800/50 pl-12 pr-4 py-4 rounded-2xl border border-slate-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-200 placeholder:text-slate-600"
                  placeholder="name@gkv.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-slate-800/50 pl-12 pr-4 py-4 rounded-2xl border border-slate-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-200 placeholder:text-slate-600"
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
            className="w-full gradebook-gradient hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-900/20 transition-all flex items-center justify-center disabled:opacity-70 mt-4 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
            Access Grade Book
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 font-medium">
            New to the portal?{' '}
            <Link to="/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors group">
              Enroll Now <ChevronRight className="inline w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </p>
        </div>
      </motion.div>

      <div className="mt-12 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10">
        Gurukul Kangri (Deemed to be University) • Haridwar
      </div>
    </div>
  );
};

export default Login;