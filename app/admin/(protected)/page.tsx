import { prisma } from "@/lib/prisma";
import { Booking } from "@prisma/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import Link from "next/link";
import { Calendar, DollarSign, Package, AlertCircle } from "lucide-react";

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
    disputed: "bg-orange-100 text-orange-800",
  };
  return `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-700"}`;
}

export default async function AdminDashboard() {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [allBookings, thisMonthBookings, pendingBonds, upcomingBookings] =
    await Promise.all([
      prisma.booking.count({ where: { status: { not: "cancelled" } } }),
      prisma.booking.findMany({
        where: {
          status: { not: "cancelled" },
          createdAt: { gte: monthStart, lte: monthEnd },
        },
        select: { totalCharged: true },
      }),
      prisma.booking.count({
        where: { status: "completed", bondStatus: "held" },
      }),
      prisma.booking.findMany({
        where: {
          status: { in: ["confirmed", "active"] },
          startDate: { gte: now },
        },
        orderBy: { startDate: "asc" },
        take: 5,
        select: {
          id: true,
          customerName: true,
          startDate: true,
          endDate: true,
          status: true,
          bondStatus: true,
          totalCharged: true,
          deliveryOption: true,
        },
      }),
    ]);

  const monthRevenue = thisMonthBookings.reduce((sum, b) => sum + b.totalCharged, 0);

  return (
    <div>
      <h1
        className="text-3xl font-extrabold uppercase text-gray-900 mb-6"
        style={{ fontFamily: "var(--font-barlow), sans-serif" }}
      >
        Dashboard
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Hires",
            value: allBookings.toString(),
            icon: <Package size={20} className="text-green-600" />,
            sub: "all time",
          },
          {
            label: "Revenue This Month",
            value: `$${monthRevenue.toFixed(0)}`,
            icon: <DollarSign size={20} className="text-green-600" />,
            sub: format(now, "MMMM yyyy"),
          },
          {
            label: "This Month Bookings",
            value: thisMonthBookings.length.toString(),
            icon: <Calendar size={20} className="text-green-600" />,
            sub: "bookings",
          },
          {
            label: "Bonds Awaiting Release",
            value: pendingBonds.toString(),
            icon: <AlertCircle size={20} className="text-amber-500" />,
            sub: "action required",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</span>
              {stat.icon}
            </div>
            <div
              className="text-3xl font-black text-gray-900"
              style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            >
              {stat.value}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Upcoming bookings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Upcoming Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-green-700 hover:underline">
            View all →
          </Link>
        </div>
        {upcomingBookings.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">No upcoming bookings</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {upcomingBookings.map((b: Booking) => (
              <Link
                key={b.id}
                href={`/admin/bookings/${b.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{b.customerName}</div>
                  <div className="text-xs text-gray-500">
                    {format(b.startDate, "d MMM")} – {format(b.endDate, "d MMM yyyy")} ·{" "}
                    {b.deliveryOption === "delivery" ? "Delivery" : "Self-collection"}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className={statusBadge(b.status)}>{b.status}</span>
                  <span className="text-sm font-semibold text-gray-700">
                    ${b.totalCharged.toFixed(0)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bond actions needed */}
      {pendingBonds > 0 && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600" />
            <strong className="text-amber-800">{pendingBonds} booking{pendingBonds !== 1 ? "s" : ""} need bond action.</strong>
          </div>
          <p className="text-amber-700 mt-1">
            Go to{" "}
            <Link href="/admin/bookings?status=completed" className="underline">
              completed bookings
            </Link>{" "}
            to release or capture bonds. Bond holds expire after 7 days.
          </p>
        </div>
      )}
    </div>
  );
}
