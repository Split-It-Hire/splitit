import type { Metadata } from "next";
import { TERMS_CONTENT } from "@/lib/terms-content";

export const metadata: Metadata = {
  title: "Terms of Hire",
  description: "Full Terms of Hire for Split It Gold Coast hydraulic log splitter hire. Read before booking.",
};

export default function TermsPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12">
          <div
            className="prose prose-sm prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: TERMS_CONTENT }}
          />
        </div>
      </div>
    </div>
  );
}
