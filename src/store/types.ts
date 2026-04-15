export type Department = 'CSE' | 'EE' | 'ME' | 'ECE';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  department?: Department;
  avatar?: string;
}

export interface RubricItem {
  id: string;
  criterion: string;
  maxMarks: number;
  description: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: Department;
  description: string;
  deadline: string;
  totalMarks: number;
  teacherId: string;
  createdAt: string;
  rubric: RubricItem[];
  allowedFileTypes: string[];
}

export interface RubricGrade {
  criterionId: string;
  marks: number;
  comment: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileName: string;
  fileType: string;
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  rubricGrades?: RubricGrade[];
  maxSimilarity?: number;
}

export interface MatchedSection {
  text: string;
  startIn1: number;
  startIn2: number;
}

export interface SimilarityPair {
  submission1Id: string;
  submission2Id: string;
  similarity: number;
  matchedSections: MatchedSection[];
}

export interface SimilarityResult {
  assignmentId: string;
  pairs: SimilarityPair[];
  computedAt: string;
}
