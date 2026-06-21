import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, GraduationCap, BookOpen, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elizade University Attendance System" },
      { name: "description", content: "Choose your role to sign in to the Elizade University Attendance Monitoring System." },
      { property: "og:title", content: "Elizade University Attendance System" },
      { property: "og:description", content: "Role-based attendance monitoring for Elizade University." },
    ],
  }),
  component: Home,
});

const roles = [
  {
    title: "Administrator",
    description: "Manage lecturers, students, courses and view reports.",
    icon: ShieldCheck,
    to: "/admin-login",
    accent: "bg-[#006B3C]",
    badge: "Admin Portal",
  },
  {
    title: "Lecturer",
    description: "Create courses, run sessions and track attendance.",
    icon: BookOpen,
    to: "/lecturer-login",
    accent: "bg-[#C9A227]",
    badge: "Lecturer Portal",
  },
  {
    title: "Student",
    description: "Register for courses and mark attendance for sessions.",
    icon: GraduationCap,
    to: "/student-login",
    accent: "bg-[#1C1C1C]",
    badge: "Student Portal",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#006B3C] grid place-items-center text-white font-bold">
              <img src="https://www.educatly.com/_next/image?url=https://api.educatly.com//rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBekZuQlE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--444a961615cfd3865a74c1b4b8b010e438b037f7/elizade_university_ilara_mokin_profile&w=3840&q=75" alt="" />
            </div>
            <div>
              <p className="font-semibold text-[#1C1C1C]">Elizade University</p>
              <p className="text-xs text-muted-foreground">Attendance Monitoring System</p>
            </div>
          </div>
          <Link
            to="/student-signup"
            className="hidden sm:inline-flex text-sm font-medium text-[#006B3C] hover:underline"
          >
            New student? Sign up →
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center">
        <p className="inline-block text-xs uppercase tracking-widest text-[#C9A227] font-semibold">Welcome</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-bold text-[#1C1C1C]">
          Attendance, made simple.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose your role to continue. Each portal is tailored for its users — administrators, lecturers and students.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 grid gap-5 md:grid-cols-3">
        {roles.map((r) => (
          <Link
            key={r.to}
            to={r.to}
            className="group rounded-2xl bg-white border shadow-sm hover:shadow-lg transition-all p-6 flex flex-col"
          >
            <div className={`h-12 w-12 rounded-xl ${r.accent} text-white grid place-items-center`}>
              <r.icon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">{r.badge}</p>
            <h3 className="mt-1 text-xl font-bold text-[#1C1C1C]">{r.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{r.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#006B3C] group-hover:gap-2 transition-all">
              Continue <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </section>

      {/* <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Elizade University — Attendance Monitoring System
        </div>
      </footer> */}
    </div>
  );
}