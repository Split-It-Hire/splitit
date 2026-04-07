"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import SignatureCanvas from "./SignatureCanvas";
import { TERMS_CONTENT } from "@/lib/terms-content";

interface Props {
  onAccept: (data: TermsAcceptance) => void;
  onBack: () => void;
}

interface TermsAcceptance {
  agreed: boolean;
  signatureDataUrl: string;
  isAdult: boolean;
  acceptsResponsibility: boolean;
}

export default function TermsStep({ onAccept, onBack }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [acceptsResponsibility, setAcceptsResponsibility] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!agreed) {
      setError("Please confirm you have read and agree to the Terms of Hire.");
      return;
    }
    if (!isAdult) {
      setError("You must confirm you are 18 years or older.");
      return;
    }
    if (!acceptsResponsibility) {
      setError("Please confirm you accept responsibility for the equipment.");
      return;
    }
    if (!signature) {
      setError("Please add your digital signature.");
      return;
    }

    setError(null);
    onAccept({ agreed, signatureDataUrl: signature, isAdult, acceptsResponsibility });
  }

  return (
    <div>
      {/* Scrollable terms */}
      <div className="border border-gray-200 rounded-xl h-64 overflow-y-auto p-4 text-xs text-gray-600 leading-relaxed bg-gray-50 mb-5">
        <div dangerouslySetInnerHTML={{ __html: TERMS_CONTENT }} />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 mb-5">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">
            I have read and agree to the <strong>Terms of Hire</strong> displayed above.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={isAdult}
            onChange={(e) => setIsAdult(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">
            I confirm I am <strong>18 years or older</strong>.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={acceptsResponsibility}
            onChange={(e) => setAcceptsResponsibility(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">
            I understand I am responsible for the equipment during the hire period and will return
            it in the same condition.
          </span>
        </label>
      </div>

      {/* Signature */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Digital Signature <span className="text-red-500">*</span>
        </label>
        <SignatureCanvas onChange={setSignature} />
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          Continue to Payment
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
