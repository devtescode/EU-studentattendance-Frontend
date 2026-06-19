import { createFileRoute, Navigate } from "@tanstack/react-router";
import { RoleLayout } from "@/components/RoleLayout";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/lecturer")({
  component: LecturerLayout,
});

function LecturerLayout() {
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
    // Get token from sessionStorage only on client
    const storedToken = sessionStorage.getItem("lecturer_token");
    setToken(storedToken);
  }, []);

  // Show loading or nothing during SSR
  if (!isClient) {
    return null; // or a loading skeleton
  }

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