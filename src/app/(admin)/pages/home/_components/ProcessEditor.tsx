import React from 'react';
import FormField from "@/components/ui/FormField";
import { Plus, Trash2 } from "lucide-react";
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

export default function ProcessEditor({ data, onChange }: Props) {
  const currentData = {
    section_title: data?.section_title || "",
    steps: data?.steps || []
  };

  const updateField = (key: keyof ProcessData, value: any) => {
    onChange({ ...currentData, [key]: value });
  };

  const handleAddStep = () => {
    updateField('steps', [...currentData.steps, {
      step_text: `STEP 0${currentData.steps.length + 1}`,
      icon: "",
      title: "",
      description: ""
    }]);
  };

  const updateStep = (index: number, key: keyof ProcessStep, value: any) => {
    const newSteps = [...currentData.steps];
    newSteps[index] = { ...newSteps[index], [key]: value };
    updateField('steps', newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = [...currentData.steps];
    newSteps.splice(index, 1);
    updateField('steps', newSteps);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)] mb-4">Section Header</h3>
        <FormField label="Section Title (HTML allowed)"><input type="text" value={currentData.section_title} onChange={e => updateField('section_title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
      </div>

      <hr className="border-obsidian-100" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)]">Process Steps</h3>
          <button onClick={handleAddStep} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-obsidian-700 rounded-lg hover:bg-obsidian-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentData.steps.map((step, index) => (
            <div key={index} className="p-5 border border-obsidian-100 rounded-[var(--radius-card)] bg-white shadow-sm space-y-4 relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => removeStep(index)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Step Text (e.g. STEP 01)"><input type="text" value={step.step_text} onChange={e => updateStep(index, 'step_text', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
                <FormField label="Icon Image URL"><input type="text" value={step.icon} onChange={e => updateStep(index, 'icon', e.target.value)} placeholder="https://img.icons8.com/..." className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              </div>
              
              <FormField label="Title"><input type="text" value={step.title} onChange={e => updateStep(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              <FormField label="Description"><textarea value={step.description} onChange={e => updateStep(index, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
