"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface Props {
  isOpen: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  productName,
  onConfirm,
  onCancel,
  loading,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl">
        {/* ICON */}
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
        </div>

        {/* TEXT */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Delete Product?
          </h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-700">"{productName}"</span>?
            This action cannot be undone.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
