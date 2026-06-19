import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/RoleLayout";

export const Route = createFileRoute("/student/history")({
  component: History,
});

const API_URL = "http://localhost:4000";

function History() {
  const token = sessionStorage.getItem("student_token");

  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH HISTORY ----------------
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/attendance/attendance-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setAttendance(data.attendance || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance History"
        subtitle="A record of all sessions you've attended"
      />

      <div className="rounded-2xl bg-white border shadow-sm p-6 overflow-x-auto">
        {loading ? (
          <p className="text-sm text-gray-500">Loading history...</p>
        ) : attendance.length === 0 ? (
          <p className="text-sm text-gray-500">
            No attendance recorded yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b bg-gray-50">
                <th className="py-3 px-2">Course</th>
                <th className="py-3 px-2">Week</th>
                <th className="py-3 px-2">Marked At</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance
                .filter((a) => a.course?.code && a.course?.title) // 🔥 hide deleted courses
                .map((a) => (
                  <tr key={a._id} className="border-b last:border-0">
                    {/* COURSE */}
                    <td className="py-3 px-2 font-medium text-gray-800">
                      {a.course.code} — {a.course.title}
                    </td>

                    {/* WEEK */}
                    <td className="py-3 px-2 text-gray-600">
                      {a.weekKey || "N/A"}
                    </td>

                    {/* MARKED AT */}
                    <td className="py-3 px-2 text-gray-500">
                      {a.markedAt
                        ? new Date(a.markedAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>

                    {/* STATUS */}
                    <td className="py-3 px-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E6F2EC] text-[#006B3C] capitalize">
                        present
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default History;