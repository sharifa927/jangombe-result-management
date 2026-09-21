import { Injectable } from '@angular/core';
import type { Assignment } from '../models';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly assignments: Assignment[] = [
    {
      id: 'assignment-1',
      teacherId: 'teacher-1',
      classId: 'class-2a',
      subjectIds: ['math', 'physics'],
      term: 'Term 1',
      academicYear: '2026',
    },
    {
      id: 'assignment-2',
      teacherId: 'teacher-2',
      classId: 'class-1a',
      subjectIds: ['english'],
      term: 'Term 1',
      academicYear: '2026',
    },
    {
      id: 'assignment-3',
      teacherId: 'teacher-3',
      classId: 'class-3a',
      subjectIds: ['biology', 'chemistry'],
      term: 'Term 1',
      academicYear: '2026',
    },
  ];

  getAssignments(): Assignment[] {
    return [...this.assignments];
  }

  addAssignment(assignment: Assignment): Assignment {
    this.assignments.push(assignment);
    return assignment;
  }

  updateAssignment(id: string, assignment: Assignment): Assignment | undefined {
    const index = this.assignments.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }
    this.assignments[index] = assignment;
    return assignment;
  }

  deleteAssignment(id: string): boolean {
    const index = this.assignments.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    this.assignments.splice(index, 1);
    return true;
  }
}
