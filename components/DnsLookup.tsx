'use client';

import React, { useState } from 'react';

interface DnsRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];

const TYPE_MAP: Record<string, number> = {
  A: 1,
  NS: 2,
  CNAME: 5,
  MX: 15,
  TXT: 16,
  AAAA: 28,
};

export default function DnsLookup() {
  const [domain, setDomain] = useState('');
  const [selectedType, setSelectedType] = useState('A');
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDnsRecords = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError('');
    setRecords([]);

    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    try {
      const typeNum = TYPE_MAP[selectedType] || 1;
      const res = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=${typeNum}`
      );
      const data = await res.json();

      if (data.Answer) {
        setRecords(data.Answer);
      } else {
        setError(`No ${selectedType} records found for ${cleanDomain}`);
      }
    } catch {
      setError('Failed to fetch DNS records. Please check the domain name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto">
      <form onSubmit={fetchDnsRecords} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g. example.com)"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            required
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white font-semibold"
          >
            {RECORD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Lookup DNS'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-center text-sm">
          {error}
        </div>
      )}

      {records.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">TTL</th>
                <th className="p-3 font-semibold">Data / Value</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-900/50"
                >
                  <td className="p-3 font-mono text-xs">{record.name}</td>
                  <td className="p-3 font-mono text-xs">{record.TTL}s</td>
                  <td className="p-3 font-mono text-xs break-all">{record.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}