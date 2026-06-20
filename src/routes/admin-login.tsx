import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [{ title: "Admin Access — Elizade University" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // INLINE ERRORS
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  // const API_URL = "http://localhost:4000";
  const API_URL = "https://eu-studentattendance-backend.onrender.com";

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/admin/status`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setHasAdmin(data.hasAdmin);
      } catch {
        setNetworkError(true);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // VALIDATE REGISTER
  const validateRegister = () => {
    const newErrors = { name: "", email: "", password: "" };
    let valid = true;

    if (!name) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Minimum 6 characters";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      toast.error("Please fix the form errors");
    }

    return valid;
  };

  // VALIDATE LOGIN
  const validateLogin = () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return false;
    }

    if (!isValidEmail(email)) {
      toast.error("Enter valid email");
      return false;
    }

    return true;
  };

  // REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegister()) return;

    setIsRegistering(true);

    try {
      const res = await fetch(`${API_URL}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Registration failed");
      }

      toast.success("Admin created successfully");
      setHasAdmin(true);
    } catch {
      toast.error("Network error");
    } finally {
      setIsRegistering(false);
    }
  };

  // LOGIN
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoginError("");

    if (!validateLogin()) return;

    setIsLoggingIn(true);

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.message || "Incorrect email or password");
        toast.error(data.message || "Incorrect email or password");
        return;
      }

      sessionStorage.setItem("admin_token", data.token);

      toast.success("Welcome back, Admin");

      navigate({ to: "/admin", replace: true });
    } catch {
      toast.error("Network error");
    } finally {
      setIsLoggingIn(false);
    }
  };
  const Spinner = () => (
    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2" />
  );

  if (networkError) {
    return (
      <AuthShell
        title="Connection Error"
        subtitle="Backend is not reachable"
        accent="green"
      >
        <Button
          onClick={() => window.location.reload()}
          className="w-full bg-[#006B3C]"
        >
          Refresh Page
        </Button>
      </AuthShell>
    );
  }

  if (loading) {
    return (
      <AuthShell
        title=""
        subtitle=""
        accent="green"
      >
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">

          {/* PREMIUM SPINNER */}
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-[#E5E7EB]" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#006B3C] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>

          {/* TEXT */}
          <p className="text-sm text-muted-foreground animate-pulse">
            Initializing Admin System...
          </p>

        </div>
      </AuthShell>
    );
  }

  // REGISTER UI
  if (!hasAdmin) {
    return (
      <AuthShell title="Admin Setup" subtitle="Create the first admin" accent="green">
        <form className="space-y-4" onSubmit={handleRegister}>

          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          <Button disabled={isRegistering} className="w-full bg-[#006B3C]" type="submit">
            {isRegistering && <Spinner />}
            {isRegistering ? "Creating Admin..." : "Create Admin"}
          </Button>
        </form>
      </AuthShell>
    );
  }

  // LOGIN UI
  return (
    <AuthShell title="Admin Login" subtitle="Access dashboard" accent="green">
      <form className="space-y-4" onSubmit={handleLogin}>

        {/* EMAIL */}
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            className="focus:ring-2 focus:ring-[#006B3C]"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm font-medium block mb-1">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="focus:ring-2 focus:ring-[#006B3C]"
          />

          {/* LOGIN ERROR MESSAGE */}
          {loginError && (
            <p className="text-xs text-red-500 mt-1">
              {loginError}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <Button
          disabled={isLoggingIn}
          className="w-full bg-[#006B3C] hover:bg-[#024d2c] transition-all flex items-center justify-center gap-2"
          type="submit"
        >
          {isLoggingIn && <Spinner />}
          {isLoggingIn ? "Signing in..." : "Sign in as Admin"}
        </Button>

        {/* FOOTER */}
        <p className="text-xs text-center text-muted-foreground">
          <Link to="/" className="text-[#006B3C] font-medium">
            Choose another role
          </Link>
        </p>

      </form>
    </AuthShell>
  );
}