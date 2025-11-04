import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Loading...");
  const [roleName, setRoleName] = useState("");

  const role = localStorage.getItem("role") || "";
  const id = localStorage.getItem("userId") || "";

  // 🧩 Fetch user details from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!id || !role) return;

        let url = "";

        // Choose correct endpoint based on role
        if (role.toLowerCase() === "superadmin") {
          url = `http://localhost:4000/AddSuperAdmin/super/${id}`;
        } else if (role.toLowerCase() === "admin") {
          url = `http://localhost:4000/getAdmin/${id}`;
        } else if (role.toLowerCase() === "employee") {
          url = `http://localhost:4000/employee/getEmployee/${id}`;
        } else {
          console.warn("Unknown role:", role);
          setUserName("Unknown");
          setRoleName(role);
          return;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        console.log(data)

        // ✅ Set name & role based on response structure
        if (role=== "superAdmin" ) {
          setUserName(data.SuperAdmin.fullName || "Super Admin");
          setRoleName("Super Admin");
        } else if (role.toLowerCase() === "admin" && data.admin) {
          setUserName(data.admin.fullName || "Admin");
          setRoleName("Admin");
        } else if (role.toLowerCase() === "employee" && data.employee) {
          setUserName(data.employee.fullName || "Employee");
          setRoleName(data.employee.role || "Employee");
        } else {
          setUserName("User");
          setRoleName(role);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserName("Unknown");
        setRoleName(role);
      }
    };

    fetchUser();
  }, [id, role]);

  // 🧭 Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between bg-white shadow-md px-4 sm:px-6 py-3 h-[10vh] sticky top-0 z-30">
      {/* Mobile: Show user logo + name | Desktop: Show heading */}
      <div className="flex items-center gap-3">
        {/* User Logo + Name - Visible only on mobile */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-200 text-[18px] font-semibold text-black">
            {userName.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span className="text-[16px] font-medium text-gray-700">
            {userName}
          </span>
        </div>

        {/* Dashboard Overview - Visible only on desktop */}
        <h1 className="hidden md:block text-2xl md:text-[28px] font-semibold text-gray-700">
          Dashboard Overview
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* 👤 User Info with name - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200 text-[18px] font-semibold text-black">
            {userName.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] sm:text-[18px] font-medium text-gray-700">
              {userName}
            </span>
            {roleName && (
              <span className="text-sm text-gray-400 capitalize">{roleName}</span>
            )}
          </div>
        </div>

        {/* 🚪 Logout Button - Always visible */}
        <button
          onClick={handleLogout}
          className="rounded-md p-2 transition-colors duration-200 hover:bg-red-100 active:bg-red-200"
        >
          <FiLogOut size={22} className="text-red-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
