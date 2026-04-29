import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { BookOpenCheck, Eye, EyeOff, AlertCircle, BookOpen, Users } from 'lucide-react';
import { useApp } from '../store/AppContext';

const DEMO_TEACHERS = [
  { name: 'Prof. Arjun Sharma', email: 'sharma@uni.edu', dept: 'CSE' },
  { name: 'Prof. Priya Mehta', email: 'mehta@uni.edu', dept: 'EE' },
  { name: 'Prof. Rajesh Patel', email: 'patel@uni.edu', dept: 'ME' },
];

const DEMO_STUDENTS = [
  { name: 'Rahul Verma', email: 'rahul@student.edu', dept: 'CSE' },
  { name: 'Priya Singh', email: 'priya@student.edu', dept: 'CSE' },
  { name: 'Anita Gupta', email: 'anita@student.edu', dept: 'CSE' },
];

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'teacher' | 'student'>('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const user = login(email, password);
    setLoading(false);
    if (user) {
      if (user.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } else {
      setError('Invalid email or password. Try the demo credentials below.');
    }
  };

  const fillDemo = (demoEmail: string, pwd: string) => {
    setEmail(demoEmail);
    setPassword(pwd);
    setError('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between bg-blue-700 p-10">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <BookOpenCheck size={24} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-xl leading-tight">Grade Book</div>
                <div className="text-blue-200 text-xs">Academic Integrity Platform</div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
              Smart Plagiarism Detection & Grading
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              Empowering educators with AI-assisted similarity detection, automated grading rubrics, and comprehensive reporting for engineering assignments.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BookOpen, label: 'Assignments', value: '3 Active' },
              { icon: Users, label: 'Students', value: '10 Enrolled' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4">
                <Icon size={20} className="text-blue-200 mb-2" />
                <div className="text-white font-semibold">{value}</div>
                <div className="text-blue-200 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white p-8 sm:p-10">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <BookOpenCheck size={20} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">Grade Book</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h1>
          <p className="text-slate-500 text-sm mb-6">Select your role and enter credentials</p>

          {/* Role Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {(['teacher', 'student'] as const).map(role => (
              <button
                key={role}
                onClick={() => { setTab(role); setError(''); setEmail(''); setPassword(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === role ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {role === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={tab === 'teacher' ? 'sharma@uni.edu' : 'rahul@student.edu'}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-10"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6">
            <div className="text-xs font-medium text-slate-500 mb-2 text-center">
              — Demo {tab === 'teacher' ? 'Teacher' : 'Student'} Accounts —
            </div>
            <div className="space-y-1.5">
              {(tab === 'teacher' ? DEMO_TEACHERS : DEMO_STUDENTS).map(d => (
                <button
                  key={d.email}
                  onClick={() => fillDemo(d.email, tab === 'teacher' ? 'teacher123' : 'student123')}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors group"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-700 group-hover:text-blue-700">{d.name}</div>
                    <div className="text-xs text-slate-400">{d.email}</div>
                  </div>
                  <div className="text-xs bg-slate-200 group-hover:bg-blue-200 text-slate-600 group-hover:text-blue-700 px-2 py-0.5 rounded-full font-medium">{d.dept}</div>
                </button>
              ))}
              <div className="text-center text-xs text-slate-400 pt-1">Password: <span className="font-mono bg-slate-100 px-1 rounded">{tab === 'teacher' ? 'teacher123' : 'student123'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
