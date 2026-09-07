'use client';

import { useState, useRef, ChangeEvent } from 'react';

export default function PngToJpg() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.9);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processImage = (file: File, q: number) => {
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setError('Failed to process image context.');
          return;
        }

        // Fill background with white (since PNG transparency becomes black in JPG otherwise)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              if (convertedUrl) URL.revokeObjectURL(convertedUrl);
              const url = URL.createObjectURL(blob);
              setConvertedUrl(url);
              setConvertedSize(blob.size);
            }
          },
          'image/jpeg',
          q
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png') {
        setError('Please upload a valid PNG image file.');
        return;
      }
      setImageFile(file);
      setOriginalSize(file.size);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      processImage(file, quality);
    }
  };

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    if (imageFile) {
      processImage(imageFile, newQuality);
    }
  };

  const handleClear = () => {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setPreviewUrl(null);
    setConvertedUrl(null);
    setOriginalSize(0);
    setConvertedSize(0);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* FILE UPLOAD DROPZONE */}
      {!imageFile && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer bg-gray-50 hover:bg-blue-50/30 transition-all duration-200"
        >
          <input
            type="file"
            accept="image/png"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-gray-700 mb-1">
            Click or drag & drop PNG image to convert
          </p>
          <p className="text-xs text-gray-500">Supports PNG images up to 20MB</p>
        </div>
      )}

      {/* CONVERSION PANEL */}
      {imageFile && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
          
          {/* QUALITY SLIDER CONTROL */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-sm font-medium text-gray-700">
              <span>JPG Output Quality: {Math.round(quality * 100)}%</span>
              <span className="text-xs text-gray-500">Adjust compression level</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* PREVIEW & COMPARISON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ORIGINAL PNG */}
            <div className="space-y-2 text-center">
              <div className="text-sm font-semibold text-gray-700 flex justify-between px-1">
                <span>Original (PNG)</span>
                <span className="text-gray-500">{formatBytes(originalSize)}</span>
              </div>
              <div className="h-64 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Original PNG"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                )}
              </div>
            </div>

            {/* CONVERTED JPG */}
            <div className="space-y-2 text-center">
              <div className="text-sm font-semibold text-gray-700 flex justify-between px-1">
                <span>Converted (JPG)</span>
                <span className="text-emerald-600 font-bold">{formatBytes(convertedSize)}</span>
              </div>
              <div className="h-64 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                {convertedUrl && (
                  <img
                    src={convertedUrl}
                    alt="Converted JPG"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                )}
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3 justify-end pt-2">
            <button
              onClick={handleClear}
              className="px-5 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
            >
              Clear Image
            </button>
            {convertedUrl && (
              <a
                href={convertedUrl}
                download={imageFile.name.replace(/\.png$/i, '.jpg')}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download JPG
              </a>
            )}
          </div>

        </div>
      )}
    </div>
  );
}