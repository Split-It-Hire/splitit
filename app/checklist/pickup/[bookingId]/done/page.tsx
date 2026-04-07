import Link from "next/link";

export default function PickupDone() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-sm">
        <div className="text-5xl mb-4">🪵</div>
        <h1
          className="text-2xl font-extrabold uppercase text-gray-900 mb-2"
          style={{ fontFamily: "var(--font-barlow), sans-serif" }}
        >
          All done — happy splitting!
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Your pickup checklist has been saved. Have a great hire!
          You&apos;ll receive a reminder on your return day with the return checklist link.
        </p>
        <Link
          href="/"
          className="text-sm text-green-700 hover:underline"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
