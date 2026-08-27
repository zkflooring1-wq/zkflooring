"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import {
  Bot,
  Sparkles,
  PoundSterling,
  BookOpen,
  MessageSquare,
  Plus,
  Trash2,
  Send,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Flame,
} from "lucide-react";
import toast from "react-hot-toast";

interface QAItem {
  id: string;
  question: string;
  answer: string;
}

interface AITrainingSettings {
  assistantName: string;
  tone: "concise" | "friendly" | "formal";
  systemInstructions: string;
  serviceAreas: string;
  pricing: {
    lvtMin: number;
    lvtMax: number;
    engineeredWoodMin: number;
    engineeredWoodMax: number;
    solidWoodMin: number;
    solidWoodMax: number;
    laminateMin: number;
    laminateMax: number;
    carpetMin: number;
    carpetMax: number;
    subfloorMin: number;
    subfloorMax: number;
  };
  customQA: QAItem[];
  specialPromotions: string;
}

const DEFAULT_SETTINGS: AITrainingSettings = {
  assistantName: "ZK Flooring AI Advisor",
  tone: "concise",
  systemInstructions:
    "You are the expert flooring consultant for ZK Flooring in Birmingham & West Midlands. Provide quick, accurate pricing and recommend booking a 100% Free Home Survey.",
  serviceAreas: "Birmingham, Solihull, Sutton Coldfield, Wolverhampton, Coventry, Dudley, and West Midlands.",
  pricing: {
    lvtMin: 40,
    lvtMax: 85,
    engineeredWoodMin: 60,
    engineeredWoodMax: 130,
    solidWoodMin: 70,
    solidWoodMax: 150,
    laminateMin: 22,
    laminateMax: 50,
    carpetMin: 18,
    carpetMax: 45,
    subfloorMin: 8,
    subfloorMax: 20,
  },
  customQA: [
    {
      id: "qa-1",
      question: "Do you remove and dispose of old carpets/floors?",
      answer: "Yes, our fitting team can provide complete uplift and eco-friendly disposal service of old flooring.",
    },
    {
      id: "qa-2",
      question: "Is the on-site laser survey really 100% free?",
      answer: "Yes! Our laser measurement and physical sample survey is 100% free with zero obligation.",
    },
    {
      id: "qa-3",
      question: "What warranty do you offer on fitting?",
      answer: "All installations come with our ZK Master Fitting Guarantee along with manufacturer material warranties.",
    },
  ],
  specialPromotions: "Free laser measurement + physical material sample book brought directly to your home.",
};

export default function AITrainingPage() {
  const [data, setData] = useState<AITrainingSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"persona" | "pricing" | "knowledge" | "promo">("persona");

  // Test Simulator State
  const [simInput, setSimInput] = useState("");
  const [simLoading, setSimLoading] = useState(false);
  const [simMessages, setSimMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I am your ZK Flooring AI Advisor. Test your custom training by asking me any flooring or pricing question!",
    },
  ]);

  useEffect(() => {
    fetch("/api/settings/ai_training")
      .then((r) => r.json())
      .then((d) => {
        if (d.value && Object.keys(d.value).length > 0) {
          setData({
            ...DEFAULT_SETTINGS,
            ...d.value,
            pricing: { ...DEFAULT_SETTINGS.pricing, ...(d.value.pricing || {}) },
            customQA: d.value.customQA || DEFAULT_SETTINGS.customQA,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/ai_training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: data }),
      });

      if (res.ok) {
        toast.success("AI Training & Pricing settings updated successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Network error saving AI settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddQA = () => {
    const newItem: QAItem = {
      id: `qa-${Date.now()}`,
      question: "",
      answer: "",
    };
    setData((prev) => ({
      ...prev,
      customQA: [...prev.customQA, newItem],
    }));
  };

  const handleRemoveQA = (id: string) => {
    setData((prev) => ({
      ...prev,
      customQA: prev.customQA.filter((item) => item.id !== id),
    }));
  };

  const handleUpdateQA = (id: string, field: "question" | "answer", value: string) => {
    setData((prev) => ({
      ...prev,
      customQA: prev.customQA.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Test Simulator Send
  const handleSimSend = async () => {
    const text = simInput.trim();
    if (!text || simLoading) return;

    const userMsg = { role: "user" as const, content: text };
    setSimMessages((prev) => [...prev, userMsg]);
    setSimInput("");
    setSimLoading(true);

    try {
      // Call frontend AI chat API endpoint directly with updated local state
      const res = await fetch("http://localhost:3000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...simMessages, userMsg],
        }),
      });

      const d = await res.json();
      setSimMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: d.reply || "No response received.",
        },
      ]);
    } catch {
      setSimMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error connecting to AI simulator. Please verify frontend server is running.",
        },
      ]);
    } finally {
      setSimLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="AI Assistant Training" breadcrumb={["Settings", "AI Training"]}>
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="AI Assistant Training & Knowledge Base" breadcrumb={["AI", "Training"]}>
      <div className="space-y-6">
        {/* Top Overview Banner */}
        <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-400/20 rounded-[var(--radius-card)] p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-obsidian-950 font-black shadow-lg shadow-gold-500/20">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-[var(--font-heading)] text-white">
                    Flooring AI Advisor Training
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live on Website
                  </span>
                </div>
                <p className="text-obsidian-300 text-xs mt-1">
                  Configure custom pricing rates, business knowledge, and persona guidelines. Changes sync directly to the frontend chatbot.
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-obsidian-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save AI Training"}
            </button>
          </div>
        </div>

        {/* Main Grid: Training Controls (Left) + Interactive Simulator (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Training Controls (8 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tabs */}
            <div className="flex border-b border-obsidian-200/60 gap-2 overflow-x-auto pb-1">
              {[
                { id: "persona", label: "Persona & Tone", icon: Sliders },
                { id: "pricing", label: "Rates & Pricing", icon: PoundSterling },
                { id: "knowledge", label: "Custom Q&A Knowledge", icon: BookOpen },
                { id: "promo", label: "Special Offers", icon: Flame },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-semibold text-xs transition-all border-b-2 ${
                      active
                        ? "border-gold-500 text-gold-600 bg-gold-50/50"
                        : "border-transparent text-obsidian-400 hover:text-obsidian-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: PERSONA & TONE */}
            {activeTab === "persona" && (
              <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/60 shadow-sm p-6 space-y-5">
                <h3 className="text-base font-bold text-obsidian-800 font-[var(--font-heading)] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-gold-500" />
                  AI Persona & Communication Rules
                </h3>

                <FormField label="Assistant Name" hint="Displayed to customers in chat header">
                  <input
                    type="text"
                    value={data.assistantName}
                    onChange={(e) => setData((p) => ({ ...p, assistantName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400"
                    placeholder="ZK Flooring AI Advisor"
                  />
                </FormField>

                <FormField label="Response Tone" hint="Controls length and formality of AI answers">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "concise", title: "Concise & Direct", desc: "Short 2-3 lines with direct numbers (Recommended)" },
                      { id: "friendly", title: "Friendly & Warm", desc: "Conversational, consultative and polite" },
                      { id: "formal", title: "High-End Luxury", desc: "Architectural, elegant and refined" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setData((p) => ({ ...p, tone: t.id as any }))}
                        className={`p-3.5 text-left rounded-xl border transition-all ${
                          data.tone === t.id
                            ? "border-gold-500 bg-gold-50/40 shadow-sm"
                            : "border-obsidian-200 hover:border-obsidian-300"
                        }`}
                      >
                        <div className="font-bold text-xs text-obsidian-800">{t.title}</div>
                        <div className="text-[11px] text-obsidian-400 mt-1 leading-snug">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label="System Instructions / Core Identity" hint="Main guidance given to the AI model">
                  <textarea
                    rows={4}
                    value={data.systemInstructions}
                    onChange={(e) => setData((p) => ({ ...p, systemInstructions: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 leading-relaxed resize-none"
                  />
                </FormField>

                <FormField label="Active Service Areas" hint="Locations the AI should confirm service for">
                  <input
                    type="text"
                    value={data.serviceAreas}
                    onChange={(e) => setData((p) => ({ ...p, serviceAreas: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400"
                    placeholder="Birmingham, Solihull, Sutton Coldfield, West Midlands"
                  />
                </FormField>
              </div>
            )}

            {/* TAB 2: PRICING & RATE CARD */}
            {activeTab === "pricing" && (
              <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/60 shadow-sm p-6 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-obsidian-800 font-[var(--font-heading)] flex items-center gap-2">
                    <PoundSterling className="w-4 h-4 text-gold-500" />
                    Live Price Estimator Rate Card (£ per m²)
                  </h3>
                  <p className="text-xs text-obsidian-400 mt-1">
                    The AI uses these exact ranges to calculate supply + fitting estimates for customer room sizes.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {[
                    { keyMin: "lvtMin", keyMax: "lvtMax", label: "Luxury Vinyl Tile (LVT / SPC)", desc: "Click & glue-down waterproof luxury tiles" },
                    { keyMin: "engineeredWoodMin", keyMax: "engineeredWoodMax", label: "Engineered Hardwood", desc: "Real wood multi-ply with underfloor heating suitability" },
                    { keyMin: "solidWoodMin", keyMax: "solidWoodMax", label: "Solid Hardwood", desc: "100% solid timber flooring" },
                    { keyMin: "laminateMin", keyMax: "laminateMax", label: "Premium Laminate", desc: "AC4/AC5 rated high durability laminate" },
                    { keyMin: "carpetMin", keyMax: "carpetMax", label: "Luxury & Commercial Carpet", desc: "Supply + underlay + fitting included" },
                    { keyMin: "subfloorMin", keyMax: "subfloorMax", label: "Subfloor Preparation / Screed", desc: "Self-levelling latex screed & plyboarding" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="p-3.5 rounded-xl bg-obsidian-50/50 border border-obsidian-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-xs text-obsidian-800">{row.label}</div>
                        <div className="text-[11px] text-obsidian-400">{row.desc}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-obsidian-400">Min £</span>
                          <input
                            type="number"
                            value={(data.pricing as any)[row.keyMin]}
                            onChange={(e) =>
                              setData((p) => ({
                                ...p,
                                pricing: { ...p.pricing, [row.keyMin]: parseFloat(e.target.value) || 0 },
                              }))
                            }
                            className="w-16 px-2 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-semibold text-center focus:outline-none focus:border-gold-400"
                          />
                        </div>
                        <span className="text-obsidian-300">—</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-obsidian-400">Max £</span>
                          <input
                            type="number"
                            value={(data.pricing as any)[row.keyMax]}
                            onChange={(e) =>
                              setData((p) => ({
                                ...p,
                                pricing: { ...p.pricing, [row.keyMax]: parseFloat(e.target.value) || 0 },
                              }))
                            }
                            className="w-16 px-2 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-semibold text-center focus:outline-none focus:border-gold-400"
                          />
                          <span className="text-xs text-obsidian-400">/m²</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOM Q&A KNOWLEDGE BASE */}
            {activeTab === "knowledge" && (
              <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/60 shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-obsidian-800 font-[var(--font-heading)] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gold-500" />
                      Custom Business Knowledge & Policies
                    </h3>
                    <p className="text-xs text-obsidian-400 mt-1">
                      Teach the AI specific answers to frequent customer questions and company policies.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddQA}
                    className="px-3 py-1.5 bg-gold-50 border border-gold-300 hover:bg-gold-100 text-gold-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Q&A Pair
                  </button>
                </div>

                <div className="space-y-4">
                  {data.customQA.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-obsidian-200 bg-obsidian-50/40 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gold-600">Rule #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQA(item.id)}
                          className="text-red-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete Q&A"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-obsidian-600 block mb-1">
                          Customer Question / Trigger
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Do you offer financing options or split payments?"
                          value={item.question}
                          onChange={(e) => handleUpdateQA(item.id, "question", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-lg text-xs focus:outline-none focus:border-gold-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-obsidian-600 block mb-1">
                          How AI Should Answer
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Yes, we provide flexible payment plans for projects over £1,000..."
                          value={item.answer}
                          onChange={(e) => handleUpdateQA(item.id, "answer", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-lg text-xs focus:outline-none focus:border-gold-400 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PROMOTIONS */}
            {activeTab === "promo" && (
              <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/60 shadow-sm p-6 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-obsidian-800 font-[var(--font-heading)] flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    Special Promotions & Announcements
                  </h3>
                  <p className="text-xs text-obsidian-400 mt-1">
                    When set, the AI will naturally mention this special offer during relevant inquiries.
                  </p>
                </div>

                <FormField label="Current Special Offer" hint="e.g. Seasonal discount, free underlay, or free laser survey">
                  <textarea
                    rows={3}
                    value={data.specialPromotions}
                    onChange={(e) => setData((p) => ({ ...p, specialPromotions: e.target.value }))}
                    placeholder="e.g. Free premium underlay included with all Engineered Hardwood orders over 30 sqm this month."
                    className="w-full px-3.5 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 leading-relaxed resize-none"
                  />
                </FormField>
              </div>
            )}

            <SaveBar onSave={handleSave} saving={saving} />
          </div>

          {/* RIGHT: Live AI Interactive Simulator (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/60 shadow-md p-5 flex flex-col h-[640px]">
              <div className="flex items-center justify-between pb-3 border-b border-obsidian-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gold-400/20 text-gold-600 flex items-center justify-center font-bold text-xs">
                    ✦
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-obsidian-800">Live AI Simulator</h4>
                    <p className="text-[10px] text-obsidian-400">Test how the AI responds in real-time</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSimMessages([
                      {
                        role: "assistant",
                        content: "Chat reset. Ask me a question to test your custom training!",
                      },
                    ])
                  }
                  className="text-obsidian-400 hover:text-obsidian-600 p-1 text-xs"
                  title="Reset simulator chat"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs">
                {simMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                        m.role === "user"
                          ? "bg-gold-500 text-obsidian-950 font-medium"
                          : "bg-obsidian-50 text-obsidian-800 border border-obsidian-100"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {simLoading && (
                  <div className="p-2.5 bg-obsidian-50 rounded-xl border border-obsidian-100 text-obsidian-400 text-xs w-fit flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold-500 animate-ping" />
                    Generating response with custom training...
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="pt-2 border-t border-obsidian-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSimSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={simInput}
                    onChange={(e) => setSimInput(e.target.value)}
                    placeholder="Test: 'How much for 30 sqm LVT in Solihull?'"
                    className="flex-1 px-3 py-2 bg-obsidian-50 border border-obsidian-200 rounded-xl text-xs focus:outline-none focus:border-gold-400 text-obsidian-800"
                  />
                  <button
                    type="submit"
                    disabled={!simInput.trim() || simLoading}
                    className="w-8 h-8 rounded-xl bg-gold-400 hover:bg-gold-300 text-obsidian-950 flex items-center justify-center disabled:opacity-40 transition-opacity"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
