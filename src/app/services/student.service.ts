import { Injectable } from '@angular/core';
import type { Student } from '../models';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly students: Student[] = [
    { id: 'std-1', admissionNumber: 'JG001', firstName: 'Amina', middleName: 'Ali', lastName: 'Hassan', gender: 'Female', dateOfBirth: '2011-04-12', classId: 'class-2a', status: 'Active' },
    { id: 'std-2', admissionNumber: 'JG002', firstName: 'Juma', middleName: 'Omar', lastName: 'Kibwana', gender: 'Male', dateOfBirth: '2010-08-28', classId: 'class-2a', status: 'Active' },
    { id: 'std-3', admissionNumber: 'JG003', firstName: 'Fatma', middleName: 'Said', lastName: 'Mselem', gender: 'Female', dateOfBirth: '2011-11-20', classId: 'class-2a', status: 'Active' },
    { id: 'std-4', admissionNumber: 'JG004', firstName: 'Mohamed', middleName: 'Abdallah', lastName: 'Kisusi', gender: 'Male', dateOfBirth: '2010-06-26', classId: 'class-2a', status: 'Active' },
    { id: 'std-5', admissionNumber: 'JG005', firstName: 'Salma', middleName: 'Khamis', lastName: 'Mosha', gender: 'Female', dateOfBirth: '2011-01-13', classId: 'class-2a', status: 'Active' },
    { id: 'std-6', admissionNumber: 'JG006', firstName: 'Yusuf', middleName: 'Mussa', lastName: 'Haji', gender: 'Male', dateOfBirth: '2010-09-15', classId: 'class-3b', status: 'Active' },
    { id: 'std-7', admissionNumber: 'JG007', firstName: 'Grace', middleName: 'John', lastName: 'Mwanga', gender: 'Female', dateOfBirth: '2011-03-18', classId: 'class-3b', status: 'Active' },
    { id: 'std-8', admissionNumber: 'JG008', firstName: 'Amani', middleName: 'Suleiman', lastName: 'Amani', gender: 'Female', dateOfBirth: '2010-12-09', classId: 'class-3b', status: 'Active' },
    { id: 'std-9', admissionNumber: 'JG009', firstName: 'Ibrahim', middleName: 'Bakari', lastName: 'Mikidadi', gender: 'Male', dateOfBirth: '2011-07-05', classId: 'class-1a', status: 'Active' },
    { id: 'std-10', admissionNumber: 'JG010', firstName: 'Mariam', middleName: 'Mshindo', lastName: 'Said', gender: 'Female', dateOfBirth: '2012-02-23', classId: 'class-1a', status: 'Active' },
  ];

  getStudents(): Student[] {
    return [...this.students];
  }

  getStudentsByClass(classId: string): Student[] {
    return this.students.filter((student) => student.classId === classId);
  }

  addStudent(student: Student): Student {
    this.students.push(student);
    return student;
  }

  updateStudent(id: string, student: Student): Student | undefined {
    const index = this.students.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }
    this.students[index] = student;
    return student;
  }

  deleteStudent(id: string): boolean {
    const index = this.students.findIndex((student) => student.id === id);
    if (index === -1) {
      return false;
    }
    this.students.splice(index, 1);
    return true;
  }
}
