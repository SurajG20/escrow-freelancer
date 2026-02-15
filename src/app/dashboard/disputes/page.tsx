"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FileText, Loader2, ExternalLink, Shield, User } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDisputes } from "@/lib/hooks/useDisputes";
import { useProjects } from "@/lib/hooks/useProjects";
import { useUsersByWallets, displayNameForUser } from "@/lib/hooks/useUser";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PLATFORM_OWNER_WALLET = process.env.NEXT_PUBLIC_PLATFORM_OWNER_WALLET;

type FilterStatus = "all" | "open" | "resolved";

export default function DisputesPage() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const { address } = useAuth();
  const isPlatformOwner = !!(
    address &&
    PLATFORM_OWNER_WALLET &&
    address.toLowerCase() === PLATFORM_OWNER_WALLET.toLowerCase()
  );
  const { data: projects = [] } = useProjects(
    isPlatformOwner ? undefined : address ? { wallet_address: address.toLowerCase() } : undefined,
  );
  const { data: disputes = [], isLoading } = useDisputes();

  const openedByWallets = useMemo(
    () => [...new Set(disputes.map((d) => d.opened_by).filter(Boolean))],
    [disputes],
  );
  const { data: usersByWallet = new Map() } = useUsersByWallets(openedByWallets);

  const disputesWithProjects = useMemo(() => {
    const filtered = isPlatformOwner
      ? disputes
      : disputes.filter((dispute) => {
          const project = projects.find((p) => p.id === dispute.project_id);
          return (
            project &&
            (project.client_wallet.toLowerCase() === address?.toLowerCase() ||
              project.freelancer_wallet?.toLowerCase() === address?.toLowerCase())
          );
        });
    const byId = new Map(filtered.map((d) => [d.id, d]));
    return Array.from(byId.values()).map((dispute) => {
      const project = projects.find((p) => p.id === dispute.project_id);
      return { ...dispute, project };
    });
  }, [disputes, projects, isPlatformOwner, address]);

  const { openCount, resolvedCount } = useMemo(() => {
    const open = disputesWithProjects.filter((d) => d.status === "open").length;
    const resolved = disputesWithProjects.filter((d) => d.status === "resolved").length;
    return { openCount: open, resolvedCount: resolved };
  }, [disputesWithProjects]);

  const filteredDisputes = useMemo(() => {
    if (filter === "open") return disputesWithProjects.filter((d) => d.status === "open");
    if (filter === "resolved") return disputesWithProjects.filter((d) => d.status === "resolved");
    return disputesWithProjects;
  }, [disputesWithProjects, filter]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-light tracking-tight">
            Dispute Resolution
          </h1>
          <p className="text-muted-foreground">
            Fair, decentralized arbitration for conflicted milestones.
          </p>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Dispute Resolution
          </h1>
          <p className="text-muted-foreground mt-2">
            Fair, decentralized arbitration for conflicted milestones.
          </p>
        </div>
        {disputesWithProjects.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-red-600 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              {openCount} Open
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-emerald-600 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {resolvedCount} Resolved
            </span>
          </div>
        )}
      </div>

      {disputesWithProjects.length === 0 ? (
        <Card className="bg-background border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-16 sm:py-20 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted/50 mb-6">
              <Shield className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">No disputes</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              You don&apos;t have any active disputes. When a client or freelancer raises a dispute, it will appear here.
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex gap-1 p-1.5 rounded-lg bg-muted/30 border border-slate-200/50 w-fit">
            {(["all", "open", "resolved"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filter === tab
                    ? "bg-background text-foreground shadow-sm border border-slate-200"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab === "all" ? "All" : tab === "open" ? "Open" : "Resolved"}
              </button>
            ))}
          </div>

          <div className="space-y-5 max-w-4xl">
            {filteredDisputes.length === 0 ? (
              <Card className="bg-background border-slate-200 rounded-xl p-10 text-center">
                <p className="text-muted-foreground text-sm">
                  No {filter} disputes.
                </p>
              </Card>
            ) : (
              filteredDisputes.map((dispute) => (
                <Card
                  key={dispute.id}
                  className="bg-background border-slate-200 rounded-xl hover:border-accent/40 hover:shadow-sm transition-all overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-1 min-w-0 px-5 py-5 sm:px-6 sm:py-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {dispute.status === "resolved" ? (
                          <Badge variant="success" className="font-medium">
                            Resolved
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="font-medium">
                            Open
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(dispute.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground truncate mb-2">
                        {dispute.project?.title || "Unknown Project"}
                      </h3>
                      {dispute.reason && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {dispute.reason}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="h-4 w-4 shrink-0 text-accent" />
                        Opened by{" "}
                        {address?.toLowerCase() === dispute.opened_by.toLowerCase()
                          ? "you"
                          : displayNameForUser(
                              usersByWallet.get(dispute.opened_by.toLowerCase()),
                              dispute.opened_by,
                            )}
                      </p>
                      {dispute.resolution && (
                        <div className="mt-5 rounded-lg border border-slate-200 bg-muted/40 p-4 text-sm">
                          <h4 className="font-medium text-foreground mb-1.5 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                            <FileText className="h-3.5 w-3.5 text-accent" /> Resolution
                          </h4>
                          <p className="text-muted-foreground">
                            {dispute.resolution.decision ??
                              (dispute.resolution.release_to_freelancer != null
                                ? dispute.resolution.release_to_freelancer
                                  ? "Released to freelancer"
                                  : "Refunded to client"
                                : "Resolved")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="sm:w-48 shrink-0 flex flex-row sm:flex-col gap-3 justify-end sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-200 px-5 py-5 sm:px-6 sm:py-6 bg-muted/20 sm:gap-4">
                      <Link href={`/dashboard/disputes/${dispute.id}`} className="flex-1 sm:flex-none min-w-0">
                        <Button
                          variant="default"
                          className="w-full gap-2 bg-accent hover:bg-accent-hover text-white border-0 shadow-sm"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4" /> View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/projects/${dispute.project_id}`} className="flex-1 sm:flex-none min-w-0">
                        <Button
                          variant="outline"
                          className="w-full border-slate-200 text-foreground hover:bg-muted"
                          size="sm"
                        >
                          View Project
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
