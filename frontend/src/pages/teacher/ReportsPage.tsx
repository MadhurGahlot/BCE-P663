import React from 'react';
import { Link } from 'react-router';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { useApp } from '../../store/AppContext';
import { BarChart3, TrendingUp, Users, AlertTriangle } from 'lucide-react';

const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

export default function ReportsPage() {
  const { currentUser, getTeacherAssignments, getSubmissionsForAssignment, users } = useApp();
  const assignments = getTeacherAssignments(currentUser?.id ?? '');

  // Grade distribution across all assignments
  const allGrades: number[] = [];
  assignments.forEach(a => {
    getSubmissionsForAssignment(a.id).forEach(s => {
      if (s.grade !== undefined && a.totalMarks > 0) {
        allGrades.push((s.grade / a.totalMarks) * 100);
      }
    });
  });

  const gradeDist = [
    { range: 'A (≥80)', count: allGrades.filter(g => g >= 80).length },
    { range: 'B (65-79)', count: allGrades.filter(g => g >= 65 && g < 80).length },
    { range: 'C (50-64)', count: allGrades.filter(g => g >= 50 && g < 65).length },
    { range: 'F (<50)', count: allGrades.filter(g => g < 50).length },
  ];

  // Similarity risk per assignment
  const simData = assignments.map(a => {
    const subs = getSubmissionsForAssignment(a.id);
    const high = subs.filter(s => (s.maxSimilarity ?? 0) >= 0.7).length;
    const medium = subs.filter(s => (s.maxSimilarity ?? 0) >= 0.5 && (s.maxSimilarity ?? 0) < 0.7).length;
    const low = subs.filter(s => (s.maxSimilarity ?? 0) < 0.5 && s.maxSimilarity !== undefined).length;
    return {
      name: a.title.length > 16 ? a.title.slice(0, 16) + '…' : a.title,
      high, medium, low,
    };
  });

  // Per-assignment avg grade
  const avgGradeData = assignments.map(a => {
    const subs = getSubmissionsForAssignment(a.id).filter(s => s.grade !== undefined);
    const avg = subs.length > 0 ? subs.reduce((acc, s) => acc + (s.grade! / a.totalMarks) * 100, 0) / subs.length : 0;
    return { name: a.title.length > 16 ? a.title.slice(0, 16) + '…' : a.title, avg: Math.round(avg) };
  });

  const totalSubs = assignments.reduce((a, assign) => a + getSubmissionsForAssignment(assign.id).length, 0);
  const flagged = assignments.reduce((a, assign) => a + getSubmissionsForAssignment(assign.id).filter(s => (s.maxSimilarity ?? 0) >= 0.6).length, 0);
  const avgGradeAll = allGrades.length > 0 ? (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1) : 'N/A';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-500 text-sm mt-0.5">Comprehensive overview of submissions, grades, and similarity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assignments', value: assignments.length, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Submissions', value: totalSubs, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Avg Grade', value: `${avgGradeAll}%`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Flagged Students', value: flagged, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Grade Distribution Pie */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Grade Distribution</h2>
          {allGrades.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={gradeDist} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {gradeDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No graded submissions yet</div>
          )}
        </div>

        {/* Avg Grade per Assignment */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Average Grade per Assignment</h2>
          {avgGradeData.some(d => d.avg > 0) ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={avgGradeData} margin={{ bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-20} textAnchor="end" />
                <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Avg Grade']} />
                <Bar dataKey="avg" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No graded assignments yet</div>
          )}
        </div>

        {/* Similarity Risk */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-800 mb-5">Similarity Risk per Assignment</h2>
          {simData.some(d => d.high + d.medium + d.low > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={simData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: 12 }} />
                <Legend />
                <Bar dataKey="high" name="High Risk" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" name="Medium Risk" stackId="a" fill="#f97316" />
                <Bar dataKey="low" name="Low Risk" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">Run similarity checks to see data here</div>
          )}
        </div>
      </div>

      {/* Assignment Links */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Assignment Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Assignment</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Submissions</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Graded</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Avg Grade</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">High Risk</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => {
                const subs = getSubmissionsForAssignment(a.id);
                const gradedSubs = subs.filter(s => s.grade !== undefined);
                const avg = gradedSubs.length > 0
                  ? (gradedSubs.reduce((acc, s) => acc + (s.grade! / a.totalMarks) * 100, 0) / gradedSubs.length).toFixed(1)
                  : 'N/A';
                const high = subs.filter(s => (s.maxSimilarity ?? 0) >= 0.7).length;
                return (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="text-sm font-medium text-gray-800">{a.title}</div>
                      <div className="text-xs text-blue-600 font-medium">{a.subject}</div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{subs.length}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{gradedSubs.length}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-semibold ${avg !== 'N/A' && Number(avg) >= 75 ? 'text-green-600' : avg !== 'N/A' && Number(avg) >= 50 ? 'text-yellow-600' : avg !== 'N/A' ? 'text-red-600' : 'text-gray-400'}`}>{avg}{avg !== 'N/A' ? '%' : ''}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-semibold ${high > 0 ? 'text-red-600' : 'text-green-600'}`}>{high}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/teacher/assignments/${a.id}`} className="text-blue-600 hover:underline text-sm">View</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

