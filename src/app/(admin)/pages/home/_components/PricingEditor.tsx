"use client";

import React, { useState } from 'react';
import FormField from "@/components/ui/FormField";
import { Plus, Trash2, Tag, Check, X } from "lucide-react";

export interface PricingPlan {
  name: string;
  price: string;
  cycle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  is_popular?: boolean;
  features: { text: string; isActive: boolean }[];
}

export interface PricingData {
  section_subtitle: string;
  section_title: string;
  plans: PricingPlan[];
}

interface Props {
  data: PricingData;
  onChange: (data: PricingData) => void;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: "29 USD",
    cycle: "/ month",
    description: "Organize Daily Task by free",
    cta_text: "Join this Plan",
    cta_link: "/contact",
    is_popular: false,
    features: [
      { text: "3 Users available", isActive: true },
      { text: "Limited tools", isActive: true },
      { text: "Unlimited Supports", isActive: true },
      { text: "API Access", isActive: false },
      { text: "Premium apps", isActive: false },
    ]
  },
  {
    name: "Starter",
    price: "39 USD",
    cycle: "/ month",
    description: "Organize Daily Task by free",
    cta_text: "Join this Plan",
    cta_link: "/contact",
    is_popular: true,
    features: [
      { text: "3 Users available", isActive: true },
      { text: "Limited tools", isActive: true },
      { text: "Unlimited Supports", isActive: true },
      { text: "API Access", isActive: true },
      { text: "Premium apps", isActive: false },
    ]
  },
  {
    name: "Business",
    price: "39 USD",
    cycle: "/ month",
    description: "Organize Daily Task by free",
    cta_text: "Join this Plan",
    cta_link: "/contact",
    is_popular: false,
    features: [
      { text: "3 Users available", isActive: true },
      { text: "Limited tools", isActive: true },
      { text: "Unlimited Supports", isActive: true },
      { text: "API Access", isActive: true },
      { text: "Premium apps", isActive: true },
    ]
  }
];

export default function PricingEditor({ data, onChange }: Props) {
  const [activePlanIndex, setActivePlanIndex] = useState(0);

  const currentData: PricingData = {
    section_subtitle: data?.section_subtitle || "Pricing Plans",
    section_title: data?.section_title || "Choose the Perfect Plans for <br /> Your Business Growth",
    plans: data?.plans && data.plans.length > 0 ? data.plans : DEFAULT_PLANS
  };

  const updateHeader = (key: 'section_subtitle' | 'section_title', value: string) => {
    onChange({ ...currentData, [key]: value });
  };

  const handleAddPlan = () => {
    const newPlan: PricingPlan = {
      name: "Custom Package",
      price: "49 USD",
      cycle: "/ month",
      description: "Tailored commercial flooring package",
      cta_text: "Join this Plan",
      cta_link: "/contact",
      is_popular: false,
      features: [
        { text: "Full Measurement Service", isActive: true },
        { text: "Sample Drop-off", isActive: true },
        { text: "Guaranteed Fitting Warranty", isActive: true },
      ]
    };
    const updated = [...currentData.plans, newPlan];
    onChange({ ...currentData, plans: updated });
    setActivePlanIndex(updated.length - 1);
  };

  const handleRemovePlan = (index: number) => {
    if (currentData.plans.length <= 1) {
      alert("At least one pricing plan is required.");
      return;
    }
    const updated = currentData.plans.filter((_, i) => i !== index);
    onChange({ ...currentData, plans: updated });
    setActivePlanIndex(Math.max(0, index - 1));
  };

  const updateCurrentPlan = (key: keyof PricingPlan, value: any) => {
    const updated = [...currentData.plans];
    if (!updated[activePlanIndex]) return;
    updated[activePlanIndex] = {
      ...updated[activePlanIndex],
      [key]: value,
    };
    onChange({ ...currentData, plans: updated });
  };

  const updateFeature = (fIndex: number, text: string, isActive: boolean) => {
    const updated = [...currentData.plans];
    if (!updated[activePlanIndex]) return;
    const feats = [...updated[activePlanIndex].features];
    feats[fIndex] = { text, isActive };
    updated[activePlanIndex] = { ...updated[activePlanIndex], features: feats };
    onChange({ ...currentData, plans: updated });
  };

  const addFeature = () => {
    const updated = [...currentData.plans];
    if (!updated[activePlanIndex]) return;
    const feats = [...updated[activePlanIndex].features, { text: "New Plan Feature", isActive: true }];
    updated[activePlanIndex] = { ...updated[activePlanIndex], features: feats };
    onChange({ ...currentData, plans: updated });
  };

  const removeFeature = (fIndex: number) => {
    const updated = [...currentData.plans];
    if (!updated[activePlanIndex]) return;
    const feats = updated[activePlanIndex].features.filter((_, i) => i !== fIndex);
    updated[activePlanIndex] = { ...updated[activePlanIndex], features: feats };
    onChange({ ...currentData, plans: updated });
  };

  const currentPlan = currentData.plans[activePlanIndex] || currentData.plans[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
        <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
          <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2">
            <Tag className="w-4 h-4 text-gold-600" />
            Pricing Section Header
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Section Subtitle">
            <input
              type="text"
              value={currentData.section_subtitle}
              onChange={(e) => updateHeader('section_subtitle', e.target.value)}
              placeholder="Pricing Plans"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>

          <FormField label="Section Title (HTML allowed)">
            <input
              type="text"
              value={currentData.section_title}
              onChange={(e) => updateHeader('section_title', e.target.value)}
              placeholder="Choose the Perfect Plans for <br /> Your Business Growth"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
            />
          </FormField>
        </div>
      </div>

      {/* Plan Selector Bar */}
      <div className="flex items-center justify-between border-b border-obsidian-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-obsidian-800 flex items-center gap-2">
            Plans ({currentData.plans.length})
          </h3>
          <p className="text-xs text-obsidian-500">Edit tier names, rates, and features list.</p>
        </div>

        <button
          onClick={handleAddPlan}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-obsidian-900 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] rounded-lg shadow-sm hover:brightness-105 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Plan
        </button>
      </div>

      {/* Plan Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {currentData.plans.map((p, idx) => {
          const isActive = idx === activePlanIndex;
          return (
            <button
              key={idx}
              onClick={() => setActivePlanIndex(idx)}
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
              <span className="max-w-[120px] truncate">{p.name || `Plan ${idx + 1}`}</span>
              {p.is_popular && <span className="text-[9px] bg-gold-400 text-obsidian-950 px-1 rounded font-bold">HOT</span>}
            </button>
          );
        })}
      </div>

      {currentPlan && (
        <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
            <span className="text-xs font-mono font-bold text-gold-700">
              EDITING: {currentPlan.name} ({currentPlan.price})
            </span>
            <button
              type="button"
              onClick={() => handleRemovePlan(activePlanIndex)}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-xs font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Plan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Plan Name">
              <input
                type="text"
                value={currentPlan.name}
                onChange={(e) => updateCurrentPlan('name', e.target.value)}
                placeholder="Starter"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>

            <FormField label="Price Label">
              <input
                type="text"
                value={currentPlan.price}
                onChange={(e) => updateCurrentPlan('price', e.target.value)}
                placeholder="29 USD"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>

            <FormField label="Billing Cycle">
              <input
                type="text"
                value={currentPlan.cycle}
                onChange={(e) => updateCurrentPlan('cycle', e.target.value)}
                placeholder="/ month"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Description">
              <input
                type="text"
                value={currentPlan.description}
                onChange={(e) => updateCurrentPlan('description', e.target.value)}
                placeholder="Organize Daily Task by free"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>

            <FormField label="Button Label">
              <input
                type="text"
                value={currentPlan.cta_text}
                onChange={(e) => updateCurrentPlan('cta_text', e.target.value)}
                placeholder="Join this Plan"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>
          </div>

          {/* Features List */}
          <div className="space-y-2 pt-2 border-t border-obsidian-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-obsidian-800">Plan Inclusions / Features</label>
              <button
                type="button"
                onClick={addFeature}
                className="text-xs text-gold-700 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Feature Item
              </button>
            </div>

            <div className="space-y-2">
              {currentPlan.features?.map((f, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateFeature(fIdx, f.text, !f.isActive)}
                    className={`p-1.5 rounded-lg border text-xs flex items-center justify-center ${
                      f.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {f.isActive ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </button>

                  <input
                    type="text"
                    value={f.text}
                    onChange={(e) => updateFeature(fIdx, e.target.value, f.isActive)}
                    className="flex-1 px-3 py-1.5 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-xs text-obsidian-800 focus:bg-white focus:outline-none focus:border-gold-500"
                  />

                  <button
                    type="button"
                    onClick={() => removeFeature(fIdx)}
                    className="p-1 text-obsidian-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
