import React, { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Search, Filter, BookOpen, Clock, ChevronRight, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../store/AppContext';

const DEPT_COLORS: Record<string, string> = {
  CSE: 'bg-blue-100 text-blue-700',
  EE: 'bg-yellow-100 text-yellow-700',
  ME: 'bg-green-100 text-green-700',
  ECE: 'bg-purple-100 text-purple-700',
};

export default function Assignments() {
  const { currentUser, getTeacherAssignments, getSubmissionsForAssignment, getSimilarityResult } = useApp();
  const assignments = getTeacherAssignments(currentUser?.id ?? '');
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = assignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchSubject = filterSubject === 'ALL' || a.subject === filterSubject;
    const isPast = new Date(a.deadline) < new Date();
    const matchStatus = filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && !isPast) ||
      (filterStatus === 'CLOSED' && isPast);
    return matchSearch && matchSubject && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-500 text-sm mt-0.5">{assignments.length} total assignments</p>
        </div>
        <Link
          to="/teacher/assignments/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Create Assignment
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">All Subjects</option>
            {['CSE', 'EE', 'ME', 'ECE'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(a => {
          const subs = getSubmissionsForAssignment(a.id);
          const graded = subs.filter(s => s.grade !== undefined).length;
          const highSim = subs.filter(s => (s.maxSimilarity ?? 0) >= 0.6).length;
          const simResult = getSimilarityResult(a.id);
          const isPast = new Date(a.deadline) < new Date();
          const daysLeft = Math.ceil((new Date(a.deadline).getTime() - Date.now()) / 86400000);

          return (
            <div key={a.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-5 flex-1">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DEPT_COLORS[a.subject] ?? 'bg-gray-100 text-gray-700'}`}>{a.subject}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isPast ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-600'}`}>
                        {isPast ? 'Closed' : 'Active'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug">{a.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{a.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-slate-50 rounded-xl p-2 text-center">
                    <div className="text-base font-bold text-slate-700">{subs.length}</div>
                    <div className="text-xs text-slate-400">Submitted</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2 text-center">
                    <div className="text-base font-bold text-green-600">{graded}</div>
                    <div className="text-xs text-slate-400">Graded</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2 text-center">
                    <div className={`text-base font-bold ${highSim > 0 ? 'text-red-600' : 'text-slate-400'}`}>{highSim}</div>
                    <div className="text-xs text-slate-400">Flagged</div>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Clock size={12} />
                  <span>Due {a.deadline}</span>
                  {!isPast && (
                    <span className={`ml-auto font-medium ${daysLeft <= 3 ? 'text-red-500' : daysLeft <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {daysLeft}d left
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <FileText size={12} />
                  <span>{a.totalMarks} marks total</span>
                  {simResult && (
                    <span className="ml-auto text-teal-600 flex items-center gap-1">
                      <CheckCircle size={11} /> Similarity checked
                    </span>
                  )}
                  {!simResult && subs.length > 0 && (
                    <span className="ml-auto text-yellow-600 flex items-center gap-1">
                      <AlertTriangle size={11} /> Check pending
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 p-4 flex gap-2">
                <Link
                  to={`/teacher/assignments/${a.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition-colors"
                >
                  <BookOpen size={13} /> Details
                </Link>
                <Link
                  to={`/teacher/assignments/${a.id}/similarity`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                >
                  Similarity <ChevronRight size={13} />
                </Link>
                <Link
                  to={`/teacher/assignments/${a.id}/grade`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                >
                  Grade <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <BookOpen size={48} className="text-slate-300 mx-auto mb-3" />
          <div className="text-slate-500 font-medium">No assignments found</div>
          <div className="text-slate-400 text-sm mt-1">
            {assignments.length === 0 ? (
              <Link to="/teacher/assignments/new" className="text-blue-600 hover:underline">Create your first assignment</Link>
            ) : 'Try adjusting your filters'}
          </div>
        </div>
      )}
    </div>
  );
}
