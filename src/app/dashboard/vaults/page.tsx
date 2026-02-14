"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getProjectStatusBadgeVariant, formatProjectStatus } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  ArrowUpRight,
  Lock,
  History,
  Wallet,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProjects } from "@/lib/hooks/useProjects";
import { useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getProjectWithMilestones } from "@/lib/api/projects";

export default function VaultsPage() {
  const { address } = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useProjects(
    address ? { wallet_address: address.toLowerCase() } : undefined,
  );

  const activeProjects = projects.filter(
    (p) => p.status === "active" || p.status === "in_dispute",
  );
  const completedProjects = projects.filter((p) => p.status === "completed");

  const projectsWithMilestones = useQuery({
    queryKey: ["vaults-projects", activeProjects.map((p) => p.id)],
    queryFn: async () => {
      const results = await Promise.all(
        activeProjects.map((p) => getProjectWithMilestones(p.id)),
      );
      return results.filter(Boolean) as Array<
        NonNullable<Awaited<ReturnType<typeof getProjectWithMilestones>>>
      >;
    },
    enabled: activeProjects.length > 0,
  });

  const completedWithMilestones = useQuery({
    queryKey: ["vaults-completed", completedProjects.map((p) => p.id)],
    queryFn: async () => {
      const results = await Promise.all(
        completedProjects.map((p) => getProjectWithMilestones(p.id)),
      );
      return results.filter(Boolean) as Array<
        NonNullable<Awaited<ReturnType<typeof getProjectWithMilestones>>>
      >;
    },
    enabled: completedProjects.length > 0,
  });

  const historyItems = useMemo(() => {
    const data = completedWithMilestones.data || [];
    const items: Array<{
      projectId: string;
      projectTitle: string;
      completedAt: string;
      releasedNative: number;
      releasedUSDT: number;
      releasedCount: number;
    }> = [];
    data.forEach((project) => {
      const milestones = project.milestones || [];
      let releasedNative = 0;
      let releasedUSDT = 0;
      let releasedCount = 0;
      let latestReleased = project.updated_at;
      milestones.forEach((m) => {
        if (m.offchain_state === "released") {
          releasedCount += 1;
          const amount = parseFloat(m.amount || "0");
          if (m.currency === "NATIVE") releasedNative += amount;
          else if (m.currency === "USDT") releasedUSDT += amount;
          if (m.updated_at > latestReleased) latestReleased = m.updated_at;
        }
      });
      if (releasedCount > 0) {
        items.push({
          projectId: project.id,
          projectTitle: project.title,
          completedAt: latestReleased,
          releasedNative,
          releasedUSDT,
          releasedCount,
        });
      }
    });
    items.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
    return items;
  }, [completedWithMilestones.data]);

  const formatCurrencyDisplay = (native: number, usdt: number) => {
    if (native > 0 && usdt > 0) {
      return `${native.toFixed(3)} NATIVE + ${usdt.toFixed(2)} USDT`;
    }
    if (native > 0) return `$${native.toFixed(2)}`;
    if (usdt > 0) return `$${usdt.toFixed(2)}`;
    return "$0.00";
  };

  const stats = useMemo(() => {
    const projectsData = projectsWithMilestones.data || [];

    let totalLockedNative = 0;
    let totalLockedUSDT = 0;
    let pendingReleaseNative = 0;
    let pendingReleaseUSDT = 0;
    let releasedNative = 0;
    let releasedUSDT = 0;

    projectsData.forEach((project) => {
      const milestones = project.milestones || [];
      milestones.forEach((milestone) => {
        const amount = parseFloat(milestone.amount || "0");

        if (milestone.currency === "NATIVE") {
          totalLockedNative += amount;
          if (
            milestone.offchain_state === "approved" ||
            milestone.offchain_state === "submitted"
          ) {
            pendingReleaseNative += amount;
          } else if (milestone.offchain_state === "released") {
            releasedNative += amount;
          }
        } else if (milestone.currency === "USDT") {
          totalLockedUSDT += amount;
          if (
            milestone.offchain_state === "approved" ||
            milestone.offchain_state === "submitted"
          ) {
            pendingReleaseUSDT += amount;
          } else if (milestone.offchain_state === "released") {
            releasedUSDT += amount;
          }
        }
      });
    });

    const formatCurrency = (native: number, usdt: number) => {
      if (native > 0 && usdt > 0) {
        return `${native.toFixed(3)} NATIVE + ${usdt.toFixed(2)} USDT`;
      } else if (native > 0) {
        return `$${native.toFixed(2)}`;
      } else if (usdt > 0) {
        return `$${usdt.toFixed(2)}`;
      }
      return "$0.00";
    };

    return {
      totalLocked: formatCurrency(totalLockedNative, totalLockedUSDT),
      pendingRelease: formatCurrency(pendingReleaseNative, pendingReleaseUSDT),
      availableToWithdraw: formatCurrency(
        Math.max(0, totalLockedNative - releasedNative - pendingReleaseNative),
        Math.max(0, totalLockedUSDT - releasedUSDT - pendingReleaseUSDT),
      ),
      activeProjectsCount: activeProjects.length,
    };
  }, [activeProjects, projectsWithMilestones.data]);

  if (projectsLoading || projectsWithMilestones.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-light tracking-tight">Escrow Vaults</h1>
          <p className="text-muted-foreground">
            Manage your locked funds and view transaction history.
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-light tracking-tight">Escrow Vaults</h1>
        <p className="text-muted-foreground">
          Manage your locked funds and view transaction history.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className=" bg-gradient-to-br from-accent/10 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value Locked
            </CardTitle>
            <Lock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLocked}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {stats.activeProjectsCount} active projects
            </p>
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Release
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRelease}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting approval or release
            </p>
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available to Withdraw
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.availableToWithdraw}
            </div>
            {!address && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 h-6 px-2 -ml-2 text-accent"
              >
                Connect Wallet to view
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> Active vaults
          </CardTitle>
          <CardDescription>Projects with locked escrow funds.</CardDescription>
        </CardHeader>
        <CardContent>
          {activeProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active projects found.
            </div>
          ) : (
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white/40 hover:bg-white/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(project.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getProjectStatusBadgeVariant(project.status)}
                      className="text-xs"
                    >
                      {formatProjectStatus(project.status)}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" /> Vault history
          </CardTitle>
          <CardDescription>
            Completed projects and released funds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No completed projects yet.
            </div>
          ) : completedWithMilestones.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No released milestones in completed projects.
            </div>
          ) : (
            <div className="space-y-4">
              {historyItems.map((item) => (
                <Link
                  key={item.projectId}
                  href={`/dashboard/projects/${item.projectId}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white/40 hover:bg-white/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{item.projectTitle}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(item.completedAt), "MMM d, yyyy")} ·{" "}
                        {item.releasedCount} milestone
                        {item.releasedCount !== 1 ? "s" : ""} released
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className="font-medium text-emerald-600">
                      {formatCurrencyDisplay(item.releasedNative, item.releasedUSDT)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
