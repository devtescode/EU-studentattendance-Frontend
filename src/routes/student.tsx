import { createFileRoute, Navigate } from "@tanstack/react-router";
import { RoleLayout } from "@/components/RoleLayout";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("student_token");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decoded: any = jwtDecode(token);

        // exp is in seconds → convert to ms
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          sessionStorage.removeItem("student_token");
          sessionStorage.removeItem("student_data");

          toast.error("Session expired. Please login again.");
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        sessionStorage.removeItem("student_token");
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // 🔥 auto re-check every 30 seconds
    const interval = setInterval(checkAuth, 30000);

    return () => clearInterval(interval);
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

export default StudentLayout;