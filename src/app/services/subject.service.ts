import { Injectable } from '@angular/core';
import type { SubjectItem } from '../models';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private readonly subjects: SubjectItem[] = [
    { id: 'math', code: 'MTH101', name: 'Mathematics', numberOfTeachers: 3, status: 'Active' },
    { id: 'english', code: 'ENG101', name: 'English', numberOfTeachers: 2, status: 'Active' },
    { id: 'kiswahili', code: 'KIS101', name: 'Kiswahili', numberOfTeachers: 2, status: 'Active' },
    { id: 'physics', code: 'PHY101', name: 'Physics', numberOfTeachers: 2, status: 'Active' },
    { id: 'chemistry', code: 'CHE101', name: 'Chemistry', numberOfTeachers: 2, status: 'Active' },
    { id: 'biology', code: 'BIO101', name: 'Biology', numberOfTeachers: 2, status: 'Active' },
    { id: 'geography', code: 'GEO101', name: 'Geography', numberOfTeachers: 1, status: 'Active' },
    { id: 'history', code: 'HIS101', name: 'History', numberOfTeachers: 1, status: 'Active' },
    { id: 'computer-science', code: 'ICT101', name: 'Computer Science', numberOfTeachers: 2, status: 'Active' },
    { id: 'civics', code: 'CIV101', name: 'Civics', numberOfTeachers: 1, status: 'Active' },
  ];

  getSubjects(): SubjectItem[] {
    return [...this.subjects];
  }

  getSubjectById(id: string): SubjectItem | undefined {
    return this.subjects.find((subject) => subject.id === id);
  }

  addSubject(subject: SubjectItem): SubjectItem {
    this.subjects.push(subject);
    return subject;
  }

  updateSubject(id: string, subject: SubjectItem): SubjectItem | undefined {
    const index = this.subjects.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }
    this.subjects[index] = subject;
    return subject;
  }

  deleteSubject(id: string): boolean {
    const index = this.subjects.findIndex((subject) => subject.id === id);
    if (index === -1) {
      return false;
    }
    this.subjects.splice(index, 1);
    return true;
  }
}
