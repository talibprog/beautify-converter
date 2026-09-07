'use client';

import React, { useState } from 'react';

export default function ImageToPrompt() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setError('');
    setPrompt('');
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generatePrompt = async () => {
    if (!imageSrc) return;

    setLoading(true);
    setError('');
    setPrompt('');

    try {
      const res = await fetch('/api/image-to-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageSrc,
          mimeType: mimeType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate prompt');
      }

      setPrompt(data.prompt);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while processing the image.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* FILE UPLOAD ZONE */}
      <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-white transition cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload-input"
        />
        <label htmlFor="image-upload-input" className="cursor-pointer block space-y-3">
          <div className="text-4xl">🖼️</div>
          <div className="text-sm font-bold text-slate-800">
            Click or Drag & Drop image here to analyze
          </div>
          <p className="text-xs text-gray-500">Supports PNG, JPG, WEBP up to 5MB</p>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* PREVIEW & PROCESS BUTTON */}
      {imageSrc && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={imageSrc}
              alt="Uploaded Preview"
              className="w-48 h-48 object-cover rounded-xl border border-gray-200"
            />
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <h4 className="font-bold text-slate-900 text-base">Image Loaded Successfully</h4>
              <p className="text-xs text-gray-500">
                Click below to extract a high-detail Midjourney/DALL-E prompt from this image using AI.
              </p>
              <button
                onClick={generatePrompt}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {loading ? 'Analyzing Image...' : '✨ Generate AI Prompt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATED PROMPT RESULT */}
      {prompt && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>🎯 Generated AI Prompt</span>
            </h4>
            <button
              onClick={handleCopy}
              className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition border border-blue-200"
            >
              {copied ? '✓ Copied!' : 'Copy Prompt'}
            </button>
          </div>
          <p className="bg-gray-50 p-4 rounded-xl text-xs text-gray-800 leading-relaxed font-mono border border-gray-200">
            {prompt}
          </p>
        </div>
      )}
    </div>
  );
}