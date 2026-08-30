import type { Metadata } from "next";
import { BookOpen, ShieldAlert, Wrench, AlertTriangle, Clock, Download, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Safety Guide & Operating Instructions | Split It Gold Coast",
  description:
    "Manufacturer's safety instructions and operating guide for the Split It Gold Coast BS50TON 15HP 50-Tonne hydraulic log splitter. Read before use.",
};

export default function GuidePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="bg-[#245824] rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={26} className="opacity-80 shrink-0" />
            <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
              Safety Guide &amp; Operating Instructions
            </h1>
          </div>
          <p className="text-green-200 text-sm mb-1">BS50TON — 15HP 50-Tonne Petrol Log Splitter</p>
          <p className="text-green-100 text-sm leading-relaxed mt-3">
            Read this guide in full before using the equipment. As a condition of hire you must confirm
            you have reviewed these instructions. Questions? Call <strong>0414 601 836</strong>.
          </p>
        </div>

        {/* Download the full manual */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 flex items-center gap-5">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <Download size={22} className="text-[#245824]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm mb-0.5">Full Manufacturer&apos;s Manual</p>
            <p className="text-xs text-gray-500">BS50TON Instruction &amp; Assembly Manual (PDF, 7.4 MB)</p>
          </div>
          <a
            href="/bs50ton-user-manual.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#245824] hover:bg-green-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            <Download size={15} />
            Download
          </a>
        </div>

        {/* Quick-reference specs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-[#245824]" />
            <h2 className="text-base font-bold text-gray-900">Quick Reference — Fluids &amp; Limits</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ["Fuel", "Unleaded 92# petrol"],
              ["Engine oil", "SAE 10W-30"],
              ["Hydraulic oil", "10wt AW32 / ISO 32 — 20 L"],
              ["Max log length", "24 inch (610 mm)"],
              ["Max log diameter", "22 inch (560 mm)"],
              ["Max splitting force", "50 tonnes"],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety requirements */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={20} className="text-red-600" />
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
              Safety Requirements
            </h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Failure to follow these rules may result in serious injury or death to the operator or bystanders.
          </p>

          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-800 mb-2">Personal protective equipment (required)</p>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {[
                "Eye protection — safety glasses or goggles at all times (log pieces can fly)",
                "Steel-capped boots — falling logs can crush feet",
                "Snug-fitting gloves — no loose cuffs or dangling strings",
                "Hearing protection — ear plugs recommended",
                "No loose or dangling clothing — can become entangled in moving parts",
              ].map((item) => (
                <li key={item} className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✓</span>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-800 mb-2">General rules</p>
            <ul className="space-y-2">
              {[
                { bold: "Outdoors only.", rest: "NEVER operate inside homes, garages, sheds, or semi-enclosed spaces — the engine produces carbon monoxide, a poisonous gas that can kill you." },
                { bold: "Age.", rest: "NEVER allow anyone under 16 years old to operate the machine. Anyone 16–17 must be supervised by a trained adult." },
                { bold: "Daylight only.", rest: "Only use the log splitter in daylight." },
                { bold: "Never under the influence.", rest: "NEVER operate, or let anyone else operate, while under the influence of alcohol, drugs, or medication." },
                { bold: "Never unattended.", rest: "NEVER leave the machine running unattended." },
                { bold: "No modifications.", rest: "NEVER modify or alter the log splitter in any way." },
                { bold: "No smoking.", rest: "NEVER smoke near the machine and never operate near sources of sparks or flames." },
                { bold: "One log at a time.", rest: "Never attempt to split more than one log at a time — pieces can be thrown from the machine." },
                { bold: "Split along grain.", rest: "The splitter is designed only for splitting lengthwise with the grain. Never use it across the grain." },
                { bold: "Engine off for maintenance.", rest: "Turn the engine off and relieve hydraulic pressure before cleaning, adjusting, or repairing the machine." },
                { bold: "Hydraulic leaks.", rest: "NEVER check for leaks with your hand. High-pressure hydraulic fluid escaping through a pinhole can penetrate skin causing serious injury. Use cardboard to check. If injected by fluid, see a doctor immediately." },
              ].map(({ bold, rest }) => (
                <li key={bold} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">!</span>
                  <span><strong>{bold}</strong> {rest}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
            <p className="font-semibold mb-1">Carbon monoxide warning</p>
            <p className="leading-relaxed">If you start to feel sick, dizzy, or weak while operating the machine, shut off the engine immediately and get to fresh air. You may have carbon monoxide poisoning — see a doctor right away.</p>
          </div>
        </div>

        {/* Operating procedure */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Wrench size={20} className="text-[#245824]" />
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
              Operating Procedure
            </h2>
          </div>
          <div className="space-y-5">
            {[
              {
                step: "1",
                title: "Pre-start inspection",
                body: "Check engine oil (SAE 10W-30), hydraulic oil level (10wt AW32, 20L capacity), and fuel (Unleaded 92#). Visually inspect all hydraulic hoses and fittings for cracks, kinks, or oily residue — do NOT operate if you see any leaks. Check all nuts and bolts are tight. Clear debris from the beam, wedge, and endplate.",
              },
              {
                step: "2",
                title: "Select your work site",
                body: "Set up on a dry, level surface outdoors. Keep at least 7 feet between the exhaust and any combustibles. Have a fire extinguisher available in dry conditions. Engage the parking brake before operating.",
              },
              {
                step: "3",
                title: "Set horizontal or vertical position",
                body: "BEFORE starting the engine, choose your splitting position. Horizontal is for lighter logs that can be easily loaded onto the beam. Vertical is for heavy rounds that are difficult to lift. To switch: remove the hitch pin, rotate the beam, re-lock with the hitch pin. WARNING: Never change position with the engine running — you may contact the hot muffler.",
              },
              {
                step: "4",
                title: "Start the engine",
                body: "Set the choke for a cold start. Pull the recoil starter firmly. Allow 2–3 minutes warm-up at idle before splitting. Pull the rope several times before the first start to circulate hydraulic fluid through the system.",
              },
              {
                step: "5",
                title: "Load the log",
                body: "Place the log centrally on the beam with a cut end against the endplate — lengthwise with the grain. Maximum: 24 inch (610mm) long, 22 inch diameter for the 50-ton machine. Hold the bark side of the log when loading — NEVER the ends. NEVER place any body part between the log and any part of the machine. Stand in the designated operator position (see diagram in full manual).",
              },
              {
                step: "6",
                title: "Split the log",
                body: "Remove both hands from the log, then push the Split Control Lever forward toward the endplate to advance the wedge. Release the lever to stop at any point. If a second person is helping load, NEVER actuate the lever until they are at least 10 feet clear. NEVER allow anyone to hold the log while the lever is actuated.",
              },
              {
                step: "7",
                title: "Return the wedge",
                body: "Move the Split Control Lever away from the endplate to retract. The wedge will return automatically and stop. WARNING: Stay clear while the wedge returns — it is still powerful on the return stroke.",
              },
              {
                step: "8",
                title: "Stuck log procedure",
                body: "If a log gets stuck: STOP and turn the engine OFF. Do NOT use hydraulic force to free it. Use a pry bar or sledgehammer to manually remove the log. Do not re-split that log — use an axe or chainsaw instead.",
              },
              {
                step: "9",
                title: "Shutdown and clean",
                body: "Return the beam to horizontal position. Turn off the engine and allow it to cool. Remove split wood from the area. Clean bark, sawdust, and debris from the beam and wedge.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex gap-4">
                <div className="shrink-0 w-7 h-7 rounded-full bg-[#245824] text-white text-sm font-bold flex items-center justify-center">
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return checklist */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-[#245824]" />
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
              Before You Return the Machine
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            {[
              "Retract the wedge fully (protects the rod from corrosion)",
              "Wipe the beam and wedge with a lightly oiled rag",
              "Clean all bark, sawdust, and debris from the machine",
              "Fill the fuel tank with Unleaded 92# petrol (minimum $25 fuel levy if returned low)",
              "Return by 5:00 PM on your agreed return date to avoid late fees",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[#245824] font-bold shrink-0">✓</span>{item}
              </li>
            ))}
          </ul>
        </div>

        {/* Troubleshooting quick ref */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-600" />
            <h2 className="text-base font-bold text-gray-900">Common Problems</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-700">Problem</th>
                  <th className="text-left py-2 font-semibold text-gray-700">Likely cause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["Cylinder won't move", "Check hydraulic oil level — top up if low"],
                  ["Slow wedge speed", "Check oil level or pump inlet hose for blockage"],
                  ["Wood won't split / very slow", "Check oil level; log may exceed machine capacity"],
                  ["Engine bogs down during splitting", "High control valve setting — call us"],
                  ["Engine stalls under low load", "Blocked hydraulic lines — call us"],
                ].map(([problem, cause]) => (
                  <tr key={problem}>
                    <td className="py-2 pr-4 text-gray-700">{problem}</td>
                    <td className="py-2 text-gray-600">{cause}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">For anything beyond these, call <strong>0414 601 836</strong> before attempting repairs.</p>
        </div>

        {/* Contact */}
        <div className="text-center text-sm text-gray-500 pb-4">
          <p>
            Questions? Call <strong className="text-gray-700">0414 601 836</strong> or email{" "}
            <a href="mailto:brett@splitithire.com.au" className="text-[#245824] underline">
              brett@splitithire.com.au
            </a>
          </p>
          <p className="mt-1 text-xs">
            <a href="/bs50ton-user-manual.pdf" target="_blank" rel="noopener noreferrer" className="text-[#245824] underline">
              Download full BS50TON manufacturer&apos;s manual (PDF)
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
