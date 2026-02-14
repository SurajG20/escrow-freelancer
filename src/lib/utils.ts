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
