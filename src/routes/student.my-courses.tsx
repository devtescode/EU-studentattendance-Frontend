import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/student/my-courses")({
  component: StudentMyCourses,
});

function StudentMyCourses() {
  const { user, courses, sessions, lecturers, markAttendance, attendance } = useApp();
  const myCourses = courses.filter((c) => c.registeredStudentIds.includes(user?.id ?? ""));

  const isOpen = (s: { date: string; startTime: string; endTime: string }) => {
    const now = new Date();
    const start = new Date(`${s.date}T${s.startTime}`);
    const end = new Date(`${s.date}T${s.endTime}`);
    return now >= start && now <= end;
  };

  return (
    <div>
      <PageHeader title="My Courses" subtitle="Your enrolled courses and active sessions" />
      {myCourses.length === 0 ? (
        <p className="text-sm text-muted-foreground">You are not enrolled in any courses yet.</p>
      ) : (
        <div className="space-y-4">
          {myCourses.map((c) => {
            const lec = lecturers.find((l) => l.id === c.lecturerId);
            const courseSessions = sessions.filter((s) => s.courseId === c.id);
            return (
              <div key={c.id} className="rounded-2xl bg-white border shadow-sm p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#C9A227] font-semibold">{c.code}</p>
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-xs text-muted-foreground">Lecturer: {lec?.name ?? "—"}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {courseSessions.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No sessions scheduled.</p>
                  ) : (
                    courseSessions.map((s) => {
                      const open = isOpen(s);
                      const marked = attendance.some((a) => a.sessionId === s.id && a.studentId === user?.id);
                      return (
                        <div key={s.id} className="border rounded-xl p-3 flex items-center justify-between">
                          <div className="text-sm">
                            <p className="font-medium">{s.date} · {s.startTime}–{s.endTime}</p>
                            <p className="text-xs text-muted-foreground">
                              {marked ? "Marked present" : open ? "Session is open" : "Not active"}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            disabled={!open || marked}
                            onClick={() => {
                              markAttendance(s.id, user?.id ?? "");
                              toast.success("Attendance marked");
                            }}
                            className="bg-[#006B3C] hover:bg-[#024d2c]"
                          >
                            {marked ? "Done" : "Mark"}
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}