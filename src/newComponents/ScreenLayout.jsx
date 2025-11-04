import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

const ScreenLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 📱 Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🧩 On desktop, always open sidebar
  useEffect(() => {
    if (!isMobile) setIsExpanded(true);
  }, [isMobile]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden lg:flex-row">
      {/* 📱 Mobile View */}
      {isMobile ? (
        <div className="flex flex-col w-full h-full">
          {/* Sidebar with its own mobile header - it handles everything */}
          <Sidebar
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            isMobile={isMobile}
          />

          {/* Header below sidebar - add top padding to account for fixed mobile header */}
          <div className="flex-shrink-0 mt-[60px]">
            <Header />
          </div>

          {/* Main content - takes remaining space */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      ) : (
        // 💻 Desktop View
        <div className="flex flex-row w-full h-full">
          {/* Sidebar fixed on left */}
          <div className="w-[250px] flex-shrink-0">
            <Sidebar
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              isMobile={isMobile}
            />
          </div>

          {/* Header + Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenLayout;