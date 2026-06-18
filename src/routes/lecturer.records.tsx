import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/lecturer/records")({
  component: Records,
});

function Records() {
  const { user, courses, sessions, attendance, students } = useApp();
  const myCourses = courses.filter((c) => c.lecturerId === user?.id);
  const mySessions = sessions.filter((s) => myCourses.some((c) => c.id === s.courseId));
  return (
    <div>
      <PageHeader title="Attendance Records" subtitle="All sessions and attendance you've recorded" />
      <div className="rounded-2xl bg-white border shadow-sm p-6">
        {mySessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No records yet.</p>
        ) : (
          <div className="space-y-4">
            {mySessions.map((s) => {
              const c = courses.find((co) => co.id === s.courseId);
              const recs = attendance.filter((a) => a.sessionId === s.id);
              return (
                <div key={s.id} className="border rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{c?.code} — {c?.title}</p>
                    <p className="text-xs text-muted-foreground">{s.date} · {s.startTime}–{s.endTime}</p>
                  </div>
                  <p className="text-sm mt-2">
                    <span className="font-semibold text-[#006B3C]">{recs.length}</span> students marked present
                  </p>
                  {recs.length > 0 && (
                    <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                      {recs.map((r) => {
                        const st = students.find((x) => x.id === r.studentId);
                        return <li key={r.studentId}>• {st?.name} ({st?.matricNo})</li>;
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}