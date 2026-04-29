import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Trash2, ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import type { Assignment, RubricItem, Department } from '../../store/types';

const DEPARTMENTS: Department[] = ['CSE', 'EE', 'ME', 'ECE'];
const FILE_TYPES_BY_DEPT: Record<Department, string[]> = {
  CSE: ['.pdf', '.docx', '.txt', '.py', '.cpp', '.java', '.js', '.c', '.zip'],
  EE: ['.pdf', '.docx', '.txt'],
  ME: ['.pdf', '.docx', '.txt'],
  ECE: ['.pdf', '.docx', '.txt', '.m', '.py'],
};

export default function CreateAssignment() {
  const { currentUser, addAssignment } = useApp();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subject: 'CSE' as Department,
    description: '',
    deadline: '',
    totalMarks: 100,
  });

  const [rubric, setRubric] = useState<RubricItem[]>([
    { id: 'r1', criterion: '', maxMarks: 0, description: '' },
  ]);

  const rubricTotal = rubric.reduce((a, r) => a + (r.maxMarks || 0), 0);

  const addRubricRow = () => {
    setRubric(prev => [...prev, { id: `r${Date.now()}`, criterion: '', maxMarks: 0, description: '' }]);
  };

  const removeRubricRow = (id: string) => {
    setRubric(prev => prev.filter(r => r.id !== id));
  };

  const updateRubric = (id: string, field: keyof RubricItem, value: string | number) => {
    setRubric(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignment: Assignment = {
      id: `assign-${Date.now()}`,
      ...form,
      teacherId: currentUser?.id ?? '',
      createdAt: new Date().toISOString().split('T')[0],
      rubric: rubric.filter(r => r.criterion.trim()),
      allowedFileTypes: FILE_TYPES_BY_DEPT[form.subject],
    };
    addAssignment(assignment);
    setSaved(true);
    setTimeout(() => navigate('/teacher/assignments'), 1500);
  };

  if (saved) {
    return (
      <div className="flex items-center justify-center h-full min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <div className="text-slate-800 font-semibold text-lg">Assignment Created!</div>
          <div className="text-slate-500 text-sm mt-1">Redirecting to assignments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Create Assignment</h1>
          <p className="text-slate-500 text-sm">Set up a new assignment for your students</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-800">Assignment Details</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Assignment Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g., Analysis of Sorting Algorithms"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject / Department *</label>
              <select
                value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value as Department }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Deadline *</label>
              <input
                type="date"
                required
                value={form.deadline}
                onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Marks *</label>
              <input
                type="number"
                required
                min={1}
                max={500}
                value={form.totalMarks}
                onChange={e => setForm(p => ({ ...p, totalMarks: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description / Instructions</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe the assignment requirements, expected format, etc."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none"
              />
            </div>
          </div>

          {/* Allowed File Types */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Allowed File Types</label>
            <div className="flex flex-wrap gap-2">
              {FILE_TYPES_BY_DEPT[form.subject].map(ft => (
                <span key={ft} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100">{ft}</span>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">File types automatically set based on selected department</p>
          </div>
        </div>

        {/* Rubric */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-slate-800">Grading Rubric</h2>
              <p className="text-xs text-slate-400 mt-0.5">Optional: Add criteria for rubric-based grading</p>
            </div>
            <div className={`text-xs font-medium px-3 py-1 rounded-full ${rubricTotal === form.totalMarks ? 'bg-green-100 text-green-700' : rubricTotal > form.totalMarks ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {rubricTotal}/{form.totalMarks} marks assigned
            </div>
          </div>

          <div className="space-y-3">
            {/* Header */}
            <div className="hidden sm:grid grid-cols-12 gap-3 text-xs font-semibold text-slate-500 px-1">
              <div className="col-span-4">Criterion</div>
              <div className="col-span-2 text-center">Max Marks</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-1"></div>
            </div>

            {rubric.map((row, idx) => (
              <div key={row.id} className="grid sm:grid-cols-12 gap-3 items-start">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder={`Criterion ${idx + 1}`}
                    value={row.criterion}
                    onChange={e => updateRubric(row.id, 'criterion', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    placeholder="Marks"
                    min={0}
                    value={row.maxMarks || ''}
                    onChange={e => updateRubric(row.id, 'maxMarks', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    placeholder="Brief description..."
                    value={row.description}
                    onChange={e => updateRubric(row.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeRubricRow(row.id)}
                    disabled={rubric.length === 1}
                    className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRubricRow}
            className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Plus size={16} /> Add Criterion
          </button>
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Create Assignment
          </button>
        </div>
      </form>
    </div>
  );
}
