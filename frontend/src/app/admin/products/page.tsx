"use client";

import { useState } from "react";
import { Plus, PackageSearch } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ProductsTable } from "../components/products-table";
import { AddProductModal } from "../components/add-product-modal";
import { AdminPageShell } from "../components/admin-page-shell";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
          <PackageSearch className="h-5 w-5 text-cyan-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Product Catalog</p>
          <p className="text-xs text-gray-500">All products sync from your database in real time.</p>
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
