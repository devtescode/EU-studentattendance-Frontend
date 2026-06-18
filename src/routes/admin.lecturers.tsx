import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/RoleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, UserPlus, X } from "lucide-react";

export const Route = createFileRoute("/admin/lecturers")({
  component: ManageLecturers,
});

const API_URL = "http://localhost:4000";

function ManageLecturers() {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const token = sessionStorage.getItem("admin_token");

  // Filter lecturers based on search
  const filteredLecturers = lecturers.filter((lecturer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lecturer.name?.toLowerCase().includes(searchLower) ||
      lecturer.email?.toLowerCase().includes(searchLower) ||
      lecturer.department?.toLowerCase().includes(searchLower)
    );
  });

  // Get visible lecturers
  const visibleLecturers = filteredLecturers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLecturers.length;

  // -----------------------------
  // FETCH LECTURERS FROM BACKEND
  // -----------------------------
  const fetchLecturers = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/lecturers/getLecturers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch lecturers");
        return;
      }

      setLecturers(data.lecturers || []);
    } catch {
      toast.error("Network error while fetching lecturers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  // -----------------------------
  // ADD LECTURER
  // -----------------------------
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.department || !form.password) {
      return toast.error("All fields are required");
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/lecturers/createLecturer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add lecturer");
        return;
      }

      toast.success("Lecturer added successfully");

      setForm({
        name: "",
        email: "",
        department: "",
        password: "",
      });

      fetchLecturers();
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(6);
  }, [searchTerm]);

  return (
    <div>
      <PageHeader
        title="Manage Lecturers"
        subtitle="Add and view registered lecturers"
      />

      <div className="grid gap-2 lg:grid-cols-3">
        {/* ---------------- FORM ---------------- */}
        <form
          onSubmit={submit}
          className="rounded-2xl bg-white border shadow-sm p-6 space-y-3 lg:col-span-1"
        >
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#006B3C]" />
            <h3 className="font-semibold">Add Lecturer</h3>
          </div>

          <div>
            <Label>Full Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Enter lecturer name"
              className="focus:ring-[#006B3C] focus:border-[#006B3C]"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="lecturer@example.com"
              className="focus:ring-[#006B3C] focus:border-[#006B3C]"
            />
          </div>

          <div>
            <Label>Department</Label>
            <Input
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
              placeholder="e.g., Computer Science"
              className="focus:ring-[#006B3C] focus:border-[#006B3C]"
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Set lecturer password"
              className="focus:ring-[#006B3C] focus:border-[#006B3C]"
            />
          </div>

          <Button
            disabled={submitting}
            type="submit"
            className="w-full bg-[#006B3C] hover:bg-[#024d2c] transition-colors"
          >
            {submitting ? "Adding..." : "Add Lecturer"}
          </Button>
        </form>

        {/* ---------------- TABLE ---------------- */}
        <div className="rounded-2xl bg-white border shadow-sm p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="font-semibold">
              All Lecturers ({filteredLecturers.length})
            </h3>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-8 focus:ring-[#006B3C] focus:border-[#006B3C]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006B3C]"></div>
            </div>
          ) : filteredLecturers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No lecturers match your search" : "No lecturers found"}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b">
                      <th className="py-2 font-medium">Name</th>
                      <th className="py-2 font-medium">Email</th>
                      <th className="py-2 font-medium">Department</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleLecturers.map((l) => (
                      <tr key={l._id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-2 font-medium">{l.name}</td>
                        <td className="py-2">{l.email}</td>
                        <td className="py-2">
                          <span className="px-2 py-1 bg-muted rounded-full text-xs">
                            {l.department}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View More Button */}
              {hasMore && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(true)}
                    className="border-[#006B3C] text-[#006B3C] hover:bg-[#006B3C] hover:text-white transition-colors"
                  >
                    View More ({filteredLecturers.length - visibleCount} more)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] shadow-2xl mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                All Lecturers ({filteredLecturers.length})
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search in all lecturers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-8 focus:ring-[#006B3C] focus:border-[#006B3C]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left">
                      <th className="py-3 px-4 font-medium">#</th>
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">Email</th>
                      <th className="py-3 px-4 font-medium">Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLecturers.map((l, index) => (
                      <tr key={l._id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 text-muted-foreground">{index + 1}</td>
                        <td className="py-3 px-4 font-medium">{l.name}</td>
                        <td className="py-3 px-4">{l.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-[#006B3C]/10 text-[#006B3C] rounded-full text-xs">
                            {l.department}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredLecturers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No lecturers found
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t bg-muted/20 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-muted"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}