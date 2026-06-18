import { createFileRoute, Navigate } from "@tanstack/react-router";
import { RoleLayout } from "@/components/RoleLayout";

export const Route = createFileRoute("/lecturer")({
  component: LecturerLayout,
});

function LecturerLayout() {
  const token = sessionStorage.getItem("lecturer_token");

  // ❌ NOT LOGGED IN
  if (!token) {
    return <Navigate to="/lecturer-login" />;
  }

  // OPTIONAL: decode check (basic role protection)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role !== "lecturer") {
      return <Navigate to="/lecturer-login" />;
    }
  } catch (err) {
    return <Navigate to="/lecturer-login" />;
  }

  return <RoleLayout role="lecturer" />;
}