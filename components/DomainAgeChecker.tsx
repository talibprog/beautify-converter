'use client';

import React, { useState } from 'react';

interface DomainDetails {
  domain: string;
  creationDate: string;
  expiryDate: string;
  updatedDate: string;
  age: string;
  registrar: string;
}

export default function DomainAgeChecker() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<DomainDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateAge = (createdStr: string) => {
    const created = new Date(createdStr);
    const now = new Date();
    
    let years = now.getFullYear() - created.getFullYear();
    let months = now.getMonth() - created.getMonth();
    let days = now.getDate() - created.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years} Years, ${months} Months, ${days} Days`;
  };

  const checkDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    const cleanDomain = domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .split('/')[0]
      .trim();

    try {
      const res = await fetch(`https://rdap.org/domain/${cleanDomain}`);
      if (!res.ok) {
        throw new Error('Domain not found or RDAP lookup failed');
      }

      const data = await res.json();
      const events = data.events || [];

      const registrationEvent = events.find(
        (e: { eventAction: string }) => e.eventAction === 'registration'
      );
      const expirationEvent = events.find(
        (e: { eventAction: string }) => e.eventAction === 'expiration'
      );
      const lastChangedEvent = events.find(
        (e: { eventAction: string }) => e.eventAction === 'last changed'
      );

      if (!registrationEvent?.eventDate) {
        throw new Error('Unable to fetch creation date for this domain.');
      }

      const creationDate = registrationEvent.eventDate;
      const expiryDate = expirationEvent?.eventDate || 'N/A';
      const updatedDate = lastChangedEvent?.eventDate || 'N/A';
      const registrar = data.entities?.[0]?.vcardArray?.[1]?.find(
        (item: string[]) => item[0] === 'fn'
      )?.[3] || 'N/A';

      setResult({
        domain: cleanDomain,
        creationDate: new Date(creationDate).toLocaleDateString(),
        expiryDate: expiryDate !== 'N/A' ? new Date(expiryDate).toLocaleDateString() : 'N/A',
        updatedDate: updatedDate !== 'N/A' ? new Date(updatedDate).toLocaleDateString() : 'N/A',
        age: calculateAge(creationDate),
        registrar,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error checking domain details';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto">
      <form onSubmit={checkDomain} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain (e.g. google.com)"
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Age'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-center text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-gray-900 rounded-lg border border-blue-100 dark:border-blue-900 text-center">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Domain Age
            </span>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {result.age}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <span className="text-xs text-gray-500 uppercase font-semibold">Registered On</span>
              <p className="font-medium text-gray-800 dark:text-gray-200">{result.creationDate}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <span className="text-xs text-gray-500 uppercase font-semibold">Expires On</span>
              <p className="font-medium text-gray-800 dark:text-gray-200">{result.expiryDate}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <span className="text-xs text-gray-500 uppercase font-semibold">Last Updated</span>
              <p className="font-medium text-gray-800 dark:text-gray-200">{result.updatedDate}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <span className="text-xs text-gray-500 uppercase font-semibold">Registrar</span>
              <p className="font-medium text-gray-800 dark:text-gray-200">{result.registrar}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}