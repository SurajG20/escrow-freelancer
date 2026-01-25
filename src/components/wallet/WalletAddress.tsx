"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
type WalletAddressProps = {
  address: string;
  className?: string;
};

export function WalletAddress({ address, className }: WalletAddressProps) {
  const [copied, setCopied] = useState(false);

  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 font-mono text-xs",
        className
      )}
    >
      <span>{truncated}</span>
      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-slate-100 transition-colors"
        aria-label="Copy wallet address"
      >
        {copied ? (
          <Check className="h-3 w-3 text-emerald-600" />
        ) : (
          <Copy className="h-3 w-3 text-slate-400 hover:text-slate-700" />
        )}
      </button>
    </div>
  );
}
