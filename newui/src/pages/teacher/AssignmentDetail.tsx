import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  ArrowLeft, Upload, FileText, Users, BarChart3, Award,
  Clock, AlertTriangle, CheckCircle, Eye, Trash2, Download, Plus
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { getSimilarityBg, getSimilarityLabel } from '../../store/similarity';
import type { Submission } from '../../store/types';
import { toast } from 'sonner';

export default function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAssignmentById, getSubmissionsForAssignment, users, addSubmission, runSimilarityCheck, getSimilarityResult } = useApp();
  const [checking, setChecking] = useState(false);
  const [viewContent, setViewContent] = useState<Submission | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const assignment = getAssignmentById(id ?? '');
  const submissions = getSubmissionsForAssignment(id ?? '');
  const simResult = getSimilarityResult(id ?? '');

  if (!assignment) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">Assignment not found.</div>
        <button onClick={() => navigate(-1)} className="mt-3 text-blue-600 text-sm hover:underline">Go back</button>
      </div>
    );
  }

  const graded = submissions.filter(s => s.grade !== undefined).length;
  const highSim = submissions.filter(s => (s.maxSimilarity ?? 0) >= 0.6).length;

  const handleRunSimilarity = async () => {
    if (submissions.length < 2) {
      toast.error('Need at least 2 submissions to run similarity check.');
      return;
    }
    setChecking(true);
    await new Promise(r => setTimeout(r, 2000)); // simulate processing
    runSimilarityCheck(id ?? '');
    setChecking(false);
    toast.success('Similarity check complete!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // We need a student selection - for teacher upload, we'll simulate adding for a "demo student"
    // In a real app, teacher would select which student's submission this is
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string ?? '';
        const newSub: Submission = {
          id: `sub-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          assignmentId: id ?? '',
          studentId: 'student-temp',
          fileName: file.name,
          fileType: file.name.split('.').pop() ?? 'txt',
          content: content.slice(0, 5000),
          submittedAt: new Date().toISOString(),
        };
        addSubmission(newSub);
        toast.success(`Uploaded: ${file.name}`);
      };
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.match(/\.(py|cpp|java|js|c|m|ts)$/)) {
        reader.readAsText(file);
      } else {
        // For PDF/DOCX, we can't parse in browser - store filename only
        const newSub: Submission = {
          id: `sub-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          assignmentId: id ?? '',
          studentId: 'student-temp',
          fileName: file.name,
          fileType: file.name.split('.').pop() ?? '',
          content: `[Binary file: ${file.name} - content extraction requires server-side processing]`,
          submittedAt: new Date().toISOString(),
        };
        addSubmission(newSub);
        toast.success(`Uploaded: ${file.name}`);
      }
    });
    e.target.value = '';
  };

  const getStudentName = (studentId: string) => {
    const u = users.find(u => u.id === studentId);
    return u?.name ?? studentId;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 mt-1 flex-shrink-0">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{assignment.subject}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${new Date(assignment.deadline) < new Date() ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'}`}>
              {new Date(assignment.deadline) < new Date() ? 'Closed' : 'Active'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{assignment.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{assignment.description}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link to={`/teacher/assignments/${id}/similarity`} className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl text-xs font-medium transition-colors">
            <BarChart3 size={14} /> Similarity
          </Link>
          <Link to={`/teacher/assignments/${id}/grade`} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition-colors">
            <Award size={14} /> Grade All
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Submissions', value: submissions.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Graded', value: graded, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending Grade', value: submissions.length - graded, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'High Similarity', value: highSim, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-2`}>
              <Icon size={18} className={color} />
            </div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Assignment Info Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Details */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Assignment Info</h2>
          <dl className="space-y-3">
            {[
              { label: 'Total Marks', value: `${assignment.totalMarks} marks` },
              { label: 'Deadline', value: assignment.deadline },
              { label: 'Created', value: assignment.createdAt },
              { label: 'Allowed Files', value: assignment.allowedFileTypes.join(', ') },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start">
                <dt className="text-sm text-gray-500">{label}</dt>
                <dd className="text-sm font-medium text-gray-700 text-right max-w-[60%]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Rubric */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Grading Rubric</h2>
          {assignment.rubric.length > 0 ? (
            <div className="space-y-2">
              {assignment.rubric.map(r => (
                <div key={r.id} className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-gray-700">{r.criterion}</div>
                    <div className="text-xs text-gray-400">{r.description}</div>
                  </div>
                  <div className="text-sm font-semibold text-blue-600 flex-shrink-0">{r.maxMarks}pts</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400">No rubric defined. Manual grading only.</div>
          )}
        </div>
      </div>

      {/* Similarity Action */}
      <div className={`rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${simResult ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
        <div>
          {simResult ? (
            <>
              <div className="font-semibold text-green-800 flex items-center gap-2"><CheckCircle size={16} /> Similarity Check Completed</div>
              <div className="text-sm text-green-700 mt-0.5">Last run: {new Date(simResult.computedAt).toLocaleString()}</div>
            </>
          ) : (
            <>
              <div className="font-semibold text-orange-800 flex items-center gap-2"><AlertTriangle size={16} /> Similarity Check Not Run</div>
              <div className="text-sm text-orange-700 mt-0.5">Run a check to detect plagiarism between {submissions.length} submissions</div>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRunSimilarity}
            disabled={checking || submissions.length < 2}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white rounded-xl text-sm font-medium transition-colors"
          >
            {checking ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running...</>
            ) : (
              <><BarChart3 size={15} /> {simResult ? 'Re-run Check' : 'Run Similarity Check'}</>
            )}
          </button>
          {simResult && (
            <Link to={`/teacher/assignments/${id}/similarity`} className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 hover:bg-green-50 text-green-700 rounded-xl text-sm font-medium transition-colors">
              <Eye size={15} /> View Report
            </Link>
          )}
        </div>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Add Submission</h2>
          <span className="text-xs text-gray-400">Drag & drop or click to upload</span>
        </div>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-8 text-center cursor-pointer transition-colors group"
        >
          <Upload size={28} className="mx-auto mb-2 text-gray-300 group-hover:text-blue-500 transition-colors" />
          <div className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Click to upload submission files</div>
          <div className="text-xs text-gray-400 mt-1">{assignment.allowedFileTypes.join(', ')}</div>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />
        </div>
        <div className="mt-3 p-3 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-2">
            <Plus size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">In production, students submit via the Student Portal. Teachers can also upload on behalf of students here. PDF/DOCX content extraction requires server-side processing.</p>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Users size={18} className="text-gray-400" /> Submissions ({submissions.length})
          </h2>
          <Link to={`/teacher/assignments/${id}/grade`} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
            Grade All <Award size={14} />
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <div>No submissions yet</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">File</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Submitted</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Similarity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Grade</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-600">{getStudentName(sub.studentId).charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{getStudentName(sub.studentId)}</div>
                          <div className="text-xs text-gray-400">{users.find(u => u.id === sub.studentId)?.email ?? sub.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <FileText size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600 max-w-[150px] truncate">{sub.fileName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      {sub.maxSimilarity !== undefined ? (
                        <div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getSimilarityBg(sub.maxSimilarity)}`}>
                            {(sub.maxSimilarity * 100).toFixed(0)}%
                          </span>
                          <div className="text-xs text-gray-400 mt-0.5">{getSimilarityLabel(sub.maxSimilarity)}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Not checked</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {sub.grade !== undefined ? (
                        <div>
                          <span className="text-sm font-semibold text-green-600">{sub.grade}</span>
                          <span className="text-sm text-gray-400">/{assignment.totalMarks}</span>
                        </div>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Not graded</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewContent(sub)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View content"
                        >
                          <Eye size={15} />
                        </button>
                        <Link
                          to={`/teacher/assignments/${id}/grade`}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Grade"
                        >
                          <Award size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Content Viewer Modal */}
      {viewContent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <div className="font-semibold text-gray-800">{viewContent.fileName}</div>
                <div className="text-xs text-gray-500">{getStudentName(viewContent.studentId)}</div>
              </div>
              <button onClick={() => setViewContent(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{viewContent.content}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

