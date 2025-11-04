import React, { useState, useEffect } from "react";
import {
  ChartNoAxesCombined,
  Clock4,
  UserCheck,
  Users,
  LogIn,
  LogOut,
  Download,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Attendance from "../attendance/Attendence.jsx";
import EmployeeTable from "./EmployeeTable.jsx";
import SearchEmployes from "./SearchEmployes.jsx";

const MainAttendance = () => {
  const userId = localStorage.getItem("userId");
  const companyId = localStorage.getItem("companyId");
  const [role, setRole] = useState("");
  const [loadingClock, setLoadingClock] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US");

  /* -------------------------------------------------------------------------- */
  /* ✅ Load role */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole?.toLowerCase() || "");
  }, []);

  /* -------------------------------------------------------------------------- */
  /* ✅ Fetch Today’s Attendance */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!userId || !role) return;

    const fetchTodayAttendance = async () => {
      try {
        const url =
          role === "admin"
            ? `http://localhost:4000/adminAttendance/${userId}`
            : `http://localhost:4000/attendance/${userId}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch attendance");

        const data = await res.json();
        const records = data?.data || data;

        const todayRec = Array.isArray(records)
          ? records.find((record) => {
              const d = new Date(record.date);
              return (
                d.getDate() === today.getDate() &&
                d.getMonth() === today.getMonth() &&
                d.getFullYear() === today.getFullYear()
              );
            })
          : null;

        setTodayRecord(todayRec || null);
      } catch (err) {
        console.error("Error fetching today's attendance:", err);
      }
    };

    fetchTodayAttendance();
  }, [userId, role, today]);

  /* -------------------------------------------------------------------------- */
  /* ✅ Handle Clock In / Clock Out */
  /* -------------------------------------------------------------------------- */
  const handleClockAction = async (type) => {
    if (loadingClock) return;
    if (!userId || !companyId)
      return toast.error("Missing user or company data.");

    const isAdmin = role === "admin";
    const endpoint =
      type === "in"
        ? isAdmin
          ? "adminAttendance/clockin"
          : "attendance/clockin"
        : isAdmin
        ? "adminAttendance/clockout"
        : "attendance/clockout";

    // prevent duplicate actions
    if (type === "in" && todayRecord?.clockIn)
      return toast.warning("You have already clocked in today.");
    if (type === "out") {
      if (!todayRecord?.clockIn)
        return toast.warning("Clock in before clocking out.");
      if (todayRecord?.clockOut)
        return toast.warning("You have already clocked out today.");
    }

    try {
      setLoadingClock(true);
      const body = isAdmin
        ? { adminId: userId, companyId }
        : { employeeId: userId, companyId };

      const res = await fetch(`http://localhost:4000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message?.includes("Sunday"))
          return toast.info("Today is Sunday — holiday, no attendance needed.");
        if (data.message?.includes("Already clocked"))
          return toast.warning("Already clocked for today.");
        if (data.message?.includes("not allowed before"))
          return toast.warning("Too early to clock in.");
        if (data.message?.includes("not allowed after"))
          return toast.error("Clock-in not allowed after.");

        return toast.error(data.message || "Clock action failed.");
      }

      toast.success(data.message || `Clock ${type === "in" ? "In" : "Out"} successful!`);

      const newRecord = data.record || data.attendance;
      setTodayRecord((prev) => ({
        ...prev,
        ...newRecord,
        [type === "in" ? "clockIn" : "clockOut"]:
          newRecord?.[type === "in" ? "clockIn" : "clockOut"] ||
          new Date().toISOString(),
      }));
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    } finally {
      setLoadingClock(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* ✅ UI Layout */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="flex w-full flex-col gap-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { id: 1, title: "Total Employees", value: "89", subtitle: "Active employees", icon: <Users /> },
          { id: 2, title: "Open Positions", value: "84", subtitle: "Positions to fill", icon: <UserCheck /> },
          { id: 3, title: "On Leave", value: "5", subtitle: "Employees on leave", icon: <Clock4 /> },
          { id: 4, title: "New Joins", value: "12", subtitle: "Joined this month", icon: <ChartNoAxesCombined /> },
        ].map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
              <div className="h-7 w-7 text-gray-500">{item.icon}</div>
            </div>
            <div>
              <div
                className={`text-left font-semibold ${
                  item.value === "5" || item.value === "12"
                    ? "text-red-500"
                    : item.value === "84"
                    ? "text-green-500"
                    : "text-slate-700"
                }`}
              >
                {item.value}
              </div>
              <div className="mt-1 text-left text-sm font-medium text-gray-500">{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance & Actions */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-shrink-0 flex-col gap-4 rounded-md border bg-white p-5 shadow-sm lg:w-80">
          <p className="text-lg font-semibold">
            {role === "admin" ? "Admin Quick Actions" : "Quick Actions"}
          </p>

          <button
            onClick={() => handleClockAction("in")}
            disabled={loadingClock}
            className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <LogIn size={18} /> Clock In
          </button>

          <button
            onClick={() => handleClockAction("out")}
            disabled={loadingClock}
            className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <LogOut size={18} /> Clock Out
          </button>

          <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
            <Download size={18} /> Export Report
          </button>
        </div>

        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-6">
          <Attendance />
        </div>
      </div>

      {/* Admin only: Employee overview */}
      {role === "admin" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <SearchEmployes />
            <div className="flex items-center gap-2 text-gray-700">
              <CalendarIcon size={20} className="text-gray-500" />
              <span className="text-sm">{formattedDate}</span>
            </div>
          </div>
        </div>
      )}
      <div className="w-full">
            <EmployeeTable />
          </div>
    </div>
  );
};

export default MainAttendance;