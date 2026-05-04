import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Upload, FileText, CheckCircle, X, AlertCircle, Code } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import api from '../../services/api';
import type { RubricItem } from '../../store/types';
import { toast } from 'sonner';

const FILE_ICONS: Record<string, string> = {
  pdf: '📄', docx: '📝', txt: '📃', py: '🐍', cpp: '⚙️', java: '☕',
  js: '🟨', ts: '🔷', c: '⚙️', m: '📊', zip: '📦',
};

export default function SubmitAssignment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const [assignment, setAssignment] = useState<any>(null);
  const [existingSub, setExistingSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [mode, setMode] = useState<'file' | 'paste'>('file');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fetchDetails = async () => {
      try {
        const assignRes = await api.get(`/assignments/${id}`);
        // Map backend formatting to frontend
        const mappedAssign = {
          ...assignRes.data,
          id: assignRes.data.id.toString(),
          totalMarks: assignRes.data.total_marks,
          description: assignRes.data.description || `Assignment for ${assignRes.data.department}`,
          rubric: [] as RubricItem[], // Mock empty rubric since backend doesn't support
          allowedFileTypes: ['.pdf', '.txt', '.png', '.jpg', '.jpeg'],
        };
        setAssignment(mappedAssign);

        const subRes = await api.get(`/submissions/assignment/${id}`);
        if (subRes.data && subRes.data.length > 0) {
          setExistingSub({
            ...subRes.data[0],
            fileName: subRes.data[0].file_path ? subRes.data[0].file_path.split('/').pop() : 'Submission',
            submittedAt: new Date().toISOString(), // DB has created_at maybe, simplifying
          });
        }
      } catch (err) {
        console.error('Failed to load assignment', err);
      } finally {
        setLoading(false);
      }
    };
    if (id && currentUser?.id) {
      fetchDetails();
    }
  }, [id, currentUser?.id]);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!assignment) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <AlertCircle size={40} className="mx-auto mb-3 text-red-400" />
        <div className="text-gray-600">Assignment not found.</div>
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Already Submitted!</h2>
          <p className="text-gray-500 text-sm mb-1">You submitted <span className="font-medium">{existingSub.fileName}</span></p>
          <p className="text-gray-400 text-xs mb-6">on {new Date(existingSub.submittedAt).toLocaleString()}</p>

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

    try {
      const formData = new FormData();
      formData.append('assignment_id', id ?? '');
      formData.append('student_id', currentUser?.id ?? '');

      if (mode === 'file' && file) {
        formData.append('file', file);
      } else if (mode === 'paste') {
        const blob = new Blob([textContent], { type: 'text/plain' });
        const fileName = `submission_${currentUser?.name?.replace(/\s/g, '_') || 'student'}.txt`;
        formData.append('file', blob, fileName);
      }

      await api.post('/submissions/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setDone(true);
      toast.success('Assignment submitted successfully!');
    } catch (error) {
      console.error('Submission failed', error);
      toast.error('Failed to submit assignment. Ensure your file size < 25MB and format is allowed (.pdf, .txt, .jpg).');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Submitted Successfully!</h2>
          <p className="text-gray-500 text-sm mb-6">Your assignment has been submitted. Your teacher will grade it soon.</p>
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
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Submit Assignment</h1>
          <p className="text-gray-500 text-sm">{assignment.title}</p>
        </div>
      </div>

      {/* Assignment Info */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="font-semibold text-gray-800">{assignment.title}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex-shrink-0">{assignment.subject}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 rounded-xl p-2.5">
            <div className="text-sm font-semibold text-gray-700">{assignment.totalMarks}</div>
            <div className="text-xs text-gray-400">Total Marks</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5">
            <div className={`text-sm font-semibold ${isPast ? 'text-red-600' : daysLeft <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
              {isPast ? 'Closed' : `${daysLeft}d left`}
            </div>
            <div className="text-xs text-gray-400">Deadline</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5">
            <div className="text-sm font-semibold text-gray-700">{assignment.rubric.length}</div>
            <div className="text-xs text-gray-400">Rubric Items</div>
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
      <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setMode('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <Upload size={15} /> Upload File
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'paste' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <Code size={15} /> Paste Content
        </button>
      </div>

      {/* File Upload */}
      {mode === 'file' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-8 text-center cursor-pointer transition-colors group"
          >
            <Upload size={32} className="mx-auto mb-3 text-gray-300 group-hover:text-blue-500 transition-colors" />
            <div className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
              Drop your file here or click to browse
            </div>
            <div className="text-xs text-gray-400 mt-2">Accepted: {assignment.allowedFileTypes.join(', ')}</div>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect} />
          </div>

          {file && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-2xl">{FILE_ICONS[file.name.split('.').pop() ?? ''] ?? '📄'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
              <button onClick={() => { setFile(null); setTextContent(''); }} className="p-1 text-gray-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
          )}

          {file && textContent && (
            <div className="mt-3 rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-600">Content Preview</div>
              <pre className="p-4 text-xs text-gray-600 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-auto">{textContent.slice(0, 1000)}{textContent.length > 1000 ? '\n...' : ''}</pre>
            </div>
          )}
        </div>
      )}

      {/* Paste Mode */}
      {mode === 'paste' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <label className="block font-semibold text-gray-800 mb-3">
            Paste your content below
            <span className="ml-2 text-xs font-normal text-gray-400">(code, text, answers)</span>
          </label>
          <textarea
            rows={14}
            value={textContent}
            onChange={e => setTextContent(e.target.value)}
            placeholder="Paste your assignment content here..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
          />
          <div className="text-xs text-gray-400 mt-1.5 text-right">{textContent.length} characters</div>
        </div>
      )}

      {/* Rubric Preview */}
      {assignment.rubric.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Grading Rubric</h2>
          <div className="space-y-2">
            {assignment.rubric.map(r => (
              <div key={r.id} className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-gray-700">{r.criterion}</div>
                  <div className="text-xs text-gray-400">{r.description}</div>
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
      <p className="text-xs text-gray-400 text-center">By submitting, you confirm this is your own work. Plagiarism will be detected.</p>
    </div>
  );
}

