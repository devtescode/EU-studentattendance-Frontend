import { createFileRoute, Navigate } from "@tanstack/react-router";
import { RoleLayout } from "@/components/RoleLayout";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const t = sessionStorage.getItem("admin_token");

      if (!t) {
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const decoded: any = jwtDecode(t);

        // ⛔ CHECK EXPIRY
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          sessionStorage.removeItem("admin_token");
          sessionStorage.removeItem("admin_data");

          toast.error("Session expired. Please login again.");

          setToken(null);
          setLoading(false);
          return;
        }

        setToken(t);
        setLoading(false);
      } catch (err) {
        sessionStorage.removeItem("admin_token");
        setToken(null);
        setLoading(false);
      }
    };

    checkToken();

    // 🔥 auto re-check every 30 seconds (optional but good)
    const interval = setInterval(checkToken, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[#E5E7EB] border-t-[#006B3C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin-login" />;
  }

  return <RoleLayout role="admin" />;
}