"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface MilestoneRejectionModalProps {
  open: boolean;
  milestoneTitle: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  loading?: boolean;
}

export function MilestoneRejectionModal({
  open,
  milestoneTitle,
  onClose,
  onConfirm,
  loading = false,
}: MilestoneRejectionModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    await onConfirm(reason.trim());
    setReason("");
    onClose();
  };

  const handleClose = () => {
    if (!loading) {
      setReason("");
      onClose();
    }
  };

  if (!open) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Reject Milestone</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="p-1 rounded-lg text-muted-foreground hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Rejecting: <span className="font-medium text-foreground">{milestoneTitle}</span>
          </p>
          <div>
            <label
              htmlFor="milestone-rejection-reason"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Reason for rejection
            </label>
            <textarea
              id="milestone-rejection-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain what needs to be changed or improved..."
              className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-slate-200 bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              disabled={loading}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !reason.trim()}>
              {loading ? "Rejecting..." : "Reject Milestone"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
