import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  accent,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  accent: "green" | "gold" | "dark";
  children: ReactNode;
  footer?: ReactNode;
}) {
  const accents: Record<string, string> = {
    green: "from-[#006B3C] to-[#024d2c]",
    gold: "from-[#C9A227] to-[#8a6c10]",
    dark: "from-[#1C1C1C] to-[#333]",
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F5F7FA]">
      <div className={`hidden lg:flex flex-col justify-between p-10 text-white bg-gradient-to-br ${accents[accent]}`}>
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 grid place-items-center font-bold">
          <img src="https://www.educatly.com/_next/image?url=https://api.educatly.com//rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBekZuQlE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--444a961615cfd3865a74c1b4b8b010e438b037f7/elizade_university_ilara_mokin_profile&w=3840&q=75" alt="" />
          </div>
          <div>
            <p className="font-semibold">Elizade University</p>
            <p className="text-xs opacity-80">Attendance Monitoring System</p>
          </div>
        </Link>
        <div className="space-y-3">
          <h2 className="text-3xl font-bold leading-tight">Excellence in Education</h2>
          <p className="text-sm opacity-90 max-w-sm">
            A modern way to manage attendance across faculties, courses, and sessions.
          </p>
        </div>
        {/* © {new Date().getFullYear()} */}
        <p className="text-xs opacity-70"> Elizade University</p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <Link to="/" className="text-sm text-[#006B3C] font-medium">← Back to Home</Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C]">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          <div className="mt-6 rounded-2xl bg-white border shadow-sm p-6">{children}</div>
          {footer && <div className="mt-4 text-sm text-center text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}