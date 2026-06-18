import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/student/")({
  component: StudentDashboard,
});

function StudentDashboard() {
  const { user, courses, sessions, attendance } = useApp();
  const myCourses = courses.filter((c) => c.registeredStudentIds.includes(user?.id ?? ""));
  const myAttendance = attendance.filter((a) => a.studentId === user?.id);
  const upcoming = sessions.filter((s) => myCourses.some((c) => c.id === s.courseId));
  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name ?? "Student"}`} subtitle="View your courses and mark attendance" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Enrolled Courses" value={myCourses.length} tone="green" />
        <StatCard label="Sessions Attended" value={myAttendance.length} tone="gold" />
        <StatCard label="Upcoming Sessions" value={upcoming.length} tone="blue" />
      </div>
      <div className="mt-6 rounded-2xl bg-white border shadow-sm p-6">
        <h3 className="font-semibold mb-3">My Courses</h3>
        {myCourses.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            You are not enrolled in any courses yet.{" "}
            <Link to="/student/available-courses" className="text-[#006B3C] font-medium">Browse courses</Link>
          </div>
        ) : (
          <ul className="divide-y">
            {myCourses.map((c) => (
              <li key={c.id} className="py-2 flex justify-between text-sm">
                <span className="font-medium">{c.code} — {c.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-6 rounded-2xl bg-white border shadow-sm p-6">
        <h3 className="font-semibold mb-3">Upcoming Attendance Sessions</h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active sessions at the moment</p>
        ) : (
          <ul className="divide-y">
            {upcoming.map((s) => {
              const c = courses.find((co) => co.id === s.courseId);
              return (
                <li key={s.id} className="py-2 text-sm flex justify-between">
                  <span className="font-medium">{c?.code} — {c?.title}</span>
                  <span className="text-muted-foreground">{s.date} · {s.startTime}–{s.endTime}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}