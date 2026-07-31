"use client";

import { useEffect, useState } from "react";
import { Plus, PackageSearch, Zap, ChevronDown, Save, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ProductsTable } from "../components/products-table";
import { AddProductModal } from "../components/add-product-modal";
import { AdminPageShell } from "../components/admin-page-shell";
import {
  INSTALLATION_WITHIN_OPTIONS,
  InstallationWithinValue,
} from "@/app/lib/installationCharges";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  /* ── Global installation_within ── */
  const [globalWithin, setGlobalWithin] = useState<InstallationWithinValue>("24 hours");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* Load current value from backend on mount */
  useEffect(() => {
    fetch(`${API_URL}/products/config`)
      .then(r => r.json())
      .then(data => {
        if (data.installation_within) {
          setGlobalWithin(data.installation_within as InstallationWithinValue);
        }
      })
      .catch(() => {/* keep default */})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveGlobal = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/products/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ installation_within: globalWithin }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }

      setSaved(true);
      toast.success(`Global installation timeline set to "${globalWithin}" — applied to all products`);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      toast.error(err.message || "Failed to save setting");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPageShell
      title="Products"
      description="Manage your product catalog, pricing, and inventory."
      action={
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      }
    >
      {/* ── Catalog info strip ── */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
          <PackageSearch className="h-5 w-5 text-cyan-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Product Catalog</p>
          <p className="text-xs text-gray-500">All products sync from your database in real time.</p>
        </div>
      </div>

      {/* ── Global Installation Settings panel ── */}
      <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border-b border-amber-100">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">Global Installation Timeline</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Sets the "Installation within" label shown on <strong>all</strong> Fast Installation
              products. You can override per product in Edit Product.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Default Installation Timeline
            </label>
            <div className="relative inline-block w-full sm:w-72">
              <select
                value={globalWithin}
                disabled={loading}
                onChange={e => setGlobalWithin(e.target.value as InstallationWithinValue)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 cursor-pointer disabled:opacity-60"
              >
                {INSTALLATION_WITHIN_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    Installation within {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              {loading
                ? "Loading current setting…"
                : <>Currently saved: <span className="font-semibold text-amber-600">Installation within {globalWithin}</span></>
              }
            </p>
          </div>

          <div className="shrink-0 self-end sm:self-auto">
            <button
              onClick={handleSaveGlobal}
              disabled={saving || loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                saved
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-200"
              }`}
            >
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : saved
                  ? <><Save className="w-4 h-4" /> Saved!</>
                  : <><Save className="w-4 h-4" /> Save Global Setting</>
              }
            </button>
          </div>
        </div>

        {/* Live preview */}
        <div className="px-5 pb-4">
          <p className="text-[11px] text-gray-400 mb-2 font-semibold uppercase tracking-wide">
            Preview on product page:
          </p>
          <div className="inline-flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-amber-50 to-white border border-amber-100 text-center w-36">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-900">Fast Installation</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">
                within {globalWithin}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProductsTable key={refreshKey} />

      <AddProductModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setRefreshKey(k => k + 1);
        }}
      />
    </AdminPageShell>
  );
}
