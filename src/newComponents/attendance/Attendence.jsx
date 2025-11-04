// AttendanceCalendarOpen.jsx
import React, { useState } from "react";

export default function AttendanceCalendarOpen() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const monthNames = [
    "January","February","March","April","May","June","July","August","September","October","November","December"
  ];
  const weekShort = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const changeMonth = (delta) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  const buildGrid = (m) => {
    const year = m.getFullYear();
    const month = m.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startDay = firstOfMonth.getDay(); // 0..6
    const startDate = new Date(year, month, 1 - startDay);
    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const days = buildGrid(currentMonth);
  const isSame = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className="w-2/4 ">
      <h3 className="text-lg font-semibold mb-4">Attendance Calendar</h3>

      <div className="rounded-md border border-gray-100 p-5">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="h-8 w-8 rounded-md border bg-white text-slate-700 grid place-items-center"
              aria-label="Previous month"
            >
              ‹
            </button>

            <div className="px-3 text-sm font-semibold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>

            <button
              onClick={() => changeMonth(1)}
              className="h-8 w-8 rounded-md border bg-white text-slate-700 grid place-items-center"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>

        {/* weekdays */}
        <div className="grid grid-cols-7 gap-2 text-xs text-gray-400 mb-2">
          {weekShort.map((w) => (
            <div key={w} className="text-center">
              {w}
            </div>
          ))}
        </div>

        {/* days grid */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((d, idx) => {
            const isCurrentMonth = d.getMonth() === currentMonth.getMonth();
            const isToday = isSame(d, new Date());
            const isSelected = isSame(d, selected);

            // classes for each day button
            const base = "h-10 w-10 grid place-items-center rounded-md cursor-pointer text-sm";
            const muted = isCurrentMonth ? "text-slate-800" : "text-gray-300";
            const todayRing = isToday && !isSelected ? "ring-1 ring-slate-200" : "";
            const sel = isSelected ? "bg-black text-white" : "hover:bg-slate-50";

            return (
              <button
                key={idx}
                onClick={() => setSelected(new Date(d.getFullYear(), d.getMonth(), d.getDate()))}
                className={`${base} ${muted} ${todayRing} ${sel}`}
                title={d.toDateString()}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
