import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { courses, lecturers, students, sessions } = useApp();
  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Manage lecturers, students, and courses" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Courses" value={courses.length} tone="green" />
        <StatCard label="Total Lecturers" value={lecturers.length} tone="gold" />
        <StatCard label="Total Students" value={students.length} tone="blue" />
        <StatCard label="Active Sessions" value={sessions.length} tone="slate" />
      </div>

      <div className="mt-6 rounded-2xl bg-white border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Courses</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="py-2">Code</th>
                <th className="py-2">Title</th>
                <th className="py-2">Lecturer</th>
                <th className="py-2">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => {
                const lec = lecturers.find((l) => l.id === c.lecturerId);
                return (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{c.code}</td>
                    <td className="py-2">{c.title}</td>
                    <td className="py-2">{lec?.name ?? "—"}</td>
                    <td className="py-2">{c.registeredStudentIds.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}