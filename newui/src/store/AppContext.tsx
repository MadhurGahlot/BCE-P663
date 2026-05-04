import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
<<<<<<< HEAD
  login: (email: string, password: string) => User | null;
  register: (name: string, email: string, password: string, role: 'teacher' | 'student', department: string) => RegisterResult;
=======
  login: (token: string, user: User) => void;
>>>>>>> 9c9939ca1c7d2b2969ca0f43a5858545e0dc77e5
  logout: () => void;
  checkAuth: () => Promise<void>;

  // Dummy methods to avoid TS compilation errors while migrating
  getTeacherAssignments: (id: string) => any[];
  getSubmissionsForAssignment: (id: string) => any[];
  getSimilarityResult: (id: string) => any;
  users: any[];
  similarityResults: any[];
  addAssignment: (a: any) => void;
  addSubmission: (s: any) => void;
  runSimilarityCheck: (id: string) => void;
  getAssignmentById: (id: string) => any;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({ currentUser: null, isLoading: true });

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

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('token', token);
    setState({ currentUser: user, isLoading: false });
  }, []);

  const register = useCallback((name: string, email: string, password: string, role: 'teacher' | 'student', department: string): RegisterResult => {
    const exists = state.users.some(u => u.email === email);
    if (exists) {
      return { success: false, error: 'An account with this email already exists' };
    }
    const newUser: User = {
      id: `${role}-${Date.now()}`,
      name,
      email,
      password,
      role,
      department: department as User['department'],
    };
    setState(prev => ({ ...prev, users: [...prev.users, newUser], currentUser: newUser }));
    return { success: true, user: newUser };
  }, [state.users]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setState({ currentUser: null, isLoading: false });
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      checkAuth,

      // Dummy methods to avoid TS compilation errors while migrating
      getTeacherAssignments: () => [],
      getSubmissionsForAssignment: () => [],
      getSimilarityResult: () => null,
      users: [],
      similarityResults: [],
      addAssignment: () => { },
      addSubmission: () => { },
      runSimilarityCheck: () => { },
      getAssignmentById: () => null,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
