import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/RoleLayout";
import { useEffect, useState } from "react";
import { Eye, Calendar, User, BookOpen, Clock, X, Search } from "lucide-react";

export const Route = createFileRoute("/lecturer/records")({
  component: Records,
});

const API_URL = "http://localhost:4000";

// Type definitions
interface Student {
  id: string;
  name: string;
  matricNumber: string;
  markedAt: string;
  attendanceCount?: number;
}

interface Course {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  students: Student[];
}

interface AttendanceRecord {
  _id?: string;
  studentId?: {
    _id: string;
    name: string;
    matricNo: string;
  };
  courseId?: {
    _id: string;
    courseCode: string;
    courseTitle: string;
  };
  createdAt: string;
}

function Records() {
  const token = sessionStorage.getItem("lecturer_token");

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Student Details Modal States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentAttendanceHistory, setStudentAttendanceHistory] = useState<any[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      const res = await fetch(
        `${API_URL}/lecturers/lecturer-records`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setRecords(data.records || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch student attendance history
  const fetchStudentAttendanceHistory = async (studentId: string, courseId: string) => {
    setStudentLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/lecturers/student-attendance-history?studentId=${studentId}&courseId=${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStudentAttendanceHistory(data.attendance || []);
      } else {
        setStudentAttendanceHistory([]);
      }
    } catch (error) {
      console.log(error);
      setStudentAttendanceHistory([]);
    } finally {
      setStudentLoading(false);
    }
  };

  const openStudentDetails = (student: any, course: any) => {
    setSelectedStudent({
      ...student,
      courseCode: course.courseCode,
      courseTitle: course.courseTitle,
      courseId: course.courseId,
    });
    setIsStudentModalOpen(true);
    fetchStudentAttendanceHistory(student.id, course.courseId);
  };

  useEffect(() => {
    fetchRecords();

    const interval = setInterval(fetchRecords, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fix: Properly calculate week key
  const getWeekKey = (date: Date) => {
    const now = new Date(date);
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + start.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week}`;
  };

  const grouped = records.reduce((acc: any, record: AttendanceRecord) => {
    const courseId = record.courseId?._id;

    if (!courseId) return acc;

    if (!acc[courseId]) {
      acc[courseId] = {
        courseId,
        courseCode: record.courseId?.courseCode,
        courseTitle: record.courseId?.courseTitle,
        students: [],
      };
    }

    // Check if student already exists in the course
    const existingStudent = acc[courseId].students.find(
      (s: any) => s.id === record.studentId?._id
    );

    if (!existingStudent) {
      acc[courseId].students.push({
        id: record.studentId?._id,
        name: record.studentId?.name,
        matricNumber: record.studentId?.matricNo,
        markedAt: record.createdAt,
        attendanceCount: 1,
      });
    } else {
      existingStudent.attendanceCount += 1;
      if (new Date(record.createdAt) > new Date(existingStudent.markedAt)) {
        existingStudent.markedAt = record.createdAt;
      }
    }

    return acc;
  }, {});

  const openTodayAttendance = (course: any) => {
    const today = new Date();

    const todayStudents = course.students.filter(
      (student: any) => {
        const attendanceDate = new Date(student.markedAt);

        return (
          attendanceDate.getDate() === today.getDate() &&
          attendanceDate.getMonth() === today.getMonth() &&
          attendanceDate.getFullYear() === today.getFullYear()
        );
      }
    );

    setSelectedCourse({
      ...course,
      students: todayStudents,
    });

    setSearch("");
    setIsModalOpen(true);
  };

  const filteredStudents =
    selectedCourse?.students?.filter((student: any) =>
      student.matricNumber
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      student.name?.toLowerCase().includes(search.toLowerCase())
    ) || [];

  // Group attendance history by week
  const groupAttendanceByWeek = (attendance: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    
    attendance.forEach((record: any) => {
      const date = new Date(record.createdAt);
      const weekKey = getWeekKey(date);
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = [];
      }
      grouped[weekKey].push(record);
    });
    
    return grouped;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const studentAttendanceGrouped = groupAttendanceByWeek(studentAttendanceHistory);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Records"
        subtitle="Students that marked attendance"
      />

      <div className="rounded-2xl bg-white border shadow-sm p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006B3C]"></div>
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-sm text-gray-500">
            No attendance records yet.
          </p>
        ) : (
          <div className="space-y-6">
            {Object.values(grouped).map(
              (course: any, index) => (
                <div
                  key={index}
                  className="border rounded-xl overflow-hidden"
                >
                  <div className="bg-[#006B3C] text-white p-4 flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {course.courseCode}
                      </h3>

                      <p className="text-sm opacity-90">
                        {course.courseTitle}
                      </p>

                      <p className="text-sm mt-1">
                        Total Students:{" "}
                        {course.students.length}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        openTodayAttendance(course)
                      }
                      className="bg-white text-[#006B3C] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      View Today's Attendance
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left p-3">
                            Student
                          </th>

                          <th className="text-left p-3">
                            Matric Number
                          </th>

                          <th className="text-left p-3">
                            Total Attendance
                          </th>

                          <th className="text-left p-3">
                            Last Marked
                          </th>

                          <th className="text-left p-3">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {course.students.map(
                          (student: any) => (
                            <tr
                              key={student.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3 font-medium">
                                {student.name}
                              </td>

                              <td className="p-3 text-gray-600">
                                {student.matricNumber}
                              </td>

                              <td className="p-3">
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                  {student.attendanceCount || 0} days
                                </span>
                              </td>

                              <td className="p-3 text-gray-500 text-sm">
                                {new Date(
                                  student.markedAt
                                ).toLocaleString()}
                              </td>

                              <td className="p-3">
                                <button
                                  onClick={() => openStudentDetails(student, course)}
                                  className="text-[#006B3C] hover:bg-green-50 p-2 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="text-xs font-medium">Details</span>
                                </button>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* MODAL - Today's Attendance */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
            <div className="flex justify-between items-center border-b p-5">
              <div>
                <h2 className="font-bold text-lg">
                  Today's Attendance
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedCourse?.courseCode} —{" "}
                  {selectedCourse?.courseTitle}
                </p>

                <div className="mt-2 inline-flex items-center gap-2 bg-[#E6F2EC] text-[#006B3C] px-3 py-1 rounded-full text-sm font-semibold">
                  Total Attendance Today: {selectedCourse?.students?.length || 0}
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name or matric number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-[#006B3C]"
                />
              </div>

              <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-3">
                        Student Name
                      </th>

                      <th className="text-left p-3">
                        Matric Number
                      </th>

                      <th className="text-left p-3">
                        Time Marked
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center p-6 text-gray-500"
                        >
                          No student found.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map(
                        (student: any) => (
                          <tr
                            key={student.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3 font-medium">
                              {student.name}
                            </td>

                            <td className="p-3 text-gray-600">
                              {student.matricNumber}
                            </td>

                            <td className="p-3 text-gray-500">
                              {new Date(
                                student.markedAt
                              ).toLocaleTimeString()}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - Student Attendance Details */}
      {isStudentModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
            <div className="flex justify-between items-center border-b p-5">
              <div>
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-[#006B3C]" />
                  Student Attendance Details
                </h2>

                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium">
                    {selectedStudent.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Matric Number: <span className="font-medium text-gray-700">{selectedStudent.matricNumber}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Course: <span className="font-medium text-gray-700">{selectedStudent.courseCode} - {selectedStudent.courseTitle}</span>
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 bg-[#E6F2EC] text-[#006B3C] px-3 py-1 rounded-full text-sm font-semibold">
                    Total Attendance: {studentAttendanceHistory.length} days
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsStudentModalOpen(false);
                  setSelectedStudent(null);
                  setStudentAttendanceHistory([]);
                }}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              {studentLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006B3C]"></div>
                </div>
              ) : studentAttendanceHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No attendance records found for this student.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-700">{studentAttendanceHistory.length}</p>
                      <p className="text-xs text-green-600">Total Sessions</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-700">
                        {Object.keys(groupAttendanceByWeek(studentAttendanceHistory)).length}
                      </p>
                      <p className="text-xs text-blue-600">Weeks Attended</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-purple-700">
                        {studentAttendanceHistory.length > 0 ? 
                          Math.round((studentAttendanceHistory.length / 10) * 100) : 0}%
                      </p>
                      <p className="text-xs text-purple-600">Attendance Rate</p>
                    </div>
                  </div>

                  {/* Attendance History Table */}
                  <div className="overflow-x-auto max-h-[40vh] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-white">
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left p-3">#</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Day</th>
                          <th className="text-left p-3">Time</th>
                          <th className="text-left p-3">Week</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentAttendanceHistory.map((record: any, index: number) => {
                          const date = new Date(record.createdAt);
                          return (
                            <tr key={record._id || index} className="border-b hover:bg-gray-50">
                              <td className="p-3 text-gray-500">{index + 1}</td>
                              <td className="p-3 font-medium">
                                {formatDate(date)}
                              </td>
                              <td className="p-3 text-gray-600">
                                {date.toLocaleDateString('en-US', { weekday: 'long' })}
                              </td>
                              <td className="p-3 text-gray-500">
                                {date.toLocaleTimeString()}
                              </td>
                              <td className="p-3">
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                  Week {getWeekKey(date).split('-W')[1]}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Records;