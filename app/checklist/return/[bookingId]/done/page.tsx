import Link from "next/link";

export default function ReturnDone() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-sm">
        <div className="text-5xl mb-4">✅</div>
        <h1
          className="text-2xl font-extrabold uppercase text-gray-900 mb-2"
          style={{ fontFamily: "var(--font-barlow), sans-serif" }}
        >
          Return checklist submitted
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Thanks for returning the machine and completing the checklist.
          We&apos;ll review it and release your bond as soon as possible — you&apos;ll get an email confirmation.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          The bond hold should clear within 3–5 business days depending on your bank.
        </p>
        <a
          href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK"
          className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors mb-3"
        >
          Leave a Google Review 🌟
        </a>
        <br />
        <Link href="/" className="text-sm text-green-700 hover:underline">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
