import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/change-password")({
  head: () => ({ meta: [{ title: "Change Password — Elizade Attendance" }] }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!oldPw || !newPw || !confirmPw) {
      setMsg({ type: "err", text: "All fields are required." });
      return;
    }
    if (newPw !== confirmPw) {
      setMsg({ type: "err", text: "New passwords do not match." });
      return;
    }
    if (newPw.length < 6) {
      setMsg({ type: "err", text: "New password must be at least 6 characters." });
      return;
    }
    setMsg({ type: "ok", text: "Password updated successfully." });
    setOldPw("");
    setNewPw("");
    setConfirmPw("");
  };

  const dashTo = user?.role === "admin" ? "/admin" : user?.role === "lecturer" ? "/lecturer" : "/student";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">Change Password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user?.email}</span>
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {[
            { label: "Old password", value: oldPw, set: setOldPw },
            { label: "New password", value: newPw, set: setNewPw },
            { label: "Confirm new password", value: confirmPw, set: setConfirmPw },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-foreground">{f.label}</label>
              <input
                type="password"
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}

          {msg && (
            <p className={`text-sm ${msg.type === "ok" ? "text-primary" : "text-destructive"}`}>
              {msg.text}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Update Password
            </button>
            <Link
              to={dashTo}
              className="rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}