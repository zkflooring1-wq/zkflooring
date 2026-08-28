"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Lead } from "@/types/database";
import {
  Users,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Search,
  Filter,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Calculator,
  Send,
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  Receipt
} from "lucide-react";
import toast from "react-hot-toast";
import QuoteInvoiceModal from "@/components/leads/QuoteInvoiceModal";
import { supabase } from "@/lib/supabase/client";

const STATUS_OPTIONS = [
  { value: "all", label: "All Leads" },
  { value: "new", label: "New Inquiries", color: "bg-amber-100 text-amber-900 border-amber-300" },
  { value: "contacted", label: "Contacted", color: "bg-blue-50 text-blue-800 border-blue-200" },
  { value: "survey_booked", label: "Survey Booked", color: "bg-purple-50 text-purple-800 border-purple-200" },
  { value: "quote_sent", label: "Quote Sent", color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  { value: "completed", label: "Completed", color: "bg-green-50 text-green-800 border-green-200" },
  { value: "cancelled", label: "Cancelled", color: "bg-gray-100 text-gray-600 border-gray-200" },
];

const SOURCE_LABELS: Record<string, { label: string; icon: any }> = {
  cost_calculator: { label: "Cost Calculator", icon: Calculator },
  contact_form: { label: "Contact Form", icon: MessageSquare },
  admin_manual: { label: "Manual / Call", icon: Phone },
  survey_request: { label: "Survey Request", icon: Calendar },
};

export default function LeadsCRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [quoteModalLead, setQuoteModalLead] = useState<Lead | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    surveyBooked: 0,
    completed: 0,
  });

  // Selected Lead for Inspector Drawer
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingNotes, setUpdatingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Manual Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [savingNew, setSavingNew] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "Carpet Fitting",
    room_size: "",
    estimated_cost: "",
    message: "",
    source: "admin_manual",
    status: "new" as const,
    notes: "",
  });

  const fetchLeads = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
    if (sourceFilter && sourceFilter !== "all") params.set("source", sourceFilter);
    params.set("page", String(page));
    params.set("limit", viewMode === "kanban" ? "100" : "25");

    fetch(`/api/leads?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setLeads(d.leads || []);
        setTotal(d.total || 0);
        setTotalPages(d.totalPages || 1);
      })
      .catch(() => setError("Failed to load customer inquiries"))
      .finally(() => setLoading(false));
  }, [search, statusFilter, sourceFilter, page]);

  const fetchStats = useCallback(() => {
    fetch("/api/leads/stats")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) {
          setStats(d);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchStats();

    // 1. Supabase Realtime Live WebSocket Channel
    const channel = supabase
      .channel("zk-leads-realtime-crm")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newLead = payload.new as Lead;
            toast.success(`🔔 New Inquiry from ${newLead.name}!`, {
              duration: 6000,
              icon: "📥",
              style: {
                background: "#16120B",
                color: "#FCF6BA",
                border: "1px solid #BF953F",
                fontWeight: "bold",
              },
            });
            setLeads((prev) => {
              if (prev.some((l) => l.id === newLead.id)) return prev;
              return [newLead, ...prev];
            });
            setTotal((prev) => prev + 1);
            setStats((prev) => ({
              ...prev,
              total: prev.total + 1,
              new: prev.new + 1,
            }));
          } else if (payload.eventType === "UPDATE") {
            const updatedLead = payload.new as Lead;
            setLeads((prev) =>
              prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
            );
            fetchStats();
          } else if (payload.eventType === "DELETE") {
            const deletedId = (payload.old as { id: string }).id;
            setLeads((prev) => prev.filter((l) => l.id !== deletedId));
            setTotal((prev) => Math.max(0, prev - 1));
            fetchStats();
          }
        }
      )
      .subscribe();

    // 2. High-reliability 5-second background polling fallback
    const interval = setInterval(() => {
      fetchLeads();
      fetchStats();
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchLeads, fetchStats]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as any } : l))
      );
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
      fetchStats();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setUpdatingNotes(true);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesDraft }),
      });
      if (!res.ok) throw new Error();
      toast.success("Notes saved successfully!");
      setSelectedLead((prev) => (prev ? { ...prev, notes: notesDraft } : null));
      setLeads((prev) =>
        prev.map((l) => (l.id === selectedLead.id ? { ...l, notes: notesDraft } : l))
      );
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setUpdatingNotes(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/leads/${deleteId}`, { method: "DELETE" });
      toast.success("Inquiry removed");
      setDeleteId(null);
      if (selectedLead?.id === deleteId) setSelectedLead(null);
      fetchLeads();
      fetchStats();
    } catch {
      toast.error("Failed to delete lead");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNew(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLeadForm),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to create lead");
      }
      toast.success("Lead created successfully!");
      setIsAddModalOpen(false);
      setNewLeadForm({
        name: "",
        phone: "",
        email: "",
        service: "Carpet Fitting",
        room_size: "",
        estimated_cost: "",
        message: "",
        source: "admin_manual",
        status: "new",
        notes: "",
      });
      fetchLeads();
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to add lead");
    } finally {
      setSavingNew(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCleanPhone = (phone: string) => {
    return phone.replace(/[^0-9+]/g, "");
  };

  return (
    <AdminLayout title="Leads &amp; Inquiries CRM" breadcrumb={["CRM", "Leads"]}>
      <div className="space-y-6 pb-24 max-w-7xl mx-auto">
        
        {/* Top Header Card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#16120B] border border-[#BF953F]/30 p-6 shadow-xl text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BF953F]/15 border border-[#BF953F]/40 text-[#FCF6BA] text-xs font-bold tracking-wide uppercase mb-3">
                <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                Customer Inquiries &amp; Survey Bookings
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#FFFFFF] tracking-tight font-[var(--font-heading)]">
                Leads &amp; Inquiries CRM
              </h1>
              <p className="text-[#C8C3BA] text-sm mt-1 max-w-xl">
                Track quote requests from the Cost Calculator and Contact Forms, manage survey appointments, and follow up directly.
              </p>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  fetchLeads();
                  fetchStats();
                  toast.success("Inquiries refreshed");
                }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#241D14] hover:bg-[#2F261B] text-[#FCF6BA] border border-[#BF953F]/40 text-sm font-semibold transition-all shadow-md"
                title="Refresh Inquiries"
              >
                <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] hover:brightness-105 text-[#16120B] text-sm font-bold shadow-lg shadow-[#BF953F]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Phone / Walk-in Lead</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Leads</div>
            <div className="text-2xl font-extrabold text-[#16120B] mt-1">{stats.total}</div>
            <div className="text-xs text-gray-400 mt-1">All time inquiries</div>
          </div>

          <div className="bg-[#FAF6EE] rounded-2xl border border-[#BF953F]/40 p-4 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#AA771C] uppercase tracking-wider">Action Required</div>
              {stats.new > 0 && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
            </div>
            <div className="text-2xl font-extrabold text-[#16120B] mt-1">{stats.new}</div>
            <div className="text-xs text-[#736E67] mt-1">New uncontacted leads</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
            <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">Surveys Booked</div>
            <div className="text-2xl font-extrabold text-purple-900 mt-1">{stats.surveyBooked}</div>
            <div className="text-xs text-gray-400 mt-1">In-home sample visits</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
            <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Completed Jobs</div>
            <div className="text-2xl font-extrabold text-green-900 mt-1">{stats.completed}</div>
            <div className="text-xs text-gray-400 mt-1">Fitted &amp; finalized</div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by customer name, phone, email, or service..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl text-sm text-[#16120B] focus:bg-white focus:outline-none focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 transition-all font-medium placeholder:text-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Switcher & Source Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* View Switcher Toggle */}
              <div className="flex items-center p-1 bg-[#FAF8F5] border border-gray-300 rounded-xl shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "kanban"
                      ? "bg-[#16120B] text-[#FCF6BA] shadow-sm"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Pipeline (Kanban)
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "table"
                      ? "bg-[#16120B] text-[#FCF6BA] shadow-sm"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  Table List
                </button>
              </div>

              {/* Source Filter */}
              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#BF953F] cursor-pointer"
              >
                <option value="all">All Sources</option>
                <option value="cost_calculator">Cost Calculator</option>
                <option value="contact_form">Contact Form</option>
                <option value="admin_manual">Phone / Walk-in</option>
              </select>
            </div>

          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-gray-100">
            {STATUS_OPTIONS.map((opt) => {
              const isActive = statusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#16120B] text-[#FCF6BA] shadow-sm border border-[#BF953F]/40"
                      : "bg-[#FAF8F5] text-gray-700 hover:bg-gray-100 hover:text-black border border-gray-200"
                  }`}
                >
                  {opt.label}
                  {opt.value === "new" && stats.new > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-black text-[10px] rounded-full font-extrabold">
                      {stats.new}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content: Kanban Pipeline OR Table View */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchLeads} />
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FAF6EE] border border-[#BF953F]/30 flex items-center justify-center mx-auto mb-4 text-[#B38728]">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#16120B]">No customer inquiries found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              {search || statusFilter !== "all" || sourceFilter !== "all"
                ? "No leads matched your filters. Try clearing search or status filters."
                : "New inquiries from the website and cost calculator will automatically show up here."}
            </p>
          </div>
        ) : viewMode === "kanban" ? (
          /* ==========================================================================
             VISUAL KANBAN PIPELINE BOARD
             ========================================================================== */
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-4 min-w-[1250px] items-start">
              {[
                {
                  id: "new",
                  title: "New Inquiries",
                  badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
                  headerBorder: "border-t-amber-500",
                  headerBg: "bg-amber-50/60 text-amber-950",
                  icon: AlertCircle,
                  nextStatus: "contacted",
                  nextLabel: "Move to Contacted",
                },
                {
                  id: "contacted",
                  title: "Contacted",
                  badgeBg: "bg-blue-100 text-blue-900 border-blue-300",
                  headerBorder: "border-t-blue-500",
                  headerBg: "bg-blue-50/60 text-blue-950",
                  icon: Phone,
                  nextStatus: "survey_booked",
                  nextLabel: "Book Survey",
                },
                {
                  id: "survey_booked",
                  title: "Survey Booked",
                  badgeBg: "bg-purple-100 text-purple-900 border-purple-300",
                  headerBorder: "border-t-purple-500",
                  headerBg: "bg-purple-50/60 text-purple-950",
                  icon: Calendar,
                  nextStatus: "quote_sent",
                  nextLabel: "Send Quote",
                },
                {
                  id: "quote_sent",
                  title: "Quote Sent",
                  badgeBg: "bg-indigo-100 text-indigo-900 border-indigo-300",
                  headerBorder: "border-t-indigo-500",
                  headerBg: "bg-indigo-50/60 text-indigo-950",
                  icon: FileText,
                  nextStatus: "completed",
                  nextLabel: "Mark Completed",
                },
                {
                  id: "completed",
                  title: "Completed & Fitted",
                  badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
                  headerBorder: "border-t-emerald-500",
                  headerBg: "bg-emerald-50/60 text-emerald-950",
                  icon: CheckCircle2,
                  nextStatus: null,
                  nextLabel: null,
                },
                {
                  id: "cancelled",
                  title: "Archived / Cancelled",
                  badgeBg: "bg-gray-100 text-gray-700 border-gray-300",
                  headerBorder: "border-t-gray-400",
                  headerBg: "bg-gray-50/60 text-gray-800",
                  icon: X,
                  nextStatus: "new",
                  nextLabel: "Reopen Inquiry",
                },
              ].map((stage) => {
                const stageLeads = leads.filter((l) => l.status === stage.id);
                const StageIcon = stage.icon;

                return (
                  <div
                    key={stage.id}
                    className="flex-1 bg-gray-50/80 rounded-2xl border border-gray-200 shadow-xs flex flex-col min-w-[280px]"
                  >
                    {/* Column Header */}
                    <div
                      className={`p-3.5 border-b border-gray-200 border-t-4 ${stage.headerBorder} ${stage.headerBg} rounded-t-2xl flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-2">
                        <StageIcon className="w-4 h-4 text-gray-700" />
                        <h3 className="text-xs font-extrabold uppercase tracking-wide">
                          {stage.title}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white font-black text-xs shadow-2xs border border-gray-200">
                        {stageLeads.length}
                      </span>
                    </div>

                    {/* Column Body / Cards List */}
                    <div className="p-3 space-y-3 min-h-[450px] max-h-[700px] overflow-y-auto">
                      {stageLeads.length === 0 ? (
                        <div className="py-12 text-center text-xs text-gray-400 font-medium">
                          No inquiries in this stage
                        </div>
                      ) : (
                        stageLeads.map((lead) => {
                          const cleanPhone = getCleanPhone(lead.phone);
                          return (
                            <div
                              key={lead.id}
                              onClick={() => {
                                setSelectedLead(lead);
                                setNotesDraft(lead.notes || "");
                              }}
                              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-[#BF953F] shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3"
                            >
                              {/* Top Row: Customer & Source */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-sm font-extrabold text-[#16120B] group-hover:text-[#AA771C] transition-colors leading-snug">
                                    {lead.name}
                                  </h4>
                                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                                    {lead.phone}
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 uppercase">
                                  {lead.source?.replace("_", " ") || "Inquiry"}
                                </span>
                              </div>

                              {/* Service & Estimate */}
                              <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-gray-100 text-xs space-y-1">
                                <div className="font-bold text-[#16120B] truncate">
                                  {lead.service || "Flooring Installation"}
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-gray-500">{lead.room_size || "Standard Room"}</span>
                                  <span className="font-extrabold text-[#AA771C]">
                                    {lead.estimated_cost || "Custom"}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons Row */}
                              <div
                                className="flex items-center justify-between pt-2 border-t border-gray-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center gap-1.5">
                                  {/* Call */}
                                  <a
                                    href={`tel:${cleanPhone}`}
                                    className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                                    title="Call Customer"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                  {/* WhatsApp */}
                                  <a
                                    href={`https://wa.me/${cleanPhone.startsWith("+") ? cleanPhone.slice(1) : cleanPhone.startsWith("0") ? "44" + cleanPhone.slice(1) : cleanPhone}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20ZK%20Flooring%20Birmingham.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                                    title="WhatsApp Customer"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </a>
                                  {/* Generate Quote */}
                                  <button
                                    onClick={() => setQuoteModalLead(lead)}
                                    className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                                    title="Build PDF Quote / Invoice"
                                  >
                                    <Receipt className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Quick Advance Button */}
                                {stage.nextStatus && (
                                  <button
                                    onClick={() => handleStatusChange(lead.id, stage.nextStatus!)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#16120B] hover:bg-black text-[#FCF6BA] text-[11px] font-bold transition-all shadow-2xs"
                                    title={stage.nextLabel || "Advance Stage"}
                                  >
                                    <span>Advance</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ==========================================================================
             TABLE LIST VIEW
             ========================================================================== */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF8F5] border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Service &amp; Estimate</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => {
                    const sourceInfo = SOURCE_LABELS[lead.source] || { label: lead.source, icon: MessageSquare };
                    const cleanPhone = getCleanPhone(lead.phone);

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setNotesDraft(lead.notes || "");
                        }}
                        className={`hover:bg-[#FAF6EE]/40 transition-colors cursor-pointer ${
                          lead.status === "new" ? "bg-[#FAF6EE]/20" : ""
                        }`}
                      >
                        {/* Customer */}
                        <td className="p-4">
                          <div className="font-bold text-[#16120B] text-sm flex items-center gap-2">
                            {lead.name}
                            {lead.status === "new" && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 uppercase tracking-wide">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5 font-mono">{lead.phone}</div>
                          {lead.email && <div className="text-xs text-gray-400">{lead.email}</div>}
                        </td>

                        {/* Service & Estimate */}
                        <td className="p-4">
                          <div className="font-semibold text-gray-900 text-xs">{lead.service || "Flooring Installation"}</div>
                          <div className="text-xs font-bold text-[#AA771C] mt-0.5">
                            {lead.estimated_cost || "Custom Survey"}{" "}
                            {lead.room_size && <span className="text-gray-500 font-normal">({lead.room_size})</span>}
                          </div>
                        </td>

                        {/* Source */}
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {sourceInfo.label}
                          </span>
                        </td>

                        {/* Status Dropdown */}
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${
                              lead.status === "new"
                                ? "bg-amber-100 text-amber-900 border-amber-300"
                                : lead.status === "survey_booked"
                                ? "bg-purple-100 text-purple-900 border-purple-300"
                                : lead.status === "quote_sent"
                                ? "bg-indigo-100 text-indigo-900 border-indigo-300"
                                : lead.status === "contacted"
                                ? "bg-blue-100 text-blue-900 border-blue-300"
                                : lead.status === "completed"
                                ? "bg-green-100 text-green-900 border-green-300"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="survey_booked">Survey Booked</option>
                            <option value="quote_sent">Quote Sent</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td className="p-4 text-xs text-gray-500 font-medium whitespace-nowrap">
                          {formatDate(lead.created_at)}
                        </td>

                        {/* Action Buttons */}
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* 1-Click Call */}
                            <a
                              href={`tel:${cleanPhone}`}
                              className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                              title="Call Customer"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* 1-Click WhatsApp */}
                            <a
                              href={`https://wa.me/${cleanPhone.startsWith("+") ? cleanPhone.slice(1) : cleanPhone.startsWith("0") ? "44" + cleanPhone.slice(1) : cleanPhone}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20ZK%20Flooring%20Birmingham.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                              title="WhatsApp Customer"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </a>

                            {/* 1-Click PDF Quote Maker */}
                            <button
                              onClick={() => setQuoteModalLead(lead)}
                              className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                              title="Generate PDF Quote / Invoice"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </button>

                            {/* Open Details */}
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setNotesDraft(lead.notes || "");
                              }}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-[#FAF6EE] text-gray-700 hover:text-[#AA771C] transition-colors"
                              title="View Lead Details"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteId(lead.id)}
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500">
                  Page <span className="text-gray-900 font-bold">{page}</span> of{" "}
                  <span className="text-gray-900 font-bold">{totalPages}</span> ({total} leads)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:border-[#BF953F] disabled:opacity-40 transition-all shadow-2xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:border-[#BF953F] disabled:opacity-40 transition-all shadow-2xs"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Lead Detail & Inspector Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedLead(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-[#BF953F]/30 animate-in zoom-in-95 duration-200">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#16120B] text-white">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#BF953F]/20 border border-[#BF953F]/40 text-[10px] font-bold text-[#FCF6BA] uppercase">
                  Lead Details
                </span>
                <h3 className="text-base font-bold text-white truncate">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Top Contact & Quick Action Bar */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-base font-extrabold text-[#16120B]">{selectedLead.name}</div>
                  <div className="text-xs text-gray-600 mt-0.5 font-mono">{selectedLead.phone}</div>
                  {selectedLead.email && <div className="text-xs text-gray-500">{selectedLead.email}</div>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuoteModalLead(selectedLead)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold transition-colors shadow-sm"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    Build Quote / Invoice
                  </button>

                  <a
                    href={`tel:${getCleanPhone(selectedLead.phone)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Now
                  </a>

                  <a
                    href={`https://wa.me/${getCleanPhone(selectedLead.phone).startsWith("+") ? getCleanPhone(selectedLead.phone).slice(1) : getCleanPhone(selectedLead.phone).startsWith("0") ? "44" + getCleanPhone(selectedLead.phone).slice(1) : getCleanPhone(selectedLead.phone)}?text=Hi%20${encodeURIComponent(selectedLead.name)},%20thank%20you%20for%20contacting%20ZK%20Flooring.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                  Lead Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "new", label: "New" },
                    { value: "contacted", label: "Contacted" },
                    { value: "survey_booked", label: "Survey Booked" },
                    { value: "quote_sent", label: "Quote Sent" },
                    { value: "completed", label: "Completed" },
                    { value: "cancelled", label: "Cancelled" },
                  ].map((st) => (
                    <button
                      key={st.value}
                      type="button"
                      onClick={() => handleStatusChange(selectedLead.id, st.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedLead.status === st.value
                          ? "bg-[#16120B] text-[#FCF6BA] shadow-sm border border-[#BF953F]"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiry & Estimate Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Service Type</div>
                  <div className="text-xs font-bold text-[#16120B] mt-0.5">{selectedLead.service || "General Inquiry"}</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Estimated Cost / Area</div>
                  <div className="text-xs font-bold text-[#AA771C] mt-0.5">
                    {selectedLead.estimated_cost || "Custom Survey"} {selectedLead.room_size ? `(${selectedLead.room_size})` : ""}
                  </div>
                </div>
              </div>

              {/* Customer Message */}
              {selectedLead.message && (
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                    Inquiry Message / Calculator Summary
                  </label>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.message}
                  </div>
                </div>
              )}

              {/* Internal Admin Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Internal Notes &amp; Follow-up Info
                  </label>
                  <button
                    onClick={handleSaveNotes}
                    disabled={updatingNotes}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#16120B] text-[#FCF6BA] hover:bg-black text-xs font-bold transition-all shadow-xs"
                  >
                    <Save className="w-3 h-3" />
                    {updatingNotes ? "Saving..." : "Save Notes"}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add private staff notes (e.g. Survey arranged for Saturday 11am with mobile carpet showroom)..."
                  className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#BF953F] resize-none font-medium"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-xs text-gray-500">
                <span>Received on: {formatDate(selectedLead.created_at)}</span>
                <button
                  onClick={() => setDeleteId(selectedLead.id)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  Delete Inquiry
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Add Manual Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col border border-[#BF953F]/30 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#16120B] text-white">
              <h3 className="text-base font-bold text-white">Add Phone / Walk-in Lead</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BF953F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="07903 723 774"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BF953F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="customer@gmail.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BF953F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Service Type</label>
                  <select
                    value={newLeadForm.service}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, service: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BF953F]"
                  >
                    <option value="Carpet Fitting">Carpet Fitting</option>
                    <option value="LVT Herringbone">LVT Herringbone</option>
                    <option value="Hardwood Flooring">Hardwood Flooring</option>
                    <option value="Laminate Installation">Laminate Installation</option>
                    <option value="Commercial Vinyl">Commercial Vinyl</option>
                    <option value="Subfloor Screeding">Subfloor Screeding</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Estimated Cost</label>
                  <input
                    type="text"
                    placeholder="e.g. £650"
                    value={newLeadForm.estimated_cost}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, estimated_cost: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BF953F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Initial Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes about survey date, client preferences..."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BF953F] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingNew}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#16120B] text-[#FCF6BA] hover:bg-black transition-colors"
                >
                  {savingNew ? "Saving..." : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Customer Inquiry"
        message="Are you sure you want to permanently delete this lead record? This action cannot be undone."
        confirmLabel="Delete Lead"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* 1-Click PDF Quote & Invoice Generator Modal */}
      <QuoteInvoiceModal
        isOpen={Boolean(quoteModalLead)}
        onClose={() => setQuoteModalLead(null)}
        lead={quoteModalLead}
      />
    </AdminLayout>
  );
}
