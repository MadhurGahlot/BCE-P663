import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { User } from './types';
import api from '../services/api';

interface AppState {
  currentUser: User | null;
  isLoading: boolean;
}

interface RegisterResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface AppContextType extends AppState {
  login: (token: string, user: User) => void;

  register: (
    name: string,
    email: string,
    password: string,
    role: 'teacher' | 'student',
    department: string
  ) => Promise<RegisterResult>;

  logout: () => void;

  checkAuth: () => Promise<void>;

  refetchData: () => Promise<void>;

  submissions: any[];
  assignments: any[];
  users: any[];

  getTeacherAssignments: (id: string) => any[];

  getSubmissionsForAssignment: (id: string) => any[];

  getStudentSubmissions: (studentId: string) => any[];

  getSimilarityResult: (id: string) => any;

  similarityResults: any[];

  addAssignment: (a: any) => void;

  addSubmission: (s: any) => void;

  runSimilarityCheck: (id: string) => void;

  getAssignmentById: (id: string) => any;
}

const AppContext = createContext<AppContextType | null>(null);

// ====================================
// NORMALIZE ASSIGNMENT
// ====================================
function normalizeAssignment(a: any) {
  return {
    ...a,

    id: a.id?.toString(),

    totalMarks:
      a.total_marks ??
      a.totalMarks ??
      100,

    teacherId:
      (
        a.created_by ??
        a.teacherId
      )?.toString(),

    createdBy: a.created_by,
  };
}

// ====================================
// NORMALIZE SUBMISSION
// ====================================
function normalizeSubmission(s: any) {
  return {
    ...s,

    id:
      s.id?.toString?.() ??
      s.id?.toString(),

    studentId:
      (
        s.student_id ??
        s.studentId
      )?.toString(),

    assignmentId:
      (
        s.assignment_id ??
        s.assignmentId
      )?.toString(),

    fileName: s.file_path
      ? s.file_path
          .replace(/\\/g, '/')
          .split('/')
          .pop()
      : s.fileName ??
        'submission.txt',

    submittedAt:
      s.created_at ??
      s.submittedAt ??
      new Date().toISOString(),

    content:
      s.ocr_text ??
      s.content ??
      '',

    grade:
      s.grade ??
      undefined,

    maxSimilarity:
      s.max_similarity ??
      s.maxSimilarity ??
      0,
  };
}

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] =
    useState<AppState>({
      currentUser: null,
      isLoading: true,
    });

  const [submissions, setSubmissions] =
    useState<any[]>([]);

  const [assignments, setAssignments] =
    useState<any[]>([]);

  const [users, setUsers] =
    useState<any[]>([]);

  // ====================================
  // AUTH CHECK
  // ====================================
  const checkAuth = useCallback(
    async () => {
      setState(prev => ({
        ...prev,
        isLoading: true,
      }));

      const token =
        localStorage.getItem(
          'token'
        );

      const savedUser =
        localStorage.getItem(
          'user'
        );

      if (!token) {
        setState({
          currentUser: null,
          isLoading: false,
        });

        return;
      }

      // Set auth header
      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      // Restore saved user instantly
      if (savedUser) {
        setState({
          currentUser:
            JSON.parse(savedUser),
          isLoading: false,
        });
      }

      try {
        const response =
          await api.get(
            '/auth/me'
          );

        setState({
          currentUser:
            response.data,
          isLoading: false,
        });

        localStorage.setItem(
          'user',
          JSON.stringify(
            response.data
          )
        );
      } catch (err) {
        console.error(
          'Auth check failed:',
          err
        );

        localStorage.removeItem(
          'token'
        );

        localStorage.removeItem(
          'user'
        );

        delete api.defaults.headers
          .common['Authorization'];

        setState({
          currentUser: null,
          isLoading: false,
        });
      }
    },
    []
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const userId =
    state.currentUser?.id;

  const userRole =
    state.currentUser?.role;

  // ====================================
  // FETCH DATA
  // ====================================
  const fetchData = useCallback(
    async () => {
      if (!userId) return;

      try {
        const assignmentUrl =
          userRole === 'teacher'
            ? '/assignments/teacher/me'
            : '/assignments/';

        // Fetch assignments + users
        const [
          assignRes,
          userRes,
        ] = await Promise.all([
          api.get(assignmentUrl),
          api.get('/users'),
        ]);

        const normalizedAssignments =
          assignRes.data.map(
            normalizeAssignment
          );

        let allSubmissions: any[] =
          [];

        // ===============================
        // TEACHER FETCH
        // ===============================
        if (
          userRole ===
          'teacher'
        ) {
          const submissionResponses =
            await Promise.all(
              normalizedAssignments.map(
                (a: any) =>
                  api.get(
                    `/submissions/assignment/${a.id}`
                  )
              )
            );

          allSubmissions =
            submissionResponses.flatMap(
              r => r.data
            );
        }

        // ===============================
        // STUDENT FETCH
        // ===============================
        else {
          const studentRes =
            await api.get(
              `/submissions/student/${userId}/history`
            );

          allSubmissions =
            studentRes.data;
        }

        console.log(
          'Fetched submissions:',
          allSubmissions
        );

        setSubmissions(
          allSubmissions.map(
            normalizeSubmission
          )
        );

        setAssignments(
          normalizedAssignments
        );

        setUsers(userRes.data);
      } catch (err) {
        console.error(
          'Error fetching data:',
          err
        );
      }
    },
    [userId, userRole]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ====================================
  // LOGIN
  // ====================================
  const login = useCallback(
    (
      token: string,
      user: User
    ) => {
      localStorage.setItem(
        'token',
        token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );

      // Set auth header
      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      setState({
        currentUser: user,
        isLoading: false,
      });
    },
    []
  );

  // ====================================
  // REGISTER
  // ====================================
  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role:
        | 'teacher'
        | 'student',
      department: string
    ): Promise<RegisterResult> => {
      try {
        await api.post(
          '/auth/register',
          {
            name,
            email,
            password,
            role,
            department,
          }
        );

        const params =
          new URLSearchParams();

        params.append(
          'username',
          email
        );

        params.append(
          'password',
          password
        );

        const loginRes =
          await api.post(
            '/auth/login',
            params,
            {
              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded',
              },
            }
          );

        const token =
          loginRes.data
            .access_token;

        localStorage.setItem(
          'token',
          token
        );

        // Set auth header
        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${token}`;

        const userRes =
          await api.get(
            '/auth/me'
          );

        const user =
          userRes.data;

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );

        setState({
          currentUser: user,
          isLoading: false,
        });

        return {
          success: true,
          user,
        };
      } catch (err: any) {
        console.error(
          'Registration error:',
          err.response?.data
        );

        const message =
          err.response?.data
            ?.detail?.[0]?.msg ||
          err.response?.data
            ?.detail ||
          err.message ||
          'Registration failed';

        return {
          success: false,
          error: message,
        };
      }
    },
    []
  );

  // ====================================
  // LOGOUT
  // ====================================
  const logout = useCallback(
    () => {
      localStorage.removeItem(
        'token'
      );

      localStorage.removeItem(
        'user'
      );

      delete api.defaults.headers
        .common['Authorization'];

      setState({
        currentUser: null,
        isLoading: false,
      });

      setSubmissions([]);
      setAssignments([]);
      setUsers([]);
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        ...state,

        login,
        logout,
        checkAuth,
        register,

        refetchData:
          fetchData,

        submissions,
        assignments,
        users,

        // ====================================
        // HELPERS
        // ====================================
        getTeacherAssignments:
          (
            teacherId: string
          ) =>
            assignments.filter(
              a =>
                a.teacherId?.toString() ===
                  teacherId?.toString() ||
                a.createdBy?.toString() ===
                  teacherId?.toString()
            ),

        getSubmissionsForAssignment:
          (
            assignmentId: string
          ) =>
            submissions.filter(
              s =>
                s.assignmentId?.toString() ===
                  assignmentId?.toString() ||
                s.assignment_id?.toString() ===
                  assignmentId?.toString()
            ),

        getStudentSubmissions:
          (
            studentId: string
          ) =>
            submissions.filter(
              s =>
                s.studentId?.toString() ===
                  studentId?.toString() ||
                s.student_id?.toString() ===
                  studentId?.toString()
            ),

        getSimilarityResult:
          () => null,

        similarityResults: [],

        addAssignment: (
          a: any
        ) =>
          setAssignments(
            prev => [
              ...prev,
              normalizeAssignment(
                a
              ),
            ]
          ),

        addSubmission: (
          s: any
        ) =>
          setSubmissions(
            prev => [
              ...prev,
              normalizeSubmission(
                s
              ),
            ]
          ),

        runSimilarityCheck:
          () => {},

        getAssignmentById:
          (id: string) =>
            assignments.find(
              a =>
                a.id?.toString() ===
                id?.toString()
            ) ?? null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx =
    useContext(AppContext);

  if (!ctx) {
    throw new Error(
      'useApp must be used within AppProvider'
    );
  }

  return ctx;
}