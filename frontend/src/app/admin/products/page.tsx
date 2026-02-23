"use client";

import { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { ProductsTable } from "../components/products-table";
import { AddProductModal } from "../components/add-product-modal";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:px-6 lg:py-6 py-6 px-2 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setOpen(true)}>Add Product</Button>
      </div>

      <ProductsTable />

      <AddProductModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
