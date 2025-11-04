import { BarChart3, Clock4, UserCheck, Users, TrendingUp, TrendingDown, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MainDashboard = () => {
    const navigate = useNavigate();

    const [lead, setLead] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);

    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loadingAttendance, setLoadingAttendance] = useState(true);

    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [errorCompanies, setErrorCompanies] = useState("");

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const role = localStorage.getItem("role"); // Super admin | admin | employee

    // 🕒 Check Token Expiry
    const checkTokenExpiry = () => {
        const token = localStorage.getItem("token");
        const expiry = localStorage.getItem("tokenExpiry");

        if (!token || !expiry) return false;

        if (new Date().getTime() > Number(expiry)) {
            // Remove expired session data
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiry");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("role");
            localStorage.removeItem("companyId");
            return false;
        }
        return true;
    };

    // 🧩 Session Timeout Watcher
    useEffect(() => {
        if (!checkTokenExpiry()) {
            alert("Session expired. Please login again.");
            navigate("/");
        }

        const interval = setInterval(() => {
            if (!checkTokenExpiry()) {
                alert("Session expired. Please login again.");
                navigate("/");
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [navigate]);

    // 📊 Fetch Attendance
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await fetch("http://localhost:4000/attendance/getAllAttendance");
                const data = await res.json();
                console.log("Fetched attendance data:", data);

                const attendance = Array.isArray(data) ? data : data.data || [];
                const userId = localStorage.getItem("userId");

                // Filter by logged-in user
                const userAttendance = attendance.filter((item) => item.employee?._id === userId);

                setAttendanceData(userAttendance);
            } catch (err) {
                console.error("Error fetching attendance:", err);
            } finally {
                setLoadingAttendance(false);
            }
        };

        fetchAttendance();
    }, []);

    // 📈 Fetch Leads
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await fetch("http://localhost:4000/leads/");
                const data = await res.json();
                const leadData = Array.isArray(data) ? data : data.data || [];
                setLead(leadData);
            } catch (err) {
                console.error("Error fetching leads:", err);
            } finally {
                setLoadingLeads(false);
            }
        };
        fetchLeads();
    }, []);

    // 🏢 Fetch Companies
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get("http://localhost:4000/company/all");
                let allCompanies = response.data?.companies || [];

                // Filter by admin role
                if (role === "admin") {
                    const userId = localStorage.getItem("userId");
                    allCompanies = allCompanies.filter((company) => company.adminId === userId);
                }

                setCompanies(allCompanies);
            } catch (err) {
                console.error("Error fetching companies:", err);
                setErrorCompanies("Failed to load companies");
            } finally {
                setLoadingCompanies(false);
            }
        };
        fetchCompanies();
    }, [role]);

    // 📅 Filter Attendance by Selected Date
    useEffect(() => {
        const target = new Date(selectedDate);
        const filtered = attendanceData.filter((item) => {
            if (!item.date) return false;
            const itemDate = new Date(item.date);
            return (
                itemDate.getFullYear() === target.getFullYear() &&
                itemDate.getMonth() === target.getMonth() &&
                itemDate.getDate() === target.getDate()
            );
        });
        setFilteredData(filtered);
    }, [selectedDate, attendanceData]);

    // 🎨 Helper: Status Colors
    const getStatusColor = (status) => {
        if (!status) return "bg-gray-400";
        switch (status.toLowerCase()) {
            case "present":
            case "active":
                return "bg-green-500 hover:bg-green-600";
            case "absent":
                return "bg-red-500 hover:bg-red-600";
            case "late":
            case "warm":
                return "bg-yellow-500 hover:bg-yellow-600";
            case "hot":
                return "bg-red-500 hover:bg-red-600";
            case "cold":
            case "inactive":
                return "bg-gray-500 hover:bg-gray-600";
            default:
                return "bg-gray-500 hover:bg-gray-600";
        }
    };

    // 🕒 Helper: Format Time
    const formatTime = (isoString) => {
        if (!isoString) return "—";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // 📊 Dashboard Cards
    const cards = [
        {
            title: "Total Leads",
            value: lead.length.toString(),
            percentage: "+12% from last month",
            icon: <Users className="h-5 w-5" />,
            trend: "up",
            color: "text-blue-600",
        },
        {
            title: "Total Users",
            value: "4",
            percentage: "+8% from last month",
            icon: <UserCheck className="h-5 w-5" />,
            trend: "up",
            color: "text-green-600",
        },
        {
            title: "Avg Time",
            value: "00:45",
            percentage: "-2% from last month",
            icon: <Clock4 className="h-5 w-5" />,
            trend: "down",
            color: "text-orange-600",
        },
        {
            title: "Conversions",
            value: "76",
            percentage: "+5% from last month",
            icon: <BarChart3 className="h-5 w-5" />,
            trend: "up",
            color: "text-purple-600",
        },
    ];

    return (
       <div className="flex-1 bg-gray-50 px-4 py-6">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Top Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color} bg-opacity-10`}>{item.icon}</div>
                            {item.trend === "up" ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                        </div>
                        <h3 className="mb-1 text-sm font-medium text-gray-600">{item.title}</h3>
                        <div className="mb-2 text-3xl font-bold text-gray-900">{item.value}</div>
                        <div className={`text-sm font-medium ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>{item.percentage}</div>
                    </div>
                ))}
            </div>

            {/* Companies Section for Admin/Super Admin */}
            {(role === "Super admin" || role === "admin") && (
                <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h4 className="mb-4 text-lg font-semibold text-gray-900">Companies</h4>
                    {loadingCompanies ? (
                        <p className="text-center text-sm text-gray-500">Loading companies...</p>
                    ) : companies.length === 0 ? (
                        <p className="text-center text-sm text-gray-500">No companies found.</p>
                    ) : (
                        <ul className="max-h-80 space-y-2 overflow-y-auto">
                            {companies.map((company) => (
                                <li
                                    key={company._id}
                                    className="flex items-center justify-between rounded p-3 hover:bg-gray-50"
                                >
                                    <span className="text-sm font-medium text-gray-900">{company.name}</span>
                                    <span className="text-xs text-gray-500">{company.email}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Employee Dashboard Section */}
            {role === "employee" && (
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Leads */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h4 className="text-lg font-semibold text-gray-900">Recent Leads</h4>
                        </div>
                        <div className="max-h-80 space-y-4 overflow-y-auto p-6">
                            {loadingLeads ? (
                                <p className="text-center text-sm text-gray-500">Loading leads...</p>
                            ) : lead.length === 0 ? (
                                <p className="text-center text-sm text-gray-500">No leads found.</p>
                            ) : (
                                lead.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                                                {item.name?.charAt(0)?.toUpperCase() || "?"}
                                            </div>
                                            <div>
                                                <span className="block text-sm font-medium text-gray-900">{item.name}</span>
                                                <span className="text-xs text-gray-500">{item.email}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-gray-900">₹{item.value}</span>
                                            <button
                                                className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${getStatusColor(
                                                    item.leadStatus,
                                                )}`}
                                            >
                                                {item.leadStatus}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Attendance */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">Attendance</h4>
                                <p className="mt-1 text-sm text-gray-600">Attendance for {selectedDate}</p>
                            </div>
                            <input
                                type="date"
                                className="rounded border px-2 py-1 text-sm"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                        <div className="max-h-80 space-y-4 overflow-y-auto p-6">
                            {loadingAttendance ? (
                                <p className="text-center text-sm text-gray-500">Loading attendance...</p>
                            ) : filteredData.length === 0 ? (
                                <p className="text-center text-sm text-gray-500">No attendance records for this date.</p>
                            ) : (
                                filteredData.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50"
                                    >
                                        <span className="text-sm font-medium text-gray-900">{item.employee?.fullName || "Unknown"}</span>
                                        <span className="text-sm text-gray-500">
                                            In: {formatTime(item.clockIn)} | Out: {formatTime(item.clockOut)}
                                        </span>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 🔹 Quick Actions (only Employee & Admin) */}
            {/* Quick Actions */}
            {(role === "employee" || role === "admin") && (
                <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-6 py-4">
                        <h4 className="text-lg font-semibold text-gray-900">Quick Actions</h4>
                        <p className="mt-1 text-sm text-gray-600">Common tasks and shortcuts</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Add Lead */}
                            <button
                                onClick={() => navigate("/lead-management")}
                                className="flex h-24 transform flex-col items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Users className="mb-2 h-6 w-6" />
                                <span className="font-semibold">Add Lead</span>
                            </button>

                            {/* Clock In/Out */}
                            <button
                                onClick={() => navigate("/attendance")}
                                className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-green-300 hover:bg-green-50"
                            >
                                <Clock4 className="mb-2 h-6 w-6 text-gray-600" />
                                <span className="font-semibold text-gray-700">Clock In/Out</span>
                            </button>

                            {/* Add User (Admin Only) */}
                            {(role === "admin" || role === "superAdmin") && (
                                <button
                                    onClick={() => navigate("/user-management")}
                                    className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-indigo-300 hover:bg-indigo-50"
                                >
                                    <UserPlus className="mb-2 h-6 w-6 text-gray-600" />
                                    <span className="font-semibold text-gray-700">Add User</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainDashboard;