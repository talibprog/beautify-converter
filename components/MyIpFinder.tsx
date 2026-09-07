'use client';

import React, { useState, useEffect } from 'react';

interface GeoDetails {
  city?: string;
  region?: string;
  country_name?: string;
  org?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
}

export default function MyIpFinder() {
  const [ipv4, setIpv4] = useState<string | null>(null);
  const [ipv6, setIpv6] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<GeoDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    fetchAllDetails();
  }, []);

  const fetchAllDetails = async () => {
    setLoading(true);

    // Fetch IPv4 specifically
    try {
      const resV4 = await fetch('https://api4.ipify.org?format=json');
      const dataV4 = await resV4.json();
      setIpv4(dataV4.ip);
    } catch {
      setIpv4('Not Available / IPv4 Disabled');
    }

    // Fetch IPv6 specifically
    try {
      const resV6 = await fetch('https://api6.ipify.org?format=json');
      const dataV6 = await resV6.json();
      setIpv6(dataV6.ip);
    } catch {
      setIpv6('Not Supported / Disabled');
    }

    // Fetch Geo & Network metadata
    try {
      const resGeo = await fetch('https://ipapi.co/json/');
      const dataGeo = await resGeo.json();
      setGeoData(dataGeo);
    } catch (error) {
      console.error('Error fetching Geo Data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    if (!text || text.includes('Not')) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Your Public IP Details
      </h2>

      {/* IP Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* IPv4 Card */}
        <div className="p-4 bg-blue-50 dark:bg-gray-900 rounded-lg border border-blue-100 dark:border-blue-900 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              IPv4 Address
            </span>
            <div className="mt-2 text-xl font-mono font-bold text-gray-900 dark:text-white break-all">
              {loading ? 'Detecting...' : ipv4 || 'Not Available'}
            </div>
          </div>
          {ipv4 && !ipv4.includes('Not') && (
            <button
              onClick={() => copyToClipboard(ipv4, 'ipv4')}
              className="mt-4 w-full py-2 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition"
            >
              {copiedType === 'ipv4' ? 'Copied IPv4!' : 'Copy IPv4'}
            </button>
          )}
        </div>

        {/* IPv6 Card */}
        <div className="p-4 bg-purple-50 dark:bg-gray-900 rounded-lg border border-purple-100 dark:border-purple-900 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              IPv6 Address
            </span>
            <div className="mt-2 text-base font-mono font-bold text-gray-900 dark:text-white break-all">
              {loading ? 'Detecting...' : ipv6 || 'Not Supported'}
            </div>
          </div>
          {ipv6 && !ipv6.includes('Not') && (
            <button
              onClick={() => copyToClipboard(ipv6, 'ipv6')}
              className="mt-4 w-full py-2 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium rounded transition"
            >
              {copiedType === 'ipv6' ? 'Copied IPv6!' : 'Copy IPv6'}
            </button>
          )}
        </div>
      </div>

      {/* Network & Geo Metadata Grid */}
      {geoData && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Location</span>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {geoData.city ? `${geoData.city}, ${geoData.region}, ${geoData.country_name}` : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">ISP / Network</span>
            <p className="font-medium text-gray-800 dark:text-gray-200">{geoData.org || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Postal Code</span>
            <p className="font-medium text-gray-800 dark:text-gray-200">{geoData.postal || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Coordinates</span>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {geoData.latitude && geoData.longitude ? `${geoData.latitude}, ${geoData.longitude}` : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}