import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/RoleLayout";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/lecturer/records")({
  component: Records,
});

const API_URL = "http://localhost:4000";

function Records() {
  const token = sessionStorage.getItem("lecturer_token");

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await fetch(
        `${API_URL}/lecturers/lecturer-records`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setRecords(data.records || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();

    const interval = setInterval(fetchRecords, 10000);

    return () => clearInterval(interval);
  }, []);

  const grouped = records.reduce((acc: any, record: any) => {
    const courseId = record.courseId?._id;

    if (!acc[courseId]) {
      acc[courseId] = {
        courseCode: record.courseId?.courseCode,
        courseTitle: record.courseId?.courseTitle,
        students: [],
      };
    }

    acc[courseId].students.push({
      id: record.studentId?._id,
      name: record.studentId?.name,
      matricNumber: record.studentId?.matricNo,
      markedAt: record.createdAt,
    });

    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Records"
        subtitle="Students that marked attendance"
      />

      <div className="rounded-2xl bg-white border shadow-sm p-6">
        {loading ? (
          <p>Loading records...</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-sm text-gray-500">
            No attendance records yet.
          </p>
        ) : (
          <div className="space-y-6">
            {Object.values(grouped).map((course: any, index) => (
              <div
                key={index}
                className="border rounded-xl overflow-hidden"
              >
                <div className="bg-[#006B3C] text-white p-4">
                  <h3 className="font-semibold">
                    {course.courseCode}
                  </h3>

                  <p className="text-sm opacity-90">
                    {course.courseTitle}
                  </p>

                  <p className="text-sm mt-1">
                    Total Attendance:{" "}
                    {course.students.length}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left p-3">Student</th>
                        <th className="text-left p-3">
                          Matric Number
                        </th>
                        <th className="text-left p-3">
                          Marked At
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {course.students.map(
                        (student: any) => (
                          <tr
                            key={student.id}
                            className="border-b"
                          >
                            <td className="p-3">
                              {student.name}
                            </td>

                            <td className="p-3">
                              {student.matricNumber}
                            </td>

                            <td className="p-3">
                              {new Date(
                                student.markedAt
                              ).toLocaleString()}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Records;