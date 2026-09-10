import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { normalizeStudentRecord, normalizeTeacherRecord } from '../src/db.js';

describe('database normalization helpers', () => {
  it('normalizes teacher payloads for database persistence and auth checks', () => {
    const teacher = normalizeTeacherRecord({
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
      assignedSubjects: ['math', 'physics'],
    });

    assert.equal(teacher.email, 'teacher@jangombe.ac.tz');
    assert.deepEqual(teacher.assigned_classes, ['class-2a', 'class-3b']);
    assert.equal(teacher.username, 'asha.ali');
    assert.equal(teacher.password_hash.length > 20, true);
  });

  it('normalizes student rows with the display names expected by the frontend', () => {
    const student = normalizeStudentRecord({
      id: 'std-1',
      admissionNumber: 'JG001',
      firstName: 'Amina',
      middleName: 'Ali',
      lastName: 'Hassan',
      gender: 'Female',
      dateOfBirth: '2011-04-12',
      classId: 'class-2a',
      status: 'Active',
    });

    assert.equal(student.admission_number, 'JG001');
    assert.equal(student.name, 'Amina Hassan');
    assert.equal(student.class_name, 'Form 2A');
  });
});
