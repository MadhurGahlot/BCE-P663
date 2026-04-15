import React from 'react';
import { Link } from 'react-router';
import { Award, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';

export default function GradesPage() {
  const { currentUser, submissions, assignments, users } = useApp();

  const mySubmissions = submissions.filter(s => s.studentId === currentUser?.id);
  const gradedSubs = mySubmissions.filter(s => s.grade !== undefined);

  const gradeData = gradedSubs.map(sub => {
    const assign = assignments.find(a => a.id === sub.assignmentId);
    const pct = assign ? (sub.grade! / assign.totalMarks) * 100 : 0;
    return {
      id: sub.id,
      title: assign?.title?.slice(0, 18) ?? sub.assignmentId,
      grade: sub.grade!,
      total: assign?.totalMarks ?? 100,
      pct: Math.round(pct),
      subject: assign?.subject ?? '',
    };
  });

  const avg = gradeData.length > 0
    ? (gradeData.reduce((a, g) => a + g.pct, 0) / gradeData.length).toFixed(1)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Grades</h1>
        <p className="text-slate-500 text-sm mt-0.5">{gradedSubs.length} graded submission{gradedSubs.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Submitted', value: mySubmissions.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: TrendingUp },
          { label: 'Graded', value: gradedSubs.length, color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
          { label: 'Pending', value: mySubmissions.length - gradedSubs.length, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
          { label: 'Average', value: avg ? `${avg}%` : '—', color: 'text-purple-600', bg: 'bg-purple-50', icon: Award },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon size={20} className={color} />
            </div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {gradeData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-5">Grade Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={gradeData} margin={{ bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="title" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-20} textAnchor="end" />
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Score']} />
              <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                {gradeData.map((entry, i) => (
                  <Cell key={i} fill={entry.pct >= 75 ? '#22c55e' : entry.pct >= 50 ? '#eab308' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Grade List */}
      <div className="space-y-3">
        {mySubmissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Award size={40} className="mx-auto mb-3 text-slate-300" />
            <div className="text-slate-500 font-medium">No submissions yet</div>
          </div>
        ) : (
          mySubmissions.map(sub => {
            const assign = assignments.find(a => a.id === sub.assignmentId);
            const pct = sub.grade !== undefined && assign ? ((sub.grade / assign.totalMarks) * 100) : null;
            const color = pct !== null ? (pct >= 75 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600') : 'text-slate-400';
            const gradient = pct !== null ? (pct >= 75 ? 'from-green-500 to-teal-500' : pct >= 50 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-rose-500') : 'from-slate-300 to-slate-400';

            return (
              <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 flex-wrap">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                  {pct !== null ? (
                    <span className="text-white font-bold text-xs">{Math.round(pct)}%</span>
                  ) : (
                    <Clock size={18} className="text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800">{assign?.title ?? sub.assignmentId}</div>
                  <div className="text-xs text-slate-400 mt-0.5 flex gap-3 flex-wrap">
                    <span>{assign?.subject}</span>
                    <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                    <span>{sub.fileName}</span>
                  </div>
                  {sub.feedback && (
                    <p className="text-xs text-slate-500 mt-1 italic line-clamp-1">"{sub.feedback}"</p>
                  )}
                </div>
                {sub.grade !== undefined ? (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-xl font-bold ${color}`}>{sub.grade}</div>
                      <div className="text-xs text-slate-400">/{assign?.totalMarks}</div>
                    </div>
                    <Link
                      to={`/student/grades/${sub.id}`}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-medium transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-medium">Pending</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
