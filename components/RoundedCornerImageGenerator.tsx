'use client';

import { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';

export default function RoundedCornerImageGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [fileSize, setFileSize] = useState<string>('');
  const [radius, setRadius] = useState<number>(30);
  const [bgColor, setBgColor] = useState<string>('transparent');
  const [outputFormat, setOutputFormat] = useState<string>('image/png');
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // File loading handler
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }

    setError('');
    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Process image with rounded corners using HTML5 Canvas
  useEffect(() => {
    if (!imageSrc) {
      setProcessedImageUrl('');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, w, h);

      // Apply background color if not transparent
      if (bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);
      }

      // Calculate border radius relative to image size or raw pixels
      const minDimension = Math.min(w, h);
      const actualRadius = Math.min((radius / 100) * (minDimension / 2), minDimension / 2);

      // Create rounded rectangle path
      ctx.beginPath();
      ctx.moveTo(actualRadius, 0);
      ctx.lineTo(w - actualRadius, 0);
      ctx.quadraticCurveTo(w, 0, w, actualRadius);
      ctx.lineTo(w, h - actualRadius);
      ctx.quadraticCurveTo(w, h, w - actualRadius, h);
      ctx.lineTo(actualRadius, h);
      ctx.quadraticCurveTo(0, h, 0, h - actualRadius);
      ctx.lineTo(0, actualRadius);
      ctx.quadraticCurveTo(0, 0, actualRadius, 0);
      ctx.closePath();

      // Clip canvas and draw image
      ctx.clip();
      ctx.drawImage(img, 0, 0, w, h);

      const dataUrl = canvas.toDataURL(outputFormat, 0.95);
      setProcessedImageUrl(dataUrl);
    };
  }, [imageSrc, radius, bgColor, outputFormat]);

  // Load from Remote URL
  const handleLoadFromUrl = async () => {
    const url = prompt('Enter Image File URL:');
    if (!url) return;

    try {
      setError('');
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const blob = await res.blob();
      handleFile(new File([blob], 'url-image.png', { type: blob.type }));
    } catch (err: any) {
      setError('Failed to fetch image from URL: ' + err.message);
    }
  };

  // Copy DataURL
  const handleCopyDataURL = () => {
    if (!processedImageUrl) return;
    navigator.clipboard.writeText(processedImageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Processed Image
  const handleDownload = () => {
    if (!processedImageUrl) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const a = document.createElement('a');
    a.href = processedImageUrl;
    a.download = `${fileName}-rounded.${ext}`;
    a.click();
  };

  // Clear Input Box
  const handleClearInput = () => {
    setImageSrc(null);
    setFileName('image');
    setFileSize('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Clear All
  const handleClearAll = () => {
    handleClearInput();
    setProcessedImageUrl('');
    setRadius(30);
    setBgColor('transparent');
    setOutputFormat('image/png');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded-md">
          {error}
        </div>
      )}

      {/* Main UI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left Column - Input Image Box */}
        <div className="lg:col-span-5 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">Upload Image File:</span>
            <button
              onClick={handleClearInput}
              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
            >
              🗑 Clear
            </button>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex-1 min-h-[420px] p-6 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-center space-y-4"
          >
            {imageSrc ? (
              <div className="space-y-3 flex flex-col items-center">
                <img
                  src={imageSrc}
                  alt="Original"
                  className="max-h-64 max-w-full object-contain rounded border border-gray-200 shadow-sm"
                />
                <div>
                  <p className="text-xs font-bold text-gray-800">{fileName}</p>
                  <p className="text-[11px] text-gray-500">{fileSize}</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                >
                  Click to change file
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer space-y-2 flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xl font-bold">
                  🖼️
                </div>
                <p className="text-xs font-bold text-gray-700">
                  Drag & Drop image here, or <span className="text-blue-600 underline">browse</span>
                </p>
                <p className="text-[11px] text-gray-400">Supports PNG, JPG, WebP, GIF</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Column - Controls & Options */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-3 py-2">
          
          {/* Format Selector */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-gray-600">Output Format:</label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full p-2 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="image/png">PNG (Transparent)</option>
              <option value="image/jpeg">JPG / JPEG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>

          {/* Corner Radius Slider */}
          <div className="space-y-1 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700">
              <span>Corner Radius:</span>
              <span>{radius}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Background Color Picker */}
          <div className="space-y-1 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
            <label className="block text-[11px] font-bold text-gray-700">Background Color:</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                disabled={outputFormat === 'image/jpeg'}
                className="w-8 h-8 rounded cursor-pointer border border-gray-300"
              />
              <button
                onClick={() => setBgColor('transparent')}
                disabled={outputFormat === 'image/jpeg'}
                className="text-[11px] font-semibold text-blue-600 hover:underline disabled:text-gray-400"
              >
                Transparent
              </button>
            </div>
          </div>

          <button
            onClick={handleLoadFromUrl}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
          >
            Load from Url
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
          >
            Load from file
          </button>

          <button
            onClick={handleCopyDataURL}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition shadow-sm"
          >
            {copied ? '✓ Copied DataURL' : 'Copy DataURL'}
          </button>

          <button
            onClick={handleDownload}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm"
          >
            Download Image
          </button>

          <button
            onClick={handleClearAll}
            className="w-full py-2.5 px-3 text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition shadow-sm mt-1"
          >
            Clear All
          </button>
        </div>

        {/* Right Column - Output Preview Box */}
        <div className="lg:col-span-5 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">Rounded Result Preview:</span>
            <button
              onClick={() => setProcessedImageUrl('')}
              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
            >
              🗑 Clear
            </button>
          </div>

          <div className="flex-1 min-h-[420px] p-6 border border-gray-200 bg-gray-50 rounded-xl flex items-center justify-center overflow-auto">
            {processedImageUrl ? (
              <img
                src={processedImageUrl}
                alt="Rounded Result"
                className="max-h-[380px] max-w-full object-contain shadow-md"
              />
            ) : (
              <p className="text-xs text-gray-400 font-mono">
                Rounded image preview will appear here...
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}