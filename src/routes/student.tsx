import { createFileRoute, Navigate } from "@tanstack/react-router";
import { RoleLayout } from "@/components/RoleLayout";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("student_token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/student-login" />;
  }

  return <RoleLayout role="student" />;
}