import Link from "next/link";
import { Phone, Mail, MapPin, Shield } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3
              className="text-white text-2xl font-extrabold uppercase tracking-tight mb-2"
              style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            >
              Split It Gold Coast
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Hydraulic log splitter hire for the Gold Coast and surrounds.
              Book online. No fuss.
            </p>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <Shield size={14} />
              <span>Fully insured equipment</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-gray-500" />
                <a href="tel:+61414601836" className="hover:text-white transition-colors">
                  0414 601 836
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-gray-500" />
                <a
                  href="mailto:brett@splitithire.com.au"
                  className="hover:text-white transition-colors"
                >
                  brett@splitithire.com.au
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={13} className="text-gray-500 mt-0.5" />
                <span>Mudgeeraba, Gold Coast QLD 4213</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/book" className="hover:text-white transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Hire
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Service areas */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <p className="text-xs text-gray-500">
            <strong className="text-gray-400">Service areas:</strong> Mudgeeraba, Robina, Nerang,
            Burleigh Heads, Burleigh Waters, Palm Beach, Currumbin, Tallebudgera, Springbrook,
            Bonogin, Reedy Creek, Varsity Lakes, Merrimac, Worongary, Gilston, Advancetown — and
            delivery available within 30 km.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Split It Gold Coast. ABN: 43 762 412 524</p>
          <p>All prices inc. GST &nbsp;|&nbsp; Pickup suburb: Mudgeeraba QLD</p>
        </div>
      </div>
    </footer>
  );
}
