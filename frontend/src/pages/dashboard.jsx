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
  { label: 'Active Reports', value: '124', icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10', trend: '+12%', isUp: true },
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
    <div className="space-y-10 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-orange-400 mb-1.5">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Console</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Academic Integrity Monitoring @ Gurukul Kangri</p>
        </div>
        <div className="flex items-center space-x-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 px-5 py-3 rounded-2xl shadow-2xl">
          <Calendar className="w-4 h-4 text-orange-400" />
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
            whileHover={{ y: -5 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-7 rounded-[2rem] relative overflow-hidden group hover:border-orange-500/30 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-lg group-hover:neon-border`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border ${stat.isUp ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' : 'text-rose-400 bg-rose-500/5 border-rose-500/20'}`}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
            <h3 className="text-4xl font-black text-white mt-2 relative z-10 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Weekly Submissions Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-lg font-bold text-white flex items-center tracking-tight">
              <BarChart className="w-5 h-5 mr-3 text-orange-400" />
              Submission Analyse
            </h3>
            <div className="text-[10px] font-black text-slate-500 bg-slate-800/50 px-4 py-1.5 rounded-xl border border-white/5 uppercase tracking-widest">Temporal Density</div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={chartData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 4, 4]} barSize={45} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Plagiarism Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl"
        >
          <h3 className="text-lg font-bold text-white flex items-center mb-10 tracking-tight">
            <PieChartIcon className="w-5 h-5 mr-3 text-orange-400" />
            Similarity Ratios
          </h3>
          <div className="h-72 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-white text-glow">82%</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Verified</span>
            </div>
          </div>
          <div className="space-y-3 mt-8">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between px-4 py-3 bg-slate-800/20 rounded-2xl border border-white/5">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 shadow-lg" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.name}</span>
                </div>
                <span className="text-xs font-black text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Flagged Assignments Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity Stream</h3>
          <button className="text-[10px] font-black text-orange-400 hover:text-orange-300 uppercase tracking-[0.2em] bg-orange-500/10 px-6 py-2.5 rounded-xl border border-orange-500/20 transition-all">Full Audit Log</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/20 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-10 py-6">Academic Artifact</th>
                <th className="px-10 py-6">Submitting Student</th>
                <th className="px-10 py-6">Detection Date</th>
                <th className="px-10 py-6 text-center">Similarity Index</th>
                <th className="px-10 py-6 text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2, 3].map((item) => (
                <tr key={item} className="hover:bg-white/5 transition-all group">
                  <td className="px-10 py-8">
                    <div className="font-bold text-slate-200 group-hover:text-orange-400 transition-colors">GKV Ph.D Thesis Draft {item}</div>
                    <div className="text-[10px] font-black text-slate-600 mt-1.5 uppercase tracking-widest">BCE-P663-GKV-{item}</div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-slate-400">AJ</div>
                      <span className="text-sm font-bold text-slate-300">Alex Johnson</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-slate-500 text-sm font-medium">2 Hours Ago</td>
                  <td className="px-10 py-8 text-center">
                    <div className={`inline-flex items-center justify-center px-4 py-2 rounded-2xl text-xs font-black border ${item === 1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : item === 2 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20 neon-border'}`}>
                      {item === 1 ? '04.2%' : item === 2 ? '42.8%' : '88.5%'}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className="inline-flex items-center px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-800/50 text-slate-500 border border-white/5">
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