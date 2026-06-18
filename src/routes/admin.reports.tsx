import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/admin/reports")({
  component: Reports,
});

function Reports() {
  const { sessions, attendance, courses, students } = useApp();
  const totalPossible = sessions.length * students.length;
  const rate = totalPossible > 0 ? Math.round((attendance.length / totalPossible) * 100) : 0;
  return (
    <div>
      <PageHeader title="Reports" subtitle="System-wide attendance overview" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Sessions" value={sessions.length} tone="green" />
        <StatCard label="Attendance Records" value={attendance.length} tone="gold" />
        <StatCard label="Avg Attendance Rate" value={`${rate}%`} tone="blue" />
      </div>
      <div className="mt-6 rounded-2xl bg-white border shadow-sm p-6">
        <h3 className="font-semibold mb-3">Course Breakdown</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b">
              <th className="py-2">Code</th>
              <th className="py-2">Title</th>
              <th className="py-2">Enrolled</th>
              <th className="py-2">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="py-2 font-medium">{c.code}</td>
                <td className="py-2">{c.title}</td>
                <td className="py-2">{c.registeredStudentIds.length}</td>
                <td className="py-2">{sessions.filter((s) => s.courseId === c.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}