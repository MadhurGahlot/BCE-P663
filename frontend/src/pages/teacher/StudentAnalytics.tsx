import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, User, BookOpen, AlertTriangle, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../../store/AppContext';
import api from '../../services/api';

interface HistoryRecord {
  assignment_id: number;
  grade: number | null;
  similarity: number;
  submitted_at: string;
}

export default function StudentAnalytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, getAssignmentById } = useApp();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const student = users.find(u => u.id === id);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/submissions/student/${id}/history`);
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHistory();
  }, [id]);

  if (!student) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">Student not found.</div>
        <button onClick={() => navigate(-1)} className="mt-3 text-blue-600 text-sm hover:underline">Go back</button>
      </div>
    );
  }

  const chartData = history.map(record => {
    const assign = getAssignmentById(record.assignment_id.toString());
    const gradePercent = record.grade !== null && assign?.totalMarks ? (record.grade / assign.totalMarks) * 100 : null;
    return {
      name: assign?.title || `Assn ${record.assignment_id}`,
      grade: gradePercent,
      similarity: record.similarity * 100, // Assuming similarity is 0-1
      date: new Date(record.submitted_at).toLocaleDateString(),
    };
  });

  const gradedCount = history.filter(h => h.grade !== null).length;
  const avgGrade = gradedCount > 0 ? chartData.reduce((acc, curr) => acc + (curr.grade || 0), 0) / gradedCount : 0;
  const avgSim = history.length > 0 ? chartData.reduce((acc, curr) => acc + curr.similarity, 0) / history.length : 0;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 flex-shrink-0">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Performance history for {student.name}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <User size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500">Student</div>
            <div className="font-bold text-gray-800 leading-tight">{student.name}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500">Submissions</div>
            <div className="font-bold text-gray-800 text-xl">{history.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Star size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500">Avg Grade</div>
            <div className="font-bold text-gray-800 text-xl">{avgGrade.toFixed(1)}%</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500">Avg Similarity</div>
            <div className="font-bold text-gray-800 text-xl">{avgSim.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-6">Performance Timeline</h2>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-400">
            No submissions recorded yet.
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis yAxisId="left" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line yAxisId="left" type="monotone" name="Grade %" dataKey="grade" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" name="Similarity %" dataKey="similarity" stroke="#ef4444" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
