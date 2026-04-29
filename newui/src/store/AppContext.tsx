import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Assignment, Submission, SimilarityResult } from './types';
import { MOCK_USERS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_SIMILARITY_RESULTS } from './mockData';
import { computeSimilarity } from './similarity';

interface AppState {
  currentUser: User | null;
  users: User[];
  assignments: Assignment[];
  submissions: Submission[];
  similarityResults: SimilarityResult[];
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => User | null;
  logout: () => void;
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (assignment: Assignment) => void;
  addSubmission: (submission: Submission) => void;
  updateSubmission: (submission: Submission) => void;
  runSimilarityCheck: (assignmentId: string) => SimilarityResult;
  getAssignmentById: (id: string) => Assignment | undefined;
  getSubmissionsForAssignment: (assignmentId: string) => Submission[];
  getSimilarityResult: (assignmentId: string) => SimilarityResult | undefined;
  getUserById: (id: string) => User | undefined;
  getTeacherAssignments: (teacherId: string) => Assignment[];
  getStudentSubmissions: (studentId: string) => Submission[];
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'gradebook_state';

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        currentUser: parsed.currentUser ?? null,
        users: parsed.users ?? MOCK_USERS,
        assignments: parsed.assignments ?? MOCK_ASSIGNMENTS,
        submissions: parsed.submissions ?? MOCK_SUBMISSIONS,
        similarityResults: parsed.similarityResults ?? MOCK_SIMILARITY_RESULTS,
      };
    }
  } catch {}
  return {
    currentUser: null,
    users: MOCK_USERS,
    assignments: MOCK_ASSIGNMENTS,
    submissions: MOCK_SUBMISSIONS,
    similarityResults: MOCK_SIMILARITY_RESULTS,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = useCallback((email: string, password: string): User | null => {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      return user;
    }
    return null;
  }, [state.users]);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, currentUser: null }));
  }, []);

  const addAssignment = useCallback((assignment: Assignment) => {
    setState(prev => ({ ...prev, assignments: [...prev.assignments, assignment] }));
  }, []);

  const updateAssignment = useCallback((assignment: Assignment) => {
    setState(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => a.id === assignment.id ? assignment : a),
    }));
  }, []);

  const addSubmission = useCallback((submission: Submission) => {
    setState(prev => ({ ...prev, submissions: [...prev.submissions, submission] }));
  }, []);

  const updateSubmission = useCallback((submission: Submission) => {
    setState(prev => ({
      ...prev,
      submissions: prev.submissions.map(s => s.id === submission.id ? submission : s),
    }));
  }, []);

  const runSimilarityCheck = useCallback((assignmentId: string): SimilarityResult => {
    const subs = state.submissions
      .filter(s => s.assignmentId === assignmentId)
      .map(s => ({ id: s.id, content: s.content }));

    const pairs = computeSimilarity(subs);
    const result: SimilarityResult = {
      assignmentId,
      pairs,
      computedAt: new Date().toISOString(),
    };

    // Update maxSimilarity on submissions
    const maxMap = new Map<string, number>();
    for (const pair of pairs) {
      const cur1 = maxMap.get(pair.submission1Id) ?? 0;
      const cur2 = maxMap.get(pair.submission2Id) ?? 0;
      if (pair.similarity > cur1) maxMap.set(pair.submission1Id, pair.similarity);
      if (pair.similarity > cur2) maxMap.set(pair.submission2Id, pair.similarity);
    }

    setState(prev => ({
      ...prev,
      submissions: prev.submissions.map(s =>
        maxMap.has(s.id) ? { ...s, maxSimilarity: maxMap.get(s.id) } : s
      ),
      similarityResults: [
        ...prev.similarityResults.filter(r => r.assignmentId !== assignmentId),
        result,
      ],
    }));

    return result;
  }, [state.submissions]);

  const getAssignmentById = useCallback((id: string) =>
    state.assignments.find(a => a.id === id), [state.assignments]);

  const getSubmissionsForAssignment = useCallback((assignmentId: string) =>
    state.submissions.filter(s => s.assignmentId === assignmentId), [state.submissions]);

  const getSimilarityResult = useCallback((assignmentId: string) =>
    state.similarityResults.find(r => r.assignmentId === assignmentId), [state.similarityResults]);

  const getUserById = useCallback((id: string) =>
    state.users.find(u => u.id === id), [state.users]);

  const getTeacherAssignments = useCallback((teacherId: string) =>
    state.assignments.filter(a => a.teacherId === teacherId), [state.assignments]);

  const getStudentSubmissions = useCallback((studentId: string) =>
    state.submissions.filter(s => s.studentId === studentId), [state.submissions]);

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      logout,
      addAssignment,
      updateAssignment,
      addSubmission,
      updateSubmission,
      runSimilarityCheck,
      getAssignmentById,
      getSubmissionsForAssignment,
      getSimilarityResult,
      getUserById,
      getTeacherAssignments,
      getStudentSubmissions,
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
