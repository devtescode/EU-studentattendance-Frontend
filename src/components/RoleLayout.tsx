import { Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

import { useApp, type Role } from "@/context/AppContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  FileBarChart,
  CalendarClock,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navByRole: Record<Role, NavItem[]> = {
  admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Manage Lecturers", url: "/admin/lecturers", icon: GraduationCap },
    { title: "Manage Students", url: "/admin/students", icon: Users },
    { title: "Reports", url: "/admin/reports", icon: FileBarChart },
  ],
  lecturer: [
    { title: "Dashboard", url: "/lecturer", icon: LayoutDashboard },
    { title: "My Courses", url: "/lecturer/courses", icon: BookOpen },
    { title: "Sessions & Attendance", url: "/lecturer/sessions-attendance", icon: CalendarClock },
    { title: "Attendance Records", url: "/lecturer/records", icon: ClipboardList },
  ],
  student: [
    { title: "Dashboard", url: "/student", icon: LayoutDashboard },
    { title: "Available Courses", url: "/student/available-courses", icon: BookOpen },
    { title: "My Courses", url: "/student/my-courses", icon: GraduationCap },
    { title: "Attendance History", url: "/student/history", icon: ClipboardList },
  ],
};

const roleLabel: Record<Role, string> = {
  admin: "Administrator",
  lecturer: "Lecturer",
  student: "Student",
};

function SidebarAutoCloseHandler({ pathname }: { pathname: string }) {
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    // CLOSE SIDEBAR ON ROUTE CHANGE (MOBILE ONLY)
    setOpenMobile(false);
  }, [pathname]);

  return null;
}

export function RoleLayout({ role }: { role: Role }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = navByRole[role];

  // const handleLogout = () => {
  //   logout();
  //   navigate({ to: "/" });
  // };

  const handleLogout = () => {
    // 🔥 Clear EVERYTHING stored in sessionStorage
    sessionStorage.clear();

    // optional: also clear localStorage if you use it
    // localStorage.clear();

    logout();

    navigate({ to: "/" });
  };
  return (
    <SidebarProvider>
      <SidebarAutoCloseHandler pathname={pathname} />

      <div className="min-h-screen flex w-full bg-[#F5F7FA]">
        {/* SIDEBAR */}
        <Sidebar
          collapsible="offcanvas"
          className="border-r bg-white"
        >
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-3">
              <div className="h-9 w-9 rounded-lg bg-[#006B3C] grid place-items-center text-white font-bold">
                <img src="https://www.educatly.com/_next/image?url=https://api.educatly.com//rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBekZuQlE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--444a961615cfd3865a74c1b4b8b010e438b037f7/elizade_university_ilara_mokin_profile&w=3840&q=75" alt="" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  Elizade University
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Attendance System
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{roleLabel[role]}</SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const active = pathname === item.url;

                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild isActive={active}>
                          <Link
                            to={item.url}
                            className="flex items-center gap-2"
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <div className="px-2 py-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {roleLabel[role]}
              </p>
              <p className="text-sm font-medium truncate">
                {user?.name ?? "Guest"}
              </p>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* HEADER */}
          <header className="h-14 flex items-center justify-between border-b bg-white px-4">
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger />
              <h1 className="text-base font-semibold truncate">
                Elizade University
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                {/* <div className="h-8 w-8 rounded-full bg-[#006B3C] grid place-items-center text-white text-xs font-bold">
                  {(user?.name ?? "U").charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">
                  {user?.name ?? "User"}
                </span> */}
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Logout</span>
              </Button>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* ================= UI COMPONENTS ================= */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  tone = "green",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "green" | "gold" | "blue" | "slate";
}) {
  const tones: Record<string, string> = {
    green: "bg-[#E6F2EC] text-[#006B3C]",
    gold: "bg-[#FBF3DC] text-[#8a6c10]",
    blue: "bg-[#E6EEF8] text-[#0b4a8a]",
    slate: "bg-[#EEF1F5] text-[#334155]",
  };

  return (
    <div className="rounded-xl bg-white border p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-3xl font-bold">{value}</p>
        <span
          className={`h-9 w-9 rounded-lg grid place-items-center text-sm font-bold ${tones[tone]}`}
        >
          ★
        </span>
      </div>
    </div>
  );
}