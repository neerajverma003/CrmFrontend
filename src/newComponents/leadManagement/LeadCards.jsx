import React, { useEffect, useState } from "react";

const LeadCards = () => {
    const [leads, setLeads] = useState([]);

    // Fetch leads from API
    const fetchLeadData = async () => {
        try {
            const response = await fetch("http://localhost:4000/leads/");
            const result = await response.json();
            console.log(result);
            if (result.success) {
                setLeads(result.data || result); // Adjust if API returns data array inside 'data'
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
  const hotLeads = leads.filter(
    (lead) =>
      (lead.status && lead.status.trim().toLowerCase() === "hot") ||
      (lead.leadStatus && lead.leadStatus.trim().toLowerCase() === "hot")
  ); 
    const totalValue = leads.reduce((acc, lead) => {
    const val = parseFloat(lead.value); // convert to number
    return acc + (isNaN(val) ? 0 : val);
  }, 0);   return (
        <>
            <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
                <div className="mb-6 flex w-full justify-between gap-6">
                    <div className="text-xl font-semibold text-black">Total Leads</div>
                </div>
                <div className="text-2xl font-semibold text-black">{leads.length}</div>
            </div>
            <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
                <div className="mb-6 flex w-full justify-between gap-6">
                    <div className="text-xl font-semibold text-black">Hot Leads</div>
                </div>
                <div className="text-2xl font-semibold text-black">{hotLeads.length}</div>
            </div>

                        <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
                <div className="mb-6 flex w-full justify-between gap-6">
                    <div className="text-xl font-semibold text-black">Total Value</div>
                </div>
                <div className="text-2xl font-semibold text-black">{totalValue}</div>
            </div>
        </>
    );
};

export default LeadCards;
