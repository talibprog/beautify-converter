'use client';

import { useState, useRef } from 'react';

export default function ExcelToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      if (ext !== 'xlsx' && ext !== 'xls') {
        setError('Please select a valid Excel file (.xlsx or .xls).');
        return;
      }
      setFile(selectedFile);
      setDownloadUrl(null);
      setError('');
    }
  };

  const convertExcelToPdf = async () => {
    if (!file) {
      setError('Please upload an Excel file first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const XLSX = await import('xlsx');
      const { jsPDF } = await import('jspdf');
      const autoTableModule = await import('jspdf-autotable');
      const autoTable = autoTableModule.default || autoTableModule;

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

      workbook.SheetNames.forEach((sheetName, index) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData && jsonData.length > 0) {
          if (index > 0) {
            pdf.addPage();
          }

          // Title header
          pdf.setFontSize(14);
          pdf.text(`Sheet: ${sheetName}`, 40, 30);

          const headers = jsonData[0] || [];
          const body = jsonData.slice(1);

          (autoTable as any)(pdf, {
            head: [headers],
            body: body,
            startY: 45,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 4 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            margin: { top: 40, left: 30, right: 30, bottom: 30 },
          });
        }
      });

      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      setError('Failed to convert Excel to PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setDownloadUrl(null);
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

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition flex items-center gap-2"
          >
            <span>📁</span> Upload Excel File
          </button>
          <input
            type="file"
            accept=".xlsx, .xls"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          {file && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 truncate max-w-xs">
                Selected: <strong>{file.name}</strong>
              </span>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center bg-gray-50 flex flex-col items-center justify-center space-y-3">
          <div className="text-4xl">📊 ➔ 📄</div>
          <div className="text-sm font-medium text-gray-700">
            {file ? file.name : 'Upload an Excel spreadsheet (.xlsx, .xls) to convert into PDF'}
          </div>
          <p className="text-xs text-gray-400">All conversion happens locally inside your browser memory.</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-end pt-2">
          <button
            onClick={convertExcelToPdf}
            disabled={loading || !file}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Converting to PDF...' : 'Convert to PDF'}
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`${file?.name.replace(/\.(xlsx|xls)$/i, '')}_converted.pdf`}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow flex items-center gap-2"
            >
              ⬇️ Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}