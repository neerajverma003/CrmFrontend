import React, { useEffect, useState } from "react";

const UserCard = () => {
  const [employees, setEmployees] = useState([]);
  const [admins, setAdmins] = useState([]);

  // ✅ Fetch data from both APIs
  const fetchData = async () => {
    try {
      const [employeeRes, adminRes] = await Promise.all([
        fetch("http://localhost:4000/employee/allEmployee"),
        fetch("http://localhost:4000/getAdmin"),
      ]);

      const employeeData = await employeeRes.json();
      const adminData = await adminRes.json();

      setEmployees(employeeData.employees || employeeData.data || employeeData);
      setAdmins(adminData.admins || adminData.data || adminData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setEmployees([]);
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalUsers = employees.length + admins.length;

  return (
    <>
      {/* Total Users */}
      <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
        <div className="mb-6 flex w-full justify-between gap-6">
          <div className="text-xl font-semibold text-black">Total Users</div>
        </div>
        <div className="text-2xl font-semibold text-black">{totalUsers}</div>
      </div>

      {/* Total Employees */}
      <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
        <div className="mb-6 flex w-full justify-between gap-6">
          <div className="text-xl font-semibold text-black">Total Employees</div>
        </div>
        <div className="text-2xl font-semibold text-black">{employees.length}</div>
      </div>

      {/* Total Admins */}
      <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
        <div className="mb-6 flex w-full justify-between gap-6">
          <div className="text-xl font-semibold text-black">Total Admins</div>
        </div>
        <div className="text-2xl font-semibold text-black">{admins.length}</div>
      </div>
    </>
  );
};

export default UserCard;