import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Split It Gold Coast log splitter hire.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1
        className="text-4xl font-extrabold uppercase text-gray-900 mb-2"
        style={{ fontFamily: "var(--font-barlow), sans-serif" }}
      >
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: April 2026</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Who we are</h2>
          <p>
            Split It Gold Coast is a micro-business operating in Mudgeeraba, Gold Coast QLD,
            providing hydraulic log splitter hire services. References to <strong>"we"</strong>,{" "}
            <strong>"us"</strong>, or <strong>"our"</strong> in this policy refer to Split It Gold Coast.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">What information we collect</h2>
          <p>When you make a booking, we collect:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Your full name, email address, and phone number</li>
            <li>Your hire dates and the address where the equipment will be used</li>
            <li>Photos of both sides of your driver's licence (for identity verification)</li>
            <li>Your digital signature on the hire agreement</li>
            <li>Payment information (processed securely by Stripe — we never see or store your card details)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">How we store your ID photos</h2>
          <p>
            Photos of your driver's licence are required to verify your identity before we release
            equipment. Here is exactly how they are stored and protected:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Stored in Vercel Blob</strong> — a secure, enterprise-grade cloud storage
              service operated by Vercel Inc. (USA), which complies with SOC 2 Type 2 security
              standards.
            </li>
            <li>
              <strong>Unguessable URLs</strong> — each file is assigned a randomly generated
              128-bit UUID filename (e.g. <code className="text-xs bg-gray-100 px-1 rounded">id-front-a3f9b2c1-7e4d-...</code>).
              This makes it statistically impossible for anyone to guess or stumble upon your file.
              This is the same security model used by Dropbox and Google Drive shared links.
            </li>
            <li>
              <strong>Accessible only to the business owner</strong> — your ID photos are only
              visible to the business owner through the private admin dashboard. They are never
              shared with any third party.
            </li>
            <li>
              <strong>Deleted after hire completion</strong> — ID photos are deleted once your hire
              is complete and any bond has been resolved. We do not retain them beyond what is
              necessary.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Why we collect this information</h2>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>To verify your identity and age before releasing equipment</li>
            <li>To contact you about your booking</li>
            <li>To process payment and manage the hire bond</li>
            <li>To meet our legal obligations as an equipment hire business</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Third-party services we use</h2>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Stripe</strong> — payment processing. Your card details go directly to Stripe
              and are never stored on our servers.{" "}
              <a href="https://stripe.com/au/privacy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">
                Stripe Privacy Policy
              </a>
            </li>
            <li>
              <strong>Resend</strong> — transactional email delivery (booking confirmations, receipts).
            </li>
            <li>
              <strong>Vercel</strong> — website hosting and file storage.{" "}
              <a href="https://vercel.com/legal/privacy-policy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">
                Vercel Privacy Policy
              </a>
            </li>
            <li>
              <strong>Neon</strong> — database hosting (stores booking records, not payment data).
            </li>
          </ul>
          <p className="mt-3">
            All third-party providers are reputable services with strong security practices. We do
            not sell or share your personal data with any third party for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Your rights</h2>
          <p>
            Under the Australian Privacy Act 1988 and the Australian Privacy Principles, you have
            the right to:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Request access to the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data (subject to any legal retention requirements)</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:hello@splitithire.com.au" className="text-green-700 underline">
              hello@splitithire.com.au
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies</h2>
          <p>
            This website uses a single session cookie to keep you logged in to the admin area. No
            tracking cookies or advertising cookies are used.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
          <p>
            If you have any questions about this privacy policy or how we handle your data, please
            contact us:
          </p>
          <ul className="list-none mt-2 space-y-1">
            <li>Email: <a href="mailto:hello@splitithire.com.au" className="text-green-700 underline">hello@splitithire.com.au</a></li>
            <li>Location: Mudgeeraba, Gold Coast QLD 4213</li>
          </ul>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-200">
        <Link href="/" className="text-sm text-green-700 hover:text-green-800 font-medium">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
