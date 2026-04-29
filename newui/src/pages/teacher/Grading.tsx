import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, Save, CheckCircle, ChevronLeft, ChevronRight,
  Award, FileText, Eye, Download, User
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { getSimilarityBg } from '../../store/similarity';
import { exportToExcel, exportToPDF } from '../../store/exportUtils';
import type { RubricGrade, Submission } from '../../store/types';
import { toast } from 'sonner';

export default function Grading() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAssignmentById, getSubmissionsForAssignment, users, updateSubmission, getSimilarityResult } = useApp();

  const assignment = getAssignmentById(id ?? '');
  const submissions = getSubmissionsForAssignment(id ?? '');
  const simResult = getSimilarityResult(id ?? '');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gradingMode, setGradingMode] = useState<'rubric' | 'direct'>('rubric');
  const [showContent, setShowContent] = useState(false);
  const [saved, setSaved] = useState(false);

  const sub = submissions[currentIdx];

  const [directGrade, setDirectGrade] = useState<number | ''>(sub?.grade ?? '');
  const [feedback, setFeedback] = useState(sub?.feedback ?? '');
  const [rubricGrades, setRubricGrades] = useState<RubricGrade[]>(
    assignment?.rubric.map(r => {
      const existing = sub?.rubricGrades?.find(rg => rg.criterionId === r.id);
      return existing ?? { criterionId: r.id, marks: 0, comment: '' };
    }) ?? []
  );

  // Sync state when switching students
  useEffect(() => {
    if (!sub || !assignment) return;
    setDirectGrade(sub.grade ?? '');
    setFeedback(sub.feedback ?? '');
    setRubricGrades(
      assignment.rubric.map(r => {
        const existing = sub.rubricGrades?.find(rg => rg.criterionId === r.id);
        return existing ?? { criterionId: r.id, marks: 0, comment: '' };
      })
    );
    setSaved(false);
  }, [currentIdx, sub?.id]);

  if (!assignment) return <div className="p-6 text-slate-500">Assignment not found.</div>;
  if (submissions.length === 0) {
    return (
      <div className="p-6 text-center">
        <FileText size={48} className="mx-auto mb-3 text-slate-300" />
        <div className="text-slate-500 font-medium">No submissions to grade</div>
        <button onClick={() => navigate(-1)} className="mt-3 text-blue-600 text-sm hover:underline">Go back</button>
      </div>
    );
  }

  const rubricTotal = rubricGrades.reduce((a, r) => a + (r.marks || 0), 0);
  const computedGrade = gradingMode === 'rubric' ? rubricTotal : (directGrade === '' ? 0 : directGrade);

  const handleSave = () => {
    const updatedSub: Submission = {
      ...sub,
      grade: Number(computedGrade),
      feedback,
      rubricGrades: gradingMode === 'rubric' ? rubricGrades : sub.rubricGrades,
    };
    updateSubmission(updatedSub);
    setSaved(true);
    toast.success(`Saved grade ${computedGrade}/${assignment.totalMarks} for ${users.find(u => u.id === sub.studentId)?.name}`);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveAndNext = () => {
    handleSave();
    if (currentIdx < submissions.length - 1) {
      setTimeout(() => setCurrentIdx(i => i + 1), 300);
    }
  };

  const getStudentName = (studentId: string) => users.find(u => u.id === studentId)?.name ?? studentId;
  const simScore = simResult?.pairs.find(p => p.submission1Id === sub.id || p.submission2Id === sub.id);
  const maxSim = sub.maxSimilarity;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 flex-shrink-0">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">Grade Submissions</h1>
          <p className="text-slate-500 text-sm">{assignment.title}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { exportToExcel(assignment, submissions, users, simResult); toast.success('Exported!'); }} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-medium">
            <Download size={13} /> Excel
          </button>
          <button onClick={() => { exportToPDF(assignment, submissions, users, simResult); toast.success('PDF started!'); }} className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium">
            <Download size={13} /> PDF
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Left: Student List */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
            <div className="text-sm font-semibold text-slate-700">Students</div>
            <div className="text-xs text-slate-400">{submissions.filter(s => s.grade !== undefined).length}/{submissions.length} graded</div>
          </div>
          <div className="overflow-auto max-h-[calc(100vh-300px)]">
            {submissions.map((s, i) => {
              const student = users.find(u => u.id === s.studentId);
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentIdx(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 transition-colors
                    ${i === currentIdx ? 'bg-blue-50 border-l-2 border-l-blue-600' : 'hover:bg-slate-50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === currentIdx ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {student?.name?.charAt(0) ?? '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-slate-700 truncate">{student?.name ?? s.studentId}</div>
                    <div className="text-xs text-slate-400 truncate">{s.fileName}</div>
                  </div>
                  {s.grade !== undefined ? (
                    <span className="text-xs font-semibold text-green-600 flex-shrink-0">{s.grade}</span>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Grading Panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Student Header */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <User size={22} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{getStudentName(sub.studentId)}</div>
                  <div className="text-sm text-slate-500">{users.find(u => u.id === sub.studentId)?.email}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Submitted: {new Date(sub.submittedAt).toLocaleString()} • {sub.fileName}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {maxSim !== undefined && (
                  <div className="text-center">
                    <div className={`text-sm font-bold px-3 py-1.5 rounded-xl border ${getSimilarityBg(maxSim)}`}>
                      {(maxSim * 100).toFixed(0)}% sim
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Max similarity</div>
                  </div>
                )}
                <div className="text-center">
                  <div className={`text-2xl font-bold ${sub.grade !== undefined ? 'text-green-600' : 'text-slate-300'}`}>
                    {sub.grade !== undefined ? sub.grade : '—'}
                  </div>
                  <div className="text-xs text-slate-400">/{assignment.totalMarks}</div>
                </div>
              </div>
            </div>

            {/* Submission Content Toggle */}
            <button
              onClick={() => setShowContent(!showContent)}
              className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Eye size={15} /> {showContent ? 'Hide' : 'View'} Submission Content
            </button>
            {showContent && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="px-4 py-2 bg-slate-100 text-xs font-medium text-slate-600">{sub.fileName}</div>
                <pre className="p-4 text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-auto">{sub.content}</pre>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm text-slate-500">{currentIdx + 1} of {submissions.length}</span>
            <button
              onClick={() => setCurrentIdx(i => Math.min(submissions.length - 1, i + 1))}
              disabled={currentIdx === submissions.length - 1}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-40 transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          {/* Grading Mode Toggle */}
          {assignment.rubric.length > 0 && (
            <div className="flex bg-slate-100 rounded-xl p-1 w-fit">
              <button
                onClick={() => setGradingMode('rubric')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${gradingMode === 'rubric' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Rubric-Based
              </button>
              <button
                onClick={() => setGradingMode('direct')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${gradingMode === 'direct' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Direct Score
              </button>
            </div>
          )}

          {/* Rubric Grading */}
          {gradingMode === 'rubric' && assignment.rubric.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800">Rubric Grading</h2>
                <div className={`text-sm font-bold px-3 py-1 rounded-xl border ${rubricTotal > assignment.totalMarks ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                  {rubricTotal}/{assignment.totalMarks}
                </div>
              </div>
              <div className="space-y-4">
                {assignment.rubric.map(criterion => {
                  const rg = rubricGrades.find(r => r.criterionId === criterion.id);
                  return (
                    <div key={criterion.id} className="border border-slate-100 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-800">{criterion.criterion}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{criterion.description}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <input
                            type="number"
                            min={0}
                            max={criterion.maxMarks}
                            value={rg?.marks ?? 0}
                            onChange={e => setRubricGrades(prev => prev.map(r =>
                              r.criterionId === criterion.id ? { ...r, marks: Math.min(criterion.maxMarks, Math.max(0, Number(e.target.value))) } : r
                            ))}
                            className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-400">/{criterion.maxMarks}</span>
                        </div>
                      </div>
                      {/* Quick mark buttons */}
                      <div className="flex gap-1.5 mb-3 flex-wrap">
                        {[0, Math.floor(criterion.maxMarks * 0.5), Math.floor(criterion.maxMarks * 0.75), criterion.maxMarks].map(v => (
                          <button
                            key={v}
                            onClick={() => setRubricGrades(prev => prev.map(r => r.criterionId === criterion.id ? { ...r, marks: v } : r))}
                            className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${rg?.marks === v ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                      {/* Progress bar */}
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${criterion.maxMarks > 0 ? ((rg?.marks ?? 0) / criterion.maxMarks) * 100 : 0}%` }} />
                      </div>
                      <input
                        type="text"
                        placeholder="Comment (optional)..."
                        value={rg?.comment ?? ''}
                        onChange={e => setRubricGrades(prev => prev.map(r =>
                          r.criterionId === criterion.id ? { ...r, comment: e.target.value } : r
                        ))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Direct Grade */}
          {(gradingMode === 'direct' || assignment.rubric.length === 0) && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="font-semibold text-slate-800 mb-4">Direct Score</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-slate-600 mb-1.5">Score (out of {assignment.totalMarks})</label>
                  <input
                    type="number"
                    min={0}
                    max={assignment.totalMarks}
                    value={directGrade}
                    onChange={e => setDirectGrade(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="text-4xl font-bold text-slate-300">/{assignment.totalMarks}</div>
              </div>
              {directGrade !== '' && (
                <div className="mt-3">
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(Number(directGrade) / assignment.totalMarks) * 100}%` }} />
                  </div>
                  <div className="text-xs text-slate-400 mt-1 text-right">{((Number(directGrade) / assignment.totalMarks) * 100).toFixed(1)}%</div>
                </div>
              )}
            </div>
          )}

          {/* Feedback */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <label className="block font-semibold text-slate-800 mb-3">Feedback to Student</label>
            <textarea
              rows={4}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Write constructive feedback for the student..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Save Buttons */}
          <div className="flex gap-3 justify-end pb-4">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${saved ? 'bg-green-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
            >
              {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Grade</>}
            </button>
            {currentIdx < submissions.length - 1 && (
              <button
                onClick={handleSaveAndNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Save & Next <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
