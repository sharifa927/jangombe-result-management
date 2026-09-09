import { Injectable } from '@angular/core';
import type { Teacher } from '../models';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private readonly teachers: Teacher[] = [
    {
      id: 'teacher-1',
      firstName: 'Asha',
      middleName: 'Ali',
      lastName: 'Mohamed',
      email: 'teacher@jangombe.ac.tz',
      phone: '+255 712 345 678',
      gender: 'Female',
      username: 'asha.ali',
      password: 'teacher123',
      teacherType: 'Class & Subject Teacher',
      status: 'Active',
      assignedClasses: ['class-2a', 'class-3b'],
      assignedSubjects: ['math', 'physics', 'computer-science'],
    },
    {
      id: 'teacher-2',
      firstName: 'Khamis',
      middleName: 'Juma',
      lastName: 'Mbezi',
      email: 'khamis.mbezi@jangombe.ac.tz',
      phone: '+255 713 222 333',
      gender: 'Male',
      username: 'khamis.mbezi',
      password: 'teacher123',
      teacherType: 'Class Teacher',
      status: 'Active',
      assignedClasses: ['class-1a', 'class-2b'],
      assignedSubjects: ['english'],
    },
    {
      id: 'teacher-3',
      firstName: 'Fatma',
      middleName: 'Abdallah',
      lastName: 'Mroso',
      email: 'fatma.mroso@jangombe.ac.tz',
      phone: '+255 766 784 125',
      gender: 'Female',
      username: 'fatma.mroso',
      password: 'teacher123',
      teacherType: 'Subject Teacher',
      status: 'Active',
      assignedClasses: ['class-3a'],
      assignedSubjects: ['biology', 'chemistry'],
    },
    {
      id: 'teacher-4',
      firstName: 'Juma',
      middleName: 'Hassan',
      lastName: 'Mneni',
      email: 'juma.mneni@jangombe.ac.tz',
      phone: '+255 765 555 111',
      gender: 'Male',
      username: 'juma.mneni',
      password: 'teacher123',
      teacherType: 'Class Teacher',
      status: 'On Leave',
      assignedClasses: ['class-4a'],
      assignedSubjects: ['history'],
    },
  ];

  getTeachers(): Teacher[] {
    return [...this.teachers];
  }

  getTeacherById(id: string): Teacher | undefined {
    return this.teachers.find((teacher) => teacher.id === id);
  }

  addTeacher(teacher: Teacher): Teacher {
    this.teachers.push(teacher);
    return teacher;
  }

  updateTeacher(id: string, teacher: Teacher): Teacher | undefined {
    const index = this.teachers.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }
    this.teachers[index] = teacher;
    return teacher;
  }

  deleteTeacher(id: string): boolean {
    const index = this.teachers.findIndex((teacher) => teacher.id === id);
    if (index === -1) {
      return false;
    }
    this.teachers.splice(index, 1);
    return true;
  }
}
