import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Award, CheckCircle, Clock, FileText, AlertTriangle, Star } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { getSimilarityBg } from '../../store/similarity';

export default function ViewGrade() {
  const { subId } = useParams<{ subId: string }>();
  const navigate = useNavigate();
  const { submissions, assignments, users } = useApp();

  const sub = submissions.find(s => s.id === subId);
  const assignment = sub ? assignments.find(a => a.id === sub.assignmentId) : null;
  const teacher = assignment ? users.find(u => u.id === assignment.teacherId) : null;

  if (!sub || !assignment) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="text-gray-500">Submission not found.</div>
        <button onClick={() => navigate(-1)} className="mt-3 text-blue-600 hover:underline text-sm">Go back</button>
      </div>
    );
  }

  const isGraded = sub.grade !== undefined;
  const pct = isGraded ? ((sub.grade! / assignment.totalMarks) * 100) : null;
  const letterGrade = pct !== null
    ? pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F'
    : null;

  const gradeColor = pct !== null
    ? pct >= 75 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'
    : 'text-gray-400';

  const gradeGradient = pct !== null
    ? pct >= 75 ? 'from-green-500 to-teal-500' : pct >= 50 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-rose-500'
    : 'from-gray-400 to-gray-500';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Grade Details</h1>
          <p className="text-gray-500 text-sm">{assignment.title}</p>
        </div>
      </div>

      {/* Grade Card */}
      <div className={`bg-gradient-to-br ${gradeGradient} rounded-2xl p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-white/80 text-sm mb-1">{assignment.subject} • {assignment.title}</div>
            <div className="font-semibold">{teacher?.name ?? 'Teacher'}</div>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <Award size={28} className="text-white" />
          </div>
        </div>

        {isGraded ? (
          <div className="flex items-end justify-between">
            <div>
              <div className="text-5xl font-bold">{sub.grade}</div>
              <div className="text-white/80 text-lg">out of {assignment.totalMarks}</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{letterGrade}</div>
              <div className="text-white/80">{pct?.toFixed(1)}%</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Clock size={32} className="mx-auto mb-2 text-white/60" />
            <div className="text-lg font-semibold">Awaiting Grade</div>
            <div className="text-white/70 text-sm">Your teacher hasn't graded this yet</div>
          </div>
        )}
      </div>

      {/* Progress */}
      {isGraded && pct !== null && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Your Score</span>
            <span className={`font-bold ${gradeColor}`}>{pct.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all bg-gradient-to-r ${gradeGradient}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1.5">
            <span>0</span>
            <span className="text-red-400">50% (Pass)</span>
            <span className="text-green-400">100%</span>
          </div>
        </div>
      )}

      {/* Submission Info */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Submission Details</h2>
        <dl className="space-y-3">
          {[
            { label: 'File Submitted', value: sub.fileName, icon: FileText },
            { label: 'Submitted On', value: new Date(sub.submittedAt).toLocaleString(), icon: Clock },
            { label: 'Assignment Deadline', value: assignment.deadline, icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start justify-between gap-2">
              <dt className="text-sm text-gray-500 flex items-center gap-1.5"><Icon size={13} />{label}</dt>
              <dd className="text-sm font-medium text-gray-700 text-right">{value}</dd>
            </div>
          ))}
          {sub.maxSimilarity !== undefined && (
            <div className="flex items-start justify-between gap-2">
              <dt className="text-sm text-gray-500 flex items-center gap-1.5"><AlertTriangle size={13} />Similarity Score</dt>
              <dd>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getSimilarityBg(sub.maxSimilarity)}`}>
                  {(sub.maxSimilarity * 100).toFixed(0)}% match
                </span>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Feedback */}
      {sub.feedback && (
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-blue-600" fill="currentColor" />
            <h2 className="font-semibold text-blue-800">Teacher Feedback</h2>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed italic">"{sub.feedback}"</p>
          <div className="text-xs text-blue-600 mt-2">— {teacher?.name ?? 'Your Teacher'}</div>
        </div>
      )}

      {/* Rubric Breakdown */}
      {sub.rubricGrades && sub.rubricGrades.length > 0 && assignment.rubric.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Rubric Breakdown</h2>
          <div className="space-y-4">
            {assignment.rubric.map(criterion => {
              const rg = sub.rubricGrades!.find(r => r.criterionId === criterion.id);
              const marks = rg?.marks ?? 0;
              const pctCrit = (marks / criterion.maxMarks) * 100;

              return (
                <div key={criterion.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800">{criterion.criterion}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{criterion.description}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-base font-bold ${pctCrit >= 75 ? 'text-green-600' : pctCrit >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{marks}</span>
                      <span className="text-sm text-gray-400">/{criterion.maxMarks}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${pctCrit >= 75 ? 'bg-green-500' : pctCrit >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${pctCrit}%` }}
                    />
                  </div>
                  {rg?.comment && (
                    <p className="text-xs text-gray-500 italic mt-1">"{rg.comment}"</p>
                  )}
                  {!rg?.comment && (
                    <p className="text-xs text-gray-300 italic">No comment</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="font-semibold text-gray-700">Total</span>
            <div>
              <span className={`text-xl font-bold ${gradeColor}`}>{sub.grade}</span>
              <span className="text-sm text-gray-400">/{assignment.totalMarks}</span>
            </div>
          </div>
        </div>
      )}

      {!isGraded && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-center">
          <Clock size={32} className="mx-auto mb-3 text-yellow-400" />
          <div className="font-semibold text-yellow-800 mb-1">Grade Pending</div>
          <p className="text-yellow-700 text-sm">Your teacher will grade your submission and provide feedback soon.</p>
        </div>
      )}
    </div>
  );
}

