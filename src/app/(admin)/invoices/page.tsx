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
  Layers,
  CheckCircle2,
  HelpCircle,
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
  documentType: "INVOICE" | "ESTIMATE / QUOTE" | "PRO-FORMA INVOICE" | "RECEIPT";
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
  { description: "LVT Herringbone Supply & Fitting (Amtico Signature Collection)", unit: "sq m", rate: 65 },
  { description: "Subfloor Preparation: F.Ball 1200 Pro Self-Levelling Compound Screed", unit: "sq m", rate: 18 },
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
  const [zoom, setZoom] = useState(85);
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

  // Financial calculations
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

  // Generate random invoice number
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
      toast.error("Invoice must contain at least one item");
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

  // Date formatter helper
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
    const element = invoiceSheetRef.current;
    const originalTransform = element.style.transform;
    try {
      setIsGenerating(true);
      toast.loading("Rendering high-definition 300 DPI PDF...", { id: "pdf-toast" });

      // Temporarily set transform to scale(1) for pure 1:1 capture
      element.style.transform = "scale(1)";

      const canvas = await html2canvas(element, {
        scale: 3.125, // 794px * 3.125 = 2481px (exact 300 DPI A4)
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.96);
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
      element.style.transform = originalTransform;
      setIsGenerating(false);
    }
  };

  // 2. Download as High-Resolution PNG Image
  const handleDownloadImage = async () => {
    if (!invoiceSheetRef.current) return;
    const element = invoiceSheetRef.current;
    const originalTransform = element.style.transform;
    try {
      setIsGenerating(true);
      toast.loading("Exporting 300 DPI image...", { id: "img-toast" });

      // Temporarily set transform to scale(1) for pure 1:1 capture
      element.style.transform = "scale(1)";

      const canvas = await html2canvas(element, {
        scale: 3.125,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: 1123,
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
      element.style.transform = originalTransform;
      setIsGenerating(false);
    }
  };

  // 3. Print Directly (Browser native A4 print dialog with 100% vector fidelity)
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
          *,
          *:before,
          *:after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            width: 210mm !important;
            height: 297mm !important;
          }
          aside,
          nav,
          header,
          footer,
          [data-no-print="true"],
          .no-print-area {
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
          .invoice-sheet-container {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            transform: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            background-image: url("/invoice-template.png") !important;
            background-size: 100% 100% !important;
            background-repeat: no-repeat !important;
          }
        }
      `}</style>

      {/* ================= TOP STUDIO ACTION BAR ================= */}
      <div
        data-no-print="true"
        className="no-print-area flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Invoice Studio
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Official Letterhead
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Accurate coordinate overlay matching ZK Flooring print geometry with instant PDF & print.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setData(DEFAULT_SAMPLE)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700/80 transition-all cursor-pointer shadow-sm"
            title="Load sample flooring data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700/80 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700/80 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <FileImage className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Export Image</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Toggle */}
      <div data-no-print="true" className="no-print-area flex lg:hidden mb-4 bg-slate-800 p-1 rounded-xl border border-slate-700">
        <button
          type="button"
          onClick={() => setActiveMobileTab("edit")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeMobileTab === "edit" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300"
          }`}
        >
          1. Edit Invoice Form
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab("preview")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeMobileTab === "preview" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300"
          }`}
        >
          2. Live Paper Preview
        </button>
      </div>

      {/* ================= MAIN STUDIO GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: Refined Human-Crafted SaaS Editor ================= */}
        <div
          data-no-print="true"
          className={`no-print-area lg:col-span-6 space-y-4 ${activeMobileTab === "preview" ? "hidden lg:block" : "block"}`}
        >
          {/* Card 1: Document & Payment Status */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Document & Meta
              </h2>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 font-bold">
                {data.invoiceNumber}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Document Type</label>
                <select
                  value={data.documentType}
                  onChange={(e: any) => setData({ ...data, documentType: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs font-medium focus:border-amber-400 focus:outline-none transition-colors"
                >
                  <option value="INVOICE">INVOICE</option>
                  <option value="ESTIMATE / QUOTE">ESTIMATE / QUOTE</option>
                  <option value="PRO-FORMA INVOICE">PRO-FORMA INVOICE</option>
                  <option value="RECEIPT">RECEIPT</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex justify-between items-center">
                  <span>Document / Invoice #</span>
                  <button
                    type="button"
                    onClick={handleGenerateInvoiceNo}
                    className="text-[10.5px] text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <Sparkles className="w-3 h-3" /> Auto
                  </button>
                </label>
                <input
                  type="text"
                  value={data.invoiceNumber}
                  onChange={(e) => setData({ ...data, invoiceNumber: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs font-mono font-medium focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={data.invoiceDate}
                  onChange={(e) => setData({ ...data, invoiceDate: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => setData({ ...data, dueDate: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Payment Status Segmented Control */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Payment Status</label>
              <div className="grid grid-cols-5 gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(["paid", "pending", "partial", "overdue", "draft"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setData({ ...data, status: st })}
                    className={`py-1.5 text-[11px] font-bold rounded-md capitalize transition-all cursor-pointer ${
                      data.status === st
                        ? st === "paid"
                          ? "bg-emerald-500 text-slate-950 shadow-sm"
                          : st === "pending"
                          ? "bg-amber-400 text-slate-950 shadow-sm"
                          : st === "partial"
                          ? "bg-sky-400 text-slate-950 shadow-sm"
                          : st === "overdue"
                          ? "bg-rose-500 text-white shadow-sm"
                          : "bg-slate-700 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {st === "paid" ? "Paid" : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Client & Installation Site Details */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2.5 border-b border-slate-800/80">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Client & Site Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Customer / Company Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Mr. David Harrison"
                    value={data.clientName}
                    onChange={(e) => setData({ ...data, clientName: e.target.value })}
                    className="w-full h-9 pl-9 pr-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs font-medium focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="+44 7123 456789"
                    value={data.clientPhone}
                    onChange={(e) => setData({ ...data, clientPhone: e.target.value })}
                    className="w-full h-9 pl-9 pr-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="david.harrison@gmail.com"
                    value={data.clientEmail}
                    onChange={(e) => setData({ ...data, clientEmail: e.target.value })}
                    className="w-full h-9 pl-9 pr-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Installation / Billing Address</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. 42 Warwick Road, Solihull, West Midlands, B92 7HX"
                    value={data.clientAddress}
                    onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
                    className="w-full h-9 pl-9 pr-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Line Items (Sleek Data Grid Editor) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Line Items & Services
                </h2>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  {data.items.length} {data.items.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Quick Preset Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPresetsMenu(!showPresetsMenu)}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/20 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>+ Quick Presets</span>
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>

                {showPresetsMenu && (
                  <div className="absolute right-0 top-8 z-50 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-800">
                      Standard Flooring Services
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-0.5">
                      {PRESET_SERVICES.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddItem(p)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-800 text-slate-200 transition-colors flex justify-between items-center group cursor-pointer"
                        >
                          <span className="truncate pr-2">{p.description}</span>
                          <span className="text-amber-400 font-mono text-[11px] font-bold whitespace-nowrap">
                            £{p.rate}/{p.unit}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Compact Table View for Line Items */}
            <div className="space-y-2">
              {data.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 space-y-2 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Service or material description"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                      className="flex-1 h-8 px-2.5 bg-slate-900 border border-slate-800 rounded-md text-white text-xs font-medium focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer flex-shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs pl-7">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">Qty</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, "quantity", e.target.value)}
                        className="w-full h-7 px-2 bg-slate-900 border border-slate-800 rounded-md text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">Unit</span>
                      <input
                        type="text"
                        placeholder="sq m, job"
                        value={item.unit}
                        onChange={(e) => handleUpdateItem(item.id, "unit", e.target.value)}
                        className="w-full h-7 px-2 bg-slate-900 border border-slate-800 rounded-md text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">Rate (£)</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => handleUpdateItem(item.id, "rate", e.target.value)}
                        className="w-full h-7 px-2 bg-slate-900 border border-slate-800 rounded-md text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">Total (£)</span>
                      <div className="h-7 px-2 bg-slate-900/60 border border-slate-800 rounded-md text-amber-400 font-mono font-bold text-xs flex items-center justify-end">
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
              className="w-full py-2 border border-dashed border-slate-700 hover:border-amber-400/60 rounded-lg text-slate-300 hover:text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-950/40 hover:bg-amber-400/5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Line Item</span>
            </button>
          </div>

          {/* Card 4: Financials & Adjustments */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2.5 border-b border-slate-800/80">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              Financials & VAT
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Discount (£)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.discount}
                  onChange={(e) => setData({ ...data, discount: parseFloat(e.target.value) || 0 })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">VAT Scheme</label>
                <select
                  value={data.vatType}
                  onChange={(e: any) => setData({ ...data, vatType: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                >
                  <option value="exempt">0% Exempt / DRC</option>
                  <option value="standard">20% Standard UK</option>
                  <option value="custom">Custom VAT %</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Deposit Paid (£)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.depositPaid}
                  onChange={(e) => setData({ ...data, depositPaid: parseFloat(e.target.value) || 0 })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono">£{subtotal.toFixed(2)}</span>
              </div>
              {data.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Discount:</span>
                  <span className="font-mono">-£{data.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>VAT ({data.vatType === "exempt" ? "0%" : data.vatType === "standard" ? "20%" : `${data.customVatRate}%`}):</span>
                <span className="font-mono">£{vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-1.5 border-t border-slate-800">
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
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2.5 border-b border-slate-800/80">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              Bank Transfer Info & Terms
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={data.bankName}
                  onChange={(e) => setData({ ...data, bankName: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Account Name</label>
                <input
                  type="text"
                  value={data.accountName}
                  onChange={(e) => setData({ ...data, accountName: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Sort Code</label>
                <input
                  type="text"
                  value={data.sortCode}
                  onChange={(e) => setData({ ...data, sortCode: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Account Number</label>
                <input
                  type="text"
                  value={data.accountNumber}
                  onChange={(e) => setData({ ...data, accountNumber: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Workmanship Guarantee Disclaimer</label>
                <textarea
                  rows={2}
                  value={data.notes}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Live A4 Visual Preview ================= */}
        <div className={`lg:col-span-6 sticky top-20 ${activeMobileTab === "edit" ? "hidden lg:block" : "block"}`}>
          {/* Preview Toolbar */}
          <div data-no-print="true" className="no-print-area flex items-center justify-between mb-3 px-1 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">Live A4 Paper Preview</span>
              <span className="text-[11px] text-slate-500 font-mono">(WYSIWYG 1:1)</span>
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
                onClick={() => setZoom(85)}
                className="p-1 hover:text-white transition-colors cursor-pointer border-l border-slate-700 pl-1.5 ml-0.5"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ================= THE A4 INVOICE SHEET VIEWPORT ================= */}
          <div className="overflow-auto max-h-[88vh] p-2 sm:p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex justify-center shadow-2xl">
            {/* The scaled container that handles width & height with centering */}
            <div
              style={{
                width: `${(794 * zoom) / 100}px`,
                height: `${(1123 * zoom) / 100}px`,
                position: "relative",
              }}
              className="flex-shrink-0"
            >
              {/* Canonical 794 x 1123 A4 element */}
              <div
                ref={invoiceSheetRef}
                style={{
                  width: "794px",
                  height: "1123px",
                  minWidth: "794px",
                  minHeight: "1123px",
                  backgroundImage: "url('/invoice-template.png')",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                }}
                className="invoice-sheet-container relative bg-white shadow-2xl rounded-sm select-none text-slate-900 box-border overflow-hidden"
              >
                {/* 
                  ================ SAFE CONTENT CANVAS ================
                  Template Geometry Analysis:
                  - Top logo: Left = 84px, Right = 266px, Bottom = 138px
                  - Top contact text: Left = 410px, Right = 735px, Bottom = 131px
                  - Top right swirl flourish: extends down to Y = 214px, X = 640px to 794px
                  - Bottom left swirl flourish: starts at Y = 910px, X = 0 to 256px
                  
                  Safe Printable Zone:
                  - Left Margin: 80px (aligned with ZK logo start)
                  - Right Margin: 70px (aligned with contact text end)
                  - Usable Width: 644px
                  - Top Margin: 245px (safely clear of top-right flourish)
                  - Max Bottom: 870px (safely clear of bottom-left swirl flourish at 910px)
                  - Total Usable Height: 625px
                  
                  We use a single unified vertical layout so table and bottom sections NEVER collide!
                */}
                <div
                  style={{
                    position: "absolute",
                    top: "245px",
                    left: "80px",
                    right: "70px",
                    width: "644px",
                  }}
                  className="space-y-4"
                >
                  {/* 1. Header Information Block */}
                  <div className="flex justify-between items-start">
                    {/* Left Column: Title & Metadata */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <h1 className="text-[25px] font-black tracking-tight text-slate-950 uppercase leading-none font-sans whitespace-nowrap">
                          {data.documentType}
                        </h1>

                        {/* Status Badge */}
                        <span
                          className={`text-[9.5px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider border whitespace-nowrap ${
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

                      <div className="space-y-1 text-[11px] text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-semibold w-24">Invoice No:</span>
                          <span className="font-bold text-slate-900 font-mono">{data.invoiceNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-semibold w-24">Date:</span>
                          <span className="font-bold text-slate-800">{formatDate(data.invoiceDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-semibold w-24">Due Date:</span>
                          <span className="font-bold text-slate-800">{formatDate(data.dueDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Bill To */}
                    <div className="text-left w-[280px]">
                      <span className="text-[10.5px] font-extrabold text-[#b8860b] uppercase tracking-wider block mb-1">
                        INVOICE TO:
                      </span>
                      <p className="font-bold text-slate-950 text-[14.5px] leading-tight mb-1">
                        {data.clientName || "Valued Customer"}
                      </p>
                      {data.clientPhone && (
                        <p className="text-slate-600 text-[11px] leading-tight mb-0.5">{data.clientPhone}</p>
                      )}
                      {data.clientEmail && (
                        <p className="text-slate-600 text-[11px] leading-tight mb-0.5">{data.clientEmail}</p>
                      )}
                      {data.clientAddress && (
                        <p className="text-slate-600 text-[10.5px] leading-snug mt-1">{data.clientAddress}</p>
                      )}
                    </div>
                  </div>

                  {/* 2. Items & Services Table */}
                  <div className="rounded-lg overflow-hidden border border-slate-200/90 shadow-xs">
                    <table className="w-full text-left border-collapse text-[10.5px]">
                      <thead>
                        <tr className="bg-[#18181b] text-white font-bold text-[9.5px] uppercase tracking-wider border-t-2 border-[#d4af37]">
                          <th className="py-2 px-2.5 w-8 text-center">#</th>
                          <th className="py-2 px-3">Service / Material Description</th>
                          <th className="py-2 px-3 text-right w-24">Qty / Area</th>
                          <th className="py-2 px-3 text-right w-24">Rate (£)</th>
                          <th className="py-2 px-3.5 text-right w-28">Amount (£)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.items.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 1 ? "bg-slate-50/60" : "bg-white"}>
                            <td className="py-2 px-2.5 text-center text-slate-400 font-mono text-[9.5px]">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-800 leading-snug">
                              {item.description}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-600 font-medium whitespace-nowrap">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-600 font-mono whitespace-nowrap">
                              £{item.rate.toFixed(2)}
                            </td>
                            <td className="py-2 px-3.5 text-right font-bold text-slate-900 font-mono whitespace-nowrap">
                              £{item.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 3. Bottom Section: Bank (Left) & Financial Totals (Right) */}
                  <div className="grid grid-cols-2 gap-6 items-start pt-1">
                    {/* Left Column: Bank Details & Guarantee */}
                    <div>
                      <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-3 text-[9.5px] space-y-1 shadow-xs">
                        <span className="font-extrabold text-[#b8860b] uppercase text-[9.5px] tracking-wider block mb-1">
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

                      {/* Workmanship Guarantee Disclaimer - Located safely within left column */}
                      {data.notes && (
                        <div className="pt-2 text-[8px] text-slate-500 italic leading-snug">
                          <p>{data.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Financial Totals */}
                    <div className="space-y-1.5 text-[10.5px] text-right">
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

                      {/* BALANCE DUE Highlight Bar */}
                      <div className="flex justify-between items-center bg-[#18181b] text-white px-3.5 py-2.5 rounded-lg font-bold text-[11px] mt-2 shadow-xs border-t-2 border-[#d4af37]">
                        <span className="text-[#d4af37] tracking-wider uppercase text-[10px]">
                          BALANCE DUE:
                        </span>
                        <span className="text-white font-mono text-[13.5px] font-extrabold">
                          £{balanceDue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
