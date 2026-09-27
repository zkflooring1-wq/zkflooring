"use client";

import { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Receipt,
  Download,
  Printer,
  Plus,
  Trash2,
  FileImage,
  RotateCcw,
  Sparkles,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
  Check,
  FileText,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
}

interface InvoiceData {
  documentType: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: "paid" | "pending" | "partial" | "overdue" | "draft";
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  items: LineItem[];
  discount: number;
  vatType: "exempt" | "standard" | "custom";
  customVatRate: number;
  depositPaid: number;
  bankName: string;
  accountName: string;
  sortCode: string;
  accountNumber: string;
  paymentReference: string;
  notes: string;
}

const PRESET_SERVICES = [
  { description: "LVT Herringbone Supply & Fitting (Amtico / Karndean)", unit: "sq m", rate: 65 },
  { description: "Subfloor Preparation: F.Ball 1200 Pro Self-Levelling Screed", unit: "sq m", rate: 18 },
  { description: "Subfloor Ply Lining (6mm SP101 Flooring Plywood)", unit: "sq m", rate: 16 },
  { description: "Luxury Carpet Supply & 10mm High-Density Underlay Fitting", unit: "sq m", rate: 38 },
  { description: "Engineered Hardwood Floor Installation (Tongue & Groove / Click)", unit: "sq m", rate: 45 },
  { description: "Laminate Flooring Supply & Fitting with Moisture Barrier", unit: "sq m", rate: 26 },
  { description: "Solid Brass / Brushed Nickel Door Threshold Trims", unit: "units", rate: 28 },
  { description: "MDF Scotia Beading / Skirting Board Installation", unit: "meters", rate: 9 },
  { description: "Existing Flooring Uplift & Responsible Site Waste Disposal", unit: "job", rate: 120 },
];

const DEFAULT_SAMPLE: InvoiceData = {
  documentType: "INVOICE",
  invoiceNumber: "ZK-INV-2026-001",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  status: "paid",
  clientName: "Mr. David Harrison",
  clientPhone: "+44 7123 456789",
  clientEmail: "david.harrison@gmail.com",
  clientAddress: "42 Warwick Road, Solihull, West Midlands, B92 7HX",
  items: [
    {
      id: "item-1",
      description: "LVT Herringbone Supply & Fitting (Amtico Signature Collection)",
      quantity: 45,
      unit: "sq m",
      rate: 65,
      total: 2925,
    },
    {
      id: "item-2",
      description: "Subfloor Preparation: F.Ball 1200 Pro Self-Levelling Compound Screed",
      quantity: 45,
      unit: "sq m",
      rate: 18,
      total: 810,
    },
    {
      id: "item-3",
      description: "Premium Acoustic DPM Underlay & Solid Brass Door Threshold Trims",
      quantity: 3,
      unit: "rooms",
      rate: 85,
      total: 255,
    },
    {
      id: "item-4",
      description: "Existing Flooring Uplift & Responsible Site Waste Disposal",
      quantity: 1,
      unit: "job",
      rate: 120,
      total: 120,
    },
  ],
  discount: 110,
  vatType: "exempt",
  customVatRate: 0,
  depositPaid: 1500,
  bankName: "Barclays Bank UK",
  accountName: "ZK Flooring Ltd",
  sortCode: "20-00-00",
  accountNumber: "12345678",
  paymentReference: "ZK-INV-2026-001",
  notes: "* 12-Month Professional Installation Guarantee included on all workmanship. All materials remain property of ZK Flooring Ltd until invoice is settled in full.",
};

export default function InvoicesPage() {
  const [data, setData] = useState<InvoiceData>(DEFAULT_SAMPLE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [activeMobileTab, setActiveMobileTab] = useState<"edit" | "preview">("edit");
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const invoiceSheetRef = useRef<HTMLDivElement | null>(null);

  // Auto update payment reference when invoice number changes
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      paymentReference: prev.invoiceNumber,
    }));
  }, [data.invoiceNumber]);

  // Calculations
  const subtotal = data.items.reduce((sum, item) => sum + (item.total || 0), 0);
  const discountedSubtotal = Math.max(0, subtotal - (data.discount || 0));

  let vatAmount = 0;
  if (data.vatType === "standard") {
    vatAmount = discountedSubtotal * 0.2;
  } else if (data.vatType === "custom") {
    vatAmount = discountedSubtotal * ((data.customVatRate || 0) / 100);
  }

  const grandTotal = discountedSubtotal + vatAmount;
  const balanceDue = Math.max(0, grandTotal - (data.depositPaid || 0));

  // Auto generate invoice number
  const handleGenerateInvoiceNo = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    setData((prev) => ({
      ...prev,
      invoiceNumber: `ZK-INV-${year}-${rand}`,
    }));
    toast.success("New invoice number generated");
  };

  // Add line item
  const handleAddItem = (preset?: { description: string; unit: string; rate: number }) => {
    const newItem: LineItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      description: preset ? preset.description : "New Flooring Service / Material",
      quantity: 1,
      unit: preset ? preset.unit : "sq m",
      rate: preset ? preset.rate : 0,
      total: preset ? preset.rate : 0,
    };
    setData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setShowPresetsMenu(false);
  };

  // Remove line item
  const handleRemoveItem = (id: string) => {
    if (data.items.length <= 1) {
      toast.error("An invoice must contain at least one line item");
      return;
    }
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // Update line item
  const handleUpdateItem = (id: string, field: keyof LineItem, value: any) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "rate") {
          const qty = field === "quantity" ? parseFloat(value) || 0 : item.quantity;
          const r = field === "rate" ? parseFloat(value) || 0 : item.rate;
          updated.total = Math.round(qty * r * 100) / 100;
        }
        return updated;
      }),
    }));
  };

  // Helper date formatter
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // 1. Download as High-Resolution PDF
  const handleDownloadPDF = async () => {
    if (!invoiceSheetRef.current) return;
    try {
      setIsGenerating(true);
      toast.loading("Rendering high-resolution vector PDF...", { id: "pdf-toast" });

      const element = invoiceSheetRef.current;
      // High-DPI canvas capture (scale: 3 for ~300 DPI sharpness)
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
      pdf.save(`ZK_Invoice_${data.invoiceNumber || "Draft"}.pdf`);

      toast.success("PDF downloaded successfully!", { id: "pdf-toast" });
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to generate PDF: ${err.message}`, { id: "pdf-toast" });
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Download as High-Resolution PNG Image
  const handleDownloadImage = async () => {
    if (!invoiceSheetRef.current) return;
    try {
      setIsGenerating(true);
      toast.loading("Exporting high-definition image...", { id: "img-toast" });

      const element = invoiceSheetRef.current;
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Failed to export image", { id: "img-toast" });
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ZK_Invoice_${data.invoiceNumber || "Draft"}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Image downloaded successfully!", { id: "img-toast" });
      }, "image/png");
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to export image: ${err.message}`, { id: "img-toast" });
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Print Directly (Native A4 print dialog with 100% vector typography)
  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayout title="Invoice Generator" breadcrumb={["Admin", "Invoices"]}>
      {/* ================= PRINT CSS INJECTION ================= */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide all surrounding admin chrome */
          aside, nav, header, [data-no-print="true"], .no-print-area {
            display: none !important;
          }
          .lg\\:pl-\\[260px\\] {
            padding-left: 0 !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }
          /* Show ONLY the invoice sheet */
          .invoice-sheet-container {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ================= TOP STUDIO ACTION BAR ================= */}
      <div
        data-no-print="true"
        className="no-print-area flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Receipt className="w-5 h-5" />
            </span>
            Invoice Generator
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Official ZK Flooring letterhead template with pixel-accurate data overlay, instant PDF download & print.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setData(DEFAULT_SAMPLE)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition-all cursor-pointer shadow-sm"
            title="Load sample flooring data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Sample Demo</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <FileImage className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Image</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Toggle */}
      <div data-no-print="true" className="no-print-area flex lg:hidden mb-4 bg-slate-800 p-1 rounded-xl border border-slate-700">
        <button
          onClick={() => setActiveMobileTab("edit")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeMobileTab === "edit" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300"
          }`}
        >
          1. Edit Invoice
        </button>
        <button
          onClick={() => setActiveMobileTab("preview")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeMobileTab === "preview" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300"
          }`}
        >
          2. Live A4 Preview
        </button>
      </div>

      {/* ================= MAIN STUDIO GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: Refined Professional Form ================= */}
        <div
          data-no-print="true"
          className={`no-print-area lg:col-span-6 space-y-5 ${activeMobileTab === "preview" ? "hidden lg:block" : "block"}`}
        >
          {/* Card 1: Document Details */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                Document Information
              </h2>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                {data.invoiceNumber}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Type</label>
                <select
                  value={data.documentType}
                  onChange={(e) => setData({ ...data, documentType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-medium focus:border-amber-400 focus:outline-none transition-colors"
                >
                  <option value="INVOICE">INVOICE</option>
                  <option value="ESTIMATE / QUOTE">ESTIMATE / QUOTE</option>
                  <option value="PRO-FORMA INVOICE">PRO-FORMA INVOICE</option>
                  <option value="RECEIPT">RECEIPT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex justify-between items-center">
                  <span>Invoice Number</span>
                  <button
                    type="button"
                    onClick={handleGenerateInvoiceNo}
                    className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-0.5"
                  >
                    <Sparkles className="w-3 h-3" /> Auto Gen
                  </button>
                </label>
                <input
                  type="text"
                  value={data.invoiceNumber}
                  onChange={(e) => setData({ ...data, invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono font-medium focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={data.invoiceDate}
                  onChange={(e) => setData({ ...data, invoiceDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => setData({ ...data, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Status Pills */}
              <div className="sm:col-span-2 pt-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Payment Status</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(
                    [
                      { id: "paid", label: "Paid in Full", color: "emerald" },
                      { id: "pending", label: "Pending", color: "amber" },
                      { id: "partial", label: "Partial", color: "blue" },
                      { id: "overdue", label: "Overdue", color: "rose" },
                      { id: "draft", label: "Draft", color: "slate" },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setData({ ...data, status: st.id })}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        data.status === st.id
                          ? "bg-amber-400 text-slate-950 border-amber-400 shadow-sm"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Client / Bill To */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-800">
              <User className="w-4 h-4 text-amber-400" />
              Client / Bill To
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. David Harrison"
                  value={data.clientName}
                  onChange={(e) => setData({ ...data, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+44 7123 456789"
                  value={data.clientPhone}
                  onChange={(e) => setData({ ...data, clientPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="client@example.co.uk"
                  value={data.clientEmail}
                  onChange={(e) => setData({ ...data, clientEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Installation / Property Address</label>
                <input
                  type="text"
                  placeholder="Street, City, Postcode"
                  value={data.clientAddress}
                  onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Line Items */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                Line Items
              </h2>

              {/* Quick Presets Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPresetsMenu(!showPresetsMenu)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Add Flooring Preset</span>
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>

                {showPresetsMenu && (
                  <div className="absolute right-0 top-full mt-1.5 w-72 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl p-1 z-30 max-h-60 overflow-y-auto">
                    {PRESET_SERVICES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddItem(preset)}
                        className="w-full text-left p-2 hover:bg-slate-800 rounded-lg text-xs text-slate-200 transition-colors flex justify-between items-center cursor-pointer"
                      >
                        <span className="truncate pr-2 font-medium">{preset.description}</span>
                        <span className="font-bold text-amber-400 whitespace-nowrap">£{preset.rate}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Line Items List */}
            <div className="space-y-3">
              {data.items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400/10 text-amber-400 text-[11px] font-bold flex items-center justify-center border border-amber-400/20">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Service / Material Description"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-medium focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">Qty</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, "quantity", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">Unit</span>
                      <input
                        type="text"
                        placeholder="sq m, rooms"
                        value={item.unit}
                        onChange={(e) => handleUpdateItem(item.id, "unit", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">Rate (£)</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => handleUpdateItem(item.id, "rate", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">Total (£)</span>
                      <div className="px-2.5 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-amber-400 font-bold text-xs truncate font-mono">
                        £{item.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleAddItem()}
              className="w-full py-2.5 border-2 border-dashed border-slate-800 hover:border-amber-400/60 rounded-xl text-slate-400 hover:text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Item</span>
            </button>
          </div>

          {/* Card 4: Financials & Totals */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-800">
              <CreditCard className="w-4 h-4 text-amber-400" />
              Financials & VAT
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Discount (£)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.discount}
                  onChange={(e) => setData({ ...data, discount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">VAT Scheme</label>
                <select
                  value={data.vatType}
                  onChange={(e: any) => setData({ ...data, vatType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                >
                  <option value="exempt">0% Exempt / DRC</option>
                  <option value="standard">20% Standard UK</option>
                  <option value="custom">Custom VAT %</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deposit Paid (£)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.depositPaid}
                  onChange={(e) => setData({ ...data, depositPaid: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono">£{subtotal.toFixed(2)}</span>
              </div>
              {data.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span className="font-mono">-£{data.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>VAT ({data.vatType === "exempt" ? "0%" : data.vatType === "standard" ? "20%" : `${data.customVatRate}%`}):</span>
                <span className="font-mono">£{vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="font-mono">£{grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-400 font-extrabold text-sm pt-1">
                <span>Balance Due:</span>
                <span className="font-mono">£{balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Card 5: Bank Details & Guarantee */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-800">
              <Building2 className="w-4 h-4 text-amber-400" />
              Bank Transfer Info & Guarantee
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={data.bankName}
                  onChange={(e) => setData({ ...data, bankName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Account Name</label>
                <input
                  type="text"
                  value={data.accountName}
                  onChange={(e) => setData({ ...data, accountName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sort Code</label>
                <input
                  type="text"
                  value={data.sortCode}
                  onChange={(e) => setData({ ...data, sortCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Account Number</label>
                <input
                  type="text"
                  value={data.accountNumber}
                  onChange={(e) => setData({ ...data, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fitting Guarantee Disclaimer</label>
                <textarea
                  rows={2}
                  value={data.notes}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Live A4 Visual Preview ================= */}
        <div className={`lg:col-span-6 sticky top-24 ${activeMobileTab === "edit" ? "hidden lg:block" : "block"}`}>
          {/* Preview Toolbar */}
          <div data-no-print="true" className="no-print-area flex items-center justify-between mb-3 px-1 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">Live A4 Paper Preview</span>
              <span className="text-[11px] text-slate-500">(1:1 Physical Ratio)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono text-[11px] text-slate-200">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(130, z + 10))}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(100)}
                className="p-1 hover:text-white transition-colors cursor-pointer border-l border-slate-700 pl-1.5 ml-0.5"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ================= THE A4 INVOICE SHEET ================= */}
          <div className="overflow-auto max-h-[88vh] p-2 sm:p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex justify-center shadow-2xl">
            <div
              ref={invoiceSheetRef}
              style={{
                width: `${(595.5 * zoom) / 100}px`,
                height: `${(842.25 * zoom) / 100}px`,
                backgroundImage: "url('/invoice-template.png')",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
              }}
              className="invoice-sheet-container relative bg-white shadow-2xl rounded-sm transition-all duration-150 select-none text-slate-900 box-border overflow-hidden"
            >
              {/* CONTENT OVERLAY: Positioned strictly within the safe printable zone:
                  Top padding: 23.5% (safely below top logo and top-right flourish)
                  Left padding: 7.5%
                  Right padding: 7.5%
                  Bottom: safely above bottom-left flourish (ends at ~72%)
              */}
              <div
                style={{
                  position: "absolute",
                  top: "23.5%",
                  left: "7.5%",
                  right: "7.5%",
                  bottom: "27%",
                }}
                className="flex flex-col justify-between"
              >
                {/* 1. Header Information Block */}
                <div>
                  <div className="flex justify-between items-start mb-5">
                    {/* Left: Invoice Title & Meta */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <h1 className="text-[22px] font-black tracking-tight text-slate-900 leading-none">
                          {data.documentType}
                        </h1>

                        {/* Status Badge */}
                        <span
                          className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase border tracking-wider ${
                            data.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : data.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-300"
                              : data.status === "partial"
                              ? "bg-blue-50 text-blue-700 border-blue-300"
                              : data.status === "overdue"
                              ? "bg-rose-50 text-rose-700 border-rose-300"
                              : "bg-slate-100 text-slate-700 border-slate-300"
                          }`}
                        >
                          {data.status === "paid"
                            ? "PAID IN FULL"
                            : data.status === "partial"
                            ? "DEPOSIT PAID"
                            : data.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-1 text-[10px]">
                        <p className="flex items-center gap-2">
                          <span className="text-slate-500 font-medium w-24">Invoice Number:</span>
                          <span className="font-bold text-slate-900 font-mono">{data.invoiceNumber}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-slate-500 font-medium w-24">Invoice Date:</span>
                          <span className="font-bold text-slate-800">{formatDate(data.invoiceDate)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-slate-500 font-medium w-24">Due Date:</span>
                          <span className="font-bold text-slate-800">{formatDate(data.dueDate)}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Bill To Client Info */}
                    <div className="text-left w-[240px]">
                      <span className="text-[10px] font-extrabold text-[#c59b27] uppercase tracking-wider block mb-1">
                        INVOICE TO:
                      </span>
                      <p className="font-bold text-slate-900 text-[13px] leading-tight mb-1">
                        {data.clientName || "Valued Customer"}
                      </p>
                      {data.clientPhone && (
                        <p className="text-slate-600 text-[10px] leading-tight">{data.clientPhone}</p>
                      )}
                      {data.clientEmail && (
                        <p className="text-slate-600 text-[10px] leading-tight">{data.clientEmail}</p>
                      )}
                      {data.clientAddress && (
                        <p className="text-slate-600 text-[9.5px] leading-tight mt-1">{data.clientAddress}</p>
                      )}
                    </div>
                  </div>

                  {/* 2. Items & Services Table */}
                  <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm mb-4">
                    <table className="w-full text-left border-collapse text-[10px]">
                      <thead>
                        <tr className="bg-[#18181b] text-white font-bold text-[9px] uppercase tracking-wider border-t-2 border-[#d4af37]">
                          <th className="py-2 px-2.5 w-7 text-center">#</th>
                          <th className="py-2 px-3">Service / Material Description</th>
                          <th className="py-2 px-3 text-right w-24">Qty / Area</th>
                          <th className="py-2 px-3 text-right w-24">Rate (£)</th>
                          <th className="py-2 px-3 text-right w-28">Amount (£)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.items.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 1 ? "bg-slate-50/70" : "bg-white"}>
                            <td className="py-2 px-2.5 text-center text-slate-400 font-mono text-[9.5px]">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-800 leading-snug">
                              {item.description}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-600 font-medium">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-600 font-mono">
                              £{item.rate.toFixed(2)}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-slate-900 font-mono">
                              £{item.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Bottom Financial & Bank Section */}
                <div>
                  <div className="grid grid-cols-2 gap-5 items-start mb-3">
                    {/* Bank Info Box (Left) */}
                    <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-3 text-[9.5px] space-y-1 shadow-sm">
                      <span className="font-extrabold text-[#c59b27] uppercase text-[9.5px] tracking-wider block mb-1">
                        PAYMENT & BANK DETAILS
                      </span>
                      <p className="text-slate-700">
                        <span className="text-slate-500 font-medium">Bank:</span> {data.bankName}
                      </p>
                      <p className="text-slate-700">
                        <span className="text-slate-500 font-medium">Account Name:</span> {data.accountName}
                      </p>
                      <p className="text-slate-700">
                        <span className="text-slate-500 font-medium">Sort Code:</span>{" "}
                        <span className="font-mono font-bold text-slate-800">{data.sortCode}</span>
                      </p>
                      <p className="text-slate-700">
                        <span className="text-slate-500 font-medium">Account Number:</span>{" "}
                        <span className="font-mono font-bold text-slate-800">{data.accountNumber}</span>
                      </p>
                      <p className="text-slate-900 font-bold pt-1 border-t border-slate-200">
                        <span className="text-slate-500 font-medium">Payment Ref:</span>{" "}
                        <span className="font-mono">{data.paymentReference}</span>
                      </p>
                    </div>

                    {/* Financial Summary (Right) */}
                    <div className="space-y-1 text-[10px] text-right">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span className="font-mono font-semibold text-slate-800">£{subtotal.toFixed(2)}</span>
                      </div>
                      {data.discount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-medium">
                          <span>Discount:</span>
                          <span className="font-mono">-£{data.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600">
                        <span>
                          VAT (
                          {data.vatType === "exempt"
                            ? "0% DRC / Exempt"
                            : data.vatType === "standard"
                            ? "20%"
                            : `${data.customVatRate}%`}
                          ):
                        </span>
                        <span className="font-mono font-semibold text-slate-800">£{vatAmount.toFixed(2)}</span>
                      </div>
                      {data.depositPaid > 0 && (
                        <div className="flex justify-between text-slate-600">
                          <span>Deposit Paid:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            £{data.depositPaid.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* BALANCE DUE HIGHLIGHT BAR */}
                      <div className="flex justify-between items-center bg-[#18181b] text-white px-3 py-2 rounded-lg font-bold text-[11px] mt-2 shadow-sm border-t-2 border-[#d4af37]">
                        <span className="text-[#d4af37] tracking-wider uppercase text-[10px]">
                          BALANCE DUE:
                        </span>
                        <span className="text-white font-mono text-[13px] font-extrabold">
                          £{balanceDue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Guarantee Disclaimer (Positioned safely above bottom flourish) */}
                  {data.notes && (
                    <div className="border-t border-slate-200/90 pt-2 text-[8px] text-slate-500 italic leading-snug">
                      <p>{data.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
