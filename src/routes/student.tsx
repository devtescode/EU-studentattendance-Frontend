import { createFileRoute, Navigate } from "@tanstack/react-router";
import { RoleLayout } from "@/components/RoleLayout";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  const { user } = useApp();
  if (!user || user.role !== "student") return <Navigate to="/student-login" />;
  return <RoleLayout role="student" />;
}