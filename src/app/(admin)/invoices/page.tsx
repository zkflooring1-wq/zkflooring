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
  FileText,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle,
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
} from "lucide-react";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";

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
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

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
    vatAmount = discountedSubtotal * 0.20;
  } else if (data.vatType === "custom") {
    vatAmount = discountedSubtotal * ((data.customVatRate || 0) / 100);
  }

  const grandTotal = discountedSubtotal + vatAmount;
  const balanceDue = Math.max(0, grandTotal - (data.depositPaid || 0));

  // Generate new random invoice number
  const handleGenerateInvoiceNo = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    setData((prev) => ({
      ...prev,
      invoiceNumber: `ZK-INV-${year}-${rand}`,
    }));
    toast.success("Generated new invoice number");
  };

  // Add line item
  const handleAddItem = (preset?: { description: string; unit: string; rate: number }) => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
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

  // Master Canvas Drawing Function (Generates 2482 x 3510, 300 DPI high-res canvas)
  const drawMasterCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = hiddenCanvasRef.current || document.createElement("canvas");
    canvas.width = 2482;
    canvas.height = 3510;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D canvas context");

    // Load template image
    const templateImg = new Image();
    templateImg.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      templateImg.onload = () => resolve();
      templateImg.onerror = () => reject(new Error("Failed to load invoice background template"));
      templateImg.src = "/invoice-template.png";
    });

    // 1. Draw template background
    ctx.drawImage(templateImg, 0, 0, 2482, 3510);

    // Font helpers
    const baseFont = "Arial, Helvetica, sans-serif";

    // 2. Title & Status Badge
    ctx.fillStyle = "#111827";
    ctx.font = `bold 68px ${baseFont}`;
    ctx.fillText(data.documentType.toUpperCase(), 160, 600);

    // Status Badge
    const statusConfig = {
      paid: { text: "PAID IN FULL", fill: "#dcfce7", stroke: "#16a34a", textCol: "#15803d" },
      pending: { text: "PENDING PAYMENT", fill: "#fef3c7", stroke: "#d97706", textCol: "#b45309" },
      partial: { text: "DEPOSIT PAID", fill: "#dbeafe", stroke: "#2563eb", textCol: "#1d4ed8" },
      overdue: { text: "OVERDUE", fill: "#fee2e2", stroke: "#dc2626", textCol: "#b91c1c" },
      draft: { text: "DRAFT", fill: "#f1f5f9", stroke: "#64748b", textCol: "#475569" },
    }[data.status];

    ctx.font = `bold 26px ${baseFont}`;
    const badgeTextWidth = ctx.measureText(statusConfig.text).width;
    const badgeX = 160 + ctx.measureText(data.documentType.toUpperCase()).width + 40;
    const badgeY = 550;
    const badgeW = badgeTextWidth + 36;
    const badgeH = 56;

    ctx.fillStyle = statusConfig.fill;
    ctx.strokeStyle = statusConfig.stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = statusConfig.textCol;
    ctx.fillText(statusConfig.text, badgeX + 18, badgeY + 38);

    // 3. Invoice Meta (Left side)
    const metaY = 675;
    const drawMetaRow = (y: number, label: string, val: string) => {
      ctx.fillStyle = "#64748b";
      ctx.font = `28px ${baseFont}`;
      ctx.fillText(label, 160, y);

      ctx.fillStyle = "#0f172a";
      ctx.font = `bold 28px ${baseFont}`;
      ctx.fillText(val, 420, y);
    };

    drawMetaRow(metaY, "Invoice Number:", data.invoiceNumber);
    drawMetaRow(metaY + 50, "Invoice Date:", formatDate(data.invoiceDate));
    drawMetaRow(metaY + 100, "Due Date:", formatDate(data.dueDate));

    // 4. Client Information (Right side)
    const clientX = 1420;
    ctx.fillStyle = "#c59b27";
    ctx.font = `bold 28px ${baseFont}`;
    ctx.fillText("INVOICE TO:", clientX, 580);

    ctx.fillStyle = "#0f172a";
    ctx.font = `bold 36px ${baseFont}`;
    ctx.fillText(data.clientName || "Valued Customer", clientX, 630);

    ctx.fillStyle = "#475569";
    ctx.font = `28px ${baseFont}`;
    let clientOffset = 680;
    if (data.clientPhone) {
      ctx.fillText(data.clientPhone, clientX, clientOffset);
      clientOffset += 45;
    }
    if (data.clientEmail) {
      ctx.fillText(data.clientEmail, clientX, clientOffset);
      clientOffset += 45;
    }
    if (data.clientAddress) {
      // Split address if too long
      const addrLines = wrapText(ctx, data.clientAddress, 900);
      for (const line of addrLines) {
        ctx.fillText(line, clientX, clientOffset);
        clientOffset += 42;
      }
    }

    // 5. Line Items Table
    const tableTop = 880;
    const tableWidth = 2162;
    const tableLeft = 160;

    // Header Background
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(tableLeft, tableTop, tableWidth, 75, 8);
    ctx.fill();

    // Table Header Text
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 26px ${baseFont}`;
    ctx.fillText("#", tableLeft + 25, tableTop + 48);
    ctx.fillText("DESCRIPTION / SERVICE", tableLeft + 90, tableTop + 48);
    
    ctx.textAlign = "right";
    ctx.fillText("QTY / AREA", tableLeft + 1450, tableTop + 48);
    ctx.fillText("RATE (£)", tableLeft + 1780, tableTop + 48);
    ctx.fillText("AMOUNT (£)", tableLeft + 2130, tableTop + 48);
    ctx.textAlign = "left";

    // Table Rows
    let currentY = tableTop + 75;
    const rowHeight = 78;

    data.items.forEach((item, index) => {
      // Alternating background
      ctx.fillStyle = index % 2 === 1 ? "#f8fafc" : "#ffffff";
      ctx.fillRect(tableLeft, currentY, tableWidth, rowHeight);

      // Bottom border
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tableLeft, currentY + rowHeight);
      ctx.lineTo(tableLeft + tableWidth, currentY + rowHeight);
      ctx.stroke();

      // Number
      ctx.fillStyle = "#64748b";
      ctx.font = `26px ${baseFont}`;
      ctx.fillText(String(index + 1), tableLeft + 25, currentY + 48);

      // Description (truncated if necessary)
      ctx.fillStyle = "#0f172a";
      ctx.font = `26px ${baseFont}`;
      const desc = truncateText(ctx, item.description, 1280);
      ctx.fillText(desc, tableLeft + 90, currentY + 48);

      // Quantity + Unit
      ctx.textAlign = "right";
      ctx.fillStyle = "#475569";
      ctx.fillText(`${item.quantity} ${item.unit || ""}`.trim(), tableLeft + 1450, currentY + 48);

      // Rate
      ctx.fillText(`£${item.rate.toFixed(2)}`, tableLeft + 1780, currentY + 48);

      // Total
      ctx.fillStyle = "#0f172a";
      ctx.font = `bold 26px ${baseFont}`;
      ctx.fillText(`£${item.total.toFixed(2)}`, tableLeft + 2130, currentY + 48);
      ctx.textAlign = "left";

      currentY += rowHeight;
    });

    // 6. Bottom Section: Bank Details (Left) & Financial Summary (Right)
    const bottomY = currentY + 45;

    // Bank Information Box
    const bankBoxW = 1050;
    const bankBoxH = 340;
    ctx.fillStyle = "#f8fafc";
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(tableLeft, bottomY, bankBoxW, bankBoxH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#c59b27";
    ctx.font = `bold 28px ${baseFont}`;
    ctx.fillText("PAYMENT & BANK DETAILS", tableLeft + 35, bottomY + 50);

    ctx.fillStyle = "#334155";
    ctx.font = `26px ${baseFont}`;
    ctx.fillText(`Bank: ${data.bankName}`, tableLeft + 35, bottomY + 105);
    ctx.fillText(`Account Name: ${data.accountName}`, tableLeft + 35, bottomY + 150);
    ctx.fillText(`Sort Code: ${data.sortCode}`, tableLeft + 35, bottomY + 195);
    ctx.fillText(`Account Number: ${data.accountNumber}`, tableLeft + 35, bottomY + 240);

    ctx.fillStyle = "#0f172a";
    ctx.font = `bold 26px ${baseFont}`;
    ctx.fillText(`Payment Ref: ${data.paymentReference}`, tableLeft + 35, bottomY + 295);

    // Terms & Guarantee Note
    if (data.notes) {
      ctx.fillStyle = "#64748b";
      ctx.font = `italic 22px ${baseFont}`;
      const noteLines = wrapText(ctx, data.notes, 1050);
      let noteY = bottomY + bankBoxH + 35;
      for (const line of noteLines) {
        ctx.fillText(line, tableLeft, noteY);
        noteY += 32;
      }
    }

    // Totals Table (Right side)
    const totalsX = 1380;
    const totalsValX = tableLeft + tableWidth;
    let totalsRowY = bottomY + 15;

    const drawTotalLine = (label: string, value: string, isBold: boolean = false) => {
      ctx.fillStyle = isBold ? "#0f172a" : "#64748b";
      ctx.font = `${isBold ? "bold " : ""}28px ${baseFont}`;
      ctx.fillText(label, totalsX, totalsRowY);

      ctx.textAlign = "right";
      ctx.fillStyle = isBold ? "#0f172a" : "#334155";
      ctx.fillText(value, totalsValX, totalsRowY);
      ctx.textAlign = "left";

      // subtle separator line
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(totalsX, totalsRowY + 20);
      ctx.lineTo(totalsValX, totalsRowY + 20);
      ctx.stroke();

      totalsRowY += 58;
    };

    drawTotalLine("Subtotal:", `£${subtotal.toFixed(2)}`);
    if (data.discount > 0) {
      drawTotalLine("Discount:", `-£${data.discount.toFixed(2)}`);
    }

    const vatLabel = data.vatType === "exempt" ? "VAT (0% DRC / Exempt):" : `VAT (${data.vatType === "standard" ? 20 : data.customVatRate}%):`;
    drawTotalLine(vatLabel, `£${vatAmount.toFixed(2)}`);

    if (data.depositPaid > 0) {
      drawTotalLine("Deposit / Amount Paid:", `£${data.depositPaid.toFixed(2)}`);
    }

    // Grand Balance Due Box
    totalsRowY += 10;
    const balanceH = 75;
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(totalsX - 15, totalsRowY - 15, totalsValX - totalsX + 30, balanceH, 10);
    ctx.fill();

    ctx.fillStyle = "#d4af37"; // luxury gold
    ctx.font = `bold 32px ${baseFont}`;
    ctx.fillText("BALANCE DUE:", totalsX + 15, totalsRowY + 35);

    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 36px ${baseFont}`;
    ctx.fillText(`£${balanceDue.toFixed(2)}`, totalsValX - 15, totalsRowY + 36);
    ctx.textAlign = "left";

    return canvas;
  };

  // Helper text wrap
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0] || "";

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Helper truncate
  const truncateText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string => {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let truncated = text;
    while (truncated.length > 0 && ctx.measureText(truncated + "...").width > maxWidth) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + "...";
  };

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
    try {
      setIsGenerating(true);
      toast.loading("Generating high-resolution PDF...", { id: "pdf-toast" });

      const canvas = await drawMasterCanvas();
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
      const filename = `ZK_Invoice_${data.invoiceNumber || "Draft"}.pdf`;
      pdf.save(filename);

      toast.success("PDF downloaded successfully!", { id: "pdf-toast" });
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to generate PDF: ${err.message}`, { id: "pdf-toast" });
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Download as High-Resolution Image (PNG, 300 DPI)
  const handleDownloadImage = async () => {
    try {
      setIsGenerating(true);
      toast.loading("Exporting 300 DPI image...", { id: "img-toast" });

      const canvas = await drawMasterCanvas();
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
        toast.success("High-res image downloaded!", { id: "img-toast" });
      }, "image/png");
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to export image: ${err.message}`, { id: "img-toast" });
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Print Functionality (Dedicated printable iframe/window)
  const handlePrint = async () => {
    try {
      setIsGenerating(true);
      toast.loading("Preparing print layout...", { id: "print-toast" });

      const canvas = await drawMasterCanvas();
      const dataUrl = canvas.toDataURL("image/png");

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Popup blocked! Please allow popups to print.", { id: "print-toast" });
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - ${data.invoiceNumber}</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #fff;
              }
              img {
                width: 100vw;
                height: 100vh;
                object-fit: contain;
                page-break-after: avoid;
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.focus(); window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("Print dialog opened!", { id: "print-toast" });
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to print: ${err.message}`, { id: "print-toast" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AdminLayout title="Invoice Generator" breadcrumb={["Admin", "Invoices"]}>
      {/* Hidden Master Canvas */}
      <canvas ref={hiddenCanvasRef} className="hidden" />

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-obsidian-800/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-obsidian-700/60 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gold-400/10 text-gold-400 border border-gold-400/20">
              <Receipt className="w-5 h-5" />
            </span>
            Invoice Generator
          </h1>
          <p className="text-obsidian-400 text-xs sm:text-sm mt-1">
            Dynamic data overlay onto official ZK Flooring letterhead template with instant PDF export & print.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setData(DEFAULT_SAMPLE)}
            className="flex items-center gap-1.5 px-3 py-2 bg-obsidian-700 hover:bg-obsidian-600 text-obsidian-200 text-xs sm:text-sm font-medium rounded-xl border border-obsidian-600/60 transition-all cursor-pointer"
            title="Load realistic flooring sample data"
          >
            <RotateCcw className="w-4 h-4 text-gold-400" />
            <span className="hidden md:inline">Sample Demo</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-obsidian-700 hover:bg-obsidian-600 text-white text-xs sm:text-sm font-medium rounded-xl border border-obsidian-600/60 transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-obsidian-700 hover:bg-obsidian-600 text-white text-xs sm:text-sm font-medium rounded-xl border border-obsidian-600/60 transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            <FileImage className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Image</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-300 text-obsidian-950 text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Toggle */}
      <div className="flex lg:hidden mb-4 bg-obsidian-800 p-1 rounded-xl border border-obsidian-700">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "edit" ? "bg-gold-400 text-obsidian-950 shadow-md" : "text-obsidian-300"
          }`}
        >
          1. Edit Invoice
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "preview" ? "bg-gold-400 text-obsidian-950 shadow-md" : "text-obsidian-300"
          }`}
        >
          2. Live A4 Preview
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: Form Controls ================= */}
        <div className={`lg:col-span-6 space-y-6 ${activeTab === "preview" ? "hidden lg:block" : "block"}`}>
          {/* Card 1: Document Details */}
          <div className="bg-obsidian-800/90 border border-obsidian-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-obsidian-700/50">
              <Calendar className="w-4 h-4 text-gold-400" />
              Document & Metadata
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Document Type</label>
                <select
                  value={data.documentType}
                  onChange={(e) => setData({ ...data, documentType: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                >
                  <option value="INVOICE">INVOICE</option>
                  <option value="ESTIMATE / QUOTE">ESTIMATE / QUOTE</option>
                  <option value="PRO-FORMA INVOICE">PRO-FORMA INVOICE</option>
                  <option value="RECEIPT">RECEIPT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5 flex justify-between items-center">
                  <span>Invoice Number</span>
                  <button
                    type="button"
                    onClick={handleGenerateInvoiceNo}
                    className="text-[11px] text-gold-400 hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Sparkles className="w-3 h-3" /> Auto
                  </button>
                </label>
                <input
                  type="text"
                  value={data.invoiceNumber}
                  onChange={(e) => setData({ ...data, invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Invoice Date</label>
                <input
                  type="date"
                  value={data.invoiceDate}
                  onChange={(e) => setData({ ...data, invoiceDate: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => setData({ ...data, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Payment Status</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(["paid", "pending", "partial", "overdue", "draft"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setData({ ...data, status: st })}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                        data.status === st
                          ? "bg-gold-400 text-obsidian-950 border-gold-400 shadow-md font-bold"
                          : "bg-obsidian-900 text-obsidian-300 border-obsidian-700 hover:border-obsidian-500"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Client / Bill To */}
          <div className="bg-obsidian-800/90 border border-obsidian-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-obsidian-700/50">
              <User className="w-4 h-4 text-gold-400" />
              Client / Bill To
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Customer / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. David Harrison or High Street Properties Ltd"
                  value={data.clientName}
                  onChange={(e) => setData({ ...data, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="+44 7123 456789"
                  value={data.clientPhone}
                  onChange={(e) => setData({ ...data, clientPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="client@example.co.uk"
                  value={data.clientEmail}
                  onChange={(e) => setData({ ...data, clientEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Installation / Property Address</label>
                <input
                  type="text"
                  placeholder="Street, Town, Postcode (e.g. 42 Warwick Road, Solihull, B92 7HX)"
                  value={data.clientAddress}
                  onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Line Items */}
          <div className="bg-obsidian-800/90 border border-obsidian-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-obsidian-700/50">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-gold-400" />
                Line Items (Services & Materials)
              </h2>

              {/* Quick Presets Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="px-2.5 py-1.5 bg-obsidian-700 hover:bg-obsidian-600 text-gold-400 text-xs font-semibold rounded-lg border border-obsidian-600 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Quick Flooring Preset</span>
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-72 bg-obsidian-900 border border-obsidian-700 rounded-xl shadow-2xl p-1 z-30 hidden group-hover:block max-h-60 overflow-y-auto">
                  {PRESET_SERVICES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddItem(p)}
                      className="w-full text-left p-2 hover:bg-obsidian-800 rounded-lg text-xs text-obsidian-200 transition-colors flex justify-between items-center cursor-pointer"
                    >
                      <span className="truncate pr-2">{p.description}</span>
                      <span className="font-bold text-gold-400 whitespace-nowrap">£{p.rate}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Line Items List */}
            <div className="space-y-3">
              {data.items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-obsidian-900/90 rounded-xl border border-obsidian-700/70 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Item / Service Description"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-obsidian-800 border border-obsidian-700 rounded-lg text-white text-sm focus:border-gold-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <label className="text-obsidian-400 block mb-1">Qty</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, "quantity", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-obsidian-800 border border-obsidian-700 rounded-lg text-white text-xs focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-obsidian-400 block mb-1">Unit</label>
                      <input
                        type="text"
                        placeholder="sq m, rolls"
                        value={item.unit}
                        onChange={(e) => handleUpdateItem(item.id, "unit", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-obsidian-800 border border-obsidian-700 rounded-lg text-white text-xs focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-obsidian-400 block mb-1">Rate (£)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => handleUpdateItem(item.id, "rate", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-obsidian-800 border border-obsidian-700 rounded-lg text-white text-xs focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-obsidian-400 block mb-1">Total (£)</label>
                      <div className="px-2.5 py-1.5 bg-obsidian-950 border border-obsidian-800 rounded-lg text-gold-400 font-bold text-xs truncate">
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
              className="w-full py-2.5 border-2 border-dashed border-obsidian-700 hover:border-gold-400/60 rounded-xl text-obsidian-300 hover:text-gold-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Line Item</span>
            </button>
          </div>

          {/* Card 4: Financials & VAT */}
          <div className="bg-obsidian-800/90 border border-obsidian-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-obsidian-700/50">
              <CreditCard className="w-4 h-4 text-gold-400" />
              Discounts, VAT & Payments
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Discount (£)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.discount}
                  onChange={(e) => setData({ ...data, discount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">VAT Calculation</label>
                <select
                  value={data.vatType}
                  onChange={(e: any) => setData({ ...data, vatType: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                >
                  <option value="exempt">0% Exempt / DRC</option>
                  <option value="standard">20% Standard UK</option>
                  <option value="custom">Custom VAT %</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Deposit Paid (£)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.depositPaid}
                  onChange={(e) => setData({ ...data, depositPaid: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="p-4 bg-obsidian-950 rounded-xl border border-obsidian-800 space-y-2 text-sm">
              <div className="flex justify-between text-obsidian-400 text-xs">
                <span>Subtotal:</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              {data.discount > 0 && (
                <div className="flex justify-between text-emerald-400 text-xs">
                  <span>Discount:</span>
                  <span>-£{data.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-obsidian-400 text-xs">
                <span>VAT ({data.vatType === "exempt" ? "0%" : data.vatType === "standard" ? "20%" : `${data.customVatRate}%`}):</span>
                <span>£{vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-2 border-t border-obsidian-800">
                <span>Grand Total:</span>
                <span>£{grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gold-400 font-extrabold text-base pt-1">
                <span>Balance Due:</span>
                <span>£{balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Card 5: Bank Details & Notes */}
          <div className="bg-obsidian-800/90 border border-obsidian-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-obsidian-700/50">
              <Building2 className="w-4 h-4 text-gold-400" />
              Bank Transfer Info & Guarantee Terms
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Bank Name</label>
                <input
                  type="text"
                  value={data.bankName}
                  onChange={(e) => setData({ ...data, bankName: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Account Name</label>
                <input
                  type="text"
                  value={data.accountName}
                  onChange={(e) => setData({ ...data, accountName: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Sort Code</label>
                <input
                  type="text"
                  value={data.sortCode}
                  onChange={(e) => setData({ ...data, sortCode: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Account Number</label>
                <input
                  type="text"
                  value={data.accountNumber}
                  onChange={(e) => setData({ ...data, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-obsidian-300 mb-1.5">Installation Guarantee & Terms</label>
                <textarea
                  rows={3}
                  value={data.notes}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600/70 rounded-xl text-white text-xs focus:border-gold-400 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Live A4 Visual Preview ================= */}
        <div className={`lg:col-span-6 sticky top-24 ${activeTab === "edit" ? "hidden lg:block" : "block"}`}>
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between mb-3 px-1 text-xs text-obsidian-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">Live A4 Paper Preview</span>
              <span className="text-[11px] text-obsidian-500">(Letterhead Canvas)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-obsidian-800 px-2 py-1 rounded-lg border border-obsidian-700">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono text-[11px] text-obsidian-200">{zoom}%</span>
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
                className="p-1 hover:text-white transition-colors cursor-pointer border-l border-obsidian-700 pl-1.5 ml-0.5"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Interactive Sheet Container */}
          <div className="overflow-auto max-h-[85vh] p-2 sm:p-4 bg-obsidian-950/80 rounded-2xl border border-obsidian-800 flex justify-center shadow-2xl">
            <div
              style={{
                width: `${(595 * zoom) / 100}px`,
                minHeight: `${(842 * zoom) / 100}px`,
                backgroundImage: "url('/invoice-template.png')",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                transformOrigin: "top center",
              }}
              className="relative bg-white shadow-2xl rounded-sm transition-all duration-150 select-none text-black flex flex-col justify-between"
            >
              {/* Overlay Content with proportionate layout */}
              <div
                style={{
                  paddingTop: "17%",
                  paddingLeft: "7%",
                  paddingRight: "7%",
                  paddingBottom: "10%",
                }}
                className="w-full flex-1 flex flex-col justify-between text-[11px] leading-tight"
              >
                <div>
                  {/* Top Bar: Title & Client info */}
                  <div className="flex justify-between items-start mb-6">
                    {/* Left: Document type & metadata */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
                          {data.documentType}
                        </h1>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                            data.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : data.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-300"
                              : data.status === "partial"
                              ? "bg-blue-50 text-blue-700 border-blue-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          {data.status.replace("-", " ")}
                        </span>
                      </div>

                      <div className="space-y-1 text-gray-600 text-[10px]">
                        <p>
                          <span className="font-semibold text-gray-800">Invoice No:</span> {data.invoiceNumber}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-800">Date:</span> {formatDate(data.invoiceDate)}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-800">Due Date:</span> {formatDate(data.dueDate)}
                        </p>
                      </div>
                    </div>

                    {/* Right: Bill To */}
                    <div className="text-left max-w-[220px]">
                      <span className="text-[10px] font-bold text-[#b8860b] uppercase tracking-wider block mb-1">
                        INVOICE TO:
                      </span>
                      <p className="font-bold text-gray-900 text-[12px]">{data.clientName || "Valued Client"}</p>
                      {data.clientPhone && <p className="text-gray-600 text-[10px]">{data.clientPhone}</p>}
                      {data.clientEmail && <p className="text-gray-600 text-[10px]">{data.clientEmail}</p>}
                      {data.clientAddress && (
                        <p className="text-gray-600 text-[10px] mt-0.5 leading-snug">{data.clientAddress}</p>
                      )}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="rounded-md overflow-hidden border border-gray-200 mb-6">
                    <table className="w-full text-left border-collapse text-[10px]">
                      <thead>
                        <tr className="bg-gray-900 text-white font-semibold text-[9px] uppercase tracking-wider">
                          <th className="py-1.5 px-2 w-6">#</th>
                          <th className="py-1.5 px-2">Description / Service</th>
                          <th className="py-1.5 px-2 text-right">Qty/Area</th>
                          <th className="py-1.5 px-2 text-right">Rate</th>
                          <th className="py-1.5 px-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.items.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 1 ? "bg-gray-50/70" : "bg-white"}>
                            <td className="py-1.5 px-2 text-gray-400 font-mono">{idx + 1}</td>
                            <td className="py-1.5 px-2 font-medium text-gray-800 max-w-[200px] truncate">
                              {item.description}
                            </td>
                            <td className="py-1.5 px-2 text-right text-gray-600">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="py-1.5 px-2 text-right text-gray-600">£{item.rate.toFixed(2)}</td>
                            <td className="py-1.5 px-2 text-right font-bold text-gray-900">
                              £{item.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Section: Bank + Totals */}
                <div>
                  <div className="grid grid-cols-2 gap-4 items-start mb-4">
                    {/* Bank Info */}
                    <div className="bg-gray-50/90 border border-gray-200 rounded-lg p-2.5 text-[9px] space-y-1">
                      <span className="font-bold text-[#b8860b] uppercase text-[9px] block">
                        PAYMENT INFORMATION
                      </span>
                      <p className="text-gray-700">Bank: {data.bankName}</p>
                      <p className="text-gray-700">Account: {data.accountName}</p>
                      <p className="text-gray-700">Sort Code: {data.sortCode}</p>
                      <p className="text-gray-700">Account No: {data.accountNumber}</p>
                      <p className="font-bold text-gray-900">Ref: {data.paymentReference}</p>
                    </div>

                    {/* Totals */}
                    <div className="space-y-1 text-[10px] text-right">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>£{subtotal.toFixed(2)}</span>
                      </div>
                      {data.discount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-medium">
                          <span>Discount:</span>
                          <span>-£{data.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600">
                        <span>VAT ({data.vatType === "exempt" ? "0%" : "20%"}):</span>
                        <span>£{vatAmount.toFixed(2)}</span>
                      </div>
                      {data.depositPaid > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Deposit Paid:</span>
                          <span>£{data.depositPaid.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center bg-gray-900 text-white p-1.5 rounded-md font-bold text-[11px] mt-2">
                        <span className="text-gold-400">BALANCE DUE:</span>
                        <span>£{balanceDue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Guarantee Note */}
                  {data.notes && (
                    <p className="text-[8px] text-gray-500 italic border-t border-gray-200/80 pt-2 leading-tight">
                      {data.notes}
                    </p>
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
