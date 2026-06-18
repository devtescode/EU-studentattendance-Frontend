import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/admin/students")({
  component: ManageStudents,
});

function ManageStudents() {
  const { students } = useApp();
  return (
    <div>
      <PageHeader title="Manage Students" subtitle="View all registered students" />
      <div className="rounded-2xl bg-white border shadow-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="py-2">Matric No</th>
                <th className="py-2">Name</th>
                <th className="py-2">Department</th>
                <th className="py-2">Level</th>
                <th className="py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">{s.matricNo}</td>
                  <td className="py-2 font-medium">{s.name}</td>
                  <td className="py-2">{s.department}</td>
                  <td className="py-2">{s.level ?? "—"}</td>
                  <td className="py-2">{s.email ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}