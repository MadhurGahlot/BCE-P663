import { createBrowserRouter, Navigate } from 'react-router';
import { TeacherLayout } from './components/TeacherLayout';
import { StudentLayout } from './components/StudentLayout';
import Login from './pages/Login';
import TeacherDashboard from './pages/teacher/Dashboard';
import Assignments from './pages/teacher/Assignments';
import CreateAssignment from './pages/teacher/CreateAssignment';
import AssignmentDetail from './pages/teacher/AssignmentDetail';
import SimilarityReport from './pages/teacher/SimilarityReport';
import Grading from './pages/teacher/Grading';
import StudentsPage from './pages/teacher/StudentPage';
import ReportsPage from './pages/teacher/ReportsPage';
import StudentDashboard from './pages/student/Dashboard';
import SubmitAssignment from './pages/student/SubmitAssignment';
import ViewGrade from './pages/student/ViewGrade';
import GradesPage from './pages/student/GradesPage';

export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  {
    path: '/teacher',
    element: <TeacherLayout />,
    children: [
      { index: true, element: <TeacherDashboard /> },
      { path: 'assignments', element: <Assignments /> },
      { path: 'assignments/new', element: <CreateAssignment /> },
      { path: 'assignments/:id', element: <AssignmentDetail /> },
      { path: 'assignments/:id/similarity', element: <SimilarityReport /> },
      { path: 'assignments/:id/grade', element: <Grading /> },
      { path: 'students', element: <StudentsPage /> },
      { path: 'reports', element: <ReportsPage /> },
    ],
  },
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: 'submit/:id', element: <SubmitAssignment /> },
      { path: 'grades', element: <GradesPage /> },
      { path: 'grades/:subId', element: <ViewGrade /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
