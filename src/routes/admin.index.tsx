import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/RoleLayout";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const API_URL = "http://localhost:4000";

function AdminDashboard() {
  const [data, setData] = useState<any>({
    courses: [],
    lecturers: [],
    students: [],
    sessions: [],
  });

  const [openModal, setOpenModal] = useState(false);

  const token = sessionStorage.getItem("admin_token");

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/getadmindashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setData(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(fetchDashboard, 5000);

    return () => clearInterval(interval);
  }, []);

  // 👉 last 3 courses
  const recentCourses = [...data.courses]
    .reverse()
    .slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage lecturers, students, and courses"
      />

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Courses" value={data.courses.length} tone="green" />
        <StatCard label="Total Lecturers" value={data.lecturers.length} tone="gold" />
        <StatCard label="Total Students" value={data.students.length} tone="blue" />
        <StatCard label="Enrolled Courses" value={data.sessions.length} tone="slate" />
      </div>

      {/* RECENT COURSES */}
      <div className="mt-6 rounded-2xl bg-white border shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Courses</h3>

          {data.courses.length > 3 && (
            <button
              onClick={() => setOpenModal(true)}
              className="text-sm text-[#006B3C] font-medium hover:underline"
            >
              View All
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Code</th>
                <th className="py-2">Title</th>
                <th className="py-2">Lecturer</th>
                <th className="py-2">Enrolled</th>
              </tr>
            </thead>

            <tbody>
              {recentCourses.map((c: any) => {
                const lec = data.lecturers.find(
                  (l: any) => l._id === c.lecturerId
                );

                return (
                  <tr key={c._id} className="border-b last:border-0">
                    <td className="py-2 font-medium whitespace-nowrap">
                      {c.courseCode}
                    </td>
                    <td className="py-2 whitespace-nowrap">
                      {c.courseTitle}
                    </td>
                    <td className="py-2 whitespace-nowrap">
                      {lec?.name ?? "—"}
                    </td>
                    <td className="py-2 whitespace-nowrap">
                      {c.registeredStudentIds?.length || 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔥 VIEW ALL MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl max-h-[80vh] overflow-hidden flex flex-col">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">All Courses</h2>

              <button
                onClick={() => setOpenModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="sticky top-0 bg-white border-b">
                  <tr className="text-left text-gray-500">
                    <th className="p-3">Code</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Lecturer</th>
                    <th className="p-3">Enrolled</th>
                  </tr>
                </thead>

                <tbody>
                  {data.courses.map((c: any) => {
                    const lec = data.lecturers.find(
                      (l: any) => l._id === c.lecturerId
                    );

                    return (
                      <tr key={c._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 whitespace-nowrap">
                          {c.courseCode}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {c.courseTitle}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {lec?.name ?? "—"}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {c.registeredStudentIds?.length || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;