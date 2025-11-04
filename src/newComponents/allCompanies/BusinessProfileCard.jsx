import { Eye, Edit, Trash2 } from "lucide-react";
import axios from "axios";

const BusinessProfileCard = ({
  _id,
  companyName,
  industry,
  email,
  phoneNumber,
  deals = 0,
  value = "$0",
  status,
  onDelete, // ✅ callback from parent
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
    <div className="flex items-center justify-between p-2 border rounded-lg shadow-sm hover:shadow-md transition bg-white">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-medium text-gray-700">
          {displayName[0] || "?"}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{displayName}</h2>
          <p className="text-sm text-gray-500">{industry || "N/A"}</p>
          <p className="text-sm text-gray-400">{email || "N/A"}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold">{deals}</p>
          <p className="text-xs text-gray-500">Deals</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-green-600">{value}</p>
          <p className="text-xs text-gray-500">Value</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            displayStatus === "Active" ? "bg-[#00c951] text-white" : "bg-[#f0b100] text-white"
          }`}
        >
          {displayStatus}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 text-gray-500">
        <button className="hover:bg-gray-200 p-2 rounded-sm">
          <Eye size={15} />
        </button>
        <button className="hover:bg-gray-200 p-2 rounded-sm">
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

export default BusinessProfileCard;
