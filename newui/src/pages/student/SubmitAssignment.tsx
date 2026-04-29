import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Upload, FileText, CheckCircle, X, AlertCircle, Code } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import type { Submission } from '../../store/types';
import { toast } from 'sonner';

const FILE_ICONS: Record<string, string> = {
  pdf: '📄', docx: '📝', txt: '📃', py: '🐍', cpp: '⚙️', java: '☕',
  js: '🟨', ts: '🔷', c: '⚙️', m: '📊', zip: '📦',
};

export default function SubmitAssignment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, getAssignmentById, getStudentSubmissions, addSubmission } = useApp();

  const assignment = getAssignmentById(id ?? '');
  const mySubmissions = getStudentSubmissions(currentUser?.id ?? '');
  const existingSub = mySubmissions.find(s => s.assignmentId === id);

  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [mode, setMode] = useState<'file' | 'paste'>('file');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!assignment) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <AlertCircle size={40} className="mx-auto mb-3 text-red-400" />
        <div className="text-slate-600">Assignment not found.</div>
        <button onClick={() => navigate(-1)} className="mt-3 text-blue-600 hover:underline text-sm">Go back</button>
      </div>
    );
  }

  if (existingSub) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Already Submitted!</h2>
          <p className="text-slate-500 text-sm mb-1">You submitted <span className="font-medium">{existingSub.fileName}</span></p>
          <p className="text-slate-400 text-xs mb-6">on {new Date(existingSub.submittedAt).toLocaleString()}</p>

          {existingSub.grade !== undefined ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="text-2xl font-bold text-green-600 mb-1">{existingSub.grade}/{assignment.totalMarks}</div>
              <div className="text-sm text-green-700">{((existingSub.grade / assignment.totalMarks) * 100).toFixed(1)}% Score</div>
              {existingSub.feedback && <p className="text-sm text-green-800 mt-2 italic">"{existingSub.feedback}"</p>}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="text-sm text-yellow-700">Your submission is under review. Grade will be visible once your teacher grades it.</div>
            </div>
          )}

          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);

    const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
    const isText = ['txt', 'py', 'cpp', 'java', 'js', 'ts', 'c', 'm'].includes(ext);

    if (isText) {
      const reader = new FileReader();
      reader.onload = ev => setTextContent(ev.target?.result as string ?? '');
      reader.readAsText(f);
    } else {
      setTextContent('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFile(f);
    const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
    const isText = ['txt', 'py', 'cpp', 'java', 'js', 'ts', 'c', 'm'].includes(ext);
    if (isText) {
      const reader = new FileReader();
      reader.onload = ev => setTextContent(ev.target?.result as string ?? '');
      reader.readAsText(f);
    }
  };

  const handleSubmit = async () => {
    if (mode === 'file' && !file) { toast.error('Please select a file.'); return; }
    if (mode === 'paste' && !textContent.trim()) { toast.error('Please enter your submission content.'); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));

    const fileName = mode === 'paste' ? `submission_${currentUser?.name?.replace(/\s/g, '_')}.txt` : file!.name;
    const fileType = fileName.split('.').pop() ?? 'txt';
    const content = mode === 'paste' ? textContent : (textContent || `[${fileType.toUpperCase()} file: content extraction requires server-side processing]`);

    const sub: Submission = {
      id: `sub-${Date.now()}-${currentUser?.id}`,
      assignmentId: id ?? '',
      studentId: currentUser?.id ?? '',
      fileName,
      fileType,
      content: content.slice(0, 8000),
      submittedAt: new Date().toISOString(),
    };

    addSubmission(sub);
    setSubmitting(false);
    setDone(true);
    toast.success('Assignment submitted successfully!');
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Submitted Successfully!</h2>
          <p className="text-slate-500 text-sm mb-6">Your assignment has been submitted. Your teacher will grade it soon.</p>
          <button onClick={() => navigate('/student')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isPast = new Date(assignment.deadline) < new Date();
  const daysLeft = Math.ceil((new Date(assignment.deadline).getTime() - Date.now()) / 86400000);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Submit Assignment</h1>
          <p className="text-slate-500 text-sm">{assignment.title}</p>
        </div>
      </div>

      {/* Assignment Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="font-semibold text-slate-800">{assignment.title}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex-shrink-0">{assignment.subject}</span>
        </div>
        <p className="text-sm text-slate-600 mb-4">{assignment.description}</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-50 rounded-xl p-2.5">
            <div className="text-sm font-semibold text-slate-700">{assignment.totalMarks}</div>
            <div className="text-xs text-slate-400">Total Marks</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5">
            <div className={`text-sm font-semibold ${isPast ? 'text-red-600' : daysLeft <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
              {isPast ? 'Closed' : `${daysLeft}d left`}
            </div>
            <div className="text-xs text-slate-400">Deadline</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5">
            <div className="text-sm font-semibold text-slate-700">{assignment.rubric.length}</div>
            <div className="text-xs text-slate-400">Rubric Items</div>
          </div>
        </div>
      </div>

      {isPast && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
          <div className="text-sm text-red-700">The deadline has passed. Late submissions may not be accepted.</div>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setMode('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          <Upload size={15} /> Upload File
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'paste' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          <Code size={15} /> Paste Content
        </button>
      </div>

      {/* File Upload */}
      {mode === 'file' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-8 text-center cursor-pointer transition-colors group"
          >
            <Upload size={32} className="mx-auto mb-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
            <div className="text-sm font-medium text-slate-600 group-hover:text-blue-600">
              Drop your file here or click to browse
            </div>
            <div className="text-xs text-slate-400 mt-2">Accepted: {assignment.allowedFileTypes.join(', ')}</div>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect} />
          </div>

          {file && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-2xl">{FILE_ICONS[file.name.split('.').pop() ?? ''] ?? '📄'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-800 truncate">{file.name}</div>
                <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
              <button onClick={() => { setFile(null); setTextContent(''); }} className="p-1 text-slate-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
          )}

          {file && textContent && (
            <div className="mt-3 rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-medium text-slate-600">Content Preview</div>
              <pre className="p-4 text-xs text-slate-600 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-auto">{textContent.slice(0, 1000)}{textContent.length > 1000 ? '\n...' : ''}</pre>
            </div>
          )}
        </div>
      )}

      {/* Paste Mode */}
      {mode === 'paste' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <label className="block font-semibold text-slate-800 mb-3">
            Paste your content below
            <span className="ml-2 text-xs font-normal text-slate-400">(code, text, answers)</span>
          </label>
          <textarea
            rows={14}
            value={textContent}
            onChange={e => setTextContent(e.target.value)}
            placeholder="Paste your assignment content here..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
          />
          <div className="text-xs text-slate-400 mt-1.5 text-right">{textContent.length} characters</div>
        </div>
      )}

      {/* Rubric Preview */}
      {assignment.rubric.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-3">Grading Rubric</h2>
          <div className="space-y-2">
            {assignment.rubric.map(r => (
              <div key={r.id} className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-slate-700">{r.criterion}</div>
                  <div className="text-xs text-slate-400">{r.description}</div>
                </div>
                <span className="text-xs font-semibold text-blue-600 flex-shrink-0">{r.maxMarks}pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitting || (mode === 'file' && !file) || (mode === 'paste' && !textContent.trim())}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-medium transition-colors text-sm"
      >
        {submitting ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
        ) : (
          <><CheckCircle size={16} /> Submit Assignment</>
        )}
      </button>
      <p className="text-xs text-slate-400 text-center">By submitting, you confirm this is your own work. Plagiarism will be detected.</p>
    </div>
  );
}
