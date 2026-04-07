import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import BondActions from "@/components/admin/BondActions";
import BookingStatusControl from "@/components/admin/BookingStatusControl";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) notFound();

  const pickupChecklist = booking.pickupChecklist
    ? JSON.parse(booking.pickupChecklist as string)
    : null;
  const returnChecklist = booking.returnChecklist
    ? JSON.parse(booking.returnChecklist as string)
    : null;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/bookings" className="text-sm text-gray-500 hover:text-gray-700">
          ← Bookings
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-mono text-gray-700">{booking.id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Customer</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="font-semibold">{booking.customerName}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="font-semibold">
                  <a href={`mailto:${booking.customerEmail}`} className="text-green-700 hover:underline">
                    {booking.customerEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-semibold">
                  <a href={`tel:${booking.customerPhone}`} className="text-green-700 hover:underline">
                    {booking.customerPhone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Address</dt>
                <dd className="font-semibold">{booking.customerAddress}</dd>
              </div>
              {booking.howHeard && (
                <div>
                  <dt className="text-gray-500">How heard</dt>
                  <dd className="font-semibold capitalize">{booking.howHeard}</dd>
                </div>
              )}
            </dl>

            {/* ID Photos */}
            <h3 className="font-semibold text-gray-700 mt-5 mb-3">ID Photos</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Front", url: booking.idPhotoFrontUrl },
                { label: "Back", url: booking.idPhotoBackUrl },
              ].map(({ label, url }) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={url}
                        alt={`ID ${label}`}
                        className="w-full rounded-lg border border-gray-200 object-cover h-24 hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                      No photo
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Signature */}
            {booking.signatureDataUrl && (
              <>
                <h3 className="font-semibold text-gray-700 mt-5 mb-2">Digital Signature</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.signatureDataUrl}
                  alt="Signature"
                  className="border border-gray-200 rounded-lg bg-white max-h-20 object-contain"
                />
                {booking.termsAcceptedAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Terms accepted: {format(booking.termsAcceptedAt, "d MMM yyyy h:mm a")}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Checklists */}
          {(pickupChecklist || returnChecklist) && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">Condition Checklists</h2>

              {pickupChecklist && (
                <div className="mb-5">
                  <h3 className="font-semibold text-gray-700 mb-2">Pickup Checklist</h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Submitted: {format(new Date(pickupChecklist.submittedAt), "d MMM yyyy h:mm a")}
                  </p>
                  {pickupChecklist.photos?.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {pickupChecklist.photos.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Pickup photo ${i + 1}`}
                            className="w-full h-16 object-cover rounded border border-gray-200"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                  <dl className="text-sm space-y-1">
                    {Object.entries(pickupChecklist.items || {}).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center ${val ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {val ? "✓" : "✗"}
                        </span>
                        <span className="text-gray-700">{key}</span>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {returnChecklist && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Return Checklist</h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Submitted: {format(new Date(returnChecklist.submittedAt), "d MMM yyyy h:mm a")}
                  </p>
                  {returnChecklist.photos?.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {returnChecklist.photos.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Return photo ${i + 1}`}
                            className="w-full h-16 object-cover rounded border border-gray-200"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                  {returnChecklist.fuelLevel && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Fuel level:</strong> {returnChecklist.fuelLevel}
                    </p>
                  )}
                  {returnChecklist.notes && (
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {returnChecklist.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Booking summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Booking Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Dates</dt>
                <dd className="font-semibold text-right">
                  {format(booking.startDate, "d MMM")} – {format(booking.endDate, "d MMM yy")}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Days</dt>
                <dd className="font-semibold">{booking.numberOfDays}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Type</dt>
                <dd className="font-semibold capitalize">{booking.hireType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Collection</dt>
                <dd className="font-semibold capitalize">{booking.deliveryOption.replace("_", " ")}</dd>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between">
                <dt className="text-gray-500">Hire fee</dt>
                <dd className="font-semibold">${booking.hireFeeTotal.toFixed(2)}</dd>
              </div>
              {booking.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Delivery</dt>
                  <dd className="font-semibold">${booking.deliveryFee.toFixed(2)}</dd>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
                <dt>Total charged</dt>
                <dd className="text-green-700">${booking.totalCharged.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          {/* Status control */}
          <BookingStatusControl bookingId={booking.id} currentStatus={booking.status} />

          {/* Bond management */}
          <BondActions
            bookingId={booking.id}
            bondStatus={booking.bondStatus}
            bondAmount={booking.bondAmount}
            stripeBondIntentId={booking.stripeBondIntentId}
          />

          {/* Admin notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-2">Admin Notes</h2>
            {booking.adminNotes ? (
              <p className="text-sm text-gray-700">{booking.adminNotes}</p>
            ) : (
              <p className="text-sm text-gray-400">No notes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
