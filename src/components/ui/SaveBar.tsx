"use client";

import { Loader2, Save, Trash2 } from "lucide-react";

interface SaveBarProps {
  onSave?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  saving?: boolean;
  dirty?: boolean;
  saveLabel?: string;
}

export default function SaveBar({
  onSave,
  onDelete,
  onCancel,
  saving = false,
  dirty = true,
  saveLabel = "Save Changes",
}: SaveBarProps) {
  return (
    <div className="sticky bottom-0 z-20 bg-white/90 backdrop-blur-md border-t border-obsidian-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between max-w-5xl">
        <div>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-[var(--radius-button)] transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-obsidian-600 bg-obsidian-50 hover:bg-obsidian-100 rounded-[var(--radius-button)] transition-all"
            >
              Cancel
            </button>
          )}
          <button type="button" onClick={onSave}
            disabled={saving || !dirty}
            className="inline-flex items-center gap-2 px-5 py-2.5 gold-gradient text-obsidian-900 font-semibold rounded-[var(--radius-button)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-md shadow-gold-500/10"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}