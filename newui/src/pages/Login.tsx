import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { BookOpenCheck, Eye, EyeOff, AlertCircle, BookOpen, Users } from 'lucide-react';
import { useApp } from '../store/AppContext';
import api from '../services/api';

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

    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const loginRes = await api.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const token = loginRes.data.access_token;
      // Temporarily store token so /auth/me can use it (api service interceptor reads from localStorage)
      localStorage.setItem('token', token);

      const userRes = await api.get('/auth/me');
      const user = userRes.data;

      login(token, user);

      if (user.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, pwd: string) => {
    setEmail(demoEmail);
    setPassword(pwd);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header — matches landing */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpenCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-semibold text-xl text-gray-900">GradeBook</h1>
          </Link>
          <Link
            to="/"
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
          {/* Left Panel */}
          <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-purple-600 p-10">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <BookOpenCheck size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl leading-tight">GradeBook</div>
                  <div className="text-blue-200 text-xs">Academic Integrity Platform</div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
                Smart Plagiarism Detection & Grading
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed">
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <BookOpenCheck size={20} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">GradeBook</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
            <p className="text-gray-500 text-sm mb-6">Select your role and enter credentials</p>

            {/* Role Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              {(['teacher', 'student'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => { setTab(role); setError(''); setEmail(''); setPassword(''); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === role ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {role === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={tab === 'teacher' ? 'sharma@uni.edu' : 'rahul@student.edu'}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-10"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
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
              <div className="text-xs font-medium text-gray-500 mb-2 text-center">
                — Demo {tab === 'teacher' ? 'Teacher' : 'Student'} Accounts —
              </div>
              <div className="space-y-1.5">
                {(tab === 'teacher' ? DEMO_TEACHERS : DEMO_STUDENTS).map(d => (
                  <button
                    key={d.email}
                    onClick={() => fillDemo(d.email, tab === 'teacher' ? 'teacher123' : 'student123')}
                    className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-medium text-gray-700 group-hover:text-blue-700">{d.name}</div>
                      <div className="text-xs text-gray-400">{d.email}</div>
                    </div>
                    <div className="text-xs bg-gray-200 group-hover:bg-blue-200 text-gray-600 group-hover:text-blue-700 px-2 py-0.5 rounded-full font-medium">{d.dept}</div>
                  </button>
                ))}
                <div className="text-center text-xs text-gray-400 pt-1">Password: <span className="font-mono bg-gray-100 px-1 rounded">{tab === 'teacher' ? 'teacher123' : 'student123'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
