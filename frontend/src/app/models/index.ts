export type UserRole = 'ADMIN' | 'TEACHER';
export type TeacherType = 'Class Teacher' | 'Subject Teacher' | 'Class & Subject Teacher';
export type TeacherStatus = 'ACTIVE' | 'INACTIVE';
export type StudentStatus = 'Active' | 'Inactive';
export type MarkStatus = 'Draft' | 'Submitted' | 'Resubmitted' | 'Accepted' | 'Rejected';
export type SubmissionStatus = 'Pending' | 'Draft' | 'Submitted' | 'Resubmitted' | 'Accepted' | 'Rejected';
export type ClassStatus = 'Active' | 'Archived';
export type SubjectStatus = 'Active' | 'Inactive';

export interface User {
  id: string | number;
  teacherId?: string | number;
  email?: string;
  username: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  assignedClasses?: string[];
  assignedSubjects?: string[];
}

export interface Teacher {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  username: string;
  password: string;
  teacherType: TeacherType;
  status: TeacherStatus;
  assignedClasses: string[];
  assignedSubjects: string[];
}

export interface ClassItem {
  id: string;
  name: string;
  numberOfStudents: number;
  classTeacherId?: string;
  status: ClassStatus;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  numberOfTeachers: number;
  status: SubjectStatus;
}

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  classId: string;
  status: StudentStatus;
}

export interface Assignment {
  id: string;
  teacherId: string;
  classId: string;
  subjectIds: string[];
  term: string;
  academicYear: string;
}

export interface Mark {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  marks: number;
  grade: string;
  remarks: string;
  term: string;
  academicYear: string;
  status: MarkStatus;
}

export interface Submission {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  term: string;
  academicYear: string;
  students: number;
  submittedDate: string;
  status: SubmissionStatus;
  rejectionReason?: string;
}

export interface ResultItem {
  id: string;
  studentId: string;
  classId: string;
  academicYear: string;
  term: string;
  subjectResults: Array<{
    subjectId: string;
    subjectName: string;
    marks: number;
    grade: string;
  }>;
  totalMarks: number;
  average: number;
  overallGrade: string;
  position: number;
}

export interface DashboardStats {
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  totalSubjects: number;
  pendingSubmissions: number;
  completedResults: number;
}

export interface TeacherOverview {
  fullName: string;
  className: string;
  subject: string;
  term: string;
  date: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}
