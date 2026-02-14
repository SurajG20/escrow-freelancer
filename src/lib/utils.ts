import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ProjectStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatProjectStatus(status: string): string {
  return status.replace(/_/g, " ").toUpperCase();
}

export function getProjectStatusBadgeVariant(
  status: ProjectStatus | string
): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" {
  switch (status) {
    case "completed":
    case "active":
      return "success";
    case "approved":
      return "info";
    case "draft":
    case "pending_approval":
      return "warning";
    case "in_dispute":
      return "destructive";
    case "cancelled":
      return "secondary";
    default:
      return "secondary";
  }
}

export function formatTimeAgo(ms: number): string {
  const sec = Math.floor((Date.now() - ms) / 1000);
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return d === 1 ? "1d ago" : `${d}d ago`;
}
