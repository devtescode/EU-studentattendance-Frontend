export interface Course {
  id: string;
  code: string;
  title: string;
  lecturerId: string;
  registeredStudentIds: string[];
}

export interface Student {
  id: string;
  matricNo: string;
  name: string;
  department: string;
  level?: string;
  email?: string;
  phone?: string;
  gender?: string;
  password?: string;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  password?: string;
}

export interface Session {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceRecord {
  sessionId: string;
  studentId: string;
  status: "present" | "absent";
  timestamp: string;
}

export const initialLecturers: Lecturer[] = [
  { id: "lec-1", name: "Dr. Adebayo Olufemi", email: "adebayo@elizade.edu.ng", department: "Computer Science", password: "lecturer123" },
  { id: "lec-2", name: "Prof. Ngozi Okafor", email: "ngozi@elizade.edu.ng", department: "Mathematics", password: "lecturer123" },
];

export const initialStudents: Student[] = [
  { id: "stu-1", matricNo: "EU/2021/0001", name: "Chinedu Okeke", department: "Computer Science", level: "300", email: "chinedu@elizade.edu.ng", phone: "08012345678", gender: "Male", password: "student123" },
  { id: "stu-2", matricNo: "EU/2021/0002", name: "Aisha Bello", department: "Computer Science", level: "300", email: "aisha@elizade.edu.ng", phone: "08023456789", gender: "Female", password: "student123" },
  { id: "stu-3", matricNo: "EU/2021/0003", name: "Tunde Adeyemi", department: "Mathematics", level: "200", email: "tunde@elizade.edu.ng", phone: "08034567890", gender: "Male", password: "student123" },
];

export const ADMIN_CREDENTIALS = {
  email: "admin@elizade.edu.ng",
  password: "admin123",
  name: "System Administrator",
};

export const initialCourses: Course[] = [
  { id: "crs-1", code: "CSC 301", title: "Data Structures", lecturerId: "lec-1", registeredStudentIds: ["stu-1"] },
  { id: "crs-2", code: "CSC 305", title: "Operating Systems", lecturerId: "lec-1", registeredStudentIds: [] },
  { id: "crs-3", code: "MTH 201", title: "Linear Algebra", lecturerId: "lec-2", registeredStudentIds: [] },
];