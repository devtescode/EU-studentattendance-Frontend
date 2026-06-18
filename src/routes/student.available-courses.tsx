import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/student/available-courses")({
  component: AvailableCourses,
});

function AvailableCourses() {
  const { user, courses, lecturers, registerCourse } = useApp();
  return (
    <div>
      <PageHeader title="Available Courses" subtitle="Register for the courses you wish to attend" />
      <div className="grid gap-3 md:grid-cols-2">
        {courses.map((c) => {
          const lec = lecturers.find((l) => l.id === c.lecturerId);
          const registered = c.registeredStudentIds.includes(user?.id ?? "");
          return (
            <div key={c.id} className="rounded-2xl bg-white border shadow-sm p-5 flex flex-col">
              <p className="text-xs uppercase tracking-wide text-[#C9A227] font-semibold">{c.code}</p>
              <p className="font-semibold mt-1">{c.title}</p>
              <p className="text-xs text-muted-foreground mt-1">Lecturer: {lec?.name ?? "—"}</p>
              <div className="mt-4">
                <Button
                  disabled={registered}
                  onClick={() => {
                    registerCourse(user?.id ?? "", c.id);
                    toast.success(`Registered for ${c.code}`);
                  }}
                  className="bg-[#006B3C] hover:bg-[#024d2c]"
                >
                  {registered ? "Registered" : "Register"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}