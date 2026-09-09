import { Injectable } from '@angular/core';
import type { ResultItem } from '../models';

@Injectable({ providedIn: 'root' })
export class ResultService {
  private readonly results: ResultItem[] = [
    {
      id: 'result-1',
      studentId: 'std-1',
      classId: 'class-2a',
      academicYear: '2026',
      term: 'Term 1',
      subjectResults: [
        { subjectId: 'math', subjectName: 'Mathematics', marks: 78, grade: 'A' },
        { subjectId: 'english', subjectName: 'English', marks: 68, grade: 'B' },
        { subjectId: 'physics', subjectName: 'Physics', marks: 72, grade: 'B' },
        { subjectId: 'chemistry', subjectName: 'Chemistry', marks: 61, grade: 'C' },
      ],
      totalMarks: 279,
      average: 69.75,
      overallGrade: 'B',
      position: 4,
    },
    {
      id: 'result-2',
      studentId: 'std-2',
      classId: 'class-2a',
      academicYear: '2026',
      term: 'Term 1',
      subjectResults: [
        { subjectId: 'math', subjectName: 'Mathematics', marks: 65, grade: 'B' },
        { subjectId: 'english', subjectName: 'English', marks: 58, grade: 'C' },
        { subjectId: 'physics', subjectName: 'Physics', marks: 70, grade: 'B' },
        { subjectId: 'chemistry', subjectName: 'Chemistry', marks: 55, grade: 'C' },
      ],
      totalMarks: 248,
      average: 62,
      overallGrade: 'C',
      position: 7,
    },
  ];

  getResults(): ResultItem[] {
    return [...this.results];
  }

  getStudentResults(studentId: string): ResultItem[] {
    return this.results.filter((result) => result.studentId === studentId);
  }
}
