import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-lg font-bold text-white tracking-tight">
              BeautifyConvertKit
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Free online developer utilities for fast, browser-side data conversion and formatting. 100% private and secure.
            </p>
          </div>

          {/* Quick Tools Links */}
          <div>
            <strong className="block text-sm font-semibold text-white mb-3">
              Popular Converters
            </strong>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/xml-to-json-converter" className="hover:text-white transition-colors">
                  XML to JSON Converter
                </Link>
              </li>
              <li>
                <Link href="/xml-to-sql-converter" className="hover:text-white transition-colors">
                  XML to SQL Converter
                </Link>
              </li>
              <li>
                <Link href="/text-to-html-converter" className="hover:text-white transition-colors">
                  Text to HTML Converter
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <strong className="block text-sm font-semibold text-white mb-3">
              Features
            </strong>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>100% Client-Side Processing</li>
              <li>No File Upload Limits</li>
              <li>Zero Data Logging</li>
              <li>Instant Download & Copy</li>
            </ul>
          </div>

          {/* SEO Policy Links */}
          <div>
            <strong className="block text-sm font-semibold text-white mb-3">
              Legal & Policies
            </strong>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BeautifyConvertKit. All rights reserved.</p>
          <p className="text-slate-500">Built for high-performance developer workflows.</p>
        </div>
      </div>
    </footer>
  );
}