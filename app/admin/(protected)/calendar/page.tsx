"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface CalendarDay {
  date: string;
  status: "available" | "booked" | "blocked" | "buffer";
}

interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
}

export default function AdminCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<CalendarDay[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [blocking, setBlocking] = useState(false);
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");

  async function load() {
    setLoading(true);
    const [avail, blocked] = await Promise.all([
      fetch("/api/availability").then((r) => r.json()),
      fetch("/api/admin/blocked-dates").then((r) => r.json()),
    ]);
    setAvailability(avail);
    setBlockedDates(blocked);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const availMap = new Map(availability.map((d) => [d.date, d.status]));

  async function addBlock() {
    if (!newBlockDate) return;
    setBlocking(true);
    await fetch("/api/admin/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newBlockDate, reason: newBlockReason }),
    });
    setNewBlockDate("");
    setNewBlockReason("");
    setBlocking(false);
    load();
  }

  async function removeBlock(id: string) {
    await fetch("/api/admin/blocked-dates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function renderDays() {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startWeek = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endWeek = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startWeek;

    while (day <= endWeek) {
      for (let i = 0; i < 7; i++) {
        const d = day;
        const key = format(d, "yyyy-MM-dd");
        const status = availMap.get(key);
        const isCurrentMonth = isSameMonth(d, currentMonth);

        let bg = "bg-white";
        let text = isCurrentMonth ? "text-gray-700" : "text-gray-200";

        if (isCurrentMonth) {
          if (status === "booked") { bg = "bg-red-100"; text = "text-red-700 font-bold"; }
          else if (status === "blocked") { bg = "bg-gray-200"; text = "text-gray-600 font-bold"; }
          else if (status === "buffer") { bg = "bg-orange-50"; text = "text-orange-500"; }
          else if (status === "available") { bg = "bg-green-50"; text = "text-green-700"; }
        }

        days.push(
          <div key={d.toString()} className={`h-10 flex items-center justify-center text-sm rounded-lg m-0.5 ${bg} ${text}`}>
            {format(d, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  }

  return (
    <div>
      <h1
        className="text-3xl font-extrabold uppercase text-gray-900 mb-6"
        style={{ fontFamily: "var(--font-barlow), sans-serif" }}
      >
        Availability Calendar
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-bold text-lg">{format(currentMonth, "MMMM yyyy")}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>
          {loading ? <div className="h-40 flex items-center justify-center text-gray-400 text-sm">Loading...</div> : renderDays()}
          <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-100 rounded inline-block" />Available</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-100 rounded inline-block" />Booked</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-gray-200 rounded inline-block" />Blocked</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-50 rounded inline-block border border-orange-100" />Buffer day</span>
          </div>
        </div>

        {/* Block dates panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Block a Date</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Date</label>
                <input
                  type="date"
                  value={newBlockDate}
                  onChange={(e) => setNewBlockDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Reason (optional)</label>
                <input
                  type="text"
                  value={newBlockReason}
                  onChange={(e) => setNewBlockReason(e.target.value)}
                  placeholder="e.g. Maintenance, personal use"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={addBlock}
                disabled={!newBlockDate || blocking}
                className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-200 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
              >
                {blocking ? "Blocking..." : "Block Date"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3">Blocked Dates</h2>
            {blockedDates.length === 0 ? (
              <p className="text-sm text-gray-400">No blocked dates</p>
            ) : (
              <ul className="space-y-2">
                {blockedDates.map((b) => (
                  <li key={b.id} className="flex items-start justify-between gap-2 text-sm">
                    <div>
                      <div className="font-semibold text-gray-800">{format(new Date(b.date), "d MMM yyyy")}</div>
                      {b.reason && <div className="text-xs text-gray-400">{b.reason}</div>}
                    </div>
                    <button
                      onClick={() => removeBlock(b.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors mt-0.5"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
