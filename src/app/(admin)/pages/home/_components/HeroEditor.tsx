"use client";

import React, { useState } from 'react';
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Type, 
  RotateCw,
  Eye
} from "lucide-react";

export interface HeroSlide {
  title: string;
  sub_title: string;
  description: string;
  bg_image: string;
  cta_text: string;
  cta_link: string;
  video_url: string;
  badge_text?: string;
}

interface Props {
  data: HeroSlide[];
  onChange: (data: HeroSlide[]) => void;
}

const PRESET_IMAGES = [
  { label: "Carpet", url: "/slider/Carpet.webp" },
  { label: "Laminate", url: "/slider/Laminate Flooring.webp" },
  { label: "Vinyl Tile", url: "/slider/Vinyl Tile.webp" },
  { label: "Sheet Vinyl", url: "/slider/Vinyl flooring.webp" },
  { label: "Carpet Tile", url: "/slider/Carpet Tile.webp" },
];

export default function HeroEditor({ data = [], onChange }: Props) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleAdd = () => {
    const newSlide: HeroSlide = {
      title: "New Premium <br /><span>Flooring Solution</span>",
      sub_title: "EXPERT FITTING SERVICES",
      description: "Professional residential and commercial flooring installation tailored to your space.",
      bg_image: "/slider/Carpet.webp",
      cta_text: "Get a Free Quote",
      cta_link: "/contact",
      video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
      badge_text: "ZK FLOORING PREMIUM CARPET FITTING SERVICE",
    };
    const updated = [...data, newSlide];
    onChange(updated);
    setActiveSlideIndex(updated.length - 1);
  };

  const handleDuplicate = (index: number) => {
    const slideToCopy = data[index];
    if (!slideToCopy) return;
    const duplicated: HeroSlide = {
      ...slideToCopy,
      title: `${slideToCopy.title} (Copy)`,
    };
    const updated = [...data.slice(0, index + 1), duplicated, ...data.slice(index + 1)];
    onChange(updated);
    setActiveSlideIndex(index + 1);
  };

  const handleRemove = (index: number) => {
    if (data.length <= 1) {
      alert("At least one slide is required in the hero section.");
      return;
    }
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.length) return;
    const updated = [...data];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
    setActiveSlideIndex(targetIndex);
  };

  const updateCurrentSlide = (key: keyof HeroSlide, value: string) => {
    const updated = [...data];
    if (!updated[activeSlideIndex]) return;
    updated[activeSlideIndex] = {
      ...updated[activeSlideIndex],
      [key]: value,
    };
    onChange(updated);
  };

  const currentSlide = data[activeSlideIndex] || data[0];

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 space-y-4">
        <Sparkles className="w-12 h-12 mx-auto text-gold-500 animate-pulse" />
        <h4 className="font-semibold text-obsidian-800">No Slides Available</h4>
        <p className="text-xs text-obsidian-500">Initialize the hero section by adding your first slide.</p>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-obsidian-900 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-400 rounded-lg shadow hover:brightness-105"
        >
          <Plus className="w-4 h-4" /> Add First Slide
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-obsidian-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-obsidian-800 flex items-center gap-2">
            Hero Slider Management
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-50 text-gold-700 border border-gold-200">
              {data.length} {data.length === 1 ? 'Slide' : 'Slides'}
            </span>
          </h3>
          <p className="text-xs text-obsidian-500">Customize titles, imagery, CTA buttons, video links &amp; badges.</p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-obsidian-900 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] rounded-lg shadow-sm hover:brightness-105 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Slide
        </button>
      </div>

      {/* Slide Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {data.map((s, idx) => {
          const isActive = idx === activeSlideIndex;
          const cleanTitle = (s.title || `Slide ${idx + 1}`).replace(/<[^>]*>?/gm, '').trim();
          return (
            <button
              key={idx}
              onClick={() => setActiveSlideIndex(idx)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-obsidian-900 text-gold-300 border-obsidian-900 shadow-sm'
                  : 'bg-obsidian-50/70 text-obsidian-600 border-obsidian-200/60 hover:bg-white hover:border-gold-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-extrabold ${
                isActive ? 'bg-gold-400 text-obsidian-950' : 'bg-obsidian-200 text-obsidian-700'
              }`}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="max-w-[100px] truncate text-left">{cleanTitle || `Slide ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {currentSlide && (
        <div className="space-y-5">
          {/* Active Slide Control Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-obsidian-900 to-obsidian-950 text-white border border-gold-500/20 shadow-md">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-gold-300">
                  EDITING SLIDE #{String(activeSlideIndex + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Move Slide Left/Up"
                  disabled={activeSlideIndex === 0}
                  onClick={() => handleMove(activeSlideIndex, 'up')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-gold-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Move Slide Right/Down"
                  disabled={activeSlideIndex === data.length - 1}
                  onClick={() => handleMove(activeSlideIndex, 'down')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-gold-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Duplicate Slide"
                  onClick={() => handleDuplicate(activeSlideIndex)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gold-300 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Delete Slide"
                  onClick={() => handleRemove(activeSlideIndex)}
                  className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Miniature Preview */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-obsidian-800 border border-white/10 flex-shrink-0 relative">
                {currentSlide.bg_image ? (
                  <img
                    src={currentSlide.bg_image}
                    alt=""
                    onError={(e) => {
                      if (currentSlide.bg_image?.startsWith('/') && !e.currentTarget.src.includes(':3000')) {
                        e.currentTarget.src = `http://localhost:3000${currentSlide.bg_image}`;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-obsidian-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block truncate">
                  {currentSlide.sub_title || "NO SUBTITLE"}
                </span>
                <h4
                  className="text-xs font-bold text-white truncate my-0.5"
                  dangerouslySetInnerHTML={{ __html: currentSlide.title || "Untitled Slide" }}
                />
                <span className="text-[10px] text-white/50 block truncate">
                  Button: <strong className="text-gold-200">{currentSlide.cta_text || "Get Quote"}</strong> → {currentSlide.cta_link || "/contact"}
                </span>
              </div>
            </div>
          </div>

          {/* Background Image Setup */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-obsidian-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-gold-600" />
                Slide Background Image
              </label>
            </div>

            {/* Preset Selector */}
            <div>
              <span className="text-[11px] text-obsidian-500 block mb-1.5 font-medium">Choose from standard showroom presets:</span>
              <div className="grid grid-cols-5 gap-1.5">
                {PRESET_IMAGES.map((preset) => {
                  const isSelected = currentSlide.bg_image === preset.url;
                  return (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => updateCurrentSlide('bg_image', preset.url)}
                      className={`p-1 rounded-lg border text-[10px] font-semibold text-center transition-all ${
                        isSelected
                          ? 'border-gold-500 bg-gold-50 text-gold-900 ring-2 ring-gold-400/30'
                          : 'border-obsidian-200 bg-obsidian-50/50 text-obsidian-700 hover:bg-white'
                      }`}
                    >
                      <div className="w-full h-8 rounded mb-1 overflow-hidden bg-obsidian-200">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          onError={(e) => {
                            if (preset.url.startsWith('/') && !e.currentTarget.src.includes(':3000')) {
                              e.currentTarget.src = `http://localhost:3000${preset.url}`;
                            }
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="block truncate">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <FormField label="Or Custom Image URL / Upload">
              <ImageUploader
                value={currentSlide.bg_image}
                onChange={(url) => updateCurrentSlide('bg_image', url)}
              />
            </FormField>
          </div>

          {/* Subtitle / Category Badge */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <FormField label="Slide Subtitle / Category Tag">
              <input
                type="text"
                value={currentSlide.sub_title || ''}
                onChange={(e) => updateCurrentSlide('sub_title', e.target.value)}
                placeholder="e.g. COMMERCIAL & DOMESTIC, ZK FLOORING SERVICES"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>
          </div>

          {/* Slide Heading */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-obsidian-800 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-gold-600" />
                Slide Main Heading (Title)
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => updateCurrentSlide('title', `${currentSlide.title || ''} <br />`)}
                  className="px-2 py-0.5 text-[10px] font-bold bg-obsidian-100 hover:bg-obsidian-200 text-obsidian-700 rounded transition-colors"
                >
                  + &lt;br /&gt;
                </button>
                <button
                  type="button"
                  onClick={() => updateCurrentSlide('title', `${currentSlide.title || ''} <span>Gold Text</span>`)}
                  className="px-2 py-0.5 text-[10px] font-bold bg-gold-100 hover:bg-gold-200 text-gold-800 rounded transition-colors"
                >
                  + &lt;span&gt;
                </button>
              </div>
            </div>

            <textarea
              rows={2}
              value={currentSlide.title || ''}
              onChange={(e) => updateCurrentSlide('title', e.target.value)}
              placeholder="e.g. Luxury & Comfort <br /><span>Carpet Fitting</span>"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 resize-none font-mono"
            />
            <div className="p-2.5 rounded-lg bg-obsidian-900 text-white text-xs">
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider block mb-1">Live Heading Preview:</span>
              <div
                className="font-bold text-sm leading-tight text-white [&>span]:text-gold-300 [&>span]:font-extrabold"
                dangerouslySetInnerHTML={{ __html: currentSlide.title || "Untitled Heading" }}
              />
            </div>
          </div>

          {/* Slide Description */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <FormField label="Slide Description Text">
              <textarea
                rows={3}
                value={currentSlide.description || ''}
                onChange={(e) => updateCurrentSlide('description', e.target.value)}
                placeholder="Detailed description of the service, benefits and craftsmanship..."
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 leading-relaxed focus:bg-white focus:outline-none focus:border-gold-500 resize-none"
              />
            </FormField>
          </div>

          {/* CTA Button Settings */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <label className="text-xs font-bold text-obsidian-800 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-gold-600" />
              Primary Action Button (CTA)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Button Label">
                <input
                  type="text"
                  value={currentSlide.cta_text || ''}
                  onChange={(e) => updateCurrentSlide('cta_text', e.target.value)}
                  placeholder="e.g. Get a Free Quote, Explore Carpets"
                  className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
                />
              </FormField>
              <FormField label="Button Destination Link">
                <input
                  type="text"
                  value={currentSlide.cta_link || ''}
                  onChange={(e) => updateCurrentSlide('cta_link', e.target.value)}
                  placeholder="e.g. /contact, /services, /pricing"
                  className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-mono focus:bg-white focus:outline-none focus:border-gold-500"
                />
              </FormField>
            </div>
          </div>

          {/* Video URL & Rotating Badge Text */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Video Popup URL (YouTube/Vimeo)">
                <div className="relative">
                  <input
                    type="text"
                    value={currentSlide.video_url || ''}
                    onChange={(e) => updateCurrentSlide('video_url', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-xs text-obsidian-800 font-mono focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </FormField>
              <FormField label="Rotating Stamp Text">
                <div className="relative">
                  <input
                    type="text"
                    value={currentSlide.badge_text || ''}
                    onChange={(e) => updateCurrentSlide('badge_text', e.target.value)}
                    placeholder="ZK FLOORING PREMIUM CARPET FITTING SERVICE"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-xs text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </FormField>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

