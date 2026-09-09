import cors from 'cors';
import express, { type Request, type Response } from 'express';

const app = express();
const port = Number(process.env.PORT || 3001);

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
    email: 'admin@jangombe.school',
    role: 'ADMIN',
    assignedClasses: ['All'],
    assignedSubjects: ['All'],
  },
];

const classes = [
  { id: 'class-1a', name: 'Form 1A', teacherId: 'teacher-2' },
  { id: 'class-2a', name: 'Form 2A', teacherId: 'teacher-1' },
  { id: 'class-2b', name: 'Form 2B', teacherId: 'teacher-1' },
  { id: 'class-3a', name: 'Form 3A', teacherId: 'admin-1' },
];

const subjects = [
  { id: 'math', name: 'Mathematics' },
  { id: 'physics', name: 'Physics' },
  { id: 'english', name: 'English' },
  { id: 'biology', name: 'Biology' },
];

const students = [
  { id: 'std-1', admissionNumber: 'JG001', name: 'Amina Ali', className: 'Form 2A' },
  { id: 'std-2', admissionNumber: 'JG002', name: 'Juma Omar', className: 'Form 2A' },
  { id: 'std-3', admissionNumber: 'JG003', name: 'Fatma Said', className: 'Form 2A' },
  { id: 'std-4', admissionNumber: 'JG010', name: 'Mariam Kitwana', className: 'Form 2B' },
  { id: 'std-5', admissionNumber: 'JG011', name: 'Said Mwarabu', className: 'Form 2B' },
  { id: 'std-6', admissionNumber: 'JG012', name: 'Nuru Makame', className: 'Form 2B' },
];

const submissions = [
  {
    id: 'sub-1',
    teacherId: 'teacher-1',
    className: 'Form 2A',
    subject: 'Mathematics',
    status: 'Accepted',
    students: 42,
    submittedDate: '2026-09-05',
  },
  {
    id: 'sub-2',
    teacherId: 'teacher-1',
    className: 'Form 2B',
    subject: 'Physics',
    status: 'Resubmitted',
    students: 40,
    submittedDate: '2026-09-08',
  },
];

const marks = [
  { id: 'mark-1', studentId: 'std-1', className: 'Form 2A', subject: 'Mathematics', marks: 78, grade: 'A', remarks: 'Good' },
  { id: 'mark-2', studentId: 'std-2', className: 'Form 2A', subject: 'Mathematics', marks: 65, grade: 'B', remarks: 'Good' },
  { id: 'mark-3', studentId: 'std-3', className: 'Form 2A', subject: 'Mathematics', marks: 42, grade: 'D', remarks: 'Fair' },
];

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Jang’ombe backend is running' });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  const user = teachers.find(
    (teacher) => teacher.email === email && password === 'school123',
  );

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

app.get('/api/classes', (_req: Request, res: Response) => {
  res.json({ items: classes });
});

app.get('/api/subjects', (_req: Request, res: Response) => {
  res.json({ items: subjects });
});

app.get('/api/students', (_req: Request, res: Response) => {
  res.json({ items: students });
});

app.get('/api/marks', (_req: Request, res: Response) => {
  res.json({ items: marks });
});

app.get('/api/submissions', (_req: Request, res: Response) => {
  res.json({ items: submissions });
});

app.get('/api/teachers/:teacherId/submissions', (req: Request, res: Response) => {
  const { teacherId } = req.params;
  const teacherSubmissions = submissions.filter((item) => item.teacherId === teacherId);
  res.json({ items: teacherSubmissions });
});

app.post('/api/submissions', (req: Request, res: Response) => {
  const { teacherId, className, subject, status = 'Pending' } = req.body ?? {};

  const newEntry = {
    id: `sub-${Date.now()}`,
    teacherId,
    className,
    subject,
    status,
    students: 42,
    submittedDate: new Date().toISOString().slice(0, 10),
  };

  submissions.push(newEntry);
  res.status(201).json({ item: newEntry });
});

app.listen(port, () => {
  console.log(`Jang’ombe backend is running on http://localhost:${port}`);
});
