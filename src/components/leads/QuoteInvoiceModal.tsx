"use client";

import { useState } from "react";
import type { Lead } from "@/types/database";
import {
  X,
  Printer,
  Share2,
  Plus,
  Trash2,
  FileText,
  Check,
  Building2,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Send
} from "lucide-react";
import toast from "react-hot-toast";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

interface QuoteInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export default function QuoteInvoiceModal({ isOpen, onClose, lead }: QuoteInvoiceModalProps) {
  if (!isOpen || !lead) return null;

  const quoteNumber = `ZK-Q-${new Date().getFullYear()}-${lead.id.slice(0, 4).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const validUntilDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const [documentType, setDocumentType] = useState<"quote" | "invoice">("quote");
  const [customerName, setCustomerName] = useState(lead.name || "");
  const [customerPhone, setCustomerPhone] = useState(lead.phone || "");
  const [customerEmail, setCustomerEmail] = useState(lead.email || "");
  const [customerAddress, setCustomerAddress] = useState(lead.room_size ? `Property Location (${lead.room_size})` : "Birmingham, West Midlands");
  const [notes, setNotes] = useState(
    "All installations strictly follow British Standards BS 8203. 10-Year Trade Workmanship Guarantee included. Price includes full subfloor preparation and dust-controlled cleanup."
  );

  // Default Line Items based on lead service
  const initialItems: LineItem[] = [
    {
      id: "1",
      description: `${lead.service || "Premium Flooring Material Supply"} (High-traffic trade grade)`,
      quantity: 1,
      unit: "pack/m²",
      unitPrice: 450,
    },
    {
      id: "2",
      description: "Subfloor Laser Leveling & Primer Prep (Latex self-levelling screed)",
      quantity: 1,
      unit: "job",
      unitPrice: 180,
    },
    {
      id: "3",
      description: "Master Trade Certified Installation & Underlay Fitting",
      quantity: 1,
      unit: "room",
      unitPrice: 260,
    },
    {
      id: "4",
      description: "Door Trims, Solid Brass Thresholds & Perimeter Beading",
      quantity: 1,
      unit: "set",
      unitPrice: 60,
    },
  ];

  const [items, setItems] = useState<LineItem[]>(initialItems);
  const [vatRate, setVatRate] = useState<number>(0); // 0% or 20%
  const [depositPct, setDepositPct] = useState<number>(25);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(),
        description: "Additional bespoke fitting / material",
        quantity: 1,
        unit: "item",
        unitPrice: 50,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) {
      toast.error("At least one line item is required");
      return;
    }
    setItems(items.filter((it) => it.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, val: any) => {
    setItems(
      items.map((it) => (it.id === id ? { ...it, [field]: val } : it))
    );
  };

  const subtotal = items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  const vatAmount = (subtotal * vatRate) / 100;
  const total = subtotal + vatAmount;
  const depositAmount = (total * depositPct) / 100;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `Hello ${customerName},\n\nHere is your official *ZK Flooring ${documentType.toUpperCase()}* (${quoteNumber}):\n\n` +
      items.map((it) => `• ${it.description}: £${(it.quantity * it.unitPrice).toFixed(2)}`).join("\n") +
      `\n\n*Total: £${total.toFixed(2)}*\nDeposit to Book: £${depositAmount.toFixed(2)} (25%)\n\nGuaranteed with 10-Year Trade Warranty.\nCall us: 07903 723 774\nZK Flooring Birmingham`;

    const url = `https://wa.me/${customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white">
      {/* Modal Box */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Top Control Header (Hidden in Print) */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-200 text-neutral-950 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ZK Official Document Builder
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  {quoteNumber}
                </span>
              </h3>
              <p className="text-xs text-neutral-400">Generate, customize and print luxury client quotes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch Quote vs Invoice */}
            <div className="bg-neutral-800 p-1 rounded-xl flex items-center text-xs font-bold border border-neutral-700">
              <button
                type="button"
                onClick={() => setDocumentType("quote")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  documentType === "quote" ? "bg-amber-500 text-neutral-950" : "text-neutral-300 hover:text-white"
                }`}
              >
                Quote
              </button>
              <button
                type="button"
                onClick={() => setDocumentType("invoice")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  documentType === "invoice" ? "bg-amber-500 text-neutral-950" : "text-neutral-300 hover:text-white"
                }`}
              >
                Invoice
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-all"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Print / PDF
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
              WhatsApp
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-8 bg-white text-neutral-900 print:p-6 print:overflow-visible">
          
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-neutral-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-black tracking-tight text-neutral-950 font-[var(--font-heading)]">
                  ZK <span className="text-amber-600">FLOORING</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-neutral-950 text-amber-400">
                  Master Trade Fitters
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
                B10 9HH, Hobmoor Road, Small Heath, Birmingham, UK<br />
                <strong>Tel:</strong> 07903 723 774 &bull; <strong>Email:</strong> zkflooring1@gmail.com<br />
                <strong>Web:</strong> www.zkflooring.co.uk
              </p>
            </div>

            <div className="text-right sm:min-w-[200px]">
              <h2 className="text-2xl font-black uppercase text-neutral-900 tracking-wider">
                {documentType === "quote" ? "PRICE ESTIMATE" : "TAX INVOICE"}
              </h2>
              <div className="text-xs text-neutral-600 space-y-1 mt-1">
                <p><strong>Ref:</strong> {quoteNumber}</p>
                <p><strong>Date:</strong> {currentDate}</p>
                <p><strong>Valid Until:</strong> {validUntilDate}</p>
              </div>
            </div>
          </div>

          {/* Customer & Job Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-xl border border-neutral-100 print:bg-white print:border-neutral-200">
            <div>
              <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2">
                Client Details:
              </div>
              <div className="space-y-1.5 text-xs text-neutral-800">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Full Name"
                  className="w-full font-bold text-sm bg-transparent border-b border-dashed border-neutral-300 focus:outline-none focus:border-amber-600 py-0.5"
                />
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full bg-transparent border-b border-dashed border-neutral-300 focus:outline-none focus:border-amber-600 py-0.5"
                />
                <input
                  type="text"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-dashed border-neutral-300 focus:outline-none focus:border-amber-600 py-0.5"
                />
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Job Location / Postcode"
                  className="w-full bg-transparent border-b border-dashed border-neutral-300 focus:outline-none focus:border-amber-600 py-0.5 text-neutral-600"
                />
              </div>
            </div>

            <div className="sm:border-l sm:border-neutral-200 sm:pl-6">
              <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2">
                Project Overview:
              </div>
              <div className="space-y-2 text-xs text-neutral-700">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Service Category:</span>
                  <span className="font-semibold text-neutral-900">{lead.service || "Flooring Installation"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Room / Area:</span>
                  <span className="font-semibold text-neutral-900">{lead.room_size || "Standard Room Spec"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Standard:</span>
                  <span className="font-semibold text-emerald-700">BS 8203 Compliant</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Warranty:</span>
                  <span className="font-semibold text-neutral-900">10-Year Trade Certificate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Itemized Work & Material Breakdown
              </h4>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 print:hidden"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-900 text-white font-bold">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-3 w-20 text-center">Qty</th>
                    <th className="py-3 px-3 w-24 text-center">Unit</th>
                    <th className="py-3 px-4 w-28 text-right">Rate (£)</th>
                    <th className="py-3 px-4 w-28 text-right">Total (£)</th>
                    <th className="py-3 px-2 w-10 text-center print:hidden"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {items.map((item, idx) => {
                    const rowTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                    return (
                      <tr key={item.id} className="hover:bg-neutral-50/50">
                        <td className="py-2.5 px-4 text-center text-neutral-400 font-semibold">{idx + 1}</td>
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            className="w-full bg-transparent font-medium text-neutral-900 focus:outline-none focus:bg-amber-50/50 px-1.5 py-0.5 rounded"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                            className="w-full text-center bg-transparent focus:outline-none focus:bg-amber-50/50 px-1 py-0.5 rounded font-semibold"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                            className="w-full text-center text-neutral-500 bg-transparent focus:outline-none focus:bg-amber-50/50 px-1 py-0.5 rounded"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                            className="w-full text-right bg-transparent focus:outline-none focus:bg-amber-50/50 px-1.5 py-0.5 rounded font-semibold"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-neutral-900">
                          £{rowTotal.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2 text-center print:hidden">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
            <div className="sm:col-span-7 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Terms, Guarantee & Warranty Notes
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-700 focus:outline-none focus:border-amber-600 leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-900 text-xs">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                <span className="font-medium">
                  Includes 10-Year Trade Certificate + Free off-cut disposal & vacuumed room handover.
                </span>
              </div>
            </div>

            <div className="sm:col-span-5 bg-neutral-50 p-5 rounded-xl border border-neutral-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-neutral-900">£{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-neutral-600">
                <span>VAT ({vatRate}%):</span>
                <span className="font-semibold text-neutral-900">£{vatAmount.toFixed(2)}</span>
              </div>

              <div className="border-t border-neutral-200 pt-2 flex justify-between text-base font-extrabold text-neutral-950">
                <span>Grand Total:</span>
                <span className="text-amber-700 font-[var(--font-heading)]">£{total.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-dashed border-neutral-200 flex justify-between text-xs text-neutral-700">
                <span>Deposit to Lock ({depositPct}%):</span>
                <span className="font-bold text-emerald-700">£{depositAmount.toFixed(2)}</span>
              </div>

              <div className="text-[10px] text-neutral-500 text-right pt-1">
                Balance due upon completion & client sign-off.
              </div>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-end justify-between gap-6 text-xs text-neutral-600">
            <div>
              <p className="font-bold text-neutral-900">ZK FLOORING BIRMINGHAM</p>
              <p>Trade Certified Fitting Team</p>
            </div>

            <div className="text-right">
              <div className="w-48 border-b border-neutral-400 pb-1 mb-1 text-center font-serif italic text-neutral-500">
                Authorized Fitter
              </div>
              <p className="text-[10px] text-neutral-400">Authorized Signature & Seal</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
