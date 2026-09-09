'use client';

import { useState, useRef } from 'react';

interface ConvertedImage {
  pageNumber: number;
  dataUrl: string;
}

export default function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [imageFormat, setImageFormat] = useState<'png' | 'jpeg'>('png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a valid PDF file.');
        return;
      }
      setFile(selectedFile);
      setImages([]);
      setError('');
    }
  };

  const convertPdfToImages = async () => {
    if (!file) {
      setError('Please select or upload a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');
    setImages([]);

    try {
      // Dynamic import to prevent SSR canvas issues
      const pdfjsLib = await import('pdfjs-dist');
      
      // Stable Unpkg CDN worker path
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const convertedList: ConvertedImage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          const mimeType = imageFormat === 'png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(mimeType, 0.95);
          convertedList.push({ pageNumber: i, dataUrl });
        }
      }

      setImages(convertedList);
    } catch (err: any) {
      setError('Failed to convert PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSingle = (dataUrl: string, pageNumber: number) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${file?.name.replace('.pdf', '')}_page_${pageNumber}.${imageFormat}`;
    a.click();
  };

  const handleDownloadAll = () => {
    images.forEach((img) => handleDownloadSingle(img.dataUrl, img.pageNumber));
  };

  const handleCopyFirstImage = () => {
    if (images.length > 0) {
      navigator.clipboard.writeText(images[0].dataUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearAll = () => {
    setFile(null);
    setImages([]);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
            <span>Upload PDF File:</span>
            <button
              onClick={handleClearAll}
              title="Clear Input"
              className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-[450px] p-4 bg-white text-gray-800 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer transition flex flex-col items-center justify-center text-center shadow-sm"
          >
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            {file ? (
              <div className="space-y-3">
                <div className="text-5xl">📄</div>
                <div className="font-semibold text-gray-800 text-sm break-all">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                  Click to change file
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-5xl">📤</div>
                <div className="font-medium text-gray-700 text-sm">Click or Drag & Drop PDF file here</div>
                <div className="text-xs text-gray-400">Supports all standard PDF documents</div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER PANEL: CONTROLS */}
        <div className="lg:col-span-2 space-y-3 pt-7 flex flex-col justify-center">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 px-1">Output Format:</label>
            <select
              value={imageFormat}
              onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpeg')}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="png">PNG (High Quality)</option>
              <option value="jpeg">JPEG (Compact)</option>
            </select>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-sm rounded-lg transition shadow-sm"
          >
            Load from file
          </button>

          <button
            onClick={convertPdfToImages}
            disabled={loading || !file}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 text-sm rounded-lg transition shadow disabled:opacity-50"
          >
            {loading ? 'Converting...' : 'Convert to Images'}
          </button>

          <button
            onClick={handleCopyFirstImage}
            disabled={images.length === 0}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 text-sm rounded-lg transition shadow-sm disabled:opacity-50"
          >
            {copied ? 'Copied DataURL!' : 'Copy DataURL'}
          </button>

          <button
            onClick={handleDownloadAll}
            disabled={images.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 text-sm rounded-lg transition shadow-sm disabled:opacity-50"
          >
            Download All Images
          </button>

          <button
            onClick={handleClearAll}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 text-sm rounded-lg transition border border-red-200"
          >
            Clear All
          </button>
        </div>

        {/* RIGHT PANEL: RESULTS */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex justify-between items-center text-gray-700 font-semibold text-sm px-1">
            <span>Converted Pages ({images.length}):</span>
            <button
              onClick={() => setImages([])}
              title="Clear Output"
              className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>

          <div className="w-full h-[450px] p-4 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 shadow-sm overflow-y-auto space-y-4">
            {images.length > 0 ? (
              images.map((img) => (
                <div key={img.pageNumber} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                    <span>Page {img.pageNumber}</span>
                    <button
                      onClick={() => handleDownloadSingle(img.dataUrl, img.pageNumber)}
                      className="px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 rounded transition"
                    >
                      Download Page
                    </button>
                  </div>
                  <img
                    src={img.dataUrl}
                    alt={`Page ${img.pageNumber}`}
                    className="w-full h-auto rounded border border-gray-100 object-contain max-h-[300px]"
                  />
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-center text-gray-400 text-sm">
                Converted image previews will appear here...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}