import type { Metadata } from "next";
import { BookOpen, ShieldAlert, Wrench, AlertTriangle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Safety Guide & Operating Instructions | Split It Gold Coast",
  description:
    "Manufacturer's safety instructions and operating guide for the Split It Gold Coast hydraulic log splitter. Read before use.",
};

const safetyPoints = [
  "Always wear appropriate personal protective equipment (PPE) — safety glasses, steel-capped boots, and gloves — before operating the machine.",
  "Never place hands or any body part within the splitting zone while the machine is in operation.",
  "Keep bystanders, especially children and pets, well clear of the working area at all times.",
  "Inspect the machine before each use. Do not operate if you notice hydraulic fluid leaks, damaged hoses, or any structural defects.",
  "Only operate on stable, level ground. Never use on slopes or uneven surfaces.",
  "Ensure the log is correctly positioned and stable before activating the ram.",
  "Do not attempt to split logs larger than the rated capacity of the machine.",
  "Never leave the machine unattended while the engine is running.",
  "Allow the engine to cool before refuelling. Use regular unleaded petrol only.",
  "Disconnect the spark plug before performing any maintenance or clearing a jam.",
];

const operatingSteps = [
  {
    step: "1",
    title: "Pre-start checks",
    body: "Check engine oil level, hydraulic fluid level, and fuel. Inspect hoses and fittings for leaks. Confirm the splitting wedge moves freely.",
  },
  {
    step: "2",
    title: "Start the engine",
    body: "Set the choke (cold start), pull the recoil starter firmly. Once running, allow 2–3 minutes warm-up before splitting.",
  },
  {
    step: "3",
    title: "Select your operating mode",
    body: "The machine operates in horizontal or vertical mode. Horizontal is recommended for most logs. Vertical mode is for large, heavy rounds — engage the leg stand before switching.",
  },
  {
    step: "4",
    title: "Position the log",
    body: "Place the log centrally on the beam, flat end against the fixed plate. Stand to the side — never directly behind the ram.",
  },
  {
    step: "5",
    title: "Activate the ram",
    body: "Push and hold the control lever forward to advance the ram. Release to stop at any point. The ram will retract automatically when the lever is released.",
  },
  {
    step: "6",
    title: "Clear split wood",
    body: "Wait for the ram to fully retract before removing split pieces. Never reach into the splitting zone during operation.",
  },
  {
    step: "7",
    title: "Shutdown and storage",
    body: "Return the ram to the fully retracted position. Turn off the engine and allow it to cool. Clean debris from the machine before returning it.",
  },
];

export default function GuidePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="bg-[#245824] rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={28} className="opacity-80" />
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
              Safety Guide &amp; Operating Instructions
            </h1>
          </div>
          <p className="text-green-200 text-sm leading-relaxed">
            Split It Gold Coast — Hydraulic Log Splitter Hire
          </p>
          <p className="text-green-100 text-sm mt-3 leading-relaxed">
            Please read this guide in full before collecting or using the equipment. As a condition
            of hire you are required to confirm you have reviewed these instructions. If you have
            any questions, call us on <strong>0414 601 836</strong> before your hire begins.
          </p>
        </div>

        {/* Placeholder notice */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 mb-6 flex gap-3">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">
              Full manufacturer&apos;s manual coming soon
            </p>
            <p className="text-sm text-amber-700 leading-relaxed">
              The complete manufacturer&apos;s user manual will be available here shortly. In the
              meantime, the safety requirements and operating steps below cover everything you need
              to use the machine safely. If you have questions before your hire, please call{" "}
              <strong>0414 601 836</strong>.
            </p>
          </div>
        </div>

        {/* Safety requirements */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <ShieldAlert size={20} className="text-red-600" />
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
              Safety Requirements
            </h2>
          </div>
          <ul className="space-y-3">
            {safetyPoints.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Operating steps */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Wrench size={20} className="text-[#245824]" />
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
              Operating Procedures
            </h2>
          </div>
          <div className="space-y-4">
            {operatingSteps.map(({ step, title, body }) => (
              <div key={step} className="flex gap-4">
                <div className="shrink-0 w-7 h-7 rounded-full bg-[#245824] text-white text-sm font-bold flex items-center justify-center">
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">{title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return reminders */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-[#245824]" />
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
              Before You Return the Machine
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2"><span className="text-[#245824] font-bold">✓</span> Clean all bark, sawdust, and debris from the machine and beam</li>
            <li className="flex gap-2"><span className="text-[#245824] font-bold">✓</span> Fill the fuel tank with regular unleaded petrol (minimum fuel levy of $25 applies if returned low)</li>
            <li className="flex gap-2"><span className="text-[#245824] font-bold">✓</span> Return the ram to the fully retracted position</li>
            <li className="flex gap-2"><span className="text-[#245824] font-bold">✓</span> Return by 5:00 PM on your agreed return date to avoid late fees</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-center text-sm text-gray-500 pb-4">
          <p>Questions? Call <strong className="text-gray-700">0414 601 836</strong> or email{" "}
            <a href="mailto:brett@splitithire.com.au" className="text-[#245824] underline">brett@splitithire.com.au</a>
          </p>
        </div>

      </div>
    </div>
  );
}
