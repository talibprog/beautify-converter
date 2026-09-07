'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const NAV_TAGS = ['ALL', 'JSON', 'HTML', 'CSS', 'JS', 'XML', 'SQL', 'OPML', 'CSV', 'IP'];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link href="/" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Beautify<span className="text-blue-600">ConverterKit</span>
        </Link>

        {/* DESKTOP MENU (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-2 overflow-x-auto text-xs font-bold text-gray-600">
          {NAV_TAGS.map((tag) => (
            <Link
              key={tag}
              href={tag === 'ALL' ? '/' : `/#tag-${tag.toLowerCase()}`}
              className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 transition"
            >
              {tag}
            </Link>
          ))}
        </nav>

        {/* MOBILE HAMBURGER BUTTON (Visible only on Mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-slate-900 hover:bg-gray-100 focus:outline-none transition"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            /* Close Icon (X) */
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* Hamburger Icon (☰) */
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Quick Categories
          </p>
          <div className="grid grid-cols-3 gap-2">
            {NAV_TAGS.map((tag) => (
              <Link
                key={tag}
                href={tag === 'ALL' ? '/' : `/#tag-${tag.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 font-bold text-xs transition border border-gray-100"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}