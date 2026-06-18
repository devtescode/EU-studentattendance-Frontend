import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/lecturer/")({
  component: LecturerDashboard,
});

function LecturerDashboard() {
  const { user, courses, sessions } = useApp();
  const myCourses = courses.filter((c) => c.lecturerId === user?.id);
  const mySessions = sessions.filter((s) => myCourses.some((c) => c.id === s.courseId));
  const totalStudents = new Set(myCourses.flatMap((c) => c.registeredStudentIds)).size;
  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name ?? "Lecturer"}`}
        subtitle="Manage your courses and track attendance"
        actions={
          <Button asChild className="bg-[#006B3C] hover:bg-[#024d2c]">
            <Link to="/lecturer/sessions-attendance">+ New Session</Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="My Courses" value={myCourses.length} tone="green" />
        <StatCard label="Attendance Sessions" value={mySessions.length} tone="gold" />
        <StatCard label="Total Students" value={totalStudents} tone="blue" />
      </div>
      <div className="mt-6 rounded-2xl bg-white border shadow-sm p-6">
        <h3 className="font-semibold mb-3">Active Courses</h3>
        {myCourses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-3">No courses created yet</p>
            <Button asChild><Link to="/lecturer/courses">Create Your First Course</Link></Button>
          </div>
        ) : (
          <ul className="divide-y">
            {myCourses.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.code} — {c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.registeredStudentIds.length} students enrolled</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}