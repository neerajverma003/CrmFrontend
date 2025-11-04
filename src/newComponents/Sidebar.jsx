
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserPlus,
  FiClock,
  FiBriefcase,
  FiSettings,
  FiMenu,
  FiX,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const Sidebar = () => {
  const [role, setRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [department, setDepartment] = useState("");
  const [expenseOpen, setExpenseOpen] = useState(false); // 🔽 Dropdown toggle

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (storedRole) setRole(storedRole.toLowerCase());
    if (userId && storedRole) fetchDepartment(userId, storedRole.toLowerCase());
  }, []);

  // ✅ Fetch department based on role
  const fetchDepartment = async (userId, role) => {
    try {
      const endpoint =
        role === "employee"
          ? `http://localhost:4000/employee/getEmployee/${userId}`
          : `http://localhost:4000/getAdmin/${userId}`;

      const res = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        console.error("❌ Department fetch failed:", res.status);
        return;
      }
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("❌ Invalid JSON received:", text);
        return;
      }

      const data = await res.json();
      console.log("✅ Department API response:", data);

      let dept =
        data?.employee?.department ||
        data?.employee?.adminId?.department ||
        data?.admin?.department ||
        data?.department ||
        "N/A";

      setDepartment(dept);
      console.log("✅ Department fetched:", dept);
    } catch (error) {
      console.error("⚠️ Error fetching department:", error);
    }
  };

  const allItems = [
    { id: 1, label: "Dashboard", icon: <FiGrid size={20} />, url: "/dashboard", roles: ["admin", "employee", "superadmin"] },
    { id: 2, label: "Lead Management", icon: <FiUsers size={20} />, url: "/lead-management", roles: ["admin", "employee", "superadmin"] },
    { id: 3, label: "User Management", icon: <FiUserPlus size={20} />, url: "/user-management", roles: ["admin", "superadmin"] },
    { id: 4, label: "Attendance", icon: <FiClock size={20} />, url: "/attendance", roles: ["admin", "employee", "superadmin"] },
    {
      id: 5,
      label: "Leave Management",
      icon: <FiClock size={20} />,
      url: role === "admin" || role === "superadmin" ? "/leaves" : "/leave-apply",
      roles: ["admin", "employee", "superadmin"],
    },
    { id: 6, label: "Companies", icon: <FiBriefcase size={20} />, url: "/companies", roles: ["admin", "superadmin"] },
    // ✅ Expense dropdown
    {
      id: 7,
      label: "Expense",
      icon: <FiDollarSign size={20} />,
      type: "dropdown",
      roles: ["admin", "employee", "superadmin"],
      children: [
        { id: "7-1", label: "Daily Expense", url: "/dailyexpenses" },
        { id: "7-2", label: "Cheque Expense", url: "/cheque" },
      ],
    },
    { id: 8, label: "Settings", icon: <FiSettings size={20} />, url: "/settings", roles: ["admin", "employee", "superadmin"] },
  ];

  const sidebarItems = allItems.filter((item) => item.roles.includes(role));

  if (!role) return null;

  return (
    <>
      {/* 📱 Mobile Header */}
      <div className="fixed top-0 left-0 z-30 flex w-full items-center justify-between bg-white px-4 py-3 shadow-md md:hidden">
        <div className="flex items-center gap-3 whitespace-nowrap select-none pointer-events-none">
          <div className="flex size-10 items-center justify-center rounded-lg bg-black text-[20px] font-semibold text-white">
            C
          </div>
          <div className="text-lg font-semibold text-black">CRM Pro</div>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
          {isOpen ? <FiX size={25} /> : <FiMenu size={25} />}
        </button>
      </div>

      {/* 💻 Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-[250px] bg-white border-r shadow-lg z-40">
        <div className="flex flex-col w-full">
          <div className="flex h-[12vh] items-center gap-3 border-b-2 px-4 select-none">
            <div className="flex size-12 items-center justify-center rounded-lg bg-black text-[25px] font-semibold text-white">
              C
            </div>
            <div className="text-[20px] font-semibold text-black whitespace-nowrap">
              CRM Pro
            </div>
          </div>

          <nav className="mt-8 flex-1 overflow-y-auto">
            <ul>
              {sidebarItems.map((item) => (
                <React.Fragment key={item.id}>
                  {item.type === "dropdown" ? (
                    <>
                      {/* Dropdown Header */}
                      <li
                        className="flex items-center justify-center gap-3 cursor-pointer px-4 py-3 hover:bg-gray-100 text-gray-700"
                        onClick={() => setExpenseOpen(!expenseOpen)}
                      >
                        <div className="flex items-center pr-7">
                          {item.icon}
                          <span className="text-md pl-4">{item.label}</span>
                        </div>
                        {expenseOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                      </li>

                      {/* Dropdown Children */}
                      {expenseOpen && (
                        <ul className="ml-8 mt-1">
                          {item.children.map((child) => (
                            <li key={child.id} className="mb-1">
                              <NavLink
                                to={child.url}
                                className={({ isActive }) =>
                                  isActive
                                    ? "block rounded-lg bg-black px-3 py-2 text-white"
                                    : "block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                                }
                              >
                                {child.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    // Regular nav item
                    <li className="mb-2 px-3">
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-3 rounded-lg bg-black px-4 py-3 text-white"
                            : "flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                        }
                      >
                        {item.icon}
                        <span className="text-md">{item.label}</span>
                      </NavLink>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </nav>

          {/* ✅ Show department info */}
          <div className="px-4 py-4 border-t font-bold text-sm text-gray-500">
            Department: <span className="font-bold text-black">{department}{department.department}</span>
          </div>
        </div>
      </div>

      {/* 📱 Overlay click to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
};

export default Sidebar;