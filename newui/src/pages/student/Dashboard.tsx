import { Link } from 'react-router';
import { Clock, CheckCircle, Upload, Award, FileText, AlertTriangle } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export default function StudentDashboard() {
  const { currentUser, assignments, getStudentSubmissions, users } = useApp();

  const mySubmissions = getStudentSubmissions(currentUser?.id ?? '');
  const dept = currentUser?.department;

  // Show assignments relevant to student's department
  const relevantAssignments = assignments.filter(a => a.subject === dept || dept === undefined);

  const submittedIds = new Set(mySubmissions.map(s => s.assignmentId));
  const pendingAssignments = relevantAssignments.filter(a =>
    !submittedIds.has(a.id) && new Date(a.deadline) >= new Date()
  );

  const gradedSubmissions = mySubmissions.filter(s => s.grade !== undefined);
  const avgGrade = gradedSubmissions.length > 0
    ? (() => {
        const total = gradedSubmissions.reduce((acc, s) => {
          const assign = assignments.find(a => a.id === s.assignmentId);
          return acc + (s.grade! / (assign?.totalMarks ?? 100)) * 100;
        }, 0);
        return (total / gradedSubmissions.length).toFixed(1);
      })()
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Hello, {currentUser?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-blue-100 text-sm">{currentUser?.department} Department • {relevantAssignments.length} assignment{relevantAssignments.length !== 1 ? 's' : ''} available</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{mySubmissions.length}</div>
              <div className="text-xs text-blue-100">Submitted</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{gradedSubmissions.length}</div>
              <div className="text-xs text-blue-100">Graded</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{avgGrade ?? '—'}{avgGrade ? '%' : ''}</div>
              <div className="text-xs text-blue-100">Avg Grade</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Assignments */}
      {pendingAssignments.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-yellow-500" />
            <h2 className="font-semibold text-gray-800">Pending Submissions</h2>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">{pendingAssignments.length}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {pendingAssignments.map(a => {
              const daysLeft = Math.ceil((new Date(a.deadline).getTime() - Date.now()) / 86400000);
              const teacher = users.find(u => u.id === a.teacherId);
              return (
                <div key={a.id} className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-5 flex flex-col gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{a.subject}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${daysLeft <= 3 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {daysLeft}d left
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{a.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={11} /> Due {a.deadline}</span>
                    <span>{a.totalMarks} marks</span>
                    <span>{teacher?.name}</span>
                  </div>
                  <Link
                    to={`/student/submit/${a.id}`}
                    className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Upload size={15} /> Submit Assignment
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* My Submissions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText size={18} className="text-gray-500" />
          <h2 className="font-semibold text-gray-800">My Submissions</h2>
        </div>
        {mySubmissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <FileText size={40} className="mx-auto mb-3 text-gray-300" />
            <div className="text-gray-500 font-medium">No submissions yet</div>
            <p className="text-gray-400 text-sm mt-1">Submit your first assignment to see it here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mySubmissions.map(sub => {
              const assign = assignments.find(a => a.id === sub.assignmentId);
              const teacher = assign ? users.find(u => u.id === assign.teacherId) : null;
              const isGraded = sub.grade !== undefined;
              const pct = isGraded && assign ? ((sub.grade! / assign.totalMarks) * 100).toFixed(1) : null;

              return (
                <div key={sub.id} className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4 flex-wrap ${isGraded ? 'border-green-200' : 'border-gray-200'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isGraded ? 'bg-green-100' : 'bg-yellow-50'}`}>
                    {isGraded ? <CheckCircle size={22} className="text-green-600" /> : <Clock size={22} className="text-yellow-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800">{assign?.title ?? sub.assignmentId}</div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-3">
                      <span className="flex items-center gap-1"><FileText size={10} /> {sub.fileName}</span>
                      <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                      {teacher && <span>{teacher.name}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isGraded ? (
                      <div className="text-center">
                        <div className={`text-xl font-bold ${Number(pct) >= 75 ? 'text-green-600' : Number(pct) >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {sub.grade}/{assign?.totalMarks}
                        </div>
                        <div className="text-xs text-gray-400">{pct}%</div>
                      </div>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">Awaiting grade</span>
                    )}
                    {isGraded && (
                      <Link
                        to={`/student/grades/${sub.id}`}
                        className="flex items-center gap-1.5 text-xs px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors"
                      >
                        <Award size={13} /> View Grade
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Available Assignments */}
      {relevantAssignments.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-4">All Assignments</h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Assignment</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Deadline</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Marks</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {relevantAssignments.map(a => {
                  const sub = mySubmissions.find(s => s.assignmentId === a.id);
                  const isPast = new Date(a.deadline) < new Date();
                  return (
                    <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="text-sm font-medium text-gray-800">{a.title}</div>
                        <span className="text-xs text-blue-600 font-medium">{a.subject}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{a.deadline}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{a.totalMarks}</td>
                      <td className="px-4 py-3">
                        {sub ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Submitted</span>
                        ) : isPast ? (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Missed</span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {!sub && !isPast ? (
                          <Link to={`/student/submit/${a.id}`} className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                            <Upload size={13} /> Submit
                          </Link>
                        ) : sub?.grade !== undefined ? (
                          <Link to={`/student/grades/${sub.id}`} className="text-green-600 hover:underline text-sm flex items-center gap-1">
                            <Award size={13} /> Grade
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

