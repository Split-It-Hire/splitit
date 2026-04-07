import { prisma } from "@/lib/prisma";
import { Booking } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

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

function bondBadge(bond: string) {
  const map: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600",
    held: "bg-amber-100 text-amber-700",
    released: "bg-green-100 text-green-700",
    captured_full: "bg-red-100 text-red-700",
    captured_partial: "bg-orange-100 text-orange-700",
  };
  return `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[bond] || "bg-gray-100 text-gray-600"}`;
}

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminBookings({ searchParams }: Props) {
  const params = await searchParams;
  const statusFilter = params.status;

  const bookings = await prisma.booking.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    orderBy: { startDate: "desc" },
  });

  const statuses = ["", "confirmed", "active", "completed", "pending", "cancelled", "disputed"];

  return (
    <div>
      <h1
        className="text-3xl font-extrabold uppercase text-gray-900 mb-4"
        style={{ fontFamily: "var(--font-barlow), sans-serif" }}
      >
        Bookings
      </h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/admin/bookings?status=${s}` : "/admin/bookings"}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              (statusFilter || "") === s
                ? "bg-green-700 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {s || "All"}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dates</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Bond</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b: Booking) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="font-semibold text-gray-900 hover:text-green-700 transition-colors"
                      >
                        {b.customerName}
                      </Link>
                      <div className="text-xs text-gray-400">{b.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {format(b.startDate, "d MMM")} – {format(b.endDate, "d MMM yy")}
                      <div className="text-xs text-gray-400">{b.numberOfDays}d</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell capitalize">
                      {b.hireType}
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusBadge(b.status)}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={bondBadge(b.bondStatus)}>{b.bondStatus.replace("_", " ")}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      ${b.totalCharged.toFixed(0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
