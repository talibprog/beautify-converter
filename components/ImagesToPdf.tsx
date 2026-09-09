'use client';

import { useState, useRef, ChangeEvent } from 'react';

export default function ImagesToPdf() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setError('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    setError('');
    const newPreviews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setPdfUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(previews[index].url);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setPdfUrl(null);
  };

  const handleClearAll = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setSelectedFiles([]);
    setPreviews([]);
    setPdfUrl(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConvertToPdf = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const imgData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        if (i > 0) {
          pdf.addPage();
        }

        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const imgWidth = img.width;
            const imgHeight = img.height;

            const margin = 10;
            const maxWidth = pageWidth - margin * 2;
            const maxHeight = pageHeight - margin * 2;

            let width = maxWidth;
            let height = (imgHeight * width) / imgWidth;

            if (height > maxHeight) {
              height = maxHeight;
              width = (imgWidth * height) / imgHeight;
            }

            const x = (pageWidth - width) / 2;
            const y = (pageHeight - height) / 2;

            let format = 'JPEG';
            if (file.type === 'image/png') format = 'PNG';
            else if (file.type === 'image/webp') format = 'WEBP';

            pdf.addImage(imgData, format, x, y, width, height);
            resolve();
          };
          img.onerror = reject;
          img.src = imgData;
        });
      }

      const pdfBlob = pdf.output('blob');
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err) {
      setError('Failed to generate PDF. Please try again with valid images.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* DROPZONE */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer bg-gray-50 hover:bg-blue-50/30 transition-all duration-200"
      >
        <input
          type="file"
          accept="image/*"
          multiple
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
          Click or drag & drop multiple images here
        </p>
        <p className="text-xs text-gray-500">Supports JPG, PNG, WebP</p>
      </div>

      {/* SELECTED IMAGES PREVIEW GRID */}
      {previews.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-800">
              Selected Images ({previews.length})
            </h3>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-80 overflow-y-auto p-2">
            {previews.map((item, idx) => (
              <div
                key={idx}
                className="relative group border border-gray-200 rounded-lg p-2 bg-gray-50 flex flex-col items-center"
              >
                <img
                  src={item.url}
                  alt={`Preview ${idx}`}
                  className="h-24 w-full object-contain rounded mb-1"
                />
                <span className="text-[11px] text-gray-500 truncate w-full text-center">
                  {item.file.name}
                </span>
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition shadow"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              onClick={handleConvertToPdf}
              disabled={isProcessing}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? 'Generating PDF...' : 'Convert to PDF'}
            </button>

            {pdfUrl && (
              <a
                href={pdfUrl}
                download="converted-images.pdf"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow flex items-center gap-2"
              >
                ⬇️ Download PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}