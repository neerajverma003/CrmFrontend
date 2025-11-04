

import { useState, useEffect } from "react";
import axios from "axios";
import MyCards from "../UserManagement/MyCards.jsx";
import SearchCompanies from "./SearchCompanies.jsx";
import SearchCompanyByStatus from "./SearchCompanyByStatus.jsx";
import AddCompany from "./AddCompany.jsx";
import CompanyCard from "./CompanyCard.jsx";
import BusinessProfileCard from "./BusinessProfileCard.jsx";

const MainAllCompanies = () => {
  const [view, setView] = useState("Grid");
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get("http://localhost:4000/company/all");
        const data = res?.data?.companies || [];
        setCompanies(data);
        setFilteredCompanies(data); // initial list
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to fetch companies. Please try again later.");
        setCompanies([]);
        setFilteredCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // ✅ Filter companies whenever status changes
  useEffect(() => {
    if (selectedStatus === "All Status") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(
        (c) => c.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
      setFilteredCompanies(filtered);
    }
  }, [selectedStatus, companies]);

  // ✅ Helper for CompanyCard props
  const mapCompanyProps = (company) => ({
    companyName: company.companyName || "N/A",
    industry: company.industry || "N/A",
    status: company.status || "Pending",
    email: company.email || "N/A",
    phoneNumber: company.phoneNumber || "N/A",
    website: company.website || "N/A",
    numberOfEmployees: company.numberOfEmployees || 0,
    deals: company.deals || 0,
    value: company.value || "$0",
  });

  return (
    <div className="max-h-[85vh] overflow-y-auto bg-[#f8f9fa] p-8">
      {/* Dashboard Summary Cards */}
      <div className="flex flex-col sm:flex-row gap-4">
        <MyCards />
      </div>

      {/* Search and View Controls */}
      <div className="my-4 flex w-full justify-between items-center">
        <div className="flex gap-3">
          <SearchCompanies aria-label="Search companies by name" />
          {/* ✅ Hook up filter here */}
          <SearchCompanyByStatus onStatusChange={setSelectedStatus} />
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setView("Grid")}
            className={`w-fit px-3 py-2 rounded-md ${
              view === "Grid" ? "bg-black text-white" : "border border-gray-200"
            }`}
          >
            Grid
          </button>

          <button
            type="button"
            onClick={() => setView("List")}
            className={`w-fit px-3 py-2 rounded-md ${
              view === "List" ? "bg-black text-white" : "border border-gray-200"
            }`}
          >
            List
          </button>

          <AddCompany />
        </div>
      </div>

      {/* Companies List */}
      <div
        className={`border border-gray-200 rounded-md bg-[#ffffff] p-4 ${
          view === "Grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "flex flex-col gap-4"
        }`}
        role="region"
        aria-label="List of all companies"
      >
        {loading ? (
          <p className="text-center text-gray-500">Loading companies...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredCompanies.length === 0 ? (
          <p className="text-center text-gray-500">
            No companies found for “{selectedStatus}”
          </p>
        ) : (
          filteredCompanies.map((company) =>
            view === "Grid" ? (
              <CompanyCard
                key={company._id}
                _id={company._id}
                {...mapCompanyProps(company)}
                onDelete={(deletedId) =>
                  setCompanies((prev) => prev.filter((c) => c._id !== deletedId))
                }
              />
            ) : (
              <BusinessProfileCard
                key={company._id}
                _id={company._id}
                {...mapCompanyProps(company)}
                onDelete={(deletedId) =>
                  setCompanies((prev) => prev.filter((c) => c._id !== deletedId))
                }
              />
            )
          )
        )}
      </div>
    </div>
  );
};

export default MainAllCompanies;
