import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ArrowLeft, AlertTriangle, CheckCircle, BarChart3,
  ChevronDown, ChevronUp, Eye, RefreshCw, Download
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { useApp } from '../../store/AppContext';
import { getSimilarityBg, getSimilarityColor, getSimilarityLabel } from '../../store/similarity';
import { exportToExcel, exportToPDF } from '../../store/exportUtils';
import { toast } from 'sonner';

export default function SimilarityReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAssignmentById, getSubmissionsForAssignment, getSimilarityResult, runSimilarityCheck, users } = useApp();
  const [expandedPair, setExpandedPair] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [tab, setTab] = useState<'overview' | 'pairs' | 'heatmap'>('overview');

  const assignment = getAssignmentById(id ?? '');
  const submissions = getSubmissionsForAssignment(id ?? '');
  const simResult = getSimilarityResult(id ?? '');

  if (!assignment) return <div className="p-6 text-slate-500">Assignment not found.</div>;

  const getStudentName = (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    const user = users.find(u => u.id === sub?.studentId);
    return user?.name ?? sub?.studentId ?? 'Unknown';
  };

  const handleRunCheck = async () => {
    if (submissions.length < 2) { toast.error('Need at least 2 submissions.'); return; }
    setChecking(true);
    await new Promise(r => setTimeout(r, 2000));
    runSimilarityCheck(id ?? '');
    setChecking(false);
    toast.success('Similarity check complete!');
  };

  const handleExportExcel = () => {
    exportToExcel(assignment, submissions, users, simResult);
    toast.success('Exported to Excel!');
  };
  const handleExportPDF = () => {
    exportToPDF(assignment, submissions, users, simResult);
    toast.success('PDF export started!');
  };

  const sortedPairs = simResult
    ? [...simResult.pairs].sort((a, b) => b.similarity - a.similarity)
    : [];

  const highRisk = sortedPairs.filter(p => p.similarity >= 0.7);
  const medRisk = sortedPairs.filter(p => p.similarity >= 0.5 && p.similarity < 0.7);
  const lowRisk = sortedPairs.filter(p => p.similarity < 0.5);

  // Per-student max similarity
  const studentMaxSim = submissions.map(sub => {
    const maxPair = simResult?.pairs.reduce<number>((max, pair) => {
      if (pair.submission1Id === sub.id || pair.submission2Id === sub.id) {
        return Math.max(max, pair.similarity);
      }
      return max;
    }, 0) ?? 0;
    const student = users.find(u => u.id === sub.studentId);
    return { name: student?.name ?? sub.studentId, similarity: maxPair, fileName: sub.fileName };
  });

  // Heatmap data
  const heatmapStudents = submissions.map(sub => ({
    id: sub.id,
    name: users.find(u => u.id === sub.studentId)?.name?.split(' ')[0] ?? sub.studentId,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 mt-1 flex-shrink-0">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="text-xs text-slate-400 font-medium mb-1">{assignment.subject} • {assignment.title}</div>
          <h1 className="text-xl font-bold text-slate-900">Similarity Report</h1>
          {simResult && (
            <p className="text-slate-500 text-sm mt-0.5">Last computed: {new Date(simResult.computedAt).toLocaleString()}</p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
          <button onClick={handleRunCheck} disabled={checking} className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white rounded-xl text-xs font-medium transition-colors">
            {checking ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RefreshCw size={13} />}
            {checking ? 'Running...' : 'Re-run Check'}
          </button>
          <button onClick={handleExportExcel} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-medium">
            <Download size={13} /> Excel
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium">
            <Download size={13} /> PDF
          </button>
        </div>
      </div>

      {!simResult ? (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-10 text-center">
          <BarChart3 size={48} className="mx-auto mb-4 text-orange-300" />
          <div className="font-semibold text-orange-800 mb-2">No Similarity Data Yet</div>
          <p className="text-orange-700 text-sm mb-4">Run the similarity check to analyze {submissions.length} submissions.</p>
          <button onClick={handleRunCheck} disabled={checking || submissions.length < 2} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white rounded-xl text-sm font-medium">
            {checking ? 'Running...' : 'Run Similarity Check'}
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Pairs', value: sortedPairs.length, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'High Risk (≥70%)', value: highRisk.length, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Medium Risk (50-70%)', value: medRisk.length, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Low Risk (<50%)', value: lowRisk.length, color: 'text-green-600', bg: 'bg-green-50' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
                <div className={`text-3xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 w-fit gap-1">
            {(['overview', 'pairs', 'heatmap'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t === 'overview' ? 'Overview Chart' : t === 'pairs' ? 'Pair Analysis' : 'Similarity Heatmap'}
              </button>
            ))}
          </div>

          {/* Tab: Overview */}
          {tab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-semibold text-slate-800 mb-4">Max Similarity per Student</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={studentMaxSim} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 1]} />
                    <Tooltip formatter={(val: number) => [`${(val * 100).toFixed(1)}%`, 'Max Similarity']} contentStyle={{ borderRadius: '10px', fontSize: 12 }} />
                    <Bar dataKey="similarity" radius={[4, 4, 0, 0]}>
                      {studentMaxSim.map((entry, i) => (
                        <Cell key={i} fill={entry.similarity >= 0.7 ? '#ef4444' : entry.similarity >= 0.5 ? '#f97316' : entry.similarity >= 0.3 ? '#eab308' : '#22c55e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {[['#ef4444', '≥70% High'], ['#f97316', '50-70% Med'], ['#eab308', '30-50% Low-Med'], ['#22c55e', '<30% Low']].map(([c, l]) => (
                    <div key={l} className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="w-3 h-3 rounded-sm inline-block" style={{ background: c }}></span>{l}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-semibold text-slate-800 mb-4">Risk Distribution</h2>
                <div className="space-y-4 mt-6">
                  {[
                    { label: 'High Risk (≥70%)', count: highRisk.length, total: sortedPairs.length, color: 'bg-red-500' },
                    { label: 'Medium Risk (50-70%)', count: medRisk.length, total: sortedPairs.length, color: 'bg-orange-500' },
                    { label: 'Low-Med Risk (30-50%)', count: sortedPairs.filter(p => p.similarity >= 0.3 && p.similarity < 0.5).length, total: sortedPairs.length, color: 'bg-yellow-500' },
                    { label: 'Low Risk (<30%)', count: sortedPairs.filter(p => p.similarity < 0.3).length, total: sortedPairs.length, color: 'bg-green-500' },
                  ].map(({ label, count, total, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-600 font-medium">{label}</span>
                        <span className="text-slate-500">{count} pair{count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Thresholds Legend */}
                <div className="mt-6 p-3 bg-slate-50 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-slate-600 mb-2">Interpretation Guide</div>
                  {[
                    { range: '≥ 70%', label: 'High Risk', desc: 'Likely plagiarism — investigate immediately', color: 'text-red-600 bg-red-50' },
                    { range: '50–69%', label: 'Medium Risk', desc: 'Significant overlap — review carefully', color: 'text-orange-600 bg-orange-50' },
                    { range: '30–49%', label: 'Low-Medium', desc: 'Some overlap — may be coincidental', color: 'text-yellow-600 bg-yellow-50' },
                    { range: '< 30%', label: 'Low Risk', desc: 'Minimal overlap — likely original work', color: 'text-green-600 bg-green-50' },
                  ].map(({ range, label, desc, color }) => (
                    <div key={range} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${color}`}>
                      <span className="text-xs font-bold min-w-[52px]">{range}</span>
                      <span className="text-xs font-medium">{label}</span>
                      <span className="text-xs opacity-80">— {desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Pairs */}
          {tab === 'pairs' && (
            <div className="space-y-3">
              {sortedPairs.length === 0 && (
                <div className="text-center py-10 text-slate-400">No pairs found.</div>
              )}
              {sortedPairs.map(pair => {
                const pairKey = `${pair.submission1Id}-${pair.submission2Id}`;
                const isExpanded = expandedPair === pairKey;
                const s1Name = getStudentName(pair.submission1Id);
                const s2Name = getStudentName(pair.submission2Id);
                const sub1 = submissions.find(s => s.id === pair.submission1Id);
                const sub2 = submissions.find(s => s.id === pair.submission2Id);

                return (
                  <div key={pairKey} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${pair.similarity >= 0.7 ? 'border-red-200' : pair.similarity >= 0.5 ? 'border-orange-200' : 'border-slate-200'}`}>
                    <button
                      onClick={() => setExpandedPair(isExpanded ? null : pairKey)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-16 text-center py-2 rounded-xl text-sm font-bold border ${getSimilarityBg(pair.similarity)}`}>
                        {(pair.similarity * 100).toFixed(0)}%
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-800 text-sm">{s1Name}</span>
                          <span className="text-slate-400 text-xs">↔</span>
                          <span className="font-medium text-slate-800 text-sm">{s2Name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-1 ${getSimilarityBg(pair.similarity)}`}>{getSimilarityLabel(pair.similarity)}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {pair.matchedSections.length} matched section{pair.matchedSections.length !== 1 ? 's' : ''} found
                        </div>
                      </div>
                      {pair.similarity >= 0.7 && <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />}
                      {pair.similarity >= 0.5 && pair.similarity < 0.7 && <AlertTriangle size={16} className="text-orange-500 flex-shrink-0" />}
                      {pair.similarity < 0.5 && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-slate-100 p-5 space-y-4">
                        {/* Similarity bar */}
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                            <span>Similarity Score</span>
                            <span className={`font-bold ${getSimilarityColor(pair.similarity)}`}>{(pair.similarity * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pair.similarity >= 0.7 ? 'bg-red-500' : pair.similarity >= 0.5 ? 'bg-orange-500' : pair.similarity >= 0.3 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${pair.similarity * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Matched Sections */}
                        {pair.matchedSections.length > 0 && (
                          <div>
                            <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                              <Eye size={15} className="text-slate-400" />
                              Matched / Copied Sections ({pair.matchedSections.length})
                            </div>
                            <div className="space-y-3">
                              {pair.matchedSections.map((section, i) => (
                                <div key={i} className="rounded-xl overflow-hidden border border-slate-200">
                                  <div className="px-3 py-1.5 bg-red-50 border-b border-slate-200 flex items-center gap-2">
                                    <AlertTriangle size={12} className="text-red-500" />
                                    <span className="text-xs font-medium text-red-700">Match #{i + 1}</span>
                                  </div>
                                  <div className="p-3 bg-red-50/50">
                                    <p className="text-xs text-slate-700 leading-relaxed font-mono">{section.text}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-slate-400">
                                      <span>In {s1Name}: position ~{section.startIn1}</span>
                                      <span>In {s2Name}: position ~{section.startIn2}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Side by side preview */}
                        {sub1 && sub2 && (
                          <div className="grid sm:grid-cols-2 gap-3">
                            {[{ sub: sub1, name: s1Name }, { sub: sub2, name: s2Name }].map(({ sub, name }) => (
                              <div key={sub.id} className="rounded-xl border border-slate-200 overflow-hidden">
                                <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-xs font-medium text-slate-600">
                                  {name} — {sub.fileName}
                                </div>
                                <div className="p-3 max-h-40 overflow-auto">
                                  <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">
                                    {sub.content.slice(0, 500)}{sub.content.length > 500 ? '...' : ''}
                                  </pre>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab: Heatmap */}
          {tab === 'heatmap' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-5">Similarity Heatmap</h2>
              <div className="overflow-auto">
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="w-32 h-12"></th>
                      {heatmapStudents.map(s => (
                        <th key={s.id} className="w-24 h-12 text-center">
                          <div className="text-xs font-medium text-slate-600 truncate max-w-[88px] -rotate-45 transform origin-left ml-4">{s.name}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapStudents.map((row, ri) => (
                      <tr key={row.id}>
                        <td className="w-32 pr-3 text-right text-xs font-medium text-slate-600 truncate max-w-[120px]">{row.name}</td>
                        {heatmapStudents.map((col, ci) => {
                          if (ri === ci) {
                            return <td key={col.id} className="w-24 h-10 bg-slate-200 border border-white" title="Same student" />;
                          }
                          const pairKey1 = simResult.pairs.find(p =>
                            (p.submission1Id === row.id && p.submission2Id === col.id) ||
                            (p.submission2Id === row.id && p.submission1Id === col.id)
                          );
                          const sim = pairKey1?.similarity ?? 0;
                          const intensity = Math.round(sim * 255);
                          const bgColor = sim >= 0.7 ? `rgba(239,68,68,${sim})` : sim >= 0.5 ? `rgba(249,115,22,${sim})` : sim >= 0.3 ? `rgba(234,179,8,${sim * 1.5})` : `rgba(34,197,94,${sim * 2})`;
                          return (
                            <td
                              key={col.id}
                              className="w-24 h-10 border border-white text-center text-xs font-semibold cursor-default"
                              style={{ backgroundColor: bgColor, color: sim > 0.4 ? 'white' : '#374151' }}
                              title={`${row.name} ↔ ${col.name}: ${(sim * 100).toFixed(1)}%`}
                            >
                              {sim > 0 ? `${(sim * 100).toFixed(0)}%` : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">Color intensity indicates similarity level:</div>
                {[['rgba(34,197,94,0.6)', 'Low'], ['rgba(234,179,8,0.8)', 'Med'], ['rgba(249,115,22,0.7)', 'High'], ['rgba(239,68,68,0.9)', 'Very High']].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ background: c }}></div>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
