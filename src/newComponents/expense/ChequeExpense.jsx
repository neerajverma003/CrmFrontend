import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ChequeExpense = () => {
  const [showModal, setShowModal] = useState(false);
  const [cheques, setCheques] = useState([]); // ✅ state for fetched cheques
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    issuedDate: "",
    toWhom: "",
    validity: "",
    amount: "",
    chequeNumber: "",
    reason: "",
    entryDate: new Date().toISOString().split("T")[0], // today's date auto-filled
  });

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Fetch all cheques from backend
  const fetchCheques = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/cheque/get");
      if (!res.ok) throw new Error("Failed to fetch cheques");
      const data = await res.json();
      console.log(data)
      setCheques(data); // Assuming backend sends { cheques: [...] }
    } catch (error) {
      console.error("❌ Error fetching cheques:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run once when component loads
  useEffect(() => {
    fetchCheques();
  }, []);

  // ✅ Handle form submission (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseEntry = {
      entryDate: new Date().toISOString().split("T")[0],
      chequeIssuedDate: formData.issuedDate,
      receiverName: formData.toWhom,
      chequeValid: formData.validity,
      chequeNumber: formData.chequeNumber,
      chequeAmount: formData.amount,
      reasonToIssue: formData.reason,
    };

    try {
      const res = await fetch("http://localhost:4000/cheque", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseEntry),
      });

      if (!res.ok) throw new Error("Failed to save cheque expense");

      const data = await res.json();
      console.log("✅ Cheque Expense Saved:", data);

      alert("Cheque expense added successfully!");
      setShowModal(false);
      fetchCheques(); // ✅ Refresh list after adding new cheque

      // Reset form
      setFormData({
        issuedDate: "",
        toWhom: "",
        validity: "",
        amount: "",
        chequeNumber: "",
        reason: "",
        entryDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("❌ Error saving cheque expense:", error);
      alert("Error saving cheque expense. Please try again.");
    }
  };
if(cheques)
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-md border border-gray-300 bg-white p-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            Today Cheque Expense
          </div>
          <div className="text-2xl font-bold text-black">₹10,000</div>
        </div>
        <div className="rounded-md border border-gray-300 bg-white p-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            Monthly Cheque Expense
          </div>
          <div className="text-2xl font-bold text-black">₹1,20,000</div>
        </div>
      </div>

      {/* ✅ Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cheque Expenses</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-nowrap rounded-lg bg-black text-white font-medium 
          px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base hover:bg-gray-800"
        >
          + Add Cheque
        </button>
      </div>

      {/* ✅ Cheque Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
        {loading ? (
          <p className="p-4 text-gray-600 text-center">Loading cheques...</p>
        ) : cheques.length === 0 ? (
          <p className="p-4 text-gray-600 text-center">No cheque records found.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Entry Date</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Issued Date</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">To Whom</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Validity</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Cheque Number</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Reason</th>
              </tr>
            </thead>
            <tbody>
              {cheques.map((cheque) => (
                <tr key={cheque._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-800">{cheque.entryDate}</td>
                  <td className="p-3 text-sm text-gray-800">
                    {new Date(cheque.chequeIssuedDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm text-gray-800">{cheque.receiverName}</td>
                  <td className="p-3 text-sm text-gray-800">
                    {new Date(cheque.chequeValid).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm text-gray-800">{cheque.chequeNumber}</td>
                  <td className="p-3 text-sm text-gray-800">₹{cheque.chequeAmount}</td>
                  <td className="p-3 text-sm text-gray-800">{cheque.reasonToIssue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Add Cheque Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Cheque Expense</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Entry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Entry Date
                  </label>
                  <input
                    type="date"
                    name="entryDate"
                    value={formData.entryDate}
                    readOnly
                    className="w-full border rounded-lg p-2 mt-1 bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* Issued Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cheque Issued Date
                  </label>
                  <input
                    type="date"
                    name="issuedDate"
                    value={formData.issuedDate}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* To Whom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    To Whom Issued
                  </label>
                  <input
                    type="text"
                    name="toWhom"
                    value={formData.toWhom}
                    onChange={handleChange}
                    placeholder="Enter receiver name"
                    required
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Validity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cheque Validity (Date)
                  </label>
                  <input
                    type="date"
                    name="validity"
                    value={formData.validity}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Cheque Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cheque Number
                  </label>
                  <input
                    type="text"
                    name="chequeNumber"
                    value={formData.chequeNumber}
                    onChange={handleChange}
                    placeholder="Enter cheque number"
                    required
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cheque Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Reason */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Reason to Issue
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Enter reason for issuing cheque"
                    required
                    rows="2"
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  Add Cheque Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChequeExpense;
