"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDispute, useUpdateDispute } from "@/lib/hooks/useDisputes";
import {
  useProjectWithMilestones,
  useUpdateProject,
} from "@/lib/hooks/useProjects";
import { useSetAllMilestonesReleasedForProject } from "@/lib/hooks/useMilestones";
import { useUsersByWallets, displayNameForUser } from "@/lib/hooks/useUser";
import { useWalletClient } from "wagmi";
import { toast } from "sonner";
import { format } from "date-fns";
import { resolveDisputeAllOnChain } from "@/lib/contracts/escrow";

const PLATFORM_OWNER_WALLET = process.env.NEXT_PUBLIC_PLATFORM_OWNER_WALLET;

export default function DisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const [disputeId, setDisputeId] = useState<string | null>(null);
  const [releaseToFreelancer, setReleaseToFreelancer] = useState(true);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const p = await Promise.resolve(params);
      setDisputeId(p.id);
    };
    load();
  }, [params]);

  const { address } = useAuth();
  const { data: walletClient } = useWalletClient();
  const { data: dispute, isLoading: disputeLoading } = useDispute(disputeId ?? "");
  const { data: project, refetch: refetchProject } = useProjectWithMilestones(
    dispute?.project_id ?? ""
  );
  const updateDisputeMutation = useUpdateDispute();
  const updateProjectMutation = useUpdateProject();
  const setAllMilestonesReleasedMutation = useSetAllMilestonesReleasedForProject();

  const isPlatformOwner = !!(
    address &&
    PLATFORM_OWNER_WALLET &&
    address.toLowerCase() === PLATFORM_OWNER_WALLET.toLowerCase()
  );

  const canView =
    dispute &&
    project &&
    (isPlatformOwner ||
      project.client_wallet.toLowerCase() === address?.toLowerCase() ||
      project.freelancer_wallet?.toLowerCase() === address?.toLowerCase());

  const handleResolve = async () => {
    if (
      !dispute ||
      !project?.onchain_address ||
      project.onchain_address === "Pending" ||
      !walletClient ||
      !isPlatformOwner
    )
      return;

    setResolving(true);
    try {
      toast.loading("Resolving dispute on-chain (all remaining funds)...", {
        id: "resolve",
      });
      await resolveDisputeAllOnChain(
        project.onchain_address,
        releaseToFreelancer,
        walletClient
      );
      await setAllMilestonesReleasedMutation.mutateAsync(project.id);
      await updateDisputeMutation.mutateAsync({
        id: dispute.id,
        updates: {
          status: "resolved",
          resolution: {
            decision: releaseToFreelancer
              ? "Released to freelancer"
              : "Refunded to client",
            release_to_freelancer: releaseToFreelancer,
            resolved_at: new Date().toISOString(),
            resolved_by: address!.toLowerCase(),
          },
        },
      });
      await updateProjectMutation.mutateAsync({
        id: project.id,
        updates: { status: "completed" },
      });
      toast.success("Dispute resolved", {
        id: "resolve",
        description: releaseToFreelancer
          ? "All remaining funds released to freelancer"
          : "All remaining funds refunded to client",
      });
      refetchProject();
    } catch (error) {
      toast.error("Failed to resolve dispute", {
        id: "resolve",
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setResolving(false);
    }
  };

  const openedByWallets = dispute ? [dispute.opened_by] : [];
  const { data: usersByWallet = new Map() } = useUsersByWallets(openedByWallets);

  if (disputeId && (disputeLoading || !dispute)) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/disputes"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Disputes
        </Link>
        <p className="text-muted-foreground pt-2">Dispute not found.</p>
      </div>
    );
  }

  if (!canView && project) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/disputes"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Disputes
        </Link>
        <p className="text-muted-foreground pt-2">You do not have access to this dispute.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/disputes"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Disputes
      </Link>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Dispute {dispute.id.slice(0, 8)}…
          </h1>
          <Badge variant={dispute.status === "resolved" ? "success" : "destructive"}>
            {dispute.status === "resolved" ? "Resolved" : "Open"}
          </Badge>
        </div>
        {dispute.reason && (
          <div className="rounded-lg border border-slate-200 bg-muted/40 p-4 text-sm mb-4">
            <p className="font-medium text-foreground mb-1">Reason</p>
            <p className="text-muted-foreground">{dispute.reason}</p>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Opened {format(new Date(dispute.created_at), "MMM d, yyyy HH:mm")} by{" "}
          {address?.toLowerCase() === dispute.opened_by.toLowerCase()
            ? "you"
            : displayNameForUser(
                usersByWallet.get(dispute.opened_by.toLowerCase()),
                dispute.opened_by
              )}
        </p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {project && (
          <Card className="rounded-xl border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <p className="font-medium text-foreground">{project.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="outline">{project.status}</Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  Contract: {project.onchain_address?.slice(0, 10)}…
                </span>
              </div>
              <Link href={`/dashboard/projects/${project.id}`}>
                <Button variant="ghost" size="sm" className="mt-3 -ml-1">
                  View Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {project?.milestones && project.milestones.length > 0 && (
          <Card className="rounded-xl border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Milestones</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="divide-y divide-slate-100">
                {project.milestones.map((m) => (
                  <li
                    key={m.id}
                    className="flex justify-between items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{m.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {m.amount} {m.currency} · {m.offchain_state}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">Index {m.index}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {dispute.resolution && (
          <Card className="rounded-xl border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" /> Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <p className="text-muted-foreground">
                {dispute.resolution.decision ??
                  (dispute.resolution.release_to_freelancer
                    ? "Released to freelancer"
                    : "Refunded to client")}
              </p>
              {dispute.resolution.resolved_at && (
                <p className="text-xs text-muted-foreground">
                  Resolved {format(new Date(dispute.resolution.resolved_at), "MMM d, yyyy")}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {isPlatformOwner &&
          dispute.status === "open" &&
          project?.onchain_address &&
          project.onchain_address !== "Pending" &&
          walletClient && (
            <Card className="rounded-xl border-amber-200 bg-amber-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Resolve (Owner)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                <p className="text-sm text-muted-foreground">
                  All remaining milestone funds will go to the chosen party.
                </p>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Resolution</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="release"
                        checked={releaseToFreelancer === true}
                        onChange={() => setReleaseToFreelancer(true)}
                        className="text-accent"
                      />
                      Release to freelancer
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="release"
                        checked={releaseToFreelancer === false}
                        onChange={() => setReleaseToFreelancer(false)}
                        className="text-accent"
                      />
                      Refund to client
                    </label>
                  </div>
                </div>
                <Button
                  onClick={handleResolve}
                  disabled={resolving}
                  className="gap-2 bg-accent hover:bg-accent-hover text-white"
                >
                  {resolving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Resolving…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Resolve on-chain
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
