'use client';

import { useState } from 'react';

interface BlockchainInfo {
  name: string;
  symbol: string;
  type: string;
  network: string;
  explorer: string;
  color: string;
}

export default function CryptoWalletChecker() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<BlockchainInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const detectBlockchain = (address: string): BlockchainInfo | null => {
    const addr = address.trim();

    // EVM Chains (Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, etc.)
    if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      return {
        name: 'EVM Compatible (Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche)',
        symbol: 'ETH / BNB / MATIC',
        type: 'Account-based (EVM)',
        network: 'Multi-Chain (EVM Layer 1 & Layer 2)',
        explorer: `https://etherscan.io/address/${addr}`,
        color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      };
    }

    // Bitcoin (BTC) - Fixed Range [a-zA-Z0-9]
    if (/^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-Z0-9]{39,59})$/.test(addr)) {
      return {
        name: 'Bitcoin',
        symbol: 'BTC',
        type: 'UTXO',
        network: 'Bitcoin Mainnet',
        explorer: `https://mempool.space/address/${addr}`,
        color: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    }

    // Solana (SOL)
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr) && !addr.startsWith('0x')) {
      return {
        name: 'Solana',
        symbol: 'SOL',
        type: 'Account-based',
        network: 'Solana Mainnet-Beta',
        explorer: `https://solscan.io/account/${addr}`,
        color: 'bg-purple-100 text-purple-800 border-purple-300',
      };
    }

    // TRON (TRX)
    if (/^T[a-zA-Z0-9]{33}$/.test(addr)) {
      return {
        name: 'TRON',
        symbol: 'TRX',
        type: 'Account-based (TVM)',
        network: 'TRON Mainnet',
        explorer: `https://tronscan.org/#/address/${addr}`,
        color: 'bg-red-100 text-red-800 border-red-300',
      };
    }

    // Cardano (ADA)
    if (/^addr1[a-z0-9]{58,}$/.test(addr)) {
      return {
        name: 'Cardano',
        symbol: 'ADA',
        type: 'eUTXO',
        network: 'Cardano Mainnet',
        explorer: `https://cardanoscan.io/address/${addr}`,
        color: 'bg-blue-100 text-blue-800 border-blue-300',
      };
    }

    // XRP Ledger (XRP)
    if (/^r[0-9a-zA-Z]{24,34}$/.test(addr)) {
      return {
        name: 'XRP Ledger',
        symbol: 'XRP',
        type: 'Account-based',
        network: 'XRP Mainnet',
        explorer: `https://xrpscan.com/account/${addr}`,
        color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      };
    }

    // Dogecoin (DOGE)
    if (/^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/.test(addr)) {
      return {
        name: 'Dogecoin',
        symbol: 'DOGE',
        type: 'UTXO',
        network: 'Dogecoin Mainnet',
        explorer: `https://dogechain.info/address/${addr}`,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      };
    }

    // Litecoin (LTC) - Fixed Range [a-zA-Z0-9]
    if (/^(L[a-km-zA-HJ-NP-Z1-9]{26,33}|M[a-km-zA-HJ-NP-Z1-9]{26,33}|ltc1[a-zA-Z0-9]{39,59})$/.test(addr)) {
      return {
        name: 'Litecoin',
        symbol: 'LTC',
        type: 'UTXO',
        network: 'Litecoin Mainnet',
        explorer: `https://blockchair.com/litecoin/address/${addr}`,
        color: 'bg-slate-100 text-slate-800 border-slate-300',
      };
    }

    // TON (The Open Network)
    if (/^(EQ|UQ)[a-zA-Z0-9_-]{46}$/.test(addr)) {
      return {
        name: 'TON (The Open Network)',
        symbol: 'TON',
        type: 'Actor-based',
        network: 'TON Mainnet',
        explorer: `https://tonscan.org/address/${addr}`,
        color: 'bg-sky-100 text-sky-800 border-sky-300',
      };
    }

    // Cosmos (ATOM)
    if (/^cosmos1[a-z0-9]{38}$/.test(addr)) {
      return {
        name: 'Cosmos Hub',
        symbol: 'ATOM',
        type: 'Account-based',
        network: 'Cosmos Network',
        explorer: `https://www.mintscan.io/cosmos/address/${addr}`,
        color: 'bg-gray-100 text-gray-800 border-gray-300',
      };
    }

    // NEAR Protocol
    if (/^(([a-z0-9_-]+\.near)|([a-f0-9]{64}))$/.test(addr)) {
      return {
        name: 'NEAR Protocol',
        symbol: 'NEAR',
        type: 'Account-based',
        network: 'NEAR Mainnet',
        explorer: `https://nearblocks.io/address/${addr}`,
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }

    // Sui / Aptos
    if (/^0x[a-fA-F0-9]{64}$/.test(addr)) {
      return {
        name: 'Sui / Aptos Network',
        symbol: 'SUI / APT',
        type: 'Object/Move-based',
        network: 'Mainnet',
        explorer: `https://suiscan.xyz/mainnet/account/${addr}`,
        color: 'bg-blue-100 text-blue-800 border-blue-300',
      };
    }

    return null;
  };

  const handleCheck = () => {
    if (!input.trim()) {
      setError('Please enter a wallet address.');
      setResult(null);
      return;
    }

    const detected = detectBlockchain(input);
    if (detected) {
      setResult(detected);
      setError('');
    } else {
      setError('Unknown or Invalid Wallet Address format.');
      setResult(null);
    }
  };

  const handleCopy = () => {
    if (input) {
      navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* THREE-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT PANEL: INPUT */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex justify-between items-center text-gray-700 font-semibold text-sm px-1">
            <span>Enter Wallet Address:</span>
            <button
              onClick={() => {
                setInput('');
                setResult(null);
                setError('');
              }}
              title="Clear Input"
              className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste crypto wallet address here...\n\nExamples:\n- 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 (EVM)\n- bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh (BTC)\n- 4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R (SOL)`}
            className="w-full h-[450px] p-4 font-mono text-sm bg-white text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* CENTER PANEL: CONTROLS */}
        <div className="lg:col-span-2 space-y-3 pt-7 flex flex-col justify-center">
          <button
            onClick={handleCheck}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 text-sm rounded-lg transition shadow"
          >
            Check Blockchain
          </button>

          <button
            onClick={handleCopy}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 text-sm rounded-lg transition shadow-sm"
          >
            {copied ? 'Copied!' : 'Copy Address'}
          </button>

          <button
            onClick={() => {
              setInput('');
              setResult(null);
              setError('');
            }}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 text-sm rounded-lg transition border border-red-200"
          >
            Clear All
          </button>
        </div>

        {/* RIGHT PANEL: RESULTS */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex justify-between items-center text-gray-700 font-semibold text-sm px-1">
            <span>Detection Result:</span>
            <button
              onClick={() => setResult(null)}
              title="Clear Result"
              className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>

          <div className="w-full h-[450px] p-4 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-y-auto">
            {result ? (
              <div className="space-y-4 my-auto">
                <div className={`p-4 rounded-lg border ${result.color} text-center font-bold text-lg`}>
                  {result.name}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-500 font-medium">Native Token:</span>
                    <span className="font-semibold text-gray-800">{result.symbol}</span>
                  </div>

                  <div className="flex justify-between p-2 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-500 font-medium">Address Type:</span>
                    <span className="font-semibold text-gray-800">{result.type}</span>
                  </div>

                  <div className="flex justify-between p-2 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-500 font-medium">Network:</span>
                    <span className="font-semibold text-gray-800">{result.network}</span>
                  </div>
                </div>

                <a
                  href={result.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 text-sm rounded-lg transition shadow-sm mt-4"
                >
                  View on Explorer ↗
                </a>
              </div>
            ) : (
              <div className="m-auto text-center text-gray-400 text-sm">
                Blockchain detection details will appear here after checking...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}