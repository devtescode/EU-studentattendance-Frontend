import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, StatCard } from "@/components/RoleLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/lecturer/")({
  component: LecturerDashboard,
});

const API_URL = "https://eu-studentattendance-backend.onrender.com";

function LecturerDashboard() {
  const token = sessionStorage.getItem("lecturer_token");

  const [courses, setCourses] = useState<any[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeSessions, setActiveSessions] = useState(0);
  const [lecturerName, setLecturerName] = useState("Lecturer");
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(
        `${API_URL}/lecturers/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setCourses(data.courses || []);
        setTotalCourses(data.totalCourses || 0);
        setTotalStudents(data.totalStudents || 0);
        setActiveSessions(data.activeSessions || 0);

        const lecturerData = JSON.parse(
          sessionStorage.getItem("lecturer_data") || "{}"
        );

        

        setLecturerName(
          lecturerData.name || "Lecturer"
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${lecturerName}`}
        subtitle="Manage your courses and track attendance"
        actions={
          <Button
            asChild
            className="bg-[#006B3C] hover:bg-[#024d2c]"
          >
            <Link to="/lecturer/sessions-attendance">
              + New Session
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="My Courses"
          value={totalCourses}
          tone="green"
        />

        <StatCard
          label="Attendance Sessions"
          value={activeSessions}
          tone="gold"
        />

        <StatCard
          label="Total Students"
          value={totalStudents}
          tone="blue"
        />
      </div>

      {/* Courses */}
      <div className="mt-6 rounded-2xl bg-white border shadow-sm p-6">
        <h3 className="font-semibold mb-3">
          My Courses
        </h3>

        {loading ? (
          <p className="text-gray-500">
            Loading courses...
          </p>
        ) : courses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-3">
              No courses created yet
            </p>

            <Button asChild>
              <Link to="/lecturer/courses">
                Create Your First Course
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y">
            {courses.map((course) => (
              <li
                key={course._id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {course.courseCode} —{" "}
                    {course.courseTitle}
                  </p>

                  <p className="text-xs text-gray-500">
                    {
                      course
                        .registeredStudentIds?.length
                    }{" "}
                    students enrolled
                  </p>

                  <p className="text-xs text-[#006B3C] mt-1">
                    {course.days?.join(", ")} |{" "}
                    {course.startTime} -{" "}
                    {course.endTime}
                  </p>
                </div>

                <div>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    Active
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default LecturerDashboard;