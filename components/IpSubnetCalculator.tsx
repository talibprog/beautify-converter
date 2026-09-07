'use client';

import React, { useState } from 'react';

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  cidrMask: number;
  totalHosts: number;
  usableHosts: number;
  hostRange: string;
  ipClass: string;
}

export default function IpSubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.1');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [error, setError] = useState('');

  const ipToInt = (ipStr: string) => {
    return ipStr.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  };

  const intToIp = (intVal: number) => {
    return [
      (intVal >>> 24) & 255,
      (intVal >>> 16) & 255,
      (intVal >>> 8) & 255,
      intVal & 255,
    ].join('.');
  };

  const calculateSubnet = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const ipRegex = /^^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ip.trim())) {
      setError('Please enter a valid IPv4 address (e.g. 192.168.1.1).');
      return;
    }

    const ipNum = ipToInt(ip.trim());
    const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const networkNum = (ipNum & maskNum) >>> 0;
    const broadcastNum = (networkNum | ~maskNum) >>> 0;

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;

    let hostRange = 'N/A';
    if (usableHosts > 0) {
      hostRange = `${intToIp(networkNum + 1)} - ${intToIp(broadcastNum - 1)}`;
    }

    const firstOctet = parseInt(ip.split('.')[0], 10);
    let ipClass = 'Unknown';
    if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'Class A';
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B';
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C';
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
    else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'Class E (Experimental)';

    setResult({
      networkAddress: intToIp(networkNum),
      broadcastAddress: intToIp(broadcastNum),
      subnetMask: intToIp(maskNum),
      cidrMask: cidr,
      totalHosts,
      usableHosts,
      hostRange,
      ipClass,
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto">
      <form onSubmit={calculateSubnet} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
            IP Address
          </label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Subnet Mask (CIDR)
          </label>
          <select
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          >
            {Array.from({ length: 33 }, (_, i) => (
              <option key={i} value={i}>
                /{i}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="sm:col-span-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          Calculate Subnet
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-center text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6 border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Network Address</span>
            <p className="font-mono font-medium text-gray-900 dark:text-white">{result.networkAddress}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Subnet Mask</span>
            <p className="font-mono font-medium text-gray-900 dark:text-white">{result.subnetMask}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Broadcast Address</span>
            <p className="font-mono font-medium text-gray-900 dark:text-white">{result.broadcastAddress}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Usable Host Range</span>
            <p className="font-mono font-medium text-gray-900 dark:text-white">{result.hostRange}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Total / Usable Hosts</span>
            <p className="font-mono font-medium text-gray-900 dark:text-white">
              {result.totalHosts.toLocaleString()} / {result.usableHosts.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">IP Class</span>
            <p className="font-mono font-medium text-gray-900 dark:text-white">{result.ipClass}</p>
          </div>
        </div>
      )}
    </div>
  );
}