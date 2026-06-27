"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { getProducts, deleteProduct } from "@/app/lib/products.api";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/app/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { ProductViewModal } from "./product-view-modal";
import { EditProductModal } from "./edit-product-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";

export function ProductsTable() {
  const [products, setProducts] = useState<any[]>([]);
  const [viewProduct, setViewProduct] = useState<any | null>(null);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((p) => p.filter((x) => x.id !== deleteTarget.id));
      toast.success("🗑️ Product deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleProductUpdated = (updated: any) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
  };

  return (
    <>
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
          <p className="text-sm">Loading products…</p>
        </div>
      ) : (
      <>
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Discount</th>
              <th className="p-4 text-left">Rating</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Catalog</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => {
              const image =
                (Array.isArray(p.thumbnail_images) && p.thumbnail_images[0]) ||
                p.thumbnail_image ||
                p.main_image ||
                null;

              return (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  {/* PRODUCT */}
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {image ? (
                        <img
                          src={image}
                          alt={p.title}
                          className="h-12 w-12 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}

                      <div>
                        <div className="font-semibold text-gray-900">
                          {p.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {p.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="p-4 font-medium">
                    ₹{p.price}
                  </td>

                  {/* DISCOUNT */}
                  <td className="p-4">
                    {p.old_price ? (
                      <span className="text-green-600 font-medium">
                        ₹{p.old_price}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* RATING */}
                  <td className="p-4">
                    {p.rating ? `⭐ ${p.rating}` : "—"}
                  </td>

                  {/* STOCK */}
                  <td className="p-4">
                    <span
                      className={`text-sm font-medium ${
                        p.in_stock
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {p.in_stock ? "In Stock" : "Out"}
                    </span>
                  </td>

                  {/* CATALOG */}
                  <td className="p-4">
                    {p.catalog_pdf ? (
                      <a
                        href={p.catalog_pdf}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-cyan-600 hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        PDF
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No PDF
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setViewProduct(p)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setEditProduct(p)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteTarget(p)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No products found
          </div>
        )}
      </div>

      {/* MOBILE & TABLET CARDS */}
      <div className="lg:hidden bg-white rounded-xl shadow-sm p-4 space-y-4">
        {products.map((p) => {
          const image =
            (Array.isArray(p.thumbnail_images) && p.thumbnail_images[0]) ||
            p.thumbnail_image ||
            p.main_image ||
            null;

          return (
            <div
              key={p.id}
              className="rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  {image ? (
                    <img
                      src={image}
                      alt={p.title}
                      className="h-12 w-12 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-500">ID: {p.id}</p>
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setViewProduct(p)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setEditProduct(p)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => setDeleteTarget(p)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Details */}
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium">₹{p.price}</p>
                </div>

                <div>
                  <p className="text-gray-500">Old Price</p>
                  {p.old_price ? (
                    <p className="font-medium text-green-600">
                      ₹{p.old_price}
                    </p>
                  ) : (
                    <p className="text-gray-400">—</p>
                  )}
                </div>

                <div>
                  <p className="text-gray-500">Rating</p>
                  <p>{p.rating ? `⭐ ${p.rating}` : "—"}</p>
                </div>

                <div>
                  <p className="text-gray-500">Stock</p>
                  <span
                    className={`font-medium ${
                      p.in_stock ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {p.in_stock ? "In Stock" : "Out"}
                  </span>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-500">Catalog</p>
                  {p.catalog_pdf ? (
                    <a
                      href={p.catalog_pdf}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-cyan-600 hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      PDF
                    </a>
                  ) : (
                    <p className="text-xs text-gray-400">No PDF</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No products found
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewProduct && (
        <ProductViewModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}

      {/* EDIT MODAL */}
      <EditProductModal
        product={editProduct}
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        onUpdated={handleProductUpdated}
      />

      {/* DELETE CONFIRMATION */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        productName={deleteTarget?.title || ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
      </>
      )}
    </>
  );
}
