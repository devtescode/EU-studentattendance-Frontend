import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/lecturer-login")({
  head: () => ({ meta: [{ title: "Lecturer Login — Elizade University" }] }),
  component: LecturerLogin,
});

function LecturerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const API_URL = "https://eu-studentattendance-backend.onrender.com";

  // --------------------------
  // SPINNER
  // --------------------------
  const Spinner = () => (
    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
  );

  // --------------------------
  // LOGIN HANDLER
  // --------------------------
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Email and password are required");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/lecturers/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Invalid lecturer credentials");
      }

      // save token
      // sessionStorage.setItem("lecturer_token", data.token);
      // save token
      sessionStorage.setItem("lecturer_token", data.token);

      // save lecturer details
      sessionStorage.setItem(
        "lecturer_data",
        JSON.stringify(data.lecturer)
      );

      toast.success(`Welcome, ${data.lecturer.name}`);

      navigate({ to: "/lecturer", replace: true });
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // UI
  // --------------------------
  return (
    <AuthShell
      title="Lecturer Sign In"
      subtitle="Manage your courses and attendance sessions"
      accent="gold"
    >
      <form className="space-y-4" onSubmit={submit}>
        {/* EMAIL */}
        <div>
          <Label htmlFor="email">Staff Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter lecturer email"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
          />
          {/* <p className="text-xs text-muted-foreground mt-1">
            Demo password: lecturer123
          </p> */}
        </div>

        {/* BUTTON */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C9A227] hover:bg-[#a98717] text-[#1C1C1C] flex items-center justify-center gap-2"
        >
          {loading && <Spinner />}
          {loading ? "Signing in..." : "Sign in as Lecturer"}
        </Button>

        {/* BACK LINK */}
        <p className="text-xs text-center text-muted-foreground">
          Wrong portal?{" "}
          <Link to="/" className="text-[#006B3C] font-medium">
            Go back
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}