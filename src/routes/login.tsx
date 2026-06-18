import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp, type Role } from "@/context/AppContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Elizade Attendance" },
      { name: "description", content: "Sign in to the Elizade University attendance system." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }
    login(email.trim(), role);
    navigate({ to: role === "admin" ? "/admin" : role === "lecturer" ? "/lecturer" : "/student" });
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl">
        <Link to="/" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          ← Back home
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
            EU
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
            <p className="text-xs text-muted-foreground">Elizade University Attendance</p>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@elizade.edu.ng"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Sign in as</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(["admin", "lecturer", "student"] as Role[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-md border px-2 py-2 text-xs font-medium capitalize transition-colors ${
                    role === r
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Frontend demo — any credentials work.
        </p>
      </div>
    </div>
  );
}