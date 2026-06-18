import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/student/history")({
  component: History,
});

function History() {
  const { user, attendance, sessions, courses } = useApp();
  const mine = attendance.filter((a) => a.studentId === user?.id);
  return (
    <div>
      <PageHeader title="Attendance History" subtitle="A record of all sessions you've attended" />
      <div className="rounded-2xl bg-white border shadow-sm p-6">
        {mine.length === 0 ? (
          <p className="text-sm text-muted-foreground">No attendance recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="py-2">Course</th>
                <th className="py-2">Date</th>
                <th className="py-2">Time</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((a) => {
                const s = sessions.find((x) => x.id === a.sessionId);
                const c = s ? courses.find((co) => co.id === s.courseId) : null;
                return (
                  <tr key={a.sessionId + a.studentId} className="border-b last:border-0">
                    <td className="py-2 font-medium">{c?.code} — {c?.title}</td>
                    <td className="py-2">{s?.date}</td>
                    <td className="py-2">{s?.startTime}–{s?.endTime}</td>
                    <td className="py-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#E6F2EC] text-[#006B3C]">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}