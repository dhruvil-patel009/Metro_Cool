"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  title = "Delete Confirmation",
  itemName,
  description,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            {description || (
              <>
                Are you sure you want to delete
                {itemName && (
                  <>
                    {" "}
                    <span className="font-semibold text-gray-700">
                      &quot;{itemName}&quot;
                    </span>
                  </>
                )}
                ? This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 sm:gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
