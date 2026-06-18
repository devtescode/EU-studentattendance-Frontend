import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  initialCourses,
  initialStudents,
  initialLecturers,
  ADMIN_CREDENTIALS,
  type Course,
  type Student,
  type Lecturer,
  type Session,
  type AttendanceRecord,
} from "@/data/mockData";

export type Role = "admin" | "lecturer" | "student";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AppContextValue {
  user: AuthUser | null;
  loginAdmin: (email: string, password: string) => AuthUser | null;
  loginLecturer: (email: string, password: string) => AuthUser | null;
  loginStudent: (matricNo: string, password: string) => AuthUser | null;
  signupStudent: (data: Omit<Student, "id">) => { ok: boolean; error?: string };
  logout: () => void;

  courses: Course[];
  students: Student[];
  lecturers: Lecturer[];
  sessions: Session[];
  attendance: AttendanceRecord[];

  addLecturer: (l: Omit<Lecturer, "id">) => void;
  addCourse: (c: Omit<Course, "id" | "registeredStudentIds">) => void;
  registerCourse: (studentId: string, courseId: string) => void;
  createSession: (s: Omit<Session, "id">) => void;
  markAttendance: (sessionId: string, studentId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [lecturers, setLecturers] = useState<Lecturer[]>(initialLecturers);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("eu_user") : null;
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const persist = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem("eu_user", JSON.stringify(u));
  };

  const loginAdmin: AppContextValue["loginAdmin"] = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const u: AuthUser = { id: "admin-1", name: ADMIN_CREDENTIALS.name, email, role: "admin" };
      persist(u);
      return u;
    }
    return null;
  };

  const loginLecturer: AppContextValue["loginLecturer"] = (email, password) => {
    const lec = lecturers.find((l) => l.email === email && l.password === password);
    if (!lec) return null;
    const u: AuthUser = { id: lec.id, name: lec.name, email: lec.email, role: "lecturer" };
    persist(u);
    return u;
  };

  const loginStudent: AppContextValue["loginStudent"] = (matricNo, password) => {
    const stu = students.find((s) => s.matricNo === matricNo && s.password === password);
    if (!stu) return null;
    const u: AuthUser = { id: stu.id, name: stu.name, email: stu.email ?? "", role: "student" };
    persist(u);
    return u;
  };

  const signupStudent: AppContextValue["signupStudent"] = (data) => {
    if (students.some((s) => s.matricNo === data.matricNo)) {
      return { ok: false, error: "A student with this matric number already exists." };
    }
    setStudents((prev) => [...prev, { ...data, id: `stu-${prev.length + 1}` }]);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eu_user");
  };

  const addLecturer: AppContextValue["addLecturer"] = (l) => {
    setLecturers((prev) => [...prev, { ...l, id: `lec-${prev.length + 1}` }]);
  };

  const addCourse: AppContextValue["addCourse"] = (c) => {
    setCourses((prev) => [
      ...prev,
      { ...c, id: `crs-${prev.length + 1}`, registeredStudentIds: [] },
    ]);
  };

  const registerCourse: AppContextValue["registerCourse"] = (studentId, courseId) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId && !c.registeredStudentIds.includes(studentId)
          ? { ...c, registeredStudentIds: [...c.registeredStudentIds, studentId] }
          : c,
      ),
    );
  };

  const createSession: AppContextValue["createSession"] = (s) => {
    setSessions((prev) => [...prev, { ...s, id: `ses-${prev.length + 1}` }]);
  };

  const markAttendance: AppContextValue["markAttendance"] = (sessionId, studentId) => {
    setAttendance((prev) => {
      if (prev.some((a) => a.sessionId === sessionId && a.studentId === studentId)) return prev;
      return [
        ...prev,
        { sessionId, studentId, status: "present", timestamp: new Date().toISOString() },
      ];
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loginAdmin,
        loginLecturer,
        loginStudent,
        signupStudent,
        logout,
        courses,
        students,
        lecturers,
        sessions,
        attendance,
        addLecturer,
        addCourse,
        registerCourse,
        createSession,
        markAttendance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}