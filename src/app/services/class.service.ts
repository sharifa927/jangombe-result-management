import { Injectable } from '@angular/core';
import type { ClassItem } from '../models';

@Injectable({ providedIn: 'root' })
export class ClassService {
  private readonly classes: ClassItem[] = [
    { id: 'class-1a', name: 'Form 1A', numberOfStudents: 41, classTeacherId: 'teacher-2', status: 'Active' },
    { id: 'class-1b', name: 'Form 1B', numberOfStudents: 39, classTeacherId: 'teacher-3', status: 'Active' },
    { id: 'class-2a', name: 'Form 2A', numberOfStudents: 42, classTeacherId: 'teacher-1', status: 'Active' },
    { id: 'class-2b', name: 'Form 2B', numberOfStudents: 40, classTeacherId: 'teacher-2', status: 'Active' },
    { id: 'class-3a', name: 'Form 3A', numberOfStudents: 45, classTeacherId: 'teacher-3', status: 'Active' },
    { id: 'class-3b', name: 'Form 3B', numberOfStudents: 44, classTeacherId: 'teacher-1', status: 'Active' },
    { id: 'class-4a', name: 'Form 4A', numberOfStudents: 38, classTeacherId: 'teacher-4', status: 'Active' },
    { id: 'class-4b', name: 'Form 4B', numberOfStudents: 37, classTeacherId: 'teacher-2', status: 'Active' },
  ];

  getClasses(): ClassItem[] {
    return [...this.classes];
  }

  getClassById(id: string): ClassItem | undefined {
    return this.classes.find((cls) => cls.id === id);
  }

  addClass(cls: ClassItem): ClassItem {
    this.classes.push(cls);
    return cls;
  }

  updateClass(id: string, cls: ClassItem): ClassItem | undefined {
    const index = this.classes.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }
    this.classes[index] = cls;
    return cls;
  }

  deleteClass(id: string): boolean {
    const index = this.classes.findIndex((cls) => cls.id === id);
    if (index === -1) {
      return false;
    }
    this.classes.splice(index, 1);
    return true;
  }
}
