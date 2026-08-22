"use client";

import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  sortField?: string;
  sortDir?: "asc" | "desc";
  onSort?: (field: string) => void;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

export default function DataTable<T = any>({
  columns,
  data,
  keyField,
  page = 1,
  totalPages = 1,
  onPageChange,
  sortField,
  sortDir,
  onSort,
  onRowClick,
  actions,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm overflow-hidden">
      {/* Desktop table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-obsidian-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-4 py-3 text-[11px] font-semibold text-obsidian-400 uppercase tracking-wider ${
                    col.className || ""
                  }`}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => onSort?.(col.key)}
                      className="flex items-center gap-1 hover:text-obsidian-600 transition-colors"
                    >
                      {col.label}
                      <ArrowUpDown
                        className={`w-3 h-3 ${
                          sortField === col.key ? "text-gold-500" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              {actions && (
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-obsidian-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-50">
            {data.map((item) => (
              <tr
                key={String((item as any)[keyField])}
                className={`hover:bg-obsidian-50/50 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm text-obsidian-600 ${
                      col.className || ""
                    }`}
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as any)[col.key] ?? "")}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-right">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {actions(item)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-obsidian-100">
          <p className="text-xs text-obsidian-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg text-obsidian-400 hover:bg-obsidian-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg text-obsidian-400 hover:bg-obsidian-50 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}