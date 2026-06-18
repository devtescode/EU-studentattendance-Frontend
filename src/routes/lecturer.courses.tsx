import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/lecturer/courses")({
  component: MyCourses,
});

function MyCourses() {
  const { user, courses, addCourse } = useApp();
  const [form, setForm] = useState({ code: "", title: "" });
  const myCourses = courses.filter((c) => c.lecturerId === user?.id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.title) return toast.error("Code and title are required");
    addCourse({ code: form.code, title: form.title, lecturerId: user?.id ?? "" });
    toast.success("Course created");
    setForm({ code: "", title: "" });
  };

  return (
    <div>
      <PageHeader title="My Courses" subtitle="Create and manage your courses" />
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={submit} className="rounded-2xl bg-white border shadow-sm p-6 space-y-3 lg:col-span-1">
          <h3 className="font-semibold">New Course</h3>
          <div>
            <Label>Course Code</Label>
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="CSC 401" />
          </div>
          <div>
            <Label>Course Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Software Engineering" />
          </div>
          <Button type="submit" className="w-full bg-[#006B3C] hover:bg-[#024d2c]">Create Course</Button>
        </form>
        <div className="rounded-2xl bg-white border shadow-sm p-6 lg:col-span-2">
          <h3 className="font-semibold mb-3">My Courses ({myCourses.length})</h3>
          {myCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No courses yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {myCourses.map((c) => (
                <div key={c.id} className="rounded-xl border p-4 bg-[#F5F7FA]">
                  <p className="text-xs uppercase tracking-wide text-[#C9A227] font-semibold">{c.code}</p>
                  <p className="font-semibold mt-1">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-2">{c.registeredStudentIds.length} enrolled</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}