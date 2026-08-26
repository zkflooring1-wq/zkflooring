"use client";

import React, { useState } from 'react';
import FormField from "@/components/ui/FormField";
import { Plus, Trash2, ChevronLeft, ChevronRight, Workflow, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";

export interface ProcessStep {
  step_text: string;
  icon: string;
  title: string;
  description: string;
}

export interface ProcessData {
  section_title: string;
  steps: ProcessStep[];
}

interface Props {
  data: ProcessData;
  onChange: (data: ProcessData) => void;
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    step_text: "STEP 01",
    icon: "https://img.icons8.com/plumpy/24/tape-measure-sewing.png",
    title: "Site Consultation",
    description: "Understand the space, assess the flooring requirements, and recommend the right solution."
  },
  {
    step_text: "STEP 02",
    icon: "https://img.icons8.com/plumpy/24/wallpaper-roll.png",
    title: "Product Selection",
    description: "Explore the right carpets, carpet tiles, vinyl, LVT, and flooring options for your space."
  },
  {
    step_text: "STEP 03",
    icon: "https://img.icons8.com/plumpy/24/cut-paper.png",
    title: "Professional Installation",
    description: "Prepare the surface and install your selected flooring with precision and professional workmanship."
  },
  {
    step_text: "STEP 04",
    icon: "https://img.icons8.com/plumpy/24/best-seller.png",
    title: "Final Inspection & Support",
    description: "Complete the final checks and provide reliable support after your flooring installation."
  }
];

export default function ProcessEditor({ data, onChange }: Props) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const currentData: ProcessData = {
    section_title: data?.section_title || 'PR<span className="text-theme">O</span>CESS',
    steps: data?.steps && data.steps.length > 0 ? data.steps : DEFAULT_STEPS
  };

  const updateHeader = (title: string) => {
    onChange({ ...currentData, section_title: title });
  };

  const handleAddStep = () => {
    const newStep: ProcessStep = {
      step_text: `STEP 0${currentData.steps.length + 1}`,
      icon: "https://img.icons8.com/plumpy/24/best-seller.png",
      title: "New Workflow Step",
      description: "Brief overview of this installation phase."
    };
    const updated = [...currentData.steps, newStep];
    onChange({ ...currentData, steps: updated });
    setActiveStepIndex(updated.length - 1);
  };

  const handleRemoveStep = (index: number) => {
    if (currentData.steps.length <= 1) {
      alert("At least one process step is required.");
      return;
    }
    const updated = currentData.steps.filter((_, i) => i !== index);
    onChange({ ...currentData, steps: updated });
    setActiveStepIndex(Math.max(0, index - 1));
  };

  const updateCurrentStep = (key: keyof ProcessStep, value: string) => {
    const updated = [...currentData.steps];
    if (!updated[activeStepIndex]) return;
    updated[activeStepIndex] = {
      ...updated[activeStepIndex],
      [key]: value,
    };
    onChange({ ...currentData, steps: updated });
  };

  const currentStep = currentData.steps[activeStepIndex] || currentData.steps[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
        <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
          <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2">
            <Workflow className="w-4 h-4 text-gold-600" />
            Process Workflow Section
          </h3>
        </div>

        <FormField label="Process Section Heading (HTML allowed)">
          <input
            type="text"
            value={currentData.section_title}
            onChange={(e) => updateHeader(e.target.value)}
            placeholder='PR<span className="text-theme">O</span>CESS'
            className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
          />
        </FormField>
      </div>

      {/* Steps Navigation Bar */}
      <div className="flex items-center justify-between border-b border-obsidian-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-obsidian-800 flex items-center gap-2">
            Workflow Steps ({currentData.steps.length})
          </h3>
          <p className="text-xs text-obsidian-500">Edit the sequential 4-step installation workflow.</p>
        </div>

        <button
          onClick={handleAddStep}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-obsidian-900 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] rounded-lg shadow-sm hover:brightness-105 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Step
        </button>
      </div>

      {/* Steps Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {currentData.steps.map((s, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveStepIndex(idx)}
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
              <span className="max-w-[120px] truncate">{s.title || `Step ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {currentStep && (
        <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
            <span className="text-xs font-mono font-bold text-gold-700">
              EDITING: {currentStep.step_text || `STEP 0${activeStepIndex + 1}`}
            </span>
            <button
              type="button"
              onClick={() => handleRemoveStep(activeStepIndex)}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-xs font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Step
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Step Label (e.g. STEP 01)">
              <input
                type="text"
                value={currentStep.step_text}
                onChange={(e) => updateCurrentStep('step_text', e.target.value)}
                placeholder="STEP 01"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>

            <FormField label="Step Title">
              <input
                type="text"
                value={currentStep.title}
                onChange={(e) => updateCurrentStep('title', e.target.value)}
                placeholder="Site Consultation"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>
          </div>

          <FormField label="Step Description">
            <textarea
              rows={2}
              value={currentStep.description}
              onChange={(e) => updateCurrentStep('description', e.target.value)}
              placeholder="Detailed step overview..."
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 leading-relaxed focus:bg-white focus:outline-none focus:border-gold-500 resize-none"
            />
          </FormField>

          <FormField label="Icon URL (PNG/SVG)">
            <input
              type="text"
              value={currentStep.icon}
              onChange={(e) => updateCurrentStep('icon', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-xs text-obsidian-800 font-mono focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>
        </div>
      )}
    </div>
  );
}
