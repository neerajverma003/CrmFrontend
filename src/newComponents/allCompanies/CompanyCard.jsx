import { Mail, Phone, Globe, Users, Eye, Edit, Trash2 } from "lucide-react";
import axios from "axios";

const CompanyCard = ({
  _id,
  companyName,
  industry,
  status,
  email,
  phoneNumber,
  website,
  numberOfEmployees,
  deals = 0,
  value = "$0",
  onDelete, // callback to remove from parent
}) => {
  const displayName = companyName || "N/A";
  const displayStatus = status?.toLowerCase() === "active" ? "Active" : "Pending";

  const handleDelete = async () => {
    if (!_id) return;
    if (!window.confirm(`Are you sure you want to delete ${displayName}?`)) return;

    try {
      const res = await axios.delete(`http://localhost:4000/company/delete/${_id}`);
      if (res.status === 200) {
        alert("Company deleted successfully ✅");
        if (onDelete) onDelete(_id);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Failed to delete company ❌");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 w-80 hover:shadow-lg transition-shadow duration-200">
      {/* Top Row */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold"
            aria-hidden="true"
          >
            {displayName[0] || "?"}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{displayName}</h2>
            <p className="text-sm text-gray-400">{industry || "N/A"}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            displayStatus === "Active"
              ? "bg-[#00c951] text-white"
              : "bg-[#f0b100] text-gray-900"
          }`}
        >
          {displayStatus}
        </span>
      </div>

      {/* Contact Info */}
      <div className="my-4 text-gray-600 text-sm space-y-1">
        <div className="flex items-center gap-1">
          <Mail size={15} /> <span>{email || "N/A"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone size={15} /> <span>{phoneNumber || "N/A"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Globe size={15} /> <span>{website || "N/A"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={15} /> <span>{numberOfEmployees || 0} employees</span>
        </div>
      </div>

      <hr className="my-3" />

      {/* Deals & Value */}
      <div className="flex justify-between items-end">
        <div>
          <p className="font-semibold text-lg text-gray-700">{deals}</p>
          <p className="text-xs text-gray-400">Deals</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg text-green-600">{value}</p>
          <p className="text-xs text-gray-400">Value</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-3">
        <button className="text-gray-500 hover:bg-gray-200 p-2 rounded-sm">
          <Eye size={15} />
        </button>
        <button className="text-gray-500 hover:bg-gray-200 p-2 rounded-sm">
          <Edit size={15} />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:bg-gray-200 p-2 rounded-sm"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default CompanyCard;
