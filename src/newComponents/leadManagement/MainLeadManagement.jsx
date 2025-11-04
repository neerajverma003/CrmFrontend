import React, { useState, useCallback } from "react";
import { cardData } from "./data.js";
import MyCards from "../UserManagement/MyCards.jsx";
import SearchLead from "./SearchLead.jsx";
import SearchStatus from "./SearchStatus.jsx";
import AddLead from "./AddLead.jsx";
import LeadTable from "./LeadTable.jsx";
import LeadCards from "./LeadCards.jsx";

const MainLeadManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handle search text change
  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  // Handle status filter change
  const handleStatusChange = useCallback((status) => {
    setSelectedStatus(status);
  }, []);

  // Handle successful lead addition
  const handleLeadAdded = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="max-h-[85vh] overflow-y-auto w-full max-w-full overflow-hidden">
      <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 xl:p-6 overflow-y-auto overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-4 xl:mb-6">
          <h1 className="text-2xl xl:text-3xl font-bold text-gray-900 mb-1 xl:mb-2">Lead Management</h1>
          <p className="text-sm xl:text-base text-gray-600">Track and manage your sales leads efficiently</p>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 xl:gap-4 mb-4 xl:mb-6">
          {cardData.map((card, index) => (
            <MyCards
              key={`lead-card-${index}-${card.title}`}
              title={card.title}
              value={card.value}
              icon={card.icon}
              description={card.description}
            />
          ))}
        </div> */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 xl:gap-4 mb-4 xl:mb-6">
          <LeadCards/>
        </div>
        {/* Filters and Actions */}
        <div className="mb-4 xl:mb-6 flex flex-col gap-3 xl:flex-row xl:gap-4 xl:justify-between xl:items-center">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full xl:w-auto min-w-0">
            <div className="flex-1 max-w-xs min-w-0">
              <SearchLead 
                onSearchChange={handleSearchChange}
                placeholder="Search leads..."
              />
            </div>
            <div className="flex-shrink-0">
              <SearchStatus 
                onStatusChange={handleStatusChange}
                selectedStatus={selectedStatus}
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <AddLead onLeadAdded={handleLeadAdded} />
          </div>
        </div>

        {/* Lead Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] w-full overflow-hidden">
          <LeadTable 
            searchText={searchText}
            selectedStatus={selectedStatus}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
};

export default MainLeadManagement;