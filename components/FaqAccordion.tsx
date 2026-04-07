"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Faq {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden bg-white">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-gray-400 transition-transform ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed bg-gray-50">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
