"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Progress } from "@/components/ui/Progress";
import {
  Activity,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  FileText,
  Clock,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProjects } from "@/lib/hooks/useProjects";
import { useMemo } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { address } = useAuth();
  const { data: projects = [], isLoading } = useProjects(
    address ? { wallet_address: address.toLowerCase() } : undefined,
  );

  const stats = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status === "active").length;
    const inDisputeProjects = projects.filter(
      (p) => p.status === "in_dispute",
    ).length;
    const draftProjects = projects.filter((p) => p.status === "draft").length;
    const completedProjects = projects.filter(
      (p) => p.status === "completed",
    ).length;

    const totalProjects = projects.length;
    const pendingActions = inDisputeProjects + draftProjects;

    const totalValue = projects.reduce((sum, p) => {
      const milestones = p.milestones || [];
      return (
        sum +
        milestones.reduce((mSum, m) => mSum + parseFloat(m.amount || "0"), 0)
      );
    }, 0);

    return {
      totalLocked: totalValue > 0 ? `$${totalValue.toLocaleString()}` : "$0.00",
      activeProjects: totalProjects,
      pendingActions,
      completedProjects,
    };
  }, [projects]);

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);
  }, [projects]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-900 mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back, {address?.substring(0, 6)}...
          </p>
        </div>
        <Badge variant="outline" className="text-xs border-slate-200/50">
          Updated just now
        </Badge>
      </div>

      {/* Hero Metrics */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="border border-slate-200/50 rounded-xl shadow-sm p-8"
            >
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </Card>
          ))
        ) : (
          <>
            <Card className="border border-slate-200/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-8">
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-slate-500 font-semibold">
                    Total Locked
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-1">
                <div className="text-base font-semibold text-slate-900">
                  {stats.totalLocked}
                </div>
                <p className="text-xs text-slate-500">Across all projects</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-8">
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-slate-500 font-semibold">
                    Active Projects
                  </CardTitle>
                  <Activity className="h-4 w-4 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-1">
                <div className="text-base font-semibold text-slate-900">
                  {stats.activeProjects}
                </div>
                <p className="text-xs text-slate-500">
                  {projects.filter((p) => p.status === "active").length} active
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-8">
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-slate-500 font-semibold">
                    Pending Actions
                  </CardTitle>
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-1">
                <div className="text-base font-semibold text-slate-900">
                  {stats.pendingActions}
                </div>
                <p className="text-xs text-slate-500">Requires attention</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-8">
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-slate-500 font-semibold">
                    Completed
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-1">
                <div className="text-base font-semibold text-slate-900">
                  {stats.completedProjects}
                </div>
                <p className="text-xs text-slate-500">Total completed</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border border-slate-200/50 rounded-xl shadow-sm p-8">
            <CardHeader className="p-0 pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-900">
                  Recent Projects
                </CardTitle>
                <Link
                  href="/dashboard/projects"
                  className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  aria-label="View all projects"
                >
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))
              ) : recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors rounded-lg px-2 -mx-2"
                    aria-label={`View project ${project.title}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                          {project.title}
                        </h3>
                        <Badge
                          variant={
                            project.status === "active"
                              ? "success"
                              : project.status === "in_dispute"
                                ? "destructive"
                                : project.status === "draft"
                                  ? "warning"
                                  : "default"
                          }
                          className="text-xs"
                        >
                          {project.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {project.description || "No description"}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 ml-4 flex-shrink-0" />
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 mb-2">No projects yet</p>
                  <Link
                    href="/dashboard/projects/new"
                    className="text-sm text-slate-900 hover:underline"
                  >
                    Create your first project
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Chart Placeholder */}
          <Card className="border border-slate-200/50 rounded-xl shadow-sm p-8">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-base font-semibold text-slate-900">
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-64 flex items-center justify-center border border-slate-100 rounded-lg bg-slate-50/50">
                <div className="text-center">
                  <Activity className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Chart placeholder</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          <Card className="border border-slate-200/50 rounded-xl shadow-sm p-8">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-base font-semibold text-slate-900">
                Project Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Active</span>
                      <span className="font-semibold text-slate-900">
                        {projects.filter((p) => p.status === "active").length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (projects.filter((p) => p.status === "active").length /
                          Math.max(projects.length, 1)) *
                        100
                      }
                      className="h-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Draft</span>
                      <span className="font-semibold text-slate-900">
                        {projects.filter((p) => p.status === "draft").length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (projects.filter((p) => p.status === "draft").length /
                          Math.max(projects.length, 1)) *
                        100
                      }
                      className="h-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Completed</span>
                      <span className="font-semibold text-slate-900">
                        {
                          projects.filter((p) => p.status === "completed")
                            .length
                        }
                      </span>
                    </div>
                    <Progress
                      value={
                        (projects.filter((p) => p.status === "completed")
                          .length /
                          Math.max(projects.length, 1)) *
                        100
                      }
                      className="h-1"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border border-slate-200/50 rounded-xl shadow-sm p-8">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-base font-semibold text-slate-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <Link
                href="/dashboard/projects/new"
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200/50 hover:bg-slate-50/50 transition-colors group"
                aria-label="Create new project"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    New Project
                  </div>
                  <div className="text-xs text-slate-500">
                    Create escrow contract
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </Link>
              <Link
                href="/dashboard/disputes"
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200/50 hover:bg-slate-50/50 transition-colors group"
                aria-label="View disputes"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-slate-900" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    Disputes
                  </div>
                  <div className="text-xs text-slate-500">Manage conflicts</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
