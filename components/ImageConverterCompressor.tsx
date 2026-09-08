'use client';

import { useState, useRef } from 'react';

interface ProcessedImage {
  originalName: string;
  originalSize: number;
  newSize: number;
  dataUrl: string;
  format: string;
  dimensions: { width: number; height: number };
}

export default function ImageConverterCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [processed, setProcessed] = useState<ProcessedImage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setProcessed(null);
    }
  };

  const processImage = () => {
    if (!file || !preview) return;
    setLoading(true);

    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setLoading(false);
        return;
      }

      // Fill white background for JPEG conversions (handles transparent PNGs)
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      // Convert using target format and quality scale (0 to 1)
      const dataUrl = canvas.toDataURL(targetFormat, quality / 100);

      // Estimate byte size from Data URL
      const head = `data:${targetFormat};base64,`;
      const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);

      setProcessed({
        originalName: file.name,
        originalSize: file.size,
        newSize: sizeInBytes,
        dataUrl,
        format: targetFormat.split('/')[1].toUpperCase(),
        dimensions: { width: img.width, height: img.height },
      });

      setLoading(false);
    };
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSavings = () => {
    if (!processed) return 0;
    const diff = processed.originalSize - processed.newSize;
    return Math.round((diff / processed.originalSize) * 100);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* INPUT & SETTINGS */}
        <div className="lg:col-span-6 space-y-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-lg flex flex-col items-center justify-center cursor-pointer transition bg-gray-50 overflow-hidden relative"
          >
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            {preview ? (
              <img src={preview} alt="Upload preview" className="w-full h-full object-contain p-2" />
            ) : (
              <div className="text-center space-y-2">
                <span className="text-4xl">🖼️</span>
                <p className="text-sm font-medium text-gray-700">Click or Drag & Drop Image Here</p>
                <p className="text-xs text-gray-400">Supports PNG, JPG, WebP</p>
              </div>
            )}
          </div>

          {file && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>File: <strong>{file.name}</strong></span>
                <span>Size: <strong>{formatBytes(file.size)}</strong></span>
              </div>

              {/* FORMAT SELECTION */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Format:</label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as any)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="image/jpeg">JPG / JPEG (Best for Photos)</option>
                  <option value="image/png">PNG (Best for Graphics)</option>
                  <option value="image/webp">WebP (Next-Gen Web Format)</option>
                </select>
              </div>

              {/* QUALITY SLIDER */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Compression Quality:</span>
                  <span>{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <button
                onClick={processImage}
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition shadow disabled:opacity-50"
              >
                {loading ? 'Processing Image...' : 'Convert & Compress'}
              </button>
            </div>
          )}
        </div>

        {/* RESULTS & DOWNLOAD */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col justify-between space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Compressed Output Preview:</h2>

          {processed ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="w-full h-56 border border-gray-100 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                <img src={processed.dataUrl} alt="Processed" className="max-h-full max-w-full object-contain p-2" />
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-2 text-center bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <div>
                  <p className="text-xs text-gray-500">Format</p>
                  <p className="text-sm font-bold text-indigo-700">{processed.format}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">New Size</p>
                  <p className="text-sm font-bold text-indigo-700">{formatBytes(processed.newSize)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Savings</p>
                  <p className="text-sm font-bold text-emerald-600">
                    {getSavings() > 0 ? `-${getSavings()}%` : '0%'}
                  </p>
                </div>
              </div>

              <a
                href={processed.dataUrl}
                download={`converted_${processed.originalName.split('.')[0]}.${processed.format.toLowerCase()}`}
                className="w-full text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition shadow block"
              >
                Download Compressed Image
              </a>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
              <span>⚡ Output result will appear here after clicking convert</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}