"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import MediaPicker from "./MediaPicker";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({
  value,
  onChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }

        const data = await res.json();
        onChange(data.url);
        toast.success("Image uploaded successfully");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  return (
    <div>
      {value ? (
        <div className="relative rounded-[var(--radius-card)] overflow-hidden border border-obsidian-200 bg-obsidian-50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-1.5 bg-white/90 rounded-lg text-obsidian-600 hover:bg-white transition-all shadow-sm text-xs font-medium px-2.5"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 bg-white/90 rounded-lg text-red-500 hover:bg-white transition-all shadow-sm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-[var(--radius-card)] p-8 text-center transition-all cursor-pointer ${
            dragOver
              ? "border-gold-400 bg-gold-50/30"
              : "border-obsidian-200 hover:border-obsidian-300 bg-white"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-obsidian-50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-obsidian-400" />
              </div>
              <p className="text-sm text-obsidian-500 font-medium">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-obsidian-300">
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>
          )}
        </div>
      )}

      {!value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPickerOpen(true);
          }}
          className="mt-2 inline-flex items-center gap-1.5 text-sm text-gold-500 hover:text-gold-600 font-medium"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Choose from Media Library
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
          e.target.value = "";
        }}
      />

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          onChange(url);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}