import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/lecturer/sessions-attendance")({
  component: SessionsAttendance,
});

function SessionsAttendance() {
  const { user, courses, sessions, students, attendance, createSession, markAttendance } = useApp();
  const myCourses = courses.filter((c) => c.lecturerId === user?.id);
  const mySessions = sessions.filter((s) => myCourses.some((c) => c.id === s.courseId));

  const [form, setForm] = useState({
    courseId: myCourses[0]?.id ?? "",
    date: new Date().toISOString().slice(0, 10),
    startTime: "09:00",
    endTime: "11:00",
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courseId) return toast.error("Select a course");
    createSession(form);
    toast.success("Attendance session created");
  };

  const activeSession = mySessions.find((s) => s.id === activeSessionId) ?? mySessions[0];
  const activeCourse = activeSession ? courses.find((c) => c.id === activeSession.courseId) : null;
  const enrolled = activeCourse ? students.filter((s) => activeCourse.registeredStudentIds.includes(s.id)) : [];

  return (
    <div>
      <PageHeader title="Sessions & Attendance" subtitle="Create attendance sessions and mark students" />
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={submit} className="rounded-2xl bg-white border shadow-sm p-6 space-y-3 lg:col-span-1">
          <h3 className="font-semibold">Create Session</h3>
          <div>
            <Label>Course</Label>
            <select
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="">Select course</option>
              {myCourses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
            </select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Start</Label>
              <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div>
              <Label>End</Label>
              <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
          </div>
          <Button type="submit" className="w-full bg-[#006B3C] hover:bg-[#024d2c]">Create Session</Button>
        </form>

        <div className="rounded-2xl bg-white border shadow-sm p-6 lg:col-span-2">
          <h3 className="font-semibold mb-3">Active Sessions ({mySessions.length})</h3>
          {mySessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions yet. Create one to get started.</p>
          ) : (
            <div className="space-y-2">
              {mySessions.map((s) => {
                const c = courses.find((co) => co.id === s.courseId);
                const active = (activeSession?.id ?? mySessions[0]?.id) === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className={`w-full text-left rounded-xl border p-3 flex items-center justify-between transition ${active ? "bg-[#E6F2EC] border-[#006B3C]" : "hover:bg-[#F5F7FA]"}`}
                  >
                    <div>
                      <p className="font-medium">{c?.code} — {c?.title}</p>
                      <p className="text-xs text-muted-foreground">{s.date} · {s.startTime}–{s.endTime}</p>
                    </div>
                    <span className="text-xs font-medium text-[#006B3C]">View</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {activeSession && activeCourse && (
        <div className="mt-6 rounded-2xl bg-white border shadow-sm p-6">
          <h3 className="font-semibold mb-3">
            Attendance — {activeCourse.code} ({activeSession.date})
          </h3>
          {enrolled.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students enrolled in this course.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2">Matric</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {enrolled.map((s) => {
                  const rec = attendance.find((a) => a.sessionId === activeSession.id && a.studentId === s.id);
                  return (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="py-2 font-mono text-xs">{s.matricNo}</td>
                      <td className="py-2 font-medium">{s.name}</td>
                      <td className="py-2">
                        {rec ? (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#E6F2EC] text-[#006B3C]">Present</span>
                        ) : (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">Pending</span>
                        )}
                      </td>
                      <td className="py-2 text-right">
                        <Button size="sm" variant="outline" disabled={!!rec} onClick={() => markAttendance(activeSession.id, s.id)}>
                          Mark Present
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}