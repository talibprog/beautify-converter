'use client';

import { useState, useRef, ChangeEvent } from 'react';

export default function HeicToJpg() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.9);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processImage = async (file: File, q: number) => {
    setError('');
    setIsProcessing(true);

    try {
      // Browser environment check & Dynamic import
      if (typeof window === 'undefined') return;
      const heic2any = (await import('heic2any')).default;

      const conversionResult = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: q,
      });

      const resultBlob = Array.isArray(conversionResult)
        ? conversionResult[0]
        : conversionResult;

      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      const url = URL.createObjectURL(resultBlob);

      if (!previewUrl) {
        setPreviewUrl(url);
      }

      setConvertedUrl(url);
      setConvertedSize(resultBlob.size);
    } catch (err: any) {
      setError('Failed to process HEIC image. Please ensure it is a valid file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isHeic =
        file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic';

      if (!isHeic) {
        setError('Please upload a valid HEIC image file.');
        return;
      }

      setImageFile(file);
      setOriginalSize(file.size);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
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
    setIsProcessing(false);
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
            accept=".heic,image/heic"
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
            Click or drag & drop HEIC image to convert
          </p>
          <p className="text-xs text-gray-500">Supports Apple .HEIC photos</p>
        </div>
      )}

      {/* CONVERSION PANEL */}
      {imageFile && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
          
          {/* QUALITY SLIDER CONTROL */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-sm font-medium text-gray-700">
              <span>JPG Output Quality: {Math.round(quality * 100)}%</span>
              <span className="text-xs text-gray-500">
                {isProcessing ? 'Processing conversion...' : 'Adjust compression level'}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              disabled={isProcessing}
              onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer disabled:opacity-50"
            />
          </div>

          {/* PREVIEW & COMPARISON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ORIGINAL HEIC METADATA */}
            <div className="space-y-2 text-center">
              <div className="text-sm font-semibold text-gray-700 flex justify-between px-1">
                <span>Original (HEIC)</span>
                <span className="text-gray-500">{formatBytes(originalSize)}</span>
              </div>
              <div className="h-64 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mb-2 font-bold text-xs">
                  HEIC
                </div>
                <p className="text-xs font-semibold text-gray-700 truncate max-w-xs">
                  {imageFile.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Browser native preview unavailable for raw HEIC
                </p>
              </div>
            </div>

            {/* CONVERTED JPG */}
            <div className="space-y-2 text-center">
              <div className="text-sm font-semibold text-gray-700 flex justify-between px-1">
                <span>Converted (JPG)</span>
                <span className="text-emerald-600 font-bold">
                  {isProcessing ? 'Converting...' : formatBytes(convertedSize)}
                </span>
              </div>
              <div className="h-64 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                {isProcessing ? (
                  <div className="text-xs text-blue-600 font-semibold animate-pulse">
                    Rendering converted image...
                  </div>
                ) : convertedUrl ? (
                  <img
                    src={convertedUrl}
                    alt="Converted JPG"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : null}
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
            {convertedUrl && !isProcessing && (
              <a
                href={convertedUrl}
                download={imageFile.name.replace(/\.heic$/i, '.jpg')}
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