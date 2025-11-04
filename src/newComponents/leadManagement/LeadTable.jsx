// import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Eye, Edit2, Trash2, ArrowUpDown } from "lucide-react";
import { useState,useEffect,useMemo,useCallback } from "react";

const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [leads, setLeads] = useState([]);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);

  // Fetch leads from API
  const fetchLeadData = async () => {
    try {
      const response = await fetch("http://localhost:4000/leads");
      const result = await response.json();
      console.log(result)
      if (result.success) {
        setLeads(result.data || result);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error("Error fetching lead data:", error);
      setLeads([]);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, []);

  // Status colors
  const getStatusColor = (status) => {
    const colors = {
      Hot: "bg-red-500 text-white",
      Warm: "bg-orange-500 text-white",
      Cold: "bg-blue-500 text-white",
    };
    return colors[status] || "bg-gray-500 text-white";
  };

  // Filter and search
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const statusMatch =
        selectedStatus === "All Status" || lead.leadStatus === selectedStatus;
      const searchMatch =
        !searchText ||
        lead.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.phone?.includes(searchText);
      return statusMatch && searchMatch;
    });
  }, [leads, searchText, selectedStatus]);

  // Sort leads
  const sortedLeads = useMemo(() => {
    if (!sortConfig.key) return filteredLeads;
    return [...filteredLeads].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "value") {
        aValue = parseFloat(aValue?.replace(/[$,]/g, "") || 0);
        bValue = parseFloat(bValue?.replace(/[$,]/g, "") || 0);
      }
      if (sortConfig.key === "lastContact" || sortConfig.key === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortConfig]);

  // Pagination
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedLeads, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

  // Handlers
  const handleSort = useCallback((key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleSelectLead = useCallback((leadId) => {
    setSelectedLeads((current) =>
      current.includes(leadId)
        ? current.filter((id) => id !== leadId)
        : [...current, leadId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedLeads((current) =>
      current.length === paginatedLeads.length
        ? []
        : paginatedLeads.map((lead) => lead._id)
    );
  }, [paginatedLeads]);

  // 👁 View Modal Trigger
  const handleView = useCallback((lead) => {
    setCurrentLead(lead);
    setIsViewModalOpen(true);
  }, []);

  // ✏️ Edit Modal Trigger
  const handleEdit = useCallback((lead) => {
    setCurrentLead(lead);
    setIsEditModalOpen(true);
  }, []);

  // 🗑 Delete Lead
  const handleDelete = useCallback(async (lead) => {
    if (!window.confirm(`Are you sure you want to delete ${lead.name}?`)) return;
    try {
      const response = await fetch(`http://localhost:4000/leads/${lead._id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setLeads((prev) => prev.filter((l) => l._id !== lead._id));
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  }, []);

  // PATCH Update
  const handleUpdateLead = async (updatedLead) => {
    try {
      const response = await fetch(`http://localhost:4000/leads/${updatedLead._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLead),
      });
      const result = await response.json();
      if (result.success) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === updatedLead._id ? { ...lead, ...updatedLead } : lead
          )
        );
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  // 🧱 Edit Modal
 // Edit Modal (UI same as Add Lead)


const EditModal = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...lead });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!lead) return null;

  const textFields = [
    "name",
    "email",
    "phone",
    "whatsAppNo",
    "company",
    "value",
    "departureCity",
    "destination",
    "noOfDays",
    "noOfPerson",
    "noOfChild",
    "childAge",
    "placesToCover",
    "groupNumber"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="mb-4 text-lg font-semibold text-center">Edit Lead</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Optional Group Number (Edit Only) */}
          <div className="flex flex-col sm:col-span-2">
  <label className="mb-1 text-sm font-medium">Group Number </label>
  <input
    type="text"
    name="groupNumber"
    value={formData.groupNumber || ""}
    onChange={(e) => {
      const value = e.target.value;
      // Allow only numeric and max 4 characters
      if (/^\d{0,4}$/.test(value)) {
        setFormData((prev) => ({ ...prev, groupNumber: value }));
      }
    }}
    placeholder="Enter Group Number"
    className="w-full rounded border px-3 py-2"
    maxLength={4} // Optional, ensures user can't type more than 4
  />
</div>


          {/* Text Inputs */}
          {textFields.map((field) => (
            <div key={field} className="flex flex-col">
              <label className="mb-1 text-sm font-medium">
                {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                placeholder={field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                className="w-full rounded border px-3 py-2"
              />
            </div>
          ))}

          {/* Dropdowns */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Lead Status</label>
            <select
              name="leadStatus"
              value={formData.leadStatus || "Cold"}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            >
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Lead Source</label>
            <select
              name="leadSource"
              value={formData.leadSource || ""}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Select Source</option>
              <option value="Referral">Referral</option>
              <option value="Website">Website</option>
              <option value="Social Media">Social Media</option>
              <option value="Advertisement">Advertisement</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Lead Type</label>
            <select
              name="leadType"
              value={formData.leadType || ""}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Select Type</option>
              <option value="Individual">Individual</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Expected Travel Date</label>
            <input
              type="date"
              name="expectedTravelDate"
              value={formData.expectedTravelDate?.split("T")[0] || ""}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col sm:col-span-2">
            <label className="mb-1 text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              placeholder="Notes"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {/* Buttons */}
          <div className="sm:col-span-2 mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};




// export default EditModal;


  // 👁 Read-only View Modal
  const ViewModal = ({ lead, onClose }) => {
  if (!lead) return null;

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="mb-4 text-lg font-semibold text-center text-gray-800">
          Lead Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
          <p><strong>Name:</strong> {lead.name}</p>
          <p><strong>Email:</strong> {lead.email}</p>
          <p><strong>Phone:</strong> {lead.phone}</p>
          <p><strong>WhatsApp No:</strong> {lead.whatsAppNo}</p>
          <p><strong>Company:</strong> {lead.company}</p>
          <p><strong>Lead Source:</strong> {lead.leadSource}</p>
          <p><strong>Lead Type:</strong> {lead.leadType}</p>
          <p><strong>Lead Status:</strong> {lead.leadStatus}</p>
          <p><strong>Value:</strong> ${lead.value}</p>
          <p><strong>Departure City:</strong> {lead.departureCity}</p>
          <p><strong>Destination:</strong> {lead.destination}</p>
          <p><strong>Expected Travel:</strong> {formatDate(lead.expectedTravelDate)}</p>
          <p><strong>No. of Days:</strong> {lead.noOfDays}</p>
          <p><strong>No. of Persons:</strong> {lead.noOfPerson}</p>
          <p><strong>No. of Children:</strong> {lead.noOfChild}</p>
          <p><strong>Group Number:</strong>{lead.groupNumber}</p>
          <p><strong>Child Age:</strong> {lead.childAge}</p>
          <p><strong>Places to Cover:</strong> {lead.placesToCover}</p>
          <p><strong>Last Contact:</strong> {formatDate(lead.lastContact)}</p>
          <p><strong>Created At:</strong> {formatDate(lead.createdAt)}</p>
          <p><strong>Updated At:</strong> {formatDate(lead.updatedAt)}</p>
          <p className="sm:col-span-2"><strong>Notes:</strong> {lead.notes}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="rounded bg-red-500 px-5 py-2 text-white hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


  const SortableHeader = ({ column, children }) => (
    <th
      className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 sm:px-6"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </th>
  );

  if (filteredLeads.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No leads found
        </h3>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
  <tr>
    <th className="px-3 py-4 sm:px-6">
      <input
        type="checkbox"
        checked={
          selectedLeads.length === paginatedLeads.length &&
          paginatedLeads.length > 0
        }
        onChange={handleSelectAll}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600"
      />
    </th>
    <SortableHeader column="name">Name</SortableHeader>
    <SortableHeader column="email">Email</SortableHeader>
    <SortableHeader column="phone">Phone</SortableHeader>
    <SortableHeader column="whatsAppNo">WhatsApp No</SortableHeader>
    <SortableHeader column="destination">Destination</SortableHeader>
    <SortableHeader column="leadSource">Lead Source</SortableHeader>
    <SortableHeader column="createdAt">Created At</SortableHeader>
    <th className="px-3 py-4 text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
      Actions
    </th>
  </tr>
</thead>

<tbody className="divide-y divide-gray-200 bg-white">
  {paginatedLeads.map((lead) => (
    <tr
      key={lead._id}
      className={selectedLeads.includes(lead._id) ? "bg-gray-100" : ""}
    >
      <td className="px-3 py-4 sm:px-6">
        <input
          type="checkbox"
          checked={selectedLeads.includes(lead._id)}
          onChange={() => handleSelectLead(lead._id)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600"
        />
      </td>
      <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.name}</td>
      <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.email}</td>
      <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.phone}</td>
      <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.whatsAppNo}</td>
      <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.destination}</td>
      <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.leadSource}</td>
      <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">
        {new Date(lead.createdAt).toLocaleDateString()}
      </td>
      <td className="flex items-center gap-3 px-3 py-4 sm:px-6">
        <button onClick={() => handleView(lead)} className="text-blue-500 hover:text-blue-700">
          <Eye className="h-4 w-4" />
        </button>
        <button onClick={() => handleEdit(lead)} className="text-green-500 hover:text-green-700">
          <Edit2 className="h-4 w-4" />
        </button>
        <button onClick={() => handleDelete(lead)} className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && (
        <EditModal
          lead={currentLead}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateLead}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          lead={currentLead}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default LeadTable;
