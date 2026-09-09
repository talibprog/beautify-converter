'use client';

import { useState } from 'react';

interface ResultData {
  domain: string;
  ip: string;
  geo?: {
    country?: string;
    city?: string;
    regionName?: string;
    isp?: string;
    org?: string;
    as?: string;
    timezone?: string;
  } | null;
  allRecords?: { name: string; type: number; data: string; ttl: number }[];
}

export default function SiteIpChecker() {
  const [domainInput, setDomainInput] = useState<string>('google.com');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string>('');

  const checkSiteIp = async () => {
    if (!domainInput.trim()) {
      setError('Please enter a domain name.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/site-ip?domain=${encodeURIComponent(domainInput.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch IP details.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the IP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
        {/* Domain Input Form */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">Enter Website Domain or URL:</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkSiteIp()}
              placeholder="e.g. google.com or https://example.com"
              className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={checkSiteIp}
              disabled={loading}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Resolving IP...' : '🔍 Check IP'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="space-y-6 pt-2 border-t border-gray-100">
            {/* Primary IP Card */}
            <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Target Domain
                </span>
                <div className="text-lg font-bold text-gray-900">{result.domain}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Resolved IP Address
                </span>
                <div className="text-xl font-extrabold text-indigo-700 font-mono">
                  {result.ip}
                </div>
              </div>
            </div>

            {/* Geolocation & Server Details Grid */}
            {result.geo && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-800">Hosting Server Details:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 border rounded-lg space-y-1">
                    <span className="text-gray-500">Location:</span>
                    <div className="font-semibold text-gray-800">
                      {result.geo.city ? `${result.geo.city}, ` : ''}{result.geo.country || 'N/A'}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 border rounded-lg space-y-1">
                    <span className="text-gray-500">ISP / Hosting Provider:</span>
                    <div className="font-semibold text-gray-800 truncate">
                      {result.geo.isp || 'N/A'}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 border rounded-lg space-y-1">
                    <span className="text-gray-500">Organization / AS:</span>
                    <div className="font-semibold text-gray-800 truncate">
                      {result.geo.org || result.geo.as || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resolved DNS Records Table */}
            {result.allRecords && result.allRecords.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-800">DNS Resolution Records:</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 border-b">
                        <th className="p-2 font-semibold">Name</th>
                        <th className="p-2 font-semibold">Record Data (IP)</th>
                        <th className="p-2 font-semibold text-right">TTL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.allRecords.map((rec, idx) => (
                        <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="p-2 font-mono text-gray-600">{rec.name}</td>
                          <td className="p-2 font-mono font-bold text-indigo-600">{rec.data}</td>
                          <td className="p-2 text-right font-mono text-gray-500">{rec.ttl}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}