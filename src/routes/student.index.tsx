import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, StatCard } from "@/components/RoleLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/student/")({
  component: StudentDashboard,
});

const API_URL = "https://eu-studentattendance-backend.onrender.com";
// const API_URL = "http://localhost:4000";

function StudentDashboard() {
  const token = sessionStorage.getItem("student_token");
  const storedStudent = JSON.parse(sessionStorage.getItem("student_data") || "{}");
  const studentName = storedStudent?.name;
  const matricNo = storedStudent?.matricNo;

  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ---------------- COURSES ----------------
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/students/my-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log(data, "Dataaaaacourses")
      if (res.ok) setMyCourses(data.courses || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- SESSIONS (WEEKLY ACTIVE) ----------------
  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/attendance/student-attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setSessions(data.sessions || []);
        // Also update attendance count if backend sends it
        if (data.weekAttendance !== undefined) {
          setAttendanceCount(data.weekAttendance);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- ATTENDANCE HISTORY (THIS WEEK) ----------------
  const fetchAttendanceCount = async () => {
    try {
      const res = await fetch(`${API_URL}/attendance/my-attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setAttendanceCount(data.attendance?.length || 0);
      }
    } catch (err) {
      console.log(err);
    }
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
        body: JSON.stringify({ courseId: sessionId }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message);
      }

      toast.success("Attendance marked successfully");

      // 🔥 IMPORTANT: Refresh both sessions and attendance count
      await Promise.all([
        fetchSessions(),  // This will update the sessions with new isAlreadyMarked values
        fetchAttendanceCount(),
      ]);

    } catch (err) {
      toast.error("Network error");
    }
  };


  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
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
        subtitle="Weekly Attendance System"
      />
      <div className="bg-white border rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-gray-500">Logged in as</p>

        <h2 className="text-lg font-semibold text-[#006B3C]">
          {studentName}
        </h2>

        <p className="text-sm text-gray-600">
          Matric No: <span className="font-medium">{matricNo}</span>
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Registered Courses" value={myCourses.length} tone="green" />
        {/* <StatCard label="Attendance This Week" value={attendanceCount} tone="gold" /> */}
        <StatCard label="Attendance Marked" value={attendanceCount} tone="gold" />
        <StatCard label="Active Sessions Today" value={sessions.length} tone="blue" />
      </div>

      {/* COURSES */}
      <div className="rounded-2xl bg-white border shadow-sm p-6">
        <h3 className="font-semibold mb-4">Registered Courses</h3>

        {myCourses.length === 0 ? (
          <p className="text-sm text-gray-500">No courses registered yet.</p>
        ) : (
          myCourses.map((course) => (
            <div key={course._id} className="border rounded-xl p-4 mb-3">
              <p className="text-xs text-[#C9A227] font-semibold">
                {course.courseCode}
              </p>
              <h4 className="font-semibold">{course.courseTitle}</h4>
            </div>
          ))
        )}
      </div>

      {/* ATTENDANCE SESSIONS */}
      <div className="rounded-2xl bg-white border shadow-sm p-6">
        <h3 className="font-semibold mb-4">Today's Attendance</h3>

        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              No active attendance sessions today.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Check your course schedule for available days and times.
            </p>
          </div>
        ) : (
          sessions.map((session) => {
            const sessionId = String(session._id);

            // Use the flag from backend
            const alreadyMarked = session.isAlreadyMarked;
            const open = session.isOpen;

            return (
              <div
                key={sessionId}
                className="border rounded-xl p-4 flex justify-between items-center mb-3 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-semibold">{session.courseCode}</p>
                  <p className="text-sm text-gray-500">
                    {session.courseTitle}
                  </p>
                  <div className="flex gap-2 text-xs text-gray-400 mt-1">
                    <span>{session.days?.join(", ")}</span>
                    <span>•</span>
                    {/* <span>{session.startTime} - {session.endTime}</span> */}
                    <span className="font-medium text-[#006B3C]">
                      {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </span>
                  </div>
                </div>

                <div>
                  {alreadyMarked ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg bg-green-100 text-green-700 cursor-not-allowed font-medium"
                    >
                      ✓ Attended Today
                    </button>
                  ) : open ? (
                    <button
                      onClick={() => markAttendance(sessionId)}
                      className="px-4 py-2 rounded-lg bg-[#006B3C] text-white hover:bg-[#024d2c] transition-colors font-medium"
                    >
                      Mark Attendance
                    </button>
                  ) : (
                    <div className="text-center">
                      <span className="text-red-500 text-sm font-medium">
                        Session Closed
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        Time expired
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;