import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/RoleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/lecturer/sessions-attendance")({
  component: SessionsAttendance,
});

const API_URL = "https://eu-studentattendance-backend.onrender.com";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function SessionsAttendance() {
  const token = sessionStorage.getItem("lecturer_token");

  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    courseCode: "",
    courseTitle: "",
    days: [] as string[],
    startTime: "",
    endTime: "",
  });

  // ================= FETCH SESSIONS (REAL TIME) =================
  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/session/my-sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setSessions(data.sessions || []);
    } catch {
      toast.error("Failed to load sessions");
    }
  };

  useEffect(() => {
    fetchSessions();

    // REAL-TIME UPDATE
    const interval = setInterval(() => {
      fetchSessions();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ================= TOGGLE DAYS =================
  const toggleDay = (day: string) => {
    setForm((prev) => {
      const exists = prev.days.includes(day);
      return {
        ...prev,
        days: exists
          ? prev.days.filter((d) => d !== day)
          : [...prev.days, day],
      };
    });
  };

  // ================= CREATE / UPDATE =================
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.courseCode ||
      !form.courseTitle ||
      !form.days.length ||
      !form.startTime ||
      !form.endTime
    ) {
      return toast.error("All fields are required");
    }

    try {
      const url = isEditing
        ? `${API_URL}/session/update/${editId}`
        : `${API_URL}/session/create`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data, "dataaaaa");
      

      if (!res.ok) return toast.error(data.message);

      toast.success(isEditing ? "Updated successfully" : "Created successfully");

      setForm({
        courseCode: "",
        courseTitle: "",
        days: [],
        startTime: "",
        endTime: "",
      });

      setIsEditing(false);
      setEditId(null);

      fetchSessions();
    } catch {
      toast.error("Network error");
    }
  };

  // ================= EDIT =================
  const handleEdit = (session: any) => {
    setForm({
      courseCode: session.courseCode,
      courseTitle: session.courseTitle,
      days: session.days || [],
      startTime: session.startTime,
      endTime: session.endTime,
    });

    setEditId(session._id);
    setIsEditing(true);
    // console.log("sessionID", session._id)
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this schedule?")) return;

    try {
      const res = await fetch(`${API_URL}/session/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return toast.error(data.message);

      toast.success("Deleted successfully");
      fetchSessions();
    } catch {
      toast.error("Network error");
    }
  };

  const activeSession =
    sessions.find((s) => s._id === activeSessionId) || sessions[0];

  return (
    <div>
      <PageHeader
        title="Lecturer Schedule Manager"
        subtitle="Create, edit and manage lecture schedules (Real-time)"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ================= FORM ================= */}
        <form
          onSubmit={submit}
          className="bg-white border rounded-2xl p-6 space-y-4 lg:col-span-1"
        >
          <h3 className="font-semibold">
            {isEditing ? "Edit Schedule" : "Create Schedule"}
          </h3>
          <Label>Course Code</Label>
          <Input
            placeholder="Course Code (CSC 201)"
            value={form.courseCode}
            onChange={(e) =>
              setForm({ ...form, courseCode: e.target.value })
            }
          />

          <Label>Course Title</Label>
          <textarea
            className="w-full border rounded-md p-2 text-sm"
            rows={3}
            placeholder="Course Title"
            value={form.courseTitle}
            onChange={(e) =>
              setForm({ ...form, courseTitle: e.target.value })
            }
          />

          {/* DAYS */}
          <div>
            <Label>Days</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DAYS.map((day) => (
                <label key={day} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.days.includes(day)}
                    onChange={() => toggleDay(day)}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          {/* TIME */}
          <div className="grid grid-cols-2 gap-2">
            
            <Input
              type="time"
              value={form.startTime}
              onChange={(e) =>
                setForm({ ...form, startTime: e.target.value })
              }
            />

            <Input
              type="time"
              value={form.endTime}
              onChange={(e) =>
                setForm({ ...form, endTime: e.target.value })
              }
            />
          </div>

          <Button className="w-full bg-[#006B3C]">
            {isEditing ? "Update Schedule" : "Create Schedule"}
          </Button>
        </form>

        {/* ================= LIST ================= */}
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6">
          <h3 className="font-semibold mb-3">
            ACTIVE SCHEDULES ({sessions.length})
          </h3>

          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No schedules yet
            </p>
          ) : (
            sessions.map((s) => (
              <div
                key={s._id}
                className="border rounded-xl p-3 mb-2 flex justify-between items-start"
              >
                <button
                  onClick={() => setActiveSessionId(s._id)}
                  className="text-left"
                >
                  <p className="font-medium">
                    {s.courseCode} — {s.courseTitle}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.days?.join(", ")} | {s.startTime} - {s.endTime}
                  </p>
                </button>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= ACTIVE DETAILS ================= */}
      {activeSession && (
        <div className="mt-6 bg-white border rounded-2xl p-6">
          <h3 className="font-semibold mb-2">
            Selected Schedule Preview
          </h3>

          <p>
            <b>Course:</b> {activeSession.courseCode}
          </p>
          <p>
            <b>Title:</b> {activeSession.courseTitle}
          </p>
          <p>
            <b>Days:</b> {activeSession.days?.join(", ")}
          </p>
          <p>
            <b>Time:</b> {activeSession.startTime} - {activeSession.endTime}
          </p>
        </div>
      )}
    </div>
  );
} 