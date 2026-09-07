import { Metadata } from 'next';
import Link from 'next/link';
import { TOOLS, CATEGORIES } from '@/config/tools';

export const metadata: Metadata = {
  title: 'BeautifyConverterKit - Free Online Code Beautifiers, Minifiers & Converters',
  description:
    'Free online developer utility portal. Beautify, minify, convert JSON, XML, CSV, HTML, CSS, JavaScript, and image files instantly in your browser.',
  keywords: [
    'code beautifier',
    'css minifier',
    'json formatter',
    'csv to json converter',
    'online developer tools',
    'base64 encoder',
  ],
  alternates: {
    canonical: 'https://beautifyconverterkit.com',
  },
  openGraph: {
    title: 'BeautifyConverterKit - Free Online Code Beautifiers & Converters',
    description: 'Fast, free, and secure online code formatting and data conversion tools for developers.',
    url: 'https://beautifyconverterkit.com',
    siteName: 'BeautifyConverterKit',
    type: 'website',
  },
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BeautifyConverterKit',
    url: 'https://beautifyconverterkit.com',
    description: 'Free online developer utility portal for code beautification, minification, and conversion.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-50 text-gray-800">
        {/* HERO SECTION */}
        <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Free Online Code Beautifiers, Minifiers & Converters
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Fast, secure, and client-side developer utilities. Format JSON, compress CSS, convert CSV files, and more without uploading data to external servers.
            </p>
          </div>
        </header>

        {/* CATEGORIES & AUTO-LISTED TOOLS */}
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
          {CATEGORIES.map((category) => {
            const categoryTools = TOOLS.filter((tool) => tool.category === category);
            if (categoryTools.length === 0) return null;

            return (
              <section key={category} className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-gray-200 pb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {categoryTools.length} Tools
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool) => (
                    <article key={tool.id}>
                      <Link
                        href={`/${tool.slug}`}
                        className="group block p-6 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-500 transition-all duration-200 h-full flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {tool.description}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                          Open Tool
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          {/* SEO INFORMATIONAL CONTENT */}
          <article className="mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Why Use BeautifyConverterKit for Your Development Needs?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              BeautifyConverterKit provides an all-in-one suite of web-based tools designed specifically for software developers, web designers, and data analysts. Whether you need to quickly format minified JSON, compress large CSS files for faster website loading, or convert CSV data into structured XML or JSON, our browser-based tools make the process seamless.
            </p>

            <div className="grid md:grid-cols-3 gap-6 pt-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">100% Client-Side Privacy</h3>
                <p className="text-sm text-gray-600">
                  Your code and data are processed directly inside your browser. We never send your code to external servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Blazing Fast Performance</h3>
                <p className="text-sm text-gray-600">
                  Built using modern web standards, execution happens instantly without server delays.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Free & Unlimited</h3>
                <p className="text-sm text-gray-600">
                  Access every single beautifier, converter, and validator completely free without usage caps.
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}