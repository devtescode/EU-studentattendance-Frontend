import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/RoleLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/student/available-courses")({
  component: AvailableCourses,
});

const API_URL = "https://eu-studentattendance-backend.onrender.com";

function AvailableCourses() {
  const token = sessionStorage.getItem("student_token");

  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/students/getallcoursebystudent`);

      const data = await res.json();

      if (res.ok) {
        setCourses(data.courses || []);
      }
    } catch {
      toast.error("Failed to load courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // const registerCourse = async () => {
  //   if (!selectedCourse) {
  //     return toast.error("Please select a course");
  //   }

  //   try {

  //     const res = await fetch(`${API_URL}/students/register-course`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         courseId: selectedCourse,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       return toast.error(data.message);
  //     }

  //     toast.success("Course registered successfully");
  //   } catch {
  //     toast.error("Network error");
  //   }
  // };

  const registerCourse = async () => {
    if (!selectedCourse) {
      return toast.error("Please select a course");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/students/register-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: selectedCourse,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message);
      }

      toast.success("Course registered successfully");

      // Optional: clear selected course
      setSelectedCourse("");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };
  const selected = courses.find(
    (course) => course._id === selectedCourse
  );

  return (
    <div>
      <PageHeader
        title="Available Courses"
        subtitle="Register for lecturer courses"
      />

      <div className="max-w-2xl bg-white border rounded-2xl p-6 shadow-sm">
        <label className="block text-sm font-medium mb-2">
          Select Course
        </label>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select Course</option>

          {courses.map((course) => (
            <option
              key={course._id}
              value={course._id}
            >
              {course.courseCode} - {course.courseTitle}
            </option>
          ))}
        </select>

        {selected && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border">
            <p>
              <strong>Course Code:</strong>{" "}
              {selected.courseCode}
            </p>

            <p>
              <strong>Course Title:</strong>{" "}
              {selected.courseTitle}
            </p>

            <p>
              <strong>Lecturer:</strong>{" "}
              {selected.lecturerName}
            </p>

            <p>
              <strong>Days:</strong>{" "}
              {selected.days?.join(", ")}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {selected.startTime} - {selected.endTime}
            </p>
          </div>
        )}

        <Button
          onClick={registerCourse}
          disabled={loading}
          className="w-full mt-4 bg-[#006B3C] hover:bg-[#005230]"
        >
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          {loading ? "Please wait..." : "Register Course"}
        </Button>
      </div>
    </div>
  );
}

export default AvailableCourses;