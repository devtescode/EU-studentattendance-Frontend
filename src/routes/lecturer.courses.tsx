import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/RoleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/lecturer/courses")({
  component: MyCourses,
});

const API_URL = "http://localhost:4000";

function MyCourses() {
  const token = sessionStorage.getItem("lecturer_token");

  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH COURSES ----------------
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/session/my-sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message);
      }

      setCourses(data.sessions || []);
    } catch (err) {
      toast.error("Failed to load courses");
    }
  };

  // ---------------- FETCH STUDENTS ----------------
  const fetchStudents = async (courseId: string) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/session/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message);
      }

      setSelectedCourse(data.course);
      setStudents(data.students);
      setFilteredStudents(data.students);
    } catch (err) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SEARCH STUDENTS ----------------
  const handleStudentSearch = (value: string) => {
    const filtered = students.filter((s) =>
      `${s.name} ${s.matricNo}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    setFilteredStudents(filtered);
  };

  // ---------------- FILTER COURSES ----------------
  const filteredCourses = courses.filter((c) =>
    `${c.courseCode} ${c.courseTitle}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        subtitle="Manage courses and view enrolled students"
      />

      {/* SEARCH COURSES */}
      <div className="flex justify-end">
        <Input
          placeholder="Search course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Course Code</th>
              <th>Course Title</th>
              <th>Days</th>
              <th>Enrolled</th>
              <th className="text-right p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCourses.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3 font-medium text-[#C9A227]">
                  {c.courseCode}
                </td>

                <td>{c.courseTitle}</td>

                <td>{c.days?.join(", ")}</td>

                <td>{c.registeredStudentIds?.length || 0}</td>

                <td className="text-right p-3">
                  <Button
                    size="sm"
                    className="bg-[#006B3C] hover:bg-[#024d2c]"
                    onClick={() => fetchStudents(c._id)}
                  >
                    View Students
                  </Button>
                </td>
              </tr>
            ))}

            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-5">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-semibold text-lg">
                  {selectedCourse.code}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedCourse.title}
                </p>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* SEARCH STUDENTS */}
            <Input
              placeholder="Search student..."
              className="mb-3"
              onChange={(e) => handleStudentSearch(e.target.value)}
            />

            {/* LIST */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {loading ? (
                <p>Loading...</p>
              ) : filteredStudents.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No students registered
                </p>
              ) : (
                filteredStudents.map((s) => (
                  <div
                    key={s._id}
                    className="border rounded-lg p-3 flex justify-between"
                  >
                    <span>{s.name}</span>
                    <span className="text-gray-500">
                      {s.matricNo}
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}