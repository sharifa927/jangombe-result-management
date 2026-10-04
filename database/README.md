# Jang'ombe Secondary School

## Grade & Result Management System — Database Notes

### 1. Database Information

* **Database name:** `jangombe_school`
* **Database system:** PostgreSQL
* **Application:** Jang'ombe Secondary School Grade & Result Management System
* **Backend:** Spring Boot
* **Frontend:** Angular

The PostgreSQL database is used by the Spring Boot backend to store and manage school information.

---

# 2. Main Database Tables

The current system contains these main tables:

1. `users`
2. `teachers`
3. `students`
4. `classes`
5. `subjects`
6. `teacher_assignments`
7. `marks`
8. `submissions`
9. `results`

---

# 3. users

The `users` table stores login accounts used by people accessing the system.

A user account contains information such as:

* User ID
* Username
* Password
* Role

### Main purpose

The table is used for authentication and authorization.

Examples of roles can include:

* ADMIN
* TEACHER

The `teachers` table is connected to the `users` table.

---

# 4. teachers

The `teachers` table stores teacher information.

Confirmed columns:

| Column       | Type         | Description                        |
| ------------ | ------------ | ---------------------------------- |
| `id`         | BIGINT       | Unique teacher ID                  |
| `user_id`    | BIGINT       | Connects teacher to a user account |
| `first_name` | VARCHAR(100) | Teacher first name                 |
| `last_name`  | VARCHAR(100) | Teacher last name                  |
| `email`      | VARCHAR(150) | Teacher email                      |
| `phone`      | VARCHAR(30)  | Teacher phone number               |
| `status`     | VARCHAR(20)  | Teacher account/status             |
| `created_at` | TIMESTAMP    | Date/time teacher was created      |

### Constraints

* `id` is the primary key.
* `email` must be unique.
* `user_id` must be unique.
* `user_id` cannot be null.
* `user_id` references `users(id)`.
* If a user is deleted, the related teacher is deleted because of `ON DELETE CASCADE`.

### Teacher status

The database currently accepts:

```text
ACTIVE
INACTIVE
```

The application should use these exact values when communicating with PostgreSQL.

---

# 5. students

The `students` table stores information about students enrolled in the school.

The table is used by the system to:

* Register students
* Associate students with classes
* Identify students when entering marks
* Generate student results

Students are associated with school classes.

---

# 6. classes

The `classes` table stores school classes.

Examples could include:

```text
Form 1
Form 2
Form 3
Form 4
```

The table is used to:

* Organize students
* Assign teachers to classes
* Identify the class for marks and results

---

# 7. subjects

The `subjects` table stores subjects taught at the school.

Confirmed subject information includes:

| Column               | Description                                    |
| -------------------- | ---------------------------------------------- |
| `id`                 | Unique subject ID                              |
| `name`               | Subject name                                   |
| `code`               | Subject code                                   |
| `number_of_teachers` | Number of teachers associated with the subject |
| `status`             | Subject status                                 |

The `name` and `code` values are unique.

The current default subject status is:

```text
Active
```

---

# 8. teacher_assignments

The `teacher_assignments` table connects teachers with the classes and subjects they are responsible for.

This table is important because one teacher may be assigned:

* A particular class
* A particular subject
* A class and subject combination

The backend uses this information to determine what a teacher is allowed to manage.

---

# 9. marks

The `marks` table stores marks entered for students.

The marks are entered by teachers according to their assigned classes and subjects.

The marks are later used to produce results and grades.

---

# 10. submissions

The `submissions` table tracks marks submitted by teachers.

The intended workflow is:

Teacher enters marks
↓
Teacher submits marks
↓
Admin views submitted marks
↓
Admin accepts/approves marks
↓
Results can be processed

This table therefore helps track the submission/approval process.

---

# 11. results

The `results` table stores student result information.

Results are based on marks entered for students.

The system is intended to use results to calculate:

* Grades
* Positions
* Student performance

---

# 12. Main Relationships

The general database relationship is:

```text
users
  │
  │ 1-to-1
  ▼
teachers
  │
  │
  ▼
teacher_assignments
  │
  ├──────────────► classes
  │
  └──────────────► subjects

classes
  │
  ▼
students
  │
  ▼
marks
  │
  ▼
results

marks
  │
  ▼
submissions
```

The exact foreign-key relationships should always be checked against the PostgreSQL database before changing the database structure.

---

# 13. Teacher Creation Workflow

When an administrator creates a teacher, the backend should create:

1. A user account in `users`
2. A teacher record in `teachers`

The teacher record contains the `user_id` of the newly created user.

Therefore:

```text
Admin
  ↓
Angular Teacher Form
  ↓
Teacher API
  ↓
TeacherService
  ↓
Create User
  ↓
Create Teacher
  ↓
PostgreSQL
```

---

# 14. Important Database Rules

The frontend and backend must use values that match the database.

For example, teacher status uses:

```text
ACTIVE
INACTIVE
```

The frontend should not send:

```text
Active
Inactive
On Leave
```

for the teacher `status` field because the current database constraint accepts only:

```text
ACTIVE
INACTIVE
```

---

# 15. Useful PostgreSQL Commands

### Show all tables

```sql
\dt
```

### Show the structure of a table

```sql
\d users
\d teachers
\d students
\d classes
\d subjects
\d teacher_assignments
\d marks
\d submissions
\d results
```

### View teachers

```sql
SELECT * FROM teachers;
```

### View users

```sql
SELECT * FROM users;
```

### View students

```sql
SELECT * FROM students;
```

### View classes

```sql
SELECT * FROM classes;
```

### View subjects

```sql
SELECT * FROM subjects;
```

### View marks

```sql
SELECT * FROM marks;
```

### View results

```sql
SELECT * FROM results;
```

---

# 16. Important Development Rule

The database is already connected to the Spring Boot backend.

The normal application architecture is:

```text
Angular Frontend
       │
       │ HTTP / REST API
       ▼
Spring Boot Backend
       │
       │ JPA / Hibernate
       ▼
PostgreSQL
       │
       ▼
jangombe_school
```

Angular should communicate with the backend through API endpoints.

Angular should NOT connect directly to PostgreSQL.

---

# 17. Important Project Files

### Frontend

```text
frontend/
```

Contains the Angular application.

### Backend

```text
backend/
```

Contains the Spring Boot application.

Important backend packages:

```text
controller/
entity/
repository/
service/
dto/
config/
```

### Database documentation

```text
database/
```

Contains documentation and SQL notes describing the PostgreSQL database.

---

# 18. Instructions for AI Assistants

When working on this project, understand that:

* `frontend/` is the Angular application.
* `backend/` is the Spring Boot application.
* PostgreSQL database name is `jangombe_school`.
* The database is separate from the project files.
* `database/` contains documentation about the database.
* Angular communicates with Spring Boot through REST APIs.
* Spring Boot communicates with PostgreSQL.
* Database changes should not be invented.
* Before changing a table, column, relationship, or constraint, inspect the existing backend entity and database structure.
* Frontend models should match the backend API.
* Backend entities should match the PostgreSQL database.
* Do not create sample/mock data unless specifically requested.
* Preserve existing real database data.
* Do not delete or recreate the database to solve an application problem without explicit approval.

The goal is to keep these three layers synchronized:

```text
Angular
   ↕
Spring Boot
   ↕
PostgreSQL
```
