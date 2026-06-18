import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/student-login")({
  head: () => ({ meta: [{ title: "Student Login — Elizade University" }] }),
  component: StudentLogin,
});

function StudentLogin() {
  const { loginStudent } = useApp();
  const navigate = useNavigate();
  const [matricNo, setMatricNo] = useState("EU/2021/0001");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = loginStudent(matricNo, password);
    if (!u) return toast.error("Invalid matric number or password");
    toast.success(`Welcome, ${u.name}`);
    navigate({ to: "/student" });
  };

  return (
    <AuthShell
      title="Student Sign In"
      subtitle="Access your courses and mark attendance"
      accent="dark"
      footer={
        <span>
          Don't have an account?{" "}
          <Link to="/student-signup" className="text-[#006B3C] font-medium">Create one</Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <Label htmlFor="matric">Matric Number</Label>
          <Input id="matric" value={matricNo} onChange={(e) => setMatricNo(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <p className="text-xs text-muted-foreground mt-1">Demo: student123</p>
        </div>
        <Button type="submit" className="w-full bg-[#006B3C] hover:bg-[#024d2c]">Sign in</Button>
      </form>
    </AuthShell>
  );
}