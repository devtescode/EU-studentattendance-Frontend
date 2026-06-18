import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Mail, Key, UserCircle, GraduationCap, BookOpen, Hash } from "lucide-react";

export const Route = createFileRoute("/student-signup")({
  head: () => ({ meta: [{ title: "Student Sign Up — Elizade University" }] }),
  component: StudentSignup,
});

function StudentSignup() {
  const navigate = useNavigate();

  const API_URL = "http://localhost:4000";

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    matricNo: "",
    level: "",
    email: "",
    gender: "",
    department: "",
    password: "",
    confirm: "",
  });

  const upd = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  // -------------------------
  // SPINNER
  // -------------------------
  const Spinner = () => (
    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
  );

  // -------------------------
  // VALIDATION HELPERS
  // -------------------------
  const validateMatricNumber = (matric: string) => {
    // Format: EU250102-4768 (EU + 6 digits + - + 4 digits)
    // Case insensitive - will match EU, Eu, eU, eu
    const matricRegex = /^[Ee][Uu]\d{6}-\d{4}$/;
    return matricRegex.test(matric.trim());
  };

  const formatMatricNumber = (matric: string) => {
    // Convert to uppercase and trim
    return matric.trim().toUpperCase();
  };

  const validateEmail = (email: string) => {
    // Format: firstname.lastname@elizadeuniversity.edu.ng
    const emailRegex = /^[a-z]+\.[a-z]+@elizadeuniversity\.edu\.ng$/;
    return emailRegex.test(email.toLowerCase());
  };

  // -------------------------
  // SUBMIT
  // -------------------------
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all required fields
    if (!form.name.trim()) {
      return toast.error("Full name is required");
    }
    if (!form.matricNo.trim()) {
      return toast.error("Matric number is required");
    }
    if (!form.level) {
      return toast.error("Please select your level");
    }
    if (!form.email.trim()) {
      return toast.error("Email address is required");
    }
    if (!form.gender) {
      return toast.error("Please select your gender");
    }
    if (!form.department.trim()) {
      return toast.error("Please select your department");
    }
    if (!form.password) {
      return toast.error("Password is required");
    }
    if (!form.confirm) {
      return toast.error("Please confirm your password");
    }

    // Validate matric number format (case insensitive)
    if (!validateMatricNumber(form.matricNo)) {
      return toast.error("Matric number must be in format: EU250102-4768");
    }

    // Validate email format
    if (!validateEmail(form.email)) {
      return toast.error("Email must be in format: firstname.lastname@elizadeuniversity.edu.ng");
    }

    if (form.password !== form.confirm) {
      return toast.error("Passwords do not match");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/students/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          matricNo: formatMatricNumber(form.matricNo),
          level: form.level,
          email: form.email.trim().toLowerCase(),
          gender: form.gender,
          department: form.department.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Signup failed");
      }

      toast.success("Account created successfully");

      navigate({ to: "/student-login", replace: true });
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Handle matric number input - allow any case but format on display
  const handleMatricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    upd("matricNo", value);
  };

  // All departments organized by faculty
  const departments = [
    // Faculty of Basic & Applied Sciences
    "Biotechnology",
    "Microbiology",
    "Biochemistry",
    "Environmental Management and Technology",
    "Applied Geophysics",
    "Computer Science",
    "Physics with Electronics",
    "Cybersecurity",
    
    // Faculty of Allied Health Sciences
    "Nursing Science",
    "Medical Laboratory Science",
    "Human Anatomy",
    "Human Physiology",
    
    // Faculty of Engineering and Environmental Sciences
    "Civil Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
    "Automotive Engineering",
    "Computer Engineering",
    "Information and Communication Engineering (ICE)",
    "Architecture",
    "Quantity Surveying",
    "Estate Management",
    
    // Faculty of Humanities, Social & Management Sciences
    "Accounting",
    "Business Administration",
    "Human Resource Management",
    "Economics",
    "Mass Communication",
    "Tourism and Hospitality Management",
    "Sociology",
    "Political Science",
    "International Relations",
    "English Language",
    "Performing and Film Arts",
    
    // Faculty of Law
    "Law"
  ];

  return (
    <AuthShell
      title="Create Student Account"
      subtitle="Register to access the attendance portal"
      accent="green"
      footer={
        <span>
          Already registered?{" "}
          <Link to="/student-login" className="text-[#006B3C] font-medium hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={submit}>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <Label className="text-sm font-medium text-gray-700">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={form.name}
                onChange={(e) => upd("name", e.target.value)}
                placeholder="Enter your full name"
                className="pl-10 focus:ring-[#006B3C] focus:border-[#006B3C] transition-all"
                required
              />
            </div>
          </div>

          {/* Matric Number */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Matric Number</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={form.matricNo}
                onChange={handleMatricChange}
                placeholder="EU250102-4768"
                className="pl-10 focus:ring-[#006B3C] focus:border-[#006B3C] transition-all"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Format: EU250102-4768 (case insensitive)
            </p>
          </div>

          {/* Level */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Level</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={form.level}
                onChange={(e) => upd("level", e.target.value)}
                className={`w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition appearance-none ${
                  !form.level ? "text-muted-foreground" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select Level
                </option>
                {["100", "200", "300", "400", "500"].map((l) => (
                  <option key={l} value={l}>
                    {l} Level
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department - Now a dropdown */}
          <div className="sm:col-span-2">
            <Label className="text-sm font-medium text-gray-700">Department</Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={form.department}
                onChange={(e) => upd("department", e.target.value)}
                className={`w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition appearance-none ${
                  !form.department ? "text-muted-foreground" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select Department
                </option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <Label className="text-sm font-medium text-gray-700">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                value={form.email}
                onChange={(e) => upd("email", e.target.value)}
                placeholder="firstname.lastname@elizadeuniversity.edu.ng"
                className="pl-10 focus:ring-[#006B3C] focus:border-[#006B3C] transition-all"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Format: firstname.lastname@elizadeuniversity.edu.ng</p>
          </div>

          {/* Gender */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Gender</Label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={form.gender}
                onChange={(e) => upd("gender", e.target.value)}
                className={`w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006B3C] focus:border-transparent transition appearance-none ${
                  !form.gender ? "text-muted-foreground" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                value={form.password}
                onChange={(e) => upd("password", e.target.value)}
                placeholder="Minimum 6 characters"
                className="pl-10 focus:ring-[#006B3C] focus:border-[#006B3C] transition-all"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Confirm Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                value={form.confirm}
                onChange={(e) => upd("confirm", e.target.value)}
                placeholder="Re-enter your password"
                className="pl-10 focus:ring-[#006B3C] focus:border-[#006B3C] transition-all"
                required
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#006B3C] hover:bg-[#024d2c] flex items-center justify-center gap-2 transition-colors py-3 text-base font-medium"
        >
          {loading && <Spinner />}
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </AuthShell>
  );
}