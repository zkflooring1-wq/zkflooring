"use client";

import { useState, useEffect } from "react";
import { X, Search, Check, Loader2 } from "lucide-react";
import type { Media } from "@/types/database";

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch("/api/media")
        .then((r) => r.json())
        .then((data) => setMedia(data.media || []))
        .catch(() => setMedia([]))
        .finally(() => setLoading(false));
    }
  }, [open]);

  if (!open) return null;

  const filtered = media.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[var(--radius-card)] shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-100">
          <h3 className="text-base font-semibold text-obsidian-800">
            Select Media
          </h3>
          <button onClick={onClose} className="text-obsidian-300 hover:text-obsidian-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-obsidian-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media..."
              className="w-full pl-10 pr-4 py-2 bg-obsidian-50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-obsidian-400 py-12">
              No media found
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selected === item.url
                      ? "border-gold-400 ring-2 ring-gold-400/20"
                      : "border-obsidian-200 hover:border-obsidian-300"
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {selected === item.url && (
                    <div className="absolute inset-0 bg-gold-400/20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-gold-400 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-obsidian-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-obsidian-600 bg-obsidian-50 hover:bg-obsidian-100 rounded-[var(--radius-button)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selected) {
                onSelect(selected);
                onClose();
              }
            }}
            disabled={!selected}
            className="px-4 py-2 text-sm font-medium gold-gradient text-obsidian-900 rounded-[var(--radius-button)] hover:opacity-90 disabled:opacity-50 transition-all"
          >
            Select Image
          </button>
        </div>
      </div>
    </div>
  );
}