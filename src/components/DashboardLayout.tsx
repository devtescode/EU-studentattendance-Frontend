import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useApp, type Role } from "@/context/AppContext";
import { LogOut, KeyRound, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
}

const NAV: Record<Role, NavItem[]> = {
  admin: [
    { label: "Overview", to: "/admin" },
    { label: "Change Password", to: "/change-password" },
  ],
  lecturer: [
    { label: "Overview", to: "/lecturer" },
    { label: "Change Password", to: "/change-password" },
  ],
  student: [
    { label: "Overview", to: "/student" },
    { label: "Change Password", to: "/change-password" },
  ],
};

export function DashboardLayout({
  role,
  title,
  children,
}: {
  role: Role;
  title: string;
  children: ReactNode;
}) {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const items = NAV[role];

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-primary text-primary-foreground transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent font-bold text-accent-foreground">
            EU
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Elizade</div>
            <div className="text-xs opacity-80">Attendance</div>
          </div>
        </div>
        <nav className="space-y-1 p-4">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === it.to
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/80 hover:bg-white/10",
              )}
            >
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <div className="mb-3 text-xs opacity-80">
            <div className="font-semibold text-primary-foreground">{user?.name}</div>
            <div className="capitalize">{role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {open && (
        <button
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 hover:bg-muted md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          </div>
          <Link
            to="/change-password"
            className="hidden items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted sm:flex"
          >
            <KeyRound className="h-4 w-4" /> Change Password
          </Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}