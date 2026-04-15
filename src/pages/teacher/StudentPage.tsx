import React, { useState } from 'react';
import { Link } from 'react-router';
import { Search, User, BookOpen, Award, AlertTriangle } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export default function StudentsPage() {
  const { users, getStudentSubmissions, getAssignmentById } = useApp();
  const [search, setSearch] = useState('');

  const students = users.filter(u => u.role === 'student');
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-500 text-sm mt-0.5">{students.length} registered students</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(student => {
          const submissions = getStudentSubmissions(student.id);
          const graded = submissions.filter(s => s.grade !== undefined);
          const avgGrade = graded.length > 0
            ? graded.reduce((a, s) => {
                const assign = getAssignmentById(s.assignmentId);
                return a + (s.grade! / (assign?.totalMarks ?? 100)) * 100;
              }, 0) / graded.length
            : null;
          const highSim = submissions.filter(s => (s.maxSimilarity ?? 0) >= 0.6).length;

          return (
            <div key={student.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-teal-100 flex items-center justify-center">
                  <span className="font-bold text-teal-700">{student.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{student.name}</div>
                  <div className="text-xs text-slate-400">{student.email}</div>
                </div>
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{student.department}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-slate-50 rounded-xl">
                  <div className="text-base font-bold text-slate-700">{submissions.length}</div>
                  <div className="text-xs text-slate-400">Submitted</div>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-xl">
                  <div className={`text-base font-bold ${avgGrade !== null ? (avgGrade >= 75 ? 'text-green-600' : avgGrade >= 50 ? 'text-yellow-600' : 'text-red-600') : 'text-slate-300'}`}>
                    {avgGrade !== null ? `${avgGrade.toFixed(0)}%` : '—'}
                  </div>
                  <div className="text-xs text-slate-400">Avg Grade</div>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-xl">
                  <div className={`text-base font-bold ${highSim > 0 ? 'text-red-600' : 'text-green-600'}`}>{highSim}</div>
                  <div className="text-xs text-slate-400">Flagged</div>
                </div>
              </div>

              {submissions.length > 0 && (
                <div className="space-y-1">
                  {submissions.slice(0, 2).map(sub => {
                    const assign = getAssignmentById(sub.assignmentId);
                    return (
                      <Link
                        key={sub.id}
                        to={`/teacher/assignments/${sub.assignmentId}`}
                        className="flex items-center justify-between text-xs px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-slate-600 truncate">{assign?.title ?? sub.assignmentId}</span>
                        {sub.grade !== undefined ? (
                          <span className="font-semibold text-green-600 ml-2">{sub.grade}/{assign?.totalMarks}</span>
                        ) : (
                          <span className="text-yellow-600 ml-2">Pending</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
