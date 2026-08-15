'use client';

import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ currentImage, onImageUploaded, folder = 'uploads' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setPreview(data.url);
        onImageUploaded(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('A network error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        {preview ? (
          <div className="relative w-full max-w-sm h-48 rounded-xl border border-[#333] overflow-hidden bg-[#111]">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setPreview('')}
              className="absolute top-2 right-2 bg-red-500 bg-opacity-80 text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-sm h-48 rounded-xl border-2 border-dashed border-[#444] hover:border-[#D4AF37] bg-[#1a1a1a] flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>
            <span className="text-gray-400 font-medium text-sm">Click to upload image</span>
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      
      {uploading && <div className="text-[#D4AF37] text-sm"><i className="fa-solid fa-spinner fa-spin mr-2"></i>Uploading...</div>}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
}
