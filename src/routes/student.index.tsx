import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, StatCard } from "@/components/RoleLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/student/")({
  component: StudentDashboard,
});

const API_URL = "http://localhost:4000";

function StudentDashboard() {
  const token = sessionStorage.getItem("student_token");

  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [attendanceCount, setAttendanceCount] = useState(0);

  // 🔥 NEW: track attended sessions
  const [attendedSessions, setAttendedSessions] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  // ---------------- FETCH COURSES ----------------
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/students/my-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setMyCourses(data.courses || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- FETCH SESSIONS ----------------
  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/attendance/student-attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- FETCH ATTENDANCE COUNT ----------------
  const fetchAttendanceCount = async () => {
    try {
      const res = await fetch(`${API_URL}/attendance/my-attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setAttendanceCount(data.attendance?.length || 0);

        // 🔥 IMPORTANT: store attended session IDs
        const ids = data.attendance?.map((a: any) => a.sessionId) || [];
        setAttendedSessions(ids);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- CHECK IF OPEN ----------------
  const isAttendanceOpen = (session: any) => {
    const now = new Date();

    const today = now.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!session.days?.includes(today)) return false;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMinute] = session.startTime.split(":").map(Number);
    const [endHour, endMinute] = session.endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  };

  // ---------------- MARK ATTENDANCE ----------------
  const markAttendance = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_URL}/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message);
      }

      toast.success("Attendance marked successfully");

      // 🔥 update UI instantly
      setAttendedSessions((prev) => [...prev, sessionId]);

      fetchAttendanceCount();
    } catch (error) {
      toast.error("Network error");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchCourses(),
        fetchSessions(),
        fetchAttendanceCount(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Dashboard"
        subtitle="View your courses and attendance"
      />

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Registered Courses" value={myCourses.length} tone="green" />
        <StatCard label="Attendance Marked" value={attendanceCount} tone="gold" />
        <StatCard label="Available Sessions" value={sessions.length} tone="blue" />
      </div>

      {/* COURSES */}
      <div className="rounded-2xl bg-white border shadow-sm p-6">
        <h3 className="font-semibold mb-4">Registered Courses</h3>

        {myCourses.map((course) => (
          <div key={course._id} className="border rounded-xl p-4 mb-3">
            <p className="text-xs text-[#C9A227] font-semibold">
              {course.courseCode}
            </p>
            <h4 className="font-semibold">{course.courseTitle}</h4>
          </div>
        ))}
      </div>

      {/* ATTENDANCE */}
      <div className="rounded-2xl bg-white border shadow-sm p-6">
        <h3 className="font-semibold mb-4">Attendance Sessions</h3>

        {sessions.map((session) => {
          const alreadyMarked = attendedSessions.includes(session._id);
          const open = isAttendanceOpen(session);

          return (
            <div
              key={session._id}
              className="border rounded-xl p-4 flex justify-between items-center mb-3"
            >
              <div>
                <p className="font-semibold">{session.courseCode}</p>
                <p className="text-sm text-gray-500">{session.courseTitle}</p>
                <p className="text-xs text-gray-400">
                  {session.days?.join(", ")} | {session.startTime} - {session.endTime}
                </p>
              </div>

              <div>
                {alreadyMarked ? (
                  <button
                    disabled
                    className="px-4 py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed"
                  >
                    Attended
                  </button>
                ) : open ? (
                  <button
                    onClick={() => markAttendance(session._id)}
                    className="px-4 py-2 rounded-lg bg-[#006B3C] text-white hover:bg-[#024d2c]"
                  >
                    Mark Attendance
                  </button>
                ) : (
                  <span className="text-red-500 text-sm">
                    Closed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudentDashboard;  