import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  Calendar,
  CreditCard,
  Truck,
  Star,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import SchemaMarkup from "@/components/SchemaMarkup";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: "default" } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "default" } });
  }
  return settings;
}

/** Format a number as a dollar amount — whole numbers show no decimals */
function fmt(n: number) {
  return "$" + (Number.isInteger(n) ? n.toString() : n.toFixed(2));
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: `Log Splitter Hire Gold Coast | From ${fmt(s.dailyRate)}/Day | Split It Gold Coast`,
    description: `Hydraulic log splitter hire on the Gold Coast QLD. Book online, pick up from ${s.pickupSuburb}, split your wood, return. ${fmt(s.dailyRate)}/day, ${fmt(s.weekendRate)} weekend, ${fmt(s.weeklyRate)} week. ${fmt(s.bondAmount)} bond. No fuss.`,
  };
}

const SPECS = [
  { label: "Splitting Force", value: "50 Tonne" },
  { label: "Power Source", value: "Petrol (Honda GX200)" },
  { label: "Max Log Length", value: "550 mm" },
  { label: "Max Log Diameter", value: "600 mm" },
  { label: "Cycle Time", value: "~12 seconds" },
  { label: "Weight", value: "~250 kg" },
  { label: "Orientation", value: "Horizontal & Vertical" },
  { label: "Fuel", value: "Regular unleaded" },
];

export default async function HomePage() {
  const s = await getSettings();

  const FAQS = [
    {
      q: "What do I need to bring at pickup?",
      a: "Your driver's licence (for ID verification — we scan it at booking), a vehicle capable of towing or transporting the machine, and your booking confirmation. If you're towing, a standard ball hitch trailer is required.",
    },
    {
      q: "Is the machine easy to use?",
      a: "Yes. The log splitter is straightforward to operate. We provide a quick-start guide with your booking confirmation, and there are clear labels on the machine. Most people have it running within 5 minutes.",
    },
    {
      q: "Do you deliver?",
      a: `Yes, we deliver within a ${s.deliveryRadius} km radius of ${s.pickupSuburb} for a flat ${fmt(s.deliveryFee)} fee. Select delivery during booking and enter your address — we'll confirm the delivery time by email.`,
    },
    {
      q: "What if I damage it?",
      a: `Normal wear is expected. For damage beyond that, the ${fmt(s.bondAmount)} security bond held on your card covers repair costs. The bond is never charged unless damage is identified — we only capture what repairs actually cost. Our Terms of Hire spell out exactly what counts as damage.`,
    },
    {
      q: "What's the bond for?",
      a: `The ${fmt(s.bondAmount)} bond is a pre-authorisation hold on your card — your bank holds the funds but we don't receive them unless damage or late fees need to be charged. If everything's good, the hold is released after your return and we'll send you a confirmation email. It typically clears within 3–5 business days.`,
    },
    {
      q: "Can I extend my hire?",
      a: "If the machine isn't booked after you, yes! Email or call us as early as possible and we'll sort it out. Extra days are charged at the daily rate.",
    },
    {
      q: "What fuel does it use?",
      a: "Regular unleaded petrol. The machine comes with a full tank — please return it full, or a fuel levy will apply (captured from bond).",
    },
    {
      q: "What's your cancellation policy?",
      a: "Full refund for cancellations 48+ hours before pickup. 50% refund for 24–48 hours. No refund within 24 hours. The bond hold is always released immediately on cancellation.",
    },
  ];

  return (
    <>
      <SchemaMarkup />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className={`flex flex-col ${s.heroVideoUrl ? "lg:flex-row lg:items-center lg:gap-12" : ""}`}>
            {/* Text content */}
            <div className={s.heroVideoUrl ? "lg:flex-1" : "max-w-2xl"}>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Gold Coast &amp; Surrounds — Self-collection &amp; Delivery
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-none tracking-tight mb-4"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                Hydraulic Log Splitter Hire
                <br />
                <span className="text-green-300">Gold Coast</span>
              </h1>
              <p className="text-lg sm:text-xl text-green-100 mb-8 leading-relaxed">
                Book online. Pick up from {s.pickupSuburb}. Split your wood. Return. Done.
                <br className="hidden sm:block" />
                No staff. No fuss. Available 7 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg"
                >
                  Check Availability &amp; Book
                  <ArrowRight size={20} />
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-xl transition-colors"
                >
                  See Pricing
                </a>
              </div>

              {/* Quick trust signals */}
              <div className="flex flex-wrap gap-4 mt-8 text-sm text-green-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-green-400" />
                  From {fmt(s.dailyRate)}/day inc. GST
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-green-400" />
                  Fully insured
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-green-400" />
                  50-tonne force
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-green-400" />
                  Instant confirmation
                </span>
              </div>
            </div>

            {/* Hero video — served via proxy route (private blob) */}
            {s.heroVideoUrl && (
              <div className="mt-10 lg:mt-0 lg:w-[42%] shrink-0">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video">
                  <video
                    src={`/api/hero-video?url=${encodeURIComponent(s.heroVideoUrl)}`}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-gray-50 py-14 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2
            className="text-3xl font-extrabold uppercase text-gray-900 mb-2"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            What&apos;s Included
          </h2>
          <p className="text-gray-500 mb-8">Everything you need. Nothing you don&apos;t.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "50-tonne hydraulic log splitter (full tank of fuel)",
              "Safety glasses and work gloves",
              "Quick-start guide + operation manual",
              "Tow-ready trailer connection (if applicable)",
              "Pickup &amp; return condition checklist via your phone",
              "Automated reminders and return instructions",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
                <span
                  className="text-sm text-gray-700 font-medium"
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Machine Gallery */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2
            className="text-3xl font-extrabold uppercase text-gray-900 mb-2"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            The Machine
          </h2>
          <p className="text-gray-500 mb-8">Bayer 50-tonne petrol log splitter — horizontal &amp; vertical operation.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="col-span-2 md:col-span-2 row-span-2 relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image src="/images/splitter/50 Tonne Log Splitter 1.jpeg" alt="Bayer 50-tonne log splitter - side angle" fill className="object-contain p-4" />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image src="/images/splitter/50 Tonne Log Splitter 2.jpeg" alt="Log splitter in vertical position" fill className="object-contain p-4" />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image src="/images/splitter/50 Tonne Log Splitter 3.jpeg" alt="Log splitter front view" fill className="object-contain p-4" />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image src="/images/splitter/50 Tonne Log Splitter 4.jpeg" alt="Log splitter rear angle" fill className="object-contain p-4" />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image src="/images/splitter/50 Tonne Log Splitter 5.jpeg" alt="Log splitter side profile" fill className="object-contain p-4" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2
            className="text-3xl font-extrabold uppercase text-gray-900 mb-2 text-center"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-10">Four steps. Completely online.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Calendar size={28} className="text-green-600" />,
                step: "01",
                title: "Book Online",
                desc: "Pick your dates on the live calendar. Price calculates instantly. Upload your ID and sign the hire agreement.",
              },
              {
                icon: <CreditCard size={28} className="text-green-600" />,
                step: "02",
                title: "Pay Securely",
                desc: `Pay your hire fee via Stripe. A ${fmt(s.bondAmount)} bond is held on your card — not charged — as a security deposit.`,
              },
              {
                icon: <Truck size={28} className="text-green-600" />,
                step: "03",
                title: "Pick Up &amp; Split",
                desc: `Collect from ${s.pickupSuburb} (or we deliver). Complete the pickup checklist on your phone, then get splitting.`,
              },
              {
                icon: <CheckCircle size={28} className="text-green-600" />,
                step: "04",
                title: "Return &amp; Done",
                desc: "Return the machine, complete the return checklist, and we&apos;ll release your bond. Simple.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
                  <div className="text-5xl font-black text-gray-100 leading-none mb-3"
                    style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
                    {item.step}
                  </div>
                  <div className="mb-3">{item.icon}</div>
                  <h3
                    className="font-bold text-gray-900 mb-2 text-lg"
                    style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  />
                  <p className="text-sm text-gray-500 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.desc }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2
            className="text-3xl font-extrabold uppercase text-gray-900 mb-2"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Pricing
          </h2>
          <p className="text-gray-500 mb-8">All prices include GST. Bond is a hold only — not charged.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Daily Rate", price: fmt(s.dailyRate), sub: "per day", highlight: false },
              { label: "Weekend Rate", price: fmt(s.weekendRate), sub: "Fri – Sun (3 days)", highlight: true },
              { label: "Weekly Rate", price: fmt(s.weeklyRate), sub: "7 days", highlight: false },
            ].map((p) => (
              <div
                key={p.label}
                className={`rounded-2xl p-6 border ${
                  p.highlight
                    ? "bg-green-700 border-green-700 text-white shadow-lg"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${p.highlight ? "text-green-200" : "text-gray-500"}`}>
                  {p.label}
                </div>
                <div
                  className={`text-5xl font-black mb-1 ${p.highlight ? "text-white" : "text-gray-900"}`}
                  style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                >
                  {p.price}
                </div>
                <div className={`text-sm ${p.highlight ? "text-green-200" : "text-gray-500"}`}>
                  {p.sub}
                </div>
                {p.highlight && (
                  <div className="mt-3 text-xs bg-green-600 rounded-lg px-2 py-1 inline-block text-green-100">
                    Best value
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg">
            <h3 className="font-bold text-gray-900 mb-3">Additional Fees</h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 text-gray-600">Security Bond (held, not charged)</td>
                  <td className="py-2 text-right font-semibold text-gray-900">{fmt(s.bondAmount)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Delivery (within {s.deliveryRadius} km of {s.pickupSuburb})</td>
                  <td className="py-2 text-right font-semibold text-gray-900">{fmt(s.deliveryFee)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Late return (per day)</td>
                  <td className="py-2 text-right font-semibold text-gray-900">Daily rate</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Fuel levy (if returned less than full)</td>
                  <td className="py-2 text-right font-semibold text-gray-900">$25+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Machine Specs */}
      <section id="machine" className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl font-extrabold uppercase text-gray-900 mb-2"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                The Machine
              </h2>
              <p className="text-gray-500 mb-6">
                A serious 50-tonne petrol-powered log splitter. Handles hardwood,
                softwood, knotty rounds — whatever you throw at it.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SPECS.map((spec) => (
                  <div key={spec.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="text-xs text-gray-500 font-medium mb-0.5">{spec.label}</div>
                    <div className="font-bold text-gray-900">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl aspect-[4/3] flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-400 p-8">
                <Zap size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Machine photo coming soon</p>
                <p className="text-xs mt-1">Add your own photo to <code className="bg-gray-200 px-1 rounded">public/machine.jpg</code></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pickup / Delivery info */}
      <section className="bg-green-800 text-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h2
                className="text-2xl font-extrabold uppercase mb-3"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                Self-Collection
              </h2>
              <p className="text-green-200 text-sm leading-relaxed mb-4">
                Pick up from {s.pickupSuburb}, Gold Coast. Full address provided 24 hours before your hire
                start date via confirmation email. Available 7 days — no staff required for pickup
                or return.
              </p>
              <ul className="space-y-2 text-sm text-green-100">
                <li className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-green-400 mt-0.5 shrink-0" />
                  <span>Bring your booking confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-green-400 mt-0.5 shrink-0" />
                  <span>Bring your driver&apos;s licence</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-green-400 mt-0.5 shrink-0" />
                  <span>Vehicle capable of towing or transporting</span>
                </li>
              </ul>
            </div>
            <div>
              <h2
                className="text-2xl font-extrabold uppercase mb-3"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                Delivery
              </h2>
              <p className="text-green-200 text-sm leading-relaxed mb-4">
                We deliver within {s.deliveryRadius} km of {s.pickupSuburb} for a flat {fmt(s.deliveryFee)} fee. Select delivery during
                booking, enter your address, and we&apos;ll confirm your delivery window by email.
                Servicing: Burleigh, Robina, Nerang, Tallebudgera, Springbrook, Bonogin, and more.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-semibold">
                <Truck size={16} className="text-green-300" />
                {fmt(s.deliveryFee)} flat delivery fee (inc. GST)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Placeholder */}
      <section className="py-14 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2
            className="text-3xl font-extrabold uppercase text-gray-900 mb-2"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            What Customers Say
          </h2>
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-sm font-semibold text-gray-700 ml-1">5.0 on Google</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: "Dave M.",
                suburb: "Burleigh Heads",
                review: "Super easy to book online. Machine was in great condition and did the job perfectly. Bond was released same day we returned it. Will definitely use again.",
              },
              {
                name: "Sarah K.",
                suburb: "Robina",
                review: "So convenient — booked online at 10pm and picked up the next morning. Exactly what I needed for a full weekend of wood splitting. Highly recommend.",
              },
              {
                name: "Phil T.",
                suburb: "Nerang",
                review: "Great machine, very fair price. The whole process is automated which I loved — no chasing anyone up. Everything just worked.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={13} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic mb-4">&ldquo;{r.review}&rdquo;</p>
                <div className="text-sm font-semibold text-gray-900">{r.name}</div>
                <div className="text-xs text-gray-400">{r.suburb}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-10 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-green-600" />
              <span>Fully insured equipment</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-green-600" />
              <span>Secure payments via Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              <span>ABN registered business</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={18} className="text-green-600" />
              <span>5-star rated on Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2
            className="text-3xl font-extrabold uppercase text-gray-900 mb-8"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Frequently Asked Questions
          </h2>
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-green-700 text-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-3xl sm:text-4xl font-extrabold uppercase mb-3"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Ready to split some wood?
          </h2>
          <p className="text-green-200 mb-6 text-lg">Check availability and book in under 5 minutes.</p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors shadow-lg"
          >
            Book Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
