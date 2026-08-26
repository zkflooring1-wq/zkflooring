"use client";

import React, { useState } from 'react';
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import { Plus, Trash2, Users, UserPlus } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface TeamData {
  section_subtitle: string;
  section_title: string;
  members: TeamMember[];
}

interface Props {
  data: TeamData;
  onChange: (data: TeamData) => void;
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Jobaer Khanom",
    role: "UI/UX Designer",
    image: "/Our Team/1.jpg"
  },
  {
    name: "Sayma D. Farna",
    role: "App Developer",
    image: "/Our Team/2.jpg"
  },
  {
    name: "Jubin E. Nawtail",
    role: "SEO Marketer",
    image: "/Our Team/3.jpg"
  }
];

export default function TeamEditor({ data, onChange }: Props) {
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);

  const currentData: TeamData = {
    section_subtitle: data?.section_subtitle || "Our Team",
    section_title: data?.section_title || "Meet the Expert Team Powering Our <br />Goals and Ambitions",
    members: data?.members && data.members.length > 0 ? data.members : DEFAULT_TEAM_MEMBERS
  };

  const updateHeader = (key: 'section_subtitle' | 'section_title', value: string) => {
    onChange({ ...currentData, [key]: value });
  };

  const handleAddMember = () => {
    const newMember: TeamMember = {
      name: "New Team Member",
      role: "Flooring Specialist",
      image: "/Our Team/1.jpg"
    };
    const updated = [...currentData.members, newMember];
    onChange({ ...currentData, members: updated });
    setActiveMemberIndex(updated.length - 1);
  };

  const handleRemoveMember = (index: number) => {
    if (currentData.members.length <= 1) {
      alert("At least one team member is required.");
      return;
    }
    const updated = currentData.members.filter((_, i) => i !== index);
    onChange({ ...currentData, members: updated });
    setActiveMemberIndex(Math.max(0, index - 1));
  };

  const updateCurrentMember = (key: keyof TeamMember, value: string) => {
    const updated = [...currentData.members];
    if (!updated[activeMemberIndex]) return;
    updated[activeMemberIndex] = {
      ...updated[activeMemberIndex],
      [key]: value,
    };
    onChange({ ...currentData, members: updated });
  };

  const currentMember = currentData.members[activeMemberIndex] || currentData.members[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
        <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
          <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-gold-600" />
            Our Team Section Header
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Section Subtitle">
            <input
              type="text"
              value={currentData.section_subtitle}
              onChange={(e) => updateHeader('section_subtitle', e.target.value)}
              placeholder="Our Team"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>

          <FormField label="Section Title (HTML allowed)">
            <input
              type="text"
              value={currentData.section_title}
              onChange={(e) => updateHeader('section_title', e.target.value)}
              placeholder="Meet the Expert Team Powering Our <br />Goals and Ambitions"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
            />
          </FormField>
        </div>
      </div>

      {/* Member Selector Bar */}
      <div className="flex items-center justify-between border-b border-obsidian-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-obsidian-800 flex items-center gap-2">
            Team Members ({currentData.members.length})
          </h3>
          <p className="text-xs text-obsidian-500">Edit member names, roles, and portraits.</p>
        </div>

        <button
          onClick={handleAddMember}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-obsidian-900 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] rounded-lg shadow-sm hover:brightness-105 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Member
        </button>
      </div>

      {/* Member Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {currentData.members.map((m, idx) => {
          const isActive = idx === activeMemberIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveMemberIndex(idx)}
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
              <span className="max-w-[120px] truncate">{m.name || `Member ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {currentMember && (
        <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
            <span className="text-xs font-mono font-bold text-gold-700">
              EDITING: {currentMember.name || `MEMBER 0${activeMemberIndex + 1}`}
            </span>
            <button
              type="button"
              onClick={() => handleRemoveMember(activeMemberIndex)}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-xs font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Member
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Full Name">
              <input
                type="text"
                value={currentMember.name}
                onChange={(e) => updateCurrentMember('name', e.target.value)}
                placeholder="Jobaer Khanom"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>

            <FormField label="Role / Designation">
              <input
                type="text"
                value={currentMember.role}
                onChange={(e) => updateCurrentMember('role', e.target.value)}
                placeholder="UI/UX Designer"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>
          </div>

          <FormField label="Member Portrait Image">
            <ImageUploader
              value={currentMember.image}
              onChange={(url) => updateCurrentMember('image', url)}
            />
          </FormField>
        </div>
      )}
    </div>
  );
}

