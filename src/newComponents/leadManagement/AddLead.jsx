import React, { useState, useCallback } from "react";
import { Plus, AlertCircle, Check } from "lucide-react";
import Modal from "../UserManagement/Modal.jsx";

// 🧩 Dropdown Options (from your Mongoose schema)
const leadSources = [
  "Cold Call",
  "Website",
  "Referral",
  "LinkedIn",
  "Trade Show",
  "Email Campaign",
  "Social Media",
  "Event",
  "Organic Search",
  "Paid Ads",
];

const leadTypes = ["International", "Domestic"];
const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];

// 🧩 Reusable Input Field
const InputField = React.memo(
  ({ name, type = "text", placeholder, required = false, value, error, onChange, onBlur, isSubmitting }) => (
    <div className="h-[4.5rem]">
      <label className="block text-xs font-medium text-gray-700 mb-0.5" htmlFor={name}>
        {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 ${
          error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
        }`}
        disabled={isSubmitting}
        autoComplete="off"
      />
      <div className="h-4 mt-0.5">
        {error && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" />
            <span className="truncate">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
);

// 🧩 Reusable Select Field
const SelectField = React.memo(
  ({ name, options, placeholder, required = false, value, error, onChange, onBlur, isSubmitting }) => (
    <div className="h-[4.5rem]">
      <label className="block text-xs font-medium text-gray-700 mb-0.5" htmlFor={name}>
        {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 ${
          error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
        }`}
        disabled={isSubmitting}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="h-4 mt-0.5">
        {error && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" />
            <span className="truncate">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
);

const AddLead = ({ onLeadAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsAppNo: "",
    departureCity: "",
    destination: "",
    expectedTravelDate: "",
    noOfDays: "",
    placesToCover: "",
    noOfPerson: "",
    noOfChild: "",
    childAge: "",
    leadSource: "",
    leadType: "",
    tripType: "",
    company: "",
    leadStatus: "Hot",
    value: "",
    notes: "",
  });

  // 🧩 Basic validation
  const validate = (data) => {
    const newErrors = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "notes" && !value) {
        newErrors[key] = `${key} is required`;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setApiError("");
    try {
      const res = await fetch("http://localhost:4000/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add lead");
      setSubmitSuccess(true);
      onLeadAdded?.();
      setTimeout(() => {
        setIsOpen(false);
        setSubmitSuccess(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          whatsAppNo: "",
          departureCity: "",
          destination: "",
          expectedTravelDate: "",
          noOfDays: "",
          placesToCover: "",
          noOfPerson: "",
          noOfChild: "",
          childAge: "",
          leadSource: "",
          leadType: "",
          tripType: "",
          company: "",
          leadStatus: "Hot",
          value: "",
          notes: "",
        });
      }, 1500);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Open Modal Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Add Lead</span>
        <span className="sm:hidden">Add</span>
      </button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="large">
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add New Lead</h2>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {submitSuccess && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-700">Lead added successfully!</p>
                </div>
              </div>
            )}

            {apiError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField name="name" value={formData.name} onChange={handleChange} required error={errors.name} />
                <InputField name="email" type="email" value={formData.email} onChange={handleChange} required error={errors.email} />
                <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} />
                <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} required error={errors.whatsAppNo} />
                <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} required error={errors.departureCity} />
                <InputField name="destination" value={formData.destination} onChange={handleChange} required error={errors.destination} />
                <InputField name="expectedTravelDate" type="date" value={formData.expectedTravelDate} onChange={handleChange} required error={errors.expectedTravelDate} />
                <InputField name="noOfDays" type="number" value={formData.noOfDays} onChange={handleChange} required error={errors.noOfDays} />
                <InputField name="placesToCover" value={formData.placesToCover} onChange={handleChange} required error={errors.placesToCover} />
                <InputField name="noOfPerson" type="number" value={formData.noOfPerson} onChange={handleChange} required error={errors.noOfPerson} />
                <InputField name="noOfChild" type="number" value={formData.noOfChild} onChange={handleChange} required error={errors.noOfChild} />
                <InputField name="childAge" value={formData.childAge} onChange={handleChange} required error={errors.childAge} />
                <SelectField name="leadSource" options={leadSources} placeholder="Select Lead Source" value={formData.leadSource} onChange={handleChange} required error={errors.leadSource} />
                <SelectField name="leadType" options={leadTypes} placeholder="Select Lead Type" value={formData.leadType} onChange={handleChange} required error={errors.leadType} />
                <SelectField name="tripType" options={tripTypes} placeholder="Select Trip Type" value={formData.tripType} onChange={handleChange} required error={errors.tripType} />
                <InputField name="company" value={formData.company} onChange={handleChange} required error={errors.company} />
                <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} error={errors.leadStatus} />
                <InputField name="value" type="number" value={formData.value} onChange={handleChange} required error={errors.value} />
              </div>

              <div className="h-[4rem]">
                <label className="block text-xs font-medium text-gray-700 mb-0.5">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none hover:border-gray-400 text-sm resize-none"
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || submitSuccess}
              className={`flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Adding..." : submitSuccess ? "Added!" : "Add Lead"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddLead;
