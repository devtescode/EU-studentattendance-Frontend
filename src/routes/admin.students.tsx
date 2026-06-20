import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/RoleLayout";
import { useEffect, useState } from "react";
import { User, Mail, BookOpen, GraduationCap, Hash, Search } from "lucide-react";

export const Route = createFileRoute("/admin/students")({
  component: ManageStudents,
});

const API_URL = "http://localhost:4000";

function ManageStudents() {
  const token = sessionStorage.getItem("admin_token");

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ---------------- FETCH STUDENTS ----------------
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/getallstudents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setStudents(data.students || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();

    // 🔥 REAL TIME (polling every 5 seconds)
    const interval = setInterval(fetchStudents, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter students based on search
  const filteredStudents = students.filter((student) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      student.matricNo?.toLowerCase().includes(term) ||
      student.name?.toLowerCase().includes(term) ||
      student.department?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.level?.toString().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Students"
        subtitle="View all registered students"
      />

      <div className="rounded-2xl bg-white border shadow-sm p-4 sm:p-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, matric no, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto max-h-[75vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3 px-4 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Matric No
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Department
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Level
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006B3C]"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    {searchTerm ? "No students match your search" : "No students found"}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs whitespace-nowrap">
                      {s.matricNo}
                    </td>
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      {s.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {s.department}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {s.level || "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <a 
                        href={`mailto:${s.email}`} 
                        className="text-[#006B3C] hover:underline"
                      >
                        {s.email || "—"}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006B3C]"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? "No students match your search" : "No students found"}
            </div>
          ) : (
            filteredStudents.map((s) => (
              <div
                key={s._id}
                className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-base">{s.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">{s.matricNo}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                    <GraduationCap className="h-3 w-3" />
                    {s.level || "—"}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{s.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <a 
                      href={`mailto:${s.email}`} 
                      className="text-[#006B3C] hover:underline truncate"
                    >
                      {s.email || "—"}
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with count */}
        {!loading && filteredStudents.length > 0 && (
          <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
            <span>
              Showing {filteredStudents.length} of {students.length} students
            </span>
            <span className="hidden sm:inline">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageStudents;