import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/RoleLayout";
 import { toast } from "sonner";


export const Route = createFileRoute("/student/my-courses")({
  component: StudentMyCourses,
});

const API_URL = "https://eu-studentattendance-backend.onrender.com";

function StudentMyCourses() {
  const token = sessionStorage.getItem("student_token");

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/students/my-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };



const unregisterCourse = async (courseId: string) => {
  toast("Are you sure you want to remove this course?", {
    action: {
      label: "Yes, remove",
      onClick: async () => {
        try {
          const res = await fetch(
            `${API_URL}/students/unregister-course/${courseId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();

          if (!res.ok) {
            return toast.error(data.message);
          }

          setCourses((prev) =>
            prev.filter((course) => course._id !== courseId)
          );

          toast.success("Course removed successfully");
        } catch (error) {
          console.log(error);
          toast.error("Network error");
        }
      },
    },
    cancel: {
      label: "Cancel",
      onClick: () => {
        toast.message("Action cancelled");
      },
    },
  });
};

  useEffect(() => {
    fetchMyCourses();
  }, []);

  return (
    <div>
      <PageHeader
        title="My Courses"
        subtitle="Courses you have successfully registered"
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Loading courses...
        </p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No registered courses found.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#C9A227] font-semibold">
                    {course.courseCode}
                  </p>

                  <h3 className="font-semibold text-lg mt-1">
                    {course.courseTitle}
                  </h3>
                </div>

                <button
                  onClick={() => unregisterCourse(course._id)}
                  className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Lecturer: {course.lecturerId?.name || "Unknown"}
              </p>

              <div className="mt-3 text-sm text-gray-600">
                <p>
                  <strong>Days:</strong>{" "}
                  {course.days?.join(", ")}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {course.startTime} - {course.endTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentMyCourses;