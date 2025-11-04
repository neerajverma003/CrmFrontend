import { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, X } from "lucide-react";

const API_URL = "http://localhost:4000";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // Get role from localStorage
  const userRole = localStorage.getItem("role");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    company: "",
    role: "",
    accountActive: true,
  });

  // 🔹 Fetch Admins
  const fetchAdmins = async () => {
    const res = await fetch(`${API_URL}/getAdmin`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch admins");
    return data.admins || [];
  };

  // 🔹 Fetch Employees
  const fetchEmployees = async () => {
    const res = await fetch(`${API_URL}/employee/allEmployee`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch employees");
    return data.employees || [];
  };

  // 🔹 Fetch Companies
  const fetchCompanies = async () => {
    const res = await fetch(`${API_URL}/company/all`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch companies");
    return data.companies || [];
  };

  // 🔹 Fetch all data together
  const fetchData = async () => {
  try {
    setLoading(true);
    setError("");

    const role = localStorage.getItem("role"); // 👈 read user role

    let combined = [];

    // 🟢 If SuperAdmin → Fetch both Admins + Employees
    if (role === "superAdmin") {
      const [adminRes, employeeRes] = await Promise.all([
        fetch(`${API_URL}/getAdmin`),
        fetch(`${API_URL}/employee/allEmployee`),
      ]);

      const adminData = await adminRes.json();
      const employeeData = await employeeRes.json();

      if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
      if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

      const admins = adminData.admins || adminData || [];
      const employees = employeeData.employees || employeeData || [];

      combined = [...admins, ...employees];
    }

    // 🟣 If Admin → Fetch only Employees
    else if (role === "admin") {
      const employeeRes = await fetch(`${API_URL}/employee/allEmployee`);
      const employeeData = await employeeRes.json();

      if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

      const employees = employeeData.employees || employeeData || [];
      combined = [...employees];
    }

    // 🔴 Optional: If other roles → No data
    else {
      combined = [];
    }

    // ✅ Sort newest first
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setUsers(combined);
  } catch (error) {
    console.error("Error fetching data:", error);
    setError("Failed to fetch users or admins. Please try again.");
  } finally {
    setLoading(false);
  }
};
  // 🔹 Delete Employee
  const deleteEmployee = async (id, role) => {
    if (role === "Admin" && userRole !== "superAdmin") {
      alert("You don't have permission to delete admins.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${API_URL}/employee/deleteEmployee/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete employee");

      fetchData();
    } catch (error) {
      console.error("❌ Error deleting employee:", error);
      alert(error.message);
    }
  };

  // 🔹 Edit
  const handleEditClick = (user) => {
    if (user.role === "Admin" && userRole !== "superAdmin") {
      alert("You don't have permission to edit admins.");
      return;
    }

    setEditingUser(user);
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      department: user.department || "",
      company: user.company || "",
      role: user.role || "",
      accountActive: user.accountActive ?? true,
    });
    setIsModalOpen(true);
  };

  // 🔹 View
  const handleViewClick = async (user) => {
    try {
      let companyName = user.companyName;
      if (!companyName && user.company) {
        const res = await fetch(`${API_URL}/company/${user.company}`);
        const data = await res.json();
        companyName = data.company?.companyName || "Unknown";
      }
      setViewingUser({ ...user, companyName });
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching company:", error);
      setViewingUser({ ...user, companyName: "Unknown" });
      setIsViewModalOpen(true);
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      department: "",
      company: "",
      role: "",
      accountActive: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser?._id) {
      alert("No user selected for update.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/employee/editEmployee/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update employee");

      alert("Employee updated successfully!");
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error("❌ Error updating employee:", error);
      alert(error.message || "Update failed. Try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRoleBadge = (role) => {
    const colors = {
      Admin: "bg-[#ad46ff]",
      Manager: "bg-[#2b7fff]",
      "Sales Rep": "bg-[#00c951]",
      Employee: "bg-[#6a7282]",
    };
    return (
      <span className={`px-2 py-1 rounded-md text-white text-xs font-medium ${colors[role] || "bg-gray-400"}`}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (status) => (
    <span
      className={`px-2 py-1 rounded-md text-white text-xs font-medium ${
        status === "Active" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {status}
    </span>
  );

  // 🔹 Render
  return (
    <>
      {/* Table Container with Horizontal Scroll */}
      <div className="w-full min-w-0">
        <div className="overflow-x-auto rounded-md shadow-sm bg-white border border-gray-200">
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">
              {userRole === "superAdmin" ? "Admin & Employee List" : "Employee List"}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-6 text-gray-600">Loading data...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No records found.</div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-left text-sm text-gray-700">
                  <th className="p-3">User</th>
                  <th className="p-3 hidden sm:table-cell">Contact</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 hidden md:table-cell">Department</th>
                  <th className="p-3 hidden lg:table-cell">Company</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 hidden md:table-cell">Join Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {/* User */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 flex-shrink-0">
                          {u.fullName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-sm truncate max-w-[150px]">
                          {u.fullName || "Unnamed"}
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-3 text-sm text-gray-600 hidden sm:table-cell">
                      <div className="truncate max-w-[180px]">{u.email || "—"}</div>
                      <div className="truncate">{u.phone || "—"}</div>
                    </td>

                    {/* Role */}
                    <td className="p-3">{getRoleBadge(u.role || "Employee")}</td>

                    {/* Department */}
                    <td className="p-3 hidden md:table-cell">
                      <span className="truncate block max-w-[120px]">{u.department || "—"}</span>
                    </td>

                    {/* Company */}
                    <td className="p-3 hidden lg:table-cell">
                      <span className="truncate block max-w-[150px]">{u.companyName || "—"}</span>
                    </td>

                    {/* Status */}
                    <td className="p-3">{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</td>

                    {/* Join Date */}
                    <td className="p-3 text-sm text-gray-600 hidden md:table-cell whitespace-nowrap">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>

                    {/* Actions */}
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewClick(u)}
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditClick(u)}
                          className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteEmployee(u._id, u.role)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 🔹 View Modal */}
      {isViewModalOpen && viewingUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">User Details</h2>
              <button onClick={handleCloseViewModal} className="text-gray-500 hover:atext-gray-700">
                <X size={22} />
              </button>
            </div>
            <div className="p-6 space-y-3 text-gray-700">
              <p>
                <strong>Name:</strong> {viewingUser.fullName}
              </p>
              <p>
                <strong>Email:</strong> {viewingUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {viewingUser.phone}
              </p>
              <p>
                <strong>Department:</strong> {viewingUser.department}
              </p>
              <p>
                <strong>Company:</strong> {viewingUser.companyName}
              </p>
              <p>
                <strong>Role:</strong> {viewingUser.role}
              </p>
              <p>
                <strong>Status:</strong> {viewingUser.accountActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Edit Modal */}





      
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">Edit Employee</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {["fullName", "email", "phone"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                ))}

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select department</option>
                    {["IT", "Sales", "Digital Marketing", "Legal", "HR", "Accounts", "Operations"].map(
                      (dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <input
                  type="checkbox"
                  name="accountActive"
                  checked={formData.accountActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Account Active</label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Update Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserTable;