import cors from 'cors';
import express, { type Request, type Response } from 'express';
import { initializeDatabase } from './db.js';

const app = express();
const port = Number(process.env.PORT || 3001);

let dbStatus;

try {
  dbStatus = await initializeDatabase();
} catch (error) {
  console.error('Database startup failed:', error instanceof Error ? error.message : error);
  process.exit(1);
}

app.use(cors());
app.use(express.json());

const teachers = [
  {
    id: 'teacher-1',
    firstName: 'Asha',
    lastName: 'Ali',
    email: 'asha.ali@jangombe.school',
    role: 'TEACHER',
    assignedClasses: ['Form 2A', 'Form 2B'],
    assignedSubjects: ['Mathematics', 'Physics'],
  },
  {
    id: 'teacher-2',
    firstName: 'Khamis',
    lastName: 'Mbezi',
    email: 'khamis.mbezi@jangombe.school',
    role: 'TEACHER',
    assignedClasses: ['Form 1A'],
    assignedSubjects: ['English'],
  },
  {
    id: 'admin-1',
    firstName: 'Mariam',
    lastName: 'Said',
    email: 'admin@jangombe.ac.tz',
    role: 'ADMIN',
    assignedClasses: ['All'],
    assignedSubjects: ['All'],
  },
];

const classes = [
  { id: 'class-1a', name: 'Form 1A', teacherId: 'teacher-2', numberOfStudents: 41, status: 'Active' },
  { id: 'class-2a', name: 'Form 2A', teacherId: 'teacher-1', numberOfStudents: 42, status: 'Active' },
  { id: 'class-2b', name: 'Form 2B', teacherId: 'teacher-1', numberOfStudents: 40, status: 'Active' },
  { id: 'class-3a', name: 'Form 3A', teacherId: 'admin-1', numberOfStudents: 45, status: 'Active' },
];

const subjects = [
  { id: 'math', name: 'Mathematics' },
  { id: 'physics', name: 'Physics' },
  { id: 'english', name: 'English' },
  { id: 'biology', name: 'Biology' },
];

const students = [
  { id: 'std-1', admissionNumber: 'JG001', name: 'Amina Ali', className: 'Form 2A', classId: 'class-2a', status: 'Active' },
  { id: 'std-2', admissionNumber: 'JG002', name: 'Juma Omar', className: 'Form 2A', classId: 'class-2a', status: 'Active' },
  { id: 'std-3', admissionNumber: 'JG003', name: 'Fatma Said', className: 'Form 2A', classId: 'class-2a', status: 'Active' },
  { id: 'std-4', admissionNumber: 'JG010', name: 'Mariam Kitwana', className: 'Form 2B', classId: 'class-2b', status: 'Active' },
  { id: 'std-5', admissionNumber: 'JG011', name: 'Said Mwarabu', className: 'Form 2B', classId: 'class-2b', status: 'Active' },
  { id: 'std-6', admissionNumber: 'JG012', name: 'Nuru Makame', className: 'Form 2B', classId: 'class-2b', status: 'Active' },
];

type SubmissionStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Resubmitted' | 'Submitted';

const normalizeSubmissionStatus = (value?: string): SubmissionStatus => {
  switch (value) {
    case 'Accepted':
      return 'Accepted';
    case 'Rejected':
      return 'Rejected';
    case 'Resubmitted':
      return 'Resubmitted';
    case 'Submitted':
      return 'Submitted';
    case 'Pending':
    default:
      return 'Pending';
  }
};

const submissions = [
  {
    id: 'sub-1',
    teacherId: 'teacher-1',
    className: 'Form 2A',
    subject: 'Mathematics',
    status: 'Accepted' as SubmissionStatus,
    students: 42,
    submittedDate: '2026-09-05',
    rejectionReason: undefined as string | undefined,
  },
  {
    id: 'sub-2',
    teacherId: 'teacher-1',
    className: 'Form 2B',
    subject: 'Physics',
    status: 'Resubmitted' as SubmissionStatus,
    students: 40,
    submittedDate: '2026-09-08',
    rejectionReason: undefined as string | undefined,
  },
  {
    id: 'sub-3',
    teacherId: 'teacher-2',
    className: 'Form 1A',
    subject: 'English',
    status: 'Pending' as SubmissionStatus,
    students: 41,
    submittedDate: '2026-09-04',
    rejectionReason: undefined as string | undefined,
  },
];

const results = [
  {
    id: 'result-1',
    studentId: 'std-1',
    classId: 'class-2a',
    academicYear: '2026',
    term: 'Term 1',
    subjectResults: [
      { subjectId: 'math', subjectName: 'Mathematics', marks: 82, grade: 'A' },
      { subjectId: 'english', subjectName: 'English', marks: 76, grade: 'A' },
      { subjectId: 'physics', subjectName: 'Physics', marks: 79, grade: 'A' },
      { subjectId: 'chemistry', subjectName: 'Chemistry', marks: 75, grade: 'A' },
    ],
    totalMarks: 312,
    average: 78,
    overallGrade: 'A',
    position: 1,
  },
  {
    id: 'result-2',
    studentId: 'std-2',
    classId: 'class-2a',
    academicYear: '2026',
    term: 'Term 1',
    subjectResults: [
      { subjectId: 'math', subjectName: 'Mathematics', marks: 74, grade: 'B' },
      { subjectId: 'english', subjectName: 'English', marks: 68, grade: 'B' },
      { subjectId: 'physics', subjectName: 'Physics', marks: 72, grade: 'B' },
      { subjectId: 'chemistry', subjectName: 'Chemistry', marks: 72, grade: 'B' },
    ],
    totalMarks: 286,
    average: 71.5,
    overallGrade: 'B',
    position: 2,
  },
  {
    id: 'result-3',
    studentId: 'std-3',
    classId: 'class-2a',
    academicYear: '2026',
    term: 'Term 1',
    subjectResults: [
      { subjectId: 'math', subjectName: 'Mathematics', marks: 62, grade: 'B' },
      { subjectId: 'english', subjectName: 'English', marks: 69, grade: 'B' },
      { subjectId: 'physics', subjectName: 'Physics', marks: 66, grade: 'B' },
      { subjectId: 'chemistry', subjectName: 'Chemistry', marks: 67, grade: 'B' },
    ],
    totalMarks: 264,
    average: 66,
    overallGrade: 'B',
    position: 3,
  },
];

const marks = [
  { id: 'mark-1', studentId: 'std-1', className: 'Form 2A', subject: 'Mathematics', marks: 78, grade: 'A', remarks: 'Good' },
  { id: 'mark-2', studentId: 'std-2', className: 'Form 2A', subject: 'Mathematics', marks: 65, grade: 'B', remarks: 'Good' },
  { id: 'mark-3', studentId: 'std-3', className: 'Form 2A', subject: 'Mathematics', marks: 42, grade: 'D', remarks: 'Fair' },
];

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Jang’ombe backend is running',
    database: dbStatus.connected ? 'postgres' : 'memory',
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  const loginMatches =[
    { email: 'admin@jangombe.ac.tz', password: 'admin123', user: teachers.find((teacher) => teacher.email === 'admin@jangombe.ac.tz') },
    { email: 'teacher@jangombe.ac.tz', password: 'teacher123', user: teachers.find((teacher) => teacher.email === 'asha.ali@jangombe.school') },
    { email: 'asha.ali@jangombe.school', password: 'school123', user: teachers.find((teacher) => teacher.email === 'asha.ali@jangombe.school') },
  ];

  const matchedLogin = loginMatches.find(
    (entry) => entry.email === email && entry.password === password,
  );

  const user = matchedLogin?.user;

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      assignedClasses: user.assignedClasses,
      assignedSubjects: user.assignedSubjects,
    },
  });
});

app.get('/api/teachers', (_req: Request, res: Response) => {
  res.json({ items: teachers });
});

app.get('/api/teachers/:id', (req: Request, res: Response) => {
  const teacher = teachers.find((item) => item.id === req.params.id);

  if (!teacher) {
    return res.status(404).json({ message: 'Teacher not found' });
  }

  return res.json({ item: teacher });
});

app.post('/api/teachers', (req: Request, res: Response) => {
  const { id, firstName, lastName, email, role, assignedClasses, assignedSubjects } = req.body ?? {};

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: 'Teacher first name, last name, and email are required' });
  }

  const newTeacher = {
    id: id ?? `teacher-${Date.now()}`,
    firstName,
    lastName,
    email,
    role: role ?? 'TEACHER',
    assignedClasses: assignedClasses ?? [],
    assignedSubjects: assignedSubjects ?? [],
  };

  teachers.push(newTeacher);
  return res.status(201).json({ item: newTeacher });
});

app.put('/api/teachers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = teachers.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Teacher not found' });
  }

  const updatedTeacher = {
    ...teachers[index],
    ...req.body,
  };

  teachers[index] = updatedTeacher;
  return res.json({ item: updatedTeacher });
});

app.delete('/api/teachers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = teachers.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Teacher not found' });
  }

  teachers.splice(index, 1);
  return res.status(204).send();
});

app.get('/api/classes', (_req: Request, res: Response) => {
  res.json({ items: classes });
});

app.get('/api/classes/:id', (req: Request, res: Response) => {
  const classItem = classes.find((item) => item.id === req.params.id);

  if (!classItem) {
    return res.status(404).json({ message: 'Class not found' });
  }

  return res.json({ item: classItem });
});

app.post('/api/classes', (req: Request, res: Response) => {
  const { id, name, numberOfStudents, classTeacherId, status } = req.body ?? {};

  if (!name) {
    return res.status(400).json({ message: 'Class name is required' });
  }

  const newClass = {
    id: id ?? `class-${Date.now()}`,
    name,
    teacherId: classTeacherId ?? 'admin-1',
    numberOfStudents: Number(numberOfStudents ?? 0),
    status: status ?? 'Active',
  };

  classes.push(newClass);
  return res.status(201).json({ item: newClass });
});

app.put('/api/classes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = classes.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Class not found' });
  }

  const updatedClass = {
    ...classes[index],
    ...req.body,
  };

  classes[index] = updatedClass;
  return res.json({ item: updatedClass });
});

app.delete('/api/classes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = classes.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Class not found' });
  }

  classes.splice(index, 1);
  return res.status(204).send();
});

app.get('/api/subjects', (_req: Request, res: Response) => {
  res.json({ items: subjects });
});

app.get('/api/subjects/:id', (req: Request, res: Response) => {
  const subject = subjects.find((item) => item.id === req.params.id);

  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  return res.json({ item: subject });
});

app.post('/api/subjects', (req: Request, res: Response) => {
  const { id, name, code, numberOfTeachers, status } = req.body ?? {};

  if (!name) {
    return res.status(400).json({ message: 'Subject name is required' });
  }

  const newSubject = {
    id: id ?? `subject-${Date.now()}`,
    code: code ?? `SUB${Date.now().toString().slice(-4)}`,
    name,
    numberOfTeachers: Number(numberOfTeachers ?? 1),
    status: status ?? 'Active',
  };

  subjects.push(newSubject);
  return res.status(201).json({ item: newSubject });
});

app.put('/api/subjects/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = subjects.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  const updatedSubject = {
    ...subjects[index],
    ...req.body,
  };

  subjects[index] = updatedSubject;
  return res.json({ item: updatedSubject });
});

app.delete('/api/subjects/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = subjects.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  subjects.splice(index, 1);
  return res.status(204).send();
});

app.get('/api/students', (req: Request, res: Response) => {
  const { classId } = req.query;

  if (classId) {
    const classStudents = students.filter((student) => student.className === classId || student.classId === classId);
    return res.json({ items: classStudents });
  }

  return res.json({ items: students });
});

app.get('/api/results', (req: Request, res: Response) => {
  const { studentId } = req.query;

  if (studentId) {
    return res.json({ items: results.filter((result) => result.studentId === studentId) });
  }

  return res.json({ items: results });
});

app.get('/api/dashboard', (_req: Request, res: Response) => {
  const teacherNameMap: Record<string, string> = {
    'teacher-1': 'Asha Ali',
    'teacher-2': 'Khamis Mbezi',
    'teacher-3': 'Fatma Mroso',
    'admin-1': 'Admin User',
  };

  const stats = {
    totalTeachers: teachers.length,
    totalStudents: students.length,
    totalClasses: classes.length,
    totalSubjects: subjects.length,
    pendingSubmissions: submissions.filter((item) => item.status === 'Pending' || item.status === 'Resubmitted').length,
    completedResults: results.length,
  };

  const recentSubmissions = submissions.slice(0, 3).map((item) => ({
    teacher: teacherNameMap[item.teacherId] ?? item.teacherId,
    className: item.className,
    subject: item.subject,
    term: 'Term 1',
    date: item.submittedDate,
    status: item.status,
  }));

  return res.json({ stats, recentSubmissions });
});

app.get('/api/students/:id', (req: Request, res: Response) => {
  const student = students.find((item) => item.id === req.params.id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  return res.json({ item: student });
});

app.post('/api/students', (req: Request, res: Response) => {
  const { id, admissionNumber, firstName, lastName, classId, className, dateOfBirth, gender, status } = req.body ?? {};

  if (!firstName || !lastName || !admissionNumber) {
    return res.status(400).json({ message: 'Student first name, last name, and admission number are required' });
  }

  const newStudent = {
    id: id ?? `std-${Date.now()}`,
    admissionNumber,
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    classId: classId ?? className ?? 'class-1a',
    className: className ?? 'Form 1A',
    dateOfBirth: dateOfBirth ?? '2010-01-01',
    gender: gender ?? 'Male',
    status: status ?? 'Active',
  };

  students.push(newStudent);
  return res.status(201).json({ item: newStudent });
});

app.put('/api/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = students.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const updatedStudent = {
    ...students[index],
    ...req.body,
  };

  students[index] = updatedStudent;
  return res.json({ item: updatedStudent });
});

app.delete('/api/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = students.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  students.splice(index, 1);
  return res.status(204).send();
});

app.get('/api/marks', (_req: Request, res: Response) => {
  res.json({ items: marks });
});

app.get('/api/submissions', (_req: Request, res: Response) => {
  res.json({ items: submissions });
});

app.get('/api/submissions/:id', (req: Request, res: Response) => {
  const submission = submissions.find((item) => item.id === req.params.id);

  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  return res.json({ item: submission });
});

app.get('/api/teachers/:teacherId/submissions', (req: Request, res: Response) => {
  const { teacherId } = req.params;
  const teacherSubmissions = submissions.filter((item) => item.teacherId === teacherId);
  res.json({ items: teacherSubmissions });
});

app.post('/api/submissions', (req: Request, res: Response) => {
  const { teacherId, className, subject, status = 'Pending', rejectionReason } = req.body ?? {};

  if (!teacherId || !className || !subject) {
    return res.status(400).json({ message: 'teacherId, className, and subject are required' });
  }

  const normalizedStatus = normalizeSubmissionStatus(status);

  const newEntry = {
    id: `sub-${Date.now()}`,
    teacherId,
    className,
    subject,
    status: normalizedStatus,
    students: 42,
    submittedDate: new Date().toISOString().slice(0, 10),
    rejectionReason: rejectionReason ?? undefined,
  };

  submissions.push(newEntry);
  return res.status(201).json({ item: newEntry });
});

app.patch('/api/submissions/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body ?? {};
  const index = submissions.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  const nextStatus = normalizeSubmissionStatus(status);

  submissions[index] = {
    ...submissions[index],
    status: nextStatus,
    rejectionReason: nextStatus === 'Rejected' ? rejectionReason ?? 'Submission did not meet the minimum review standard.' : undefined,
  };

  return res.json({ item: submissions[index] });
});

app.get('/api/reports/summary', (_req: Request, res: Response) => {
  const acceptedCount = submissions.filter((item) => item.status === 'Accepted').length;
  const pendingCount = submissions.filter((item) => item.status === 'Pending').length;
  const resubmittedCount = submissions.filter((item) => item.status === 'Resubmitted').length;

  return res.json({
    summary: {
      accepted: acceptedCount,
      pending: pendingCount,
      resubmitted: resubmittedCount,
      total: submissions.length,
    },
  });
});

app.get('/api/reports/export', (_req: Request, res: Response) => {
  const header = 'Teacher,Class,Subject,Status,Date\n';
  const rows = submissions
    .map((item) => {
      const teacherName = teachers.find((teacher) => teacher.id === item.teacherId)?.firstName && teachers.find((teacher) => teacher.id === item.teacherId)
        ? `${teachers.find((teacher) => teacher.id === item.teacherId)?.firstName} ${teachers.find((teacher) => teacher.id === item.teacherId)?.lastName}`
        : item.teacherId;

      return `${teacherName},${item.className},${item.subject},${item.status},${item.submittedDate}`;
    })
    .join('\n');

  return res.type('text/csv').send(`${header}${rows}\n`);
});

app.listen(port, () => {
  console.log(`Jang’ombe backend is running on http://localhost:${port}`);
  console.log('PostgreSQL database initialized.');
});
