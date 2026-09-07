// app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TOOLS, CATEGORIES } from '@/config/tools';

const NAV_TAGS = ['ALL', 'JSON', 'HTML', 'CSS', 'JS', 'XML', 'SQL', 'OPML', 'CSV', 'IP'];

// Dedicated inline SVGs/Badges for 100% reliable icon rendering
function DynamicToolIcon({ slug }: { slug: string }) {
  const lowerSlug = slug.toLowerCase();

  if (lowerSlug.includes('json')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0">
        {'{ }'}
      </div>
    );
  }
  if (lowerSlug.includes('css')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-blue-500 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0">
        CSS3
      </div>
    );
  }
  if (lowerSlug.includes('js') || lowerSlug.includes('javascript')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-yellow-400 text-black font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
        JS
      </div>
    );
  }
  if (lowerSlug.includes('html')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
        HTML5
      </div>
    );
  }
  if (lowerSlug.includes('xml')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-teal-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-sm shrink-0">
        &lt;XML&gt;
      </div>
    );
  }
  if (lowerSlug.includes('sql')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-sky-700 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
        SQL
      </div>
    );
  }
  if (lowerSlug.includes('opml')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-sm shrink-0">
        OPML
      </div>
    );
  }
  if (lowerSlug.includes('csv')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-green-700 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
        CSV
      </div>
    );
  }
  if (lowerSlug.includes('base64')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-purple-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-sm shrink-0">
        B64
      </div>
    );
  }
  if (lowerSlug.includes('sip')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
        SIP
      </div>
    );
  }
  if (lowerSlug.includes('png') || lowerSlug.includes('image')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
        IMG
      </div>
    );
  }
  if (lowerSlug.includes('ip')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-cyan-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
        IP
      </div>
    );
  }
  if (lowerSlug.includes('dns')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-violet-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
        DNS
      </div>
    );
  }
  if (lowerSlug.includes('domain')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-slate-700 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
        DOM
      </div>
    );
  }
  if (lowerSlug.includes('ssl')) {
    return (
      <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
        🔒 SSL
      </div>
    );
  }

  return (
    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
      {slug.substring(0, 3).toUpperCase()}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] text-gray-800">
      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        
        {/* SEO HERO BANNER SECTION */}
        <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
            Free Online Developer Tools, Code Beautifiers & Data Converters
          </h1>
          
          <p className="text-gray-600 text-base leading-relaxed">
            Welcome to <strong>BeautifyConverterKit</strong>, your all-in-one suite of privacy-first, ultra-fast web tools designed for software engineers, web developers, data analysts, and IT professionals. Whether you need to format raw JSON strings, minify production CSS/JS scripts, validate domain SSL certificates, or convert CSV data into clean HTML tables, our portal provides instant client-side execution directly inside your browser.
          </p>

          <div className="grid md:grid-cols-3 gap-6 pt-2 border-t border-gray-100">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                ⚡ 100% Client-Side Speed
              </h3>
              <p className="text-xs text-gray-500">
                All algorithms execute locally via JavaScript. Experience zero latency, instant processing, and high performance without backend delays.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                🔒 Bank-Grade Privacy & Security
              </h3>
              <p className="text-xs text-gray-500">
                Your code, API tokens, database queries, and files never leave your device. We do not store, log, or transmit your input data to external servers.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                🛠️ Multi-Format Conversion Suite
              </h3>
              <p className="text-xs text-gray-500">
                Effortlessly process formats including JSON, XML, OPML, SQL, CSV, HTML, CSS, JavaScript, Base64 strings, and Network CIDR subnetting.
              </p>
            </div>
          </div>
        </section>

        {/* CATEGORY TOOL GROUPS */}
        {CATEGORIES.map((category) => {
          const categoryTools = TOOLS.filter((tool) => tool.category === category);
          if (categoryTools.length === 0) return null;

          return (
            <section
              key={category}
              id={category.toLowerCase().replace(/\s+/g, '-')}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-blue-600">📑</span> {category} tools
                </h2>
                <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full">
                  {categoryTools.length} Tools
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTools.map((tool) => {
                  const matchedTag = NAV_TAGS.find(
                    (tag) =>
                      tag !== 'ALL' &&
                      (tool.name.toUpperCase().includes(tag) ||
                        tool.slug.toUpperCase().includes(tag))
                  );
                  const tagId = matchedTag ? `tag-${matchedTag.toLowerCase()}` : undefined;

                  return (
                    <Link
                      key={tool.id}
                      id={tagId}
                      href={`/${tool.slug}`}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-500 transition group"
                    >
                      <DynamicToolIcon slug={tool.slug} />

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 truncate transition">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-snug">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* SEO DEEP GUIDE & ABOUT SECTION */}
        <article className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-gray-700 leading-relaxed text-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Why Choose BeautifyConverterKit for Your Daily Workflow?
          </h2>

          <p>
            Modern web development and network operations demand fast, accessible, and reliable code utilities. Developers often spend hours dealing with obfuscated scripts, unformatted minified JSON responses, or complex network subnet calculations. <strong>BeautifyConverterKit</strong> unifies essential utilities under a clean, advertising-light, and distraction-free workspace.
          </p>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Code Beautification & Minification</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Clean markup improves maintainability and debugging speed. Our HTML, CSS, JavaScript, XML, SQL, and OPML beautifiers apply proper DOM indentation and syntax structuring. Conversely, when preparing code for production deployments, our minifiers compress files by stripping comments, multi-character whitespace, and redundant line breaks to reduce HTTP payload sizes and speed up site load times.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Network, IP & Domain Management</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Sysadmins and DevOps engineers can inspect DNS records (A, AAAA, MX, TXT, NS), check SSL/TLS certificate validity periods, calculate CIDR subnet ranges, and verify domain WHOIS registration dates instantly. Everything runs smoothly without requiring command-line terminal access.
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}