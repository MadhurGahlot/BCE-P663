import { Link } from 'react-router';
import {
  BookOpen, AlertTriangle, CheckCircle, TrendingUp,
  Clock, ArrowRight, FileText, Plus, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../store/AppContext';
import { getSimilarityBg } from '../../store/similarity';

export default function TeacherDashboard() {
  const { currentUser, getTeacherAssignments, getSubmissionsForAssignment, users, similarityResults } = useApp();

  const assignments = getTeacherAssignments(currentUser?.id ?? '');
  const allSubmissions = assignments.flatMap(a => getSubmissionsForAssignment(a.id));
  const gradedCount = allSubmissions.filter(s => s.grade !== undefined).length;
  const highSimilarityCount = allSubmissions.filter(s => (s.maxSimilarity ?? 0) >= 0.6).length;

  const stats = [
    { label: 'Total Assignments', value: assignments.length, icon: BookOpen, color: 'bg-blue-500', textColor: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Submissions', value: allSubmissions.length, icon: FileText, color: 'bg-teal-500', textColor: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Graded', value: `${gradedCount}/${allSubmissions.length}`, icon: CheckCircle, color: 'bg-green-500', textColor: 'text-green-600', bg: 'bg-green-50' },
    { label: 'High Similarity', value: highSimilarityCount, icon: AlertTriangle, color: 'bg-red-500', textColor: 'text-red-600', bg: 'bg-red-50' },
  ];

  // Chart: submissions per assignment
  const chartData = assignments.map((a, idx) => {
    const subs = getSubmissionsForAssignment(a.id);
    const graded = subs.filter(s => s.grade !== undefined).length;
    const truncated = a.title.length > 14 ? a.title.slice(0, 14) + '…' : a.title;
    return {
      name: `${idx + 1}. ${truncated}`,
      total: subs.length,
      graded,
      pending: subs.length - graded,
    };
  });

  // Recent high-similarity pairs
  const flaggedPairs: { s1Name: string; s2Name: string; similarity: number; assignTitle: string }[] = [];
  for (const result of similarityResults) {
    const assign = assignments.find(a => a.id === result.assignmentId);
    if (!assign) continue;
    for (const pair of result.pairs) {
      if (pair.similarity >= 0.5) {
        const subs = getSubmissionsForAssignment(assign.id);
        const sub1 = subs.find(s => s.id === pair.submission1Id);
        const sub2 = subs.find(s => s.id === pair.submission2Id);
        const u1 = users.find(u => u.id === sub1?.studentId);
        const u2 = users.find(u => u.id === sub2?.studentId);
        if (u1 && u2) {
          flaggedPairs.push({ s1Name: u1.name, s2Name: u2.name, similarity: pair.similarity, assignTitle: assign.title });
        }
      }
    }
  }
  flaggedPairs.sort((a, b) => b.similarity - a.similarity);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.name?.split(' ')[1] ?? currentUser?.name}! 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's your academic integrity overview</p>
        </div>
        <Link
          to="/teacher/assignments/new"
          className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> New Assignment
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, textColor, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={textColor} />
            </div>
            <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-800">Submissions Overview</h2>
            <Activity size={18} className="text-gray-400" />
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="graded" name="Graded" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          )}
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-green-500 inline-block"></span> Graded</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-yellow-500 inline-block"></span> Pending</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/teacher/assignments/new" className="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm text-blue-700 font-medium transition-colors">
                <div className="flex items-center gap-2"><Plus size={16} /> Create Assignment</div>
                <ArrowRight size={14} />
              </Link>
              <Link to="/teacher/assignments" className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm text-gray-700 font-medium transition-colors">
                <div className="flex items-center gap-2"><BookOpen size={16} /> View All Assignments</div>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Deadline Tracker */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3">Upcoming Deadlines</h2>
            <div className="space-y-2">
              {assignments
                .filter(a => new Date(a.deadline) >= new Date())
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .slice(0, 3)
                .map(a => {
                  const daysLeft = Math.ceil((new Date(a.deadline).getTime() - Date.now()) / 86400000);
                  return (
                    <Link key={a.id} to={`/teacher/assignments/${a.id}`} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors group">
                      <div>
                        <div className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{a.title}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} />{a.deadline}</div>
                      </div>
                      <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${daysLeft <= 3 ? 'bg-red-100 text-red-600' : daysLeft <= 7 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                        {daysLeft}d
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Pairs */}
      {flaggedPairs.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              Flagged Similarity Pairs
            </h2>
            <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">{flaggedPairs.length} flagged</span>
          </div>
          <div className="space-y-2">
            {flaggedPairs.slice(0, 5).map((pair, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">{pair.s1Name.charAt(0)}</div>
                    <TrendingUp size={14} className="text-red-500" />
                    <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">{pair.s2Name.charAt(0)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">{pair.s1Name} ↔ {pair.s2Name}</div>
                    <div className="text-xs text-gray-400">{pair.assignTitle}</div>
                  </div>
                </div>
                <div className={`text-xs font-semibold px-3 py-1 rounded-full border ${getSimilarityBg(pair.similarity)}`}>
                  {(pair.similarity * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignments Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">My Assignments</h2>
          <Link to="/teacher/assignments" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assignment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Deadline</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Submissions</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => {
                const subs = getSubmissionsForAssignment(a.id);
                const graded = subs.filter(s => s.grade !== undefined).length;
                const isPast = new Date(a.deadline) < new Date();
                return (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800 text-sm">{a.title}</div>
                      <div className="text-xs text-gray-400">{a.totalMarks} marks</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">{a.subject}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{a.deadline}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700">{subs.length} submitted</div>
                      <div className="text-xs text-gray-400">{graded} graded</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isPast ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                        {isPast ? 'Closed' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link to={`/teacher/assignments/${a.id}`} className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                        View <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {assignments.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">No assignments yet. <Link to="/teacher/assignments/new" className="text-blue-600 hover:underline">Create one</Link></div>
          )}
        </div>
      </div>
    </div>
  );
}
