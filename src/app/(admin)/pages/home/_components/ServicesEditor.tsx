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
  Image as ImageIcon, 
  Link as LinkIcon, 
  Type, 
  Tag as TagIcon,
  Layers
} from "lucide-react";

export interface ServiceCard {
  number: string;
  image: string;
  sub_heading: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
}

export interface ServicesData {
  section_subtitle: string;
  section_title: string;
  cards: ServiceCard[];
}

interface Props {
  data: ServicesData;
  onChange: (data: ServicesData) => void;
}

const PRESET_SERVICE_IMAGES = [
  { label: "Self Levelling", url: "/services/Self Levelling.webp" },
  { label: "Carpet Fitting", url: "/services/Carpet, Carpet Tile.webp" },
  { label: "LVT & Vinyl", url: "/services/Vinyl, Vinyl Tile.webp" },
  { label: "Laminate Timber", url: "/about page/1.webp" },
  { label: "Commercial Floor", url: "/about page/2.webp" },
];

const DEFAULT_SERVICE_CARDS: ServiceCard[] = [
  {
    number: "01.",
    sub_heading: "PREPARATION",
    title: "Expert Self Levelling & <br /> Subfloor Preparation",
    description: "Ensure a perfectly smooth and durable foundation for your new floors. Our professional self-levelling services guarantee a flawless finish with moisture testing and DPM barrier protection.",
    image: "/services/Self Levelling.webp",
    link: "/contact",
    tags: ["Latex Screed", "Plywood", "DPM", "Moisture Testing"]
  },
  {
    number: "02.",
    sub_heading: "INSTALLATION",
    title: "Premium Carpet & <br /> Carpet Tile Fitting",
    description: "From luxurious domestic carpets to heavy-duty commercial tiles, we provide expert installation tailored to your space with premium underlays and master gripper stretching.",
    image: "/services/Carpet, Carpet Tile.webp",
    link: "/contact",
    tags: ["Broadloom", "Carpet Tiles", "Underlay", "Stair Runners"]
  },
  {
    number: "03.",
    sub_heading: "INSTALLATION",
    title: "Luxury Vinyl Tile (LVT) & <br /> Sheet Vinyl Flooring",
    description: "Transform your interiors with versatile, 100% water-resistant vinyl solutions. We specialize in precision fitting for stunning LVT herringbone layouts and seamless commercial sheets.",
    image: "/services/Vinyl, Vinyl Tile.webp",
    link: "/contact",
    tags: ["LVT", "Sheet Vinyl", "Amtico", "Karndean"]
  }
];

export default function ServicesEditor({ data, onChange }: Props) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const currentData: ServicesData = {
    section_subtitle: data?.section_subtitle || "Our Services",
    section_title: data?.section_title || "Specialist Flooring Solutions & <br />Precision Installation",
    cards: (data?.cards && Array.isArray(data.cards) && data.cards.length > 0) ? data.cards : DEFAULT_SERVICE_CARDS
  };

  const updateHeaderField = (key: 'section_subtitle' | 'section_title', value: string) => {
    onChange({ ...currentData, [key]: value });
  };

  const handleAddCard = () => {
    const newCard: ServiceCard = {
      number: `0${currentData.cards.length + 1}.`,
      image: "/services/Self Levelling.webp",
      sub_heading: "INSTALLATION",
      title: "New Flooring Service <br /><span>Solutions</span>",
      description: "Professional flooring fitting and installation crafted to the highest UK standards.",
      link: "/contact",
      tags: ["Commercial", "Residential", "Free Survey"]
    };
    const updated = [...currentData.cards, newCard];
    onChange({ ...currentData, cards: updated });
    setActiveCardIndex(updated.length - 1);
  };

  const handleDuplicateCard = (index: number) => {
    const cardToCopy = currentData.cards[index];
    if (!cardToCopy) return;
    const duplicated: ServiceCard = {
      ...cardToCopy,
      number: `0${currentData.cards.length + 1}.`,
      title: `${cardToCopy.title} (Copy)`,
    };
    const updated = [...currentData.cards.slice(0, index + 1), duplicated, ...currentData.cards.slice(index + 1)];
    onChange({ ...currentData, cards: updated });
    setActiveCardIndex(index + 1);
  };

  const handleRemoveCard = (index: number) => {
    if (currentData.cards.length <= 1) {
      alert("At least one service card is required.");
      return;
    }
    const updated = currentData.cards.filter((_, i) => i !== index);
    onChange({ ...currentData, cards: updated });
    setActiveCardIndex(Math.max(0, index - 1));
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentData.cards.length) return;
    const updated = [...currentData.cards];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange({ ...currentData, cards: updated });
    setActiveCardIndex(targetIndex);
  };

  const updateCurrentCard = (key: keyof ServiceCard, value: any) => {
    const updated = [...currentData.cards];
    if (!updated[activeCardIndex]) return;
    updated[activeCardIndex] = {
      ...updated[activeCardIndex],
      [key]: value,
    };
    onChange({ ...currentData, cards: updated });
  };

  const handleTagChange = (tagIndex: number, val: string) => {
    const card = currentData.cards[activeCardIndex];
    if (!card) return;
    const newTags = [...(card.tags || [])];
    newTags[tagIndex] = val;
    updateCurrentCard('tags', newTags);
  };

  const handleAddTag = () => {
    const card = currentData.cards[activeCardIndex];
    if (!card) return;
    const newTags = [...(card.tags || []), "New Tag"];
    updateCurrentCard('tags', newTags);
  };

  const handleRemoveTag = (tagIndex: number) => {
    const card = currentData.cards[activeCardIndex];
    if (!card) return;
    const newTags = (card.tags || []).filter((_, i) => i !== tagIndex);
    updateCurrentCard('tags', newTags);
  };

  const currentCard = currentData.cards[activeCardIndex] || currentData.cards[0];

  return (
    <div className="space-y-6">
      {/* Section Header Controls */}
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
        <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
          <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-gold-600" />
            Services Section Header
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Section Subtitle">
            <input
              type="text"
              value={currentData.section_subtitle}
              onChange={(e) => updateHeaderField('section_subtitle', e.target.value)}
              placeholder="e.g. Our Services"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>

          <FormField label="Section Title (HTML allowed)">
            <input
              type="text"
              value={currentData.section_title}
              onChange={(e) => updateHeaderField('section_title', e.target.value)}
              placeholder="e.g. Specialist Flooring Solutions & <br />Precision Installation"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
            />
          </FormField>
        </div>
      </div>

      {/* Service Cards Header & Tabs */}
      <div className="flex items-center justify-between border-b border-obsidian-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-obsidian-800 flex items-center gap-2">
            Showcase Service Cards
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-50 text-gold-700 border border-gold-200">
              {currentData.cards.length} Cards
            </span>
          </h3>
          <p className="text-xs text-obsidian-500">Manage pinned stacked service cards displayed on home page.</p>
        </div>

        <button
          onClick={handleAddCard}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-obsidian-900 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] rounded-lg shadow-sm hover:brightness-105 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Card
        </button>
      </div>

      {/* Card Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {currentData.cards.map((c, idx) => {
          const isActive = idx === activeCardIndex;
          const cleanTitle = (c.title || `Card ${idx + 1}`).replace(/<[^>]*>?/gm, '').trim();
          return (
            <button
              key={idx}
              onClick={() => setActiveCardIndex(idx)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-obsidian-900 text-gold-300 border-obsidian-900 shadow-sm'
                  : 'bg-obsidian-50/70 text-obsidian-600 border-obsidian-200/60 hover:bg-white hover:border-gold-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-extrabold ${
                isActive ? 'bg-gold-400 text-obsidian-950' : 'bg-obsidian-200 text-obsidian-700'
              }`}>
                {c.number || String(idx + 1).padStart(2, '0')}
              </span>
              <span className="max-w-[110px] truncate text-left">{cleanTitle || `Card ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {currentCard && (
        <div className="space-y-5">
          {/* Active Card Control & Mini Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-obsidian-900 to-obsidian-950 text-white border border-gold-500/20 shadow-md">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-gold-300">
                  EDITING CARD #{currentCard.number || String(activeCardIndex + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Move Left/Up"
                  disabled={activeCardIndex === 0}
                  onClick={() => handleMoveCard(activeCardIndex, 'up')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-gold-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Move Right/Down"
                  disabled={activeCardIndex === currentData.cards.length - 1}
                  onClick={() => handleMoveCard(activeCardIndex, 'down')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-gold-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Duplicate Card"
                  onClick={() => handleDuplicateCard(activeCardIndex)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gold-300 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Delete Card"
                  onClick={() => handleRemoveCard(activeCardIndex)}
                  className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card Miniature Preview */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-obsidian-800 border border-white/10 flex-shrink-0 relative">
                {currentCard.image ? (
                  <img
                    src={currentCard.image}
                    alt=""
                    onError={(e) => {
                      if (currentCard.image?.startsWith('/') && !e.currentTarget.src.includes(':3000')) {
                        e.currentTarget.src = `http://localhost:3000${currentCard.image}`;
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
                  {currentCard.sub_heading || "CATEGORY"}
                </span>
                <h4
                  className="text-xs font-bold text-white truncate my-0.5"
                  dangerouslySetInnerHTML={{ __html: currentCard.title || "Untitled Service" }}
                />
                <span className="text-[10px] text-white/50 block truncate">
                  Tags: <strong className="text-gold-200">{currentCard.tags?.join(', ') || 'No tags'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Number & Category Subheading */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Card Number (e.g. 01.)">
                <input
                  type="text"
                  value={currentCard.number || ''}
                  onChange={(e) => updateCurrentCard('number', e.target.value)}
                  placeholder="01."
                  className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-mono font-bold focus:bg-white focus:outline-none focus:border-gold-500"
                />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Sub-heading / Category Badge">
                  <input
                    type="text"
                    value={currentCard.sub_heading || ''}
                    onChange={(e) => updateCurrentCard('sub_heading', e.target.value)}
                    placeholder="e.g. PREPARATION, INSTALLATION, TIMBER"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Card Title */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-obsidian-800 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-gold-600" />
                Card Title (HTML allowed)
              </label>
              <button
                type="button"
                onClick={() => updateCurrentCard('title', `${currentCard.title || ''} <br />`)}
                className="px-2 py-0.5 text-[10px] font-bold bg-obsidian-100 hover:bg-obsidian-200 text-obsidian-700 rounded transition-colors"
              >
                + &lt;br /&gt;
              </button>
            </div>

            <textarea
              rows={2}
              value={currentCard.title || ''}
              onChange={(e) => updateCurrentCard('title', e.target.value)}
              placeholder="e.g. Expert Self Levelling & <br /> Subfloor Preparation"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 resize-none font-mono"
            />
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <FormField label="Card Description">
              <textarea
                rows={3}
                value={currentCard.description || ''}
                onChange={(e) => updateCurrentCard('description', e.target.value)}
                placeholder="Comprehensive service description..."
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 leading-relaxed focus:bg-white focus:outline-none focus:border-gold-500 resize-none"
              />
            </FormField>
          </div>

          {/* Destination Link */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <FormField label="Learn More Destination URL">
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-3 text-obsidian-400" />
                <input
                  type="text"
                  value={currentCard.link || ''}
                  onChange={(e) => updateCurrentCard('link', e.target.value)}
                  placeholder="/contact or /services/carpet-fitting"
                  className="w-full pl-9 pr-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-mono focus:bg-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </FormField>
          </div>

          {/* Tags Chips */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-obsidian-800 flex items-center gap-1.5">
                <TagIcon className="w-3.5 h-3.5 text-gold-600" />
                Feature Tags & Badges
              </label>
              <button
                type="button"
                onClick={handleAddTag}
                className="text-[11px] font-bold text-gold-700 hover:text-gold-800 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Tag
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(currentCard.tags || []).map((tag, tIdx) => (
                <div key={tIdx} className="flex items-center gap-1 bg-obsidian-50 border border-obsidian-200 rounded-lg px-2 py-1">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(tIdx, e.target.value)}
                    placeholder={`Tag ${tIdx + 1}`}
                    className="w-full text-xs font-medium bg-transparent focus:outline-none text-obsidian-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tIdx)}
                    className="text-obsidian-400 hover:text-red-500 p-0.5"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card Image Setup */}
          <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-obsidian-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-gold-600" />
                Featured Service Image
              </label>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] text-obsidian-500 block mb-1.5 font-medium">Standard showroom presets:</span>
              <div className="grid grid-cols-5 gap-1.5">
                {PRESET_SERVICE_IMAGES.map((preset) => {
                  const isSelected = currentCard.image === preset.url;
                  return (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => updateCurrentCard('image', preset.url)}
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
                value={currentCard.image}
                onChange={(url) => updateCurrentCard('image', url)}
              />
            </FormField>
          </div>
        </div>
      )}
    </div>
  );
}

