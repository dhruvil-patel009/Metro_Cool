"use client";

import { useState } from "react";
import { updateProduct, Product } from "@/app/lib/products.api";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import { toast } from "react-toastify";

export function EditProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] =
    useState(product.description || "");
  const [inStock, setInStock] = useState(product.in_stock);

  const handleUpdate = async () => {
    try {
      await updateProduct(product.id, {
        title,
        price: Number(price),
        description,
        in_stock: inStock,
      });

      toast.success("✅ Product updated");
      onClose();
    } catch {
      toast.error("❌ Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Edit Product
        </h2>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          className="mt-3"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Textarea
          className="mt-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-between items-center mt-4">
          <span>In Stock</span>
          <Switch
            checked={inStock}
            onCheckedChange={setInStock}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </div>
      </div>
    </div>
  );
}
