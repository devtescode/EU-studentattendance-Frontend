import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/student-login")({
  head: () => ({ meta: [{ title: "Student Login — Elizade University" }] }),
  component: StudentLogin,
});

const API_URL = "https://eu-studentattendance-backend.onrender.com";

function StudentLogin() {
  const navigate = useNavigate();

  const [matricNo, setMatricNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!matricNo || !password) {
      return toast.error("Matric number and password are required");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/students/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matricNo,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(
          data.message || "Invalid matric number or password"
        );
      }

      sessionStorage.setItem("student_token", data.token);
      sessionStorage.setItem(
        "student_data",
        JSON.stringify(data.student)
      );

      toast.success(`Welcome, ${data.student.name}`);

      navigate({
        to: "/student",
      });
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Student Sign In"
      subtitle="Access your courses and mark attendance"
      accent="dark"
      footer={
        <span>
          Don't have an account?{" "}
          <Link
            to="/student-signup"
            className="text-[#006B3C] font-medium"
          >
            Create one
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <Label htmlFor="matric">Matric Number</Label>
          <Input
            id="matric"
            value={matricNo}
            onChange={(e) => setMatricNo(e.target.value)}
            placeholder="EU250102-4768"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#006B3C] hover:bg-[#024d2c]"
        >
          {loading ? "Signing In..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}