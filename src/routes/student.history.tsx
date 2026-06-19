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
        console.log(data.attendance);

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
                {/* <th className="py-3 px-2">Date</th> */}
                {/* <th className="py-3 px-2">Time</th> */}
                <th className="py-3 px-2">Marked At</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((a) => (
                <tr key={a._id} className="border-b last:border-0">
                  <td className="py-3 px-2 font-medium">
                    {a.course?.code} — {a.course?.title}
                  </td>

                  {/* <td className="py-3 px-2">
                    {a.session?.date || "N/A"}
                  </td>

                  <td className="py-3 px-2">
                    {a.session?.startTime} - {a.session?.endTime}
                  </td> */}

                  {/* 🔥 TIME STUDENT MARKED ATTENDANCE */}
                  <td className="py-3 px-2 text-gray-500">
                    {new Date(a.markedAt).toLocaleString('en-US', {
                      month: 'short',   // 'Jun'
                      day: 'numeric',   // '6'
                      year: 'numeric',  // '2026'
                      hour: 'numeric',  // '2'
                      minute: '2-digit' // '30'
                    })}
                  </td>

                  <td className="py-3 px-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E6F2EC] text-[#006B3C] capitalize">
                      {a.status}
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