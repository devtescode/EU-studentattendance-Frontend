import { createFileRoute, Navigate } from "@tanstack/react-router";
import { RoleLayout } from "@/components/RoleLayout";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const Route = createFileRoute("/lecturer")({
  component: LecturerLayout,
});

function LecturerLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("lecturer_token");

      // ❌ no token
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decoded: any = jwtDecode(token);

        // ❌ expired token
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          sessionStorage.removeItem("lecturer_token");
          sessionStorage.removeItem("lecturer_data");

          toast.error("Session expired. Please login again.");
          setIsAuthenticated(false);
          return;
        }

        // ❌ wrong role
        if (decoded.role !== "lecturer") {
          sessionStorage.removeItem("lecturer_token");
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (err) {
        sessionStorage.removeItem("lecturer_token");
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
    return <Navigate to="/lecturer-login" />;
  }

  return <RoleLayout role="lecturer" />;
}

export default LecturerLayout;