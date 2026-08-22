import React from 'react';
import FormField from "@/components/ui/FormField";
import { Plus, Trash2 } from "lucide-react";

export interface PricingPlan {
  name: string;
  price: string;
  cycle: string;
  description: string;
  cta_text: string;
  cta_link: string;
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

export default function PricingEditor({ data, onChange }: Props) {
  const currentData = {
    section_subtitle: data?.section_subtitle || "",
    section_title: data?.section_title || "",
    plans: data?.plans || []
  };

  const updateField = (key: keyof PricingData, value: any) => {
    onChange({ ...currentData, [key]: value });
  };

  const handleAddPlan = () => {
    updateField('plans', [...currentData.plans, {
      name: "New Plan", price: "0 USD", cycle: "/ month", description: "", cta_text: "Join this Plan", cta_link: "#",
      features: [
        { text: "Feature 1", isActive: true },
        { text: "Feature 2", isActive: true },
        { text: "Feature 3", isActive: false },
      ]
    }]);
  };

  const updatePlan = (index: number, key: keyof PricingPlan, value: any) => {
    const newPlans = [...currentData.plans];
    newPlans[index] = { ...newPlans[index], [key]: value };
    updateField('plans', newPlans);
  };

  const updateFeature = (planIndex: number, featureIndex: number, text: string, isActive: boolean) => {
    const newPlans = [...currentData.plans];
    const newFeatures = [...newPlans[planIndex].features];
    newFeatures[featureIndex] = { text, isActive };
    newPlans[planIndex] = { ...newPlans[planIndex], features: newFeatures };
    updateField('plans', newPlans);
  };

  const addFeature = (planIndex: number) => {
    const newPlans = [...currentData.plans];
    newPlans[planIndex].features.push({ text: "New Feature", isActive: true });
    updateField('plans', newPlans);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...currentData.plans];
    newPlans[planIndex].features.splice(featureIndex, 1);
    updateField('plans', newPlans);
  };

  const removePlan = (index: number) => {
    const newPlans = [...currentData.plans];
    newPlans.splice(index, 1);
    updateField('plans', newPlans);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)] mb-4">Section Header</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Section Subtitle"><input type="text" value={currentData.section_subtitle} onChange={e => updateField('section_subtitle', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="Section Title (HTML allowed)"><input type="text" value={currentData.section_title} onChange={e => updateField('section_title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
        </div>
      </div>

      <hr className="border-obsidian-100" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)]">Pricing Plans</h3>
          <button onClick={handleAddPlan} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-obsidian-700 rounded-lg hover:bg-obsidian-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentData.plans.map((plan, pIndex) => (
            <div key={pIndex} className="p-4 border border-obsidian-100 rounded-[var(--radius-card)] bg-white shadow-sm space-y-4 relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => removePlan(pIndex)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>

              <FormField label="Plan Name"><input type="text" value={plan.name} onChange={e => updatePlan(pIndex, 'name', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 font-bold" /></FormField>
              
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Price"><input type="text" value={plan.price} onChange={e => updatePlan(pIndex, 'price', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
                <FormField label="Cycle"><input type="text" value={plan.cycle} onChange={e => updatePlan(pIndex, 'cycle', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              </div>
              
              <FormField label="Description"><input type="text" value={plan.description} onChange={e => updatePlan(pIndex, 'description', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              
              <div className="grid grid-cols-2 gap-2">
                <FormField label="CTA Text"><input type="text" value={plan.cta_text} onChange={e => updatePlan(pIndex, 'cta_text', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
                <FormField label="CTA Link"><input type="text" value={plan.cta_link} onChange={e => updatePlan(pIndex, 'cta_link', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-semibold text-obsidian-600">Features</h5>
                  <button onClick={() => addFeature(pIndex)} className="text-xs text-obsidian-500 hover:text-gold-500">Add Feature</button>
                </div>
                <div className="space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-2">
                      <input type="checkbox" checked={feature.isActive} onChange={e => updateFeature(pIndex, fIndex, feature.text, e.target.checked)} className="rounded border-obsidian-300 text-gold-500 focus:ring-gold-500" />
                      <input type="text" value={feature.text} onChange={e => updateFeature(pIndex, fIndex, e.target.value, feature.isActive)} className="flex-1 px-2 py-1 bg-white border border-obsidian-200 rounded text-sm focus:outline-none focus:border-gold-400" />
                      <button onClick={() => removeFeature(pIndex, fIndex)} className="text-red-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
