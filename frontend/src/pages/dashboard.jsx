import React from 'react';
import { useAuth } from '../context/authcontext';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  BarChart,
  PieChart as PieChartIcon,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const teacherStats = [
  { label: 'Active Reports', value: '124', icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/10', trend: '+12%', isUp: true },
  { label: 'Enrolled Students', value: '482', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+5%', isUp: true },
  { label: 'High Similarity', value: '12', icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', trend: '-2%', isUp: false },
  { label: 'Originality Rate', value: '82%', icon: ShieldCheck, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+1%', isUp: true },
];

const chartData = [
  { name: 'Mon', count: 40 },
  { name: 'Tue', count: 30 },
  { name: 'Wed', count: 65 },
  { name: 'Thu', count: 45 },
  { name: 'Fri', count: 90 },
  { name: 'Sat', count: 25 },
  { name: 'Sun', count: 15 },
];

const pieData = [
  { name: 'Original', value: 70, color: '#10b981' },
  { name: 'Flagged', value: 20, color: '#f59e0b' },
  { name: 'Critical', value: 10, color: '#ef4444' },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 mb-1">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Grade Book Overview</h1>
          <p className="text-slate-500 font-medium">Welcome, {user?.name}. Monitoring Academic Integrity @ GKV.</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl shadow-xl">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-300">Spring Semester 2024</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teacherStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-indigo-500/30 transition-all"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl transition-transform group-hover:scale-110 shadow-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-full border ${stat.isUp ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' : 'text-rose-400 bg-rose-500/5 border-rose-500/20'}`}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">{stat.label}</p>
            <h3 className="text-3xl font-black text-white mt-1 relative z-10">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Submissions Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white flex items-center">
              <BarChart className="w-5 h-5 mr-3 text-indigo-400" />
              Scanning Activity
            </h3>
            <div className="text-[10px] font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-lg">Last 7 Days</div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={chartData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Plagiarism Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl"
        >
          <h3 className="text-lg font-bold text-white flex items-center mb-8">
            <PieChartIcon className="w-5 h-5 mr-3 text-indigo-400" />
            Integrity Distribution
          </h3>
          <div className="h-64 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">82%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clean</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center px-3 py-2 bg-slate-800/30 rounded-xl border border-slate-800/50">
                <div className="w-2.5 h-2.5 rounded-full mr-2 shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: item.color }}></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Flagged Assignments Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Recent Scans & Flags</h3>
          <button className="text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-4 py-2 rounded-xl transition-all">Audit Trail</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-800">
              <tr>
                <th className="px-8 py-5">Academic Artifact</th>
                <th className="px-8 py-5">Submitting Student</th>
                <th className="px-8 py-5">Detection Date</th>
                <th className="px-8 py-5 text-center">Similarity Index</th>
                <th className="px-8 py-5 text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[1, 2, 3].map((item) => (
                <tr key={item} className="hover:bg-slate-800/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-200 group-hover:text-white transition-colors">GKV Ph.D Thesis Draft {item}</div>
                    <div className="text-[10px] font-black text-slate-600 mt-1 uppercase tracking-tighter">BCE-P663-SEC-{item}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">AJ</div>
                      <span className="text-sm font-bold text-slate-300">Alex Johnson</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-500 text-sm font-medium tracking-tight">2 Hours Ago</td>
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-black border ${item === 1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : item === 2 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'}`}>
                      {item === 1 ? '04.2%' : item === 2 ? '42.8%' : '88.5%'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 border border-slate-700">
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;