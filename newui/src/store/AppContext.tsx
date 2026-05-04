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

interface AppContextType extends AppState {
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;

  // ✅ REAL DATA
  submissions: any[];
  assignments: any[];
  users: any[];

  // Dummy methods
  getTeacherAssignments: (id: string) => any[];
  getSubmissionsForAssignment: (id: string) => any[];
  getSimilarityResult: (id: string) => any;
  similarityResults: any[];
  addAssignment: (a: any) => void;
  addSubmission: (s: any) => void;
  runSimilarityCheck: (id: string) => void;
  getAssignmentById: (id: string) => any;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    isLoading: true,
  });

  // ✅ DATA STATES
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // ✅ AUTH CHECK
  const checkAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    const token = localStorage.getItem('token');

    if (!token) {
      setState({ currentUser: null, isLoading: false });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setState({ currentUser: response.data, isLoading: false });
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      setState({ currentUser: null, isLoading: false });
    }
  }, []);

  // ✅ RUN AUTH CHECK
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, assignRes, userRes] = await Promise.all([
          api.get('/submissions'),
          api.get('/assignments'),
          api.get('/users'),
        ]);

        console.log('SUBMISSIONS:', subRes.data);

        setSubmissions(subRes.data);
        setAssignments(assignRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // ✅ LOGIN
  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('token', token);
    setState({ currentUser: user, isLoading: false });
  }, []);

  // ✅ LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setState({ currentUser: null, isLoading: false });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        checkAuth,

        // ✅ REAL DATA
        submissions,
        assignments,
        users,

        // Dummy methods
        getTeacherAssignments: () => [],
        getSubmissionsForAssignment: () => [],
        getSimilarityResult: () => null,
        similarityResults: [],
        addAssignment: () => {},
        addSubmission: () => {},
        runSimilarityCheck: () => {},
        getAssignmentById: () => null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}