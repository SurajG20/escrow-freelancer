"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { getProjectStatusBadgeVariant, formatProjectStatus } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { LayoutGrid, List, Plus, Search, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useProjects } from "@/lib/hooks/useProjects";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUsersByWallets, displayNameForUser } from "@/lib/hooks/useUser";
import { format } from "date-fns";

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const view = searchParams.get("view") === "board" ? "board" : "list";
  const setView = (v: "list" | "board") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", v);
    router.replace(pathname + "?" + params.toString());
  };
  const [searchQuery, setSearchQuery] = useState("");
  const { address } = useAuth();
  const { data: projects = [], isLoading } = useProjects(
    address ? { wallet_address: address.toLowerCase() } : undefined,
  );
  const participantWallets = useMemo(
    () =>
      [...new Set(projects.flatMap((p) => [p.client_wallet, p.freelancer_wallet].filter(Boolean) as string[]))],
    [projects],
  );
  const { data: usersByWallet = new Map() } = useUsersByWallets(participantWallets);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight">Projects</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your active contracts and bids.
          </p>
        </div>
        <Link href="/dashboard/projects/new" className="w-full sm:w-auto">
          <Button className="gap-2 shadow-lg shadow-accent/20 w-full sm:w-auto">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white/30 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
          <div className="relative flex-1 sm:flex-none sm:w-64 min-w-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Search projects..."
              className="pl-9 bg-white/50 border-transparent shadow-none w-full min-w-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-white/50 shrink-0"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex bg-muted/20 p-1 rounded-lg border border-slate-200/50 w-full sm:w-auto justify-center sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3 flex-1 sm:flex-none",
              view === "list"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground",
            )}
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4 mr-2" /> List
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3 flex-1 sm:flex-none",
              view === "board"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground",
            )}
            onClick={() => setView("board")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" /> Board
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "list" ? (
        <>
          <div className="md:hidden space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : projects.filter(
                (p) =>
                  !searchQuery ||
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (p.description?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()),
              ).length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white/50 p-6 text-center text-muted-foreground text-sm">
                No projects found.{" "}
                <Link href="/dashboard/projects/new" className="text-accent hover:underline">
                  Create your first project
                </Link>
              </div>
            ) : (
              projects
                .filter(
                  (p) =>
                    !searchQuery ||
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (p.description?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()),
                )
                .map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}?fromView=${view}`}
                    className="block"
                  >
                    <Card className="p-4 hover:border-accent/50 transition-all">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-semibold text-foreground truncate flex-1 min-w-0">
                          {project.title}
                        </h3>
                        <Badge variant={getProjectStatusBadgeVariant(project.status)} className="text-xs shrink-0">
                          {formatProjectStatus(project.status)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {project.freelancer_wallet
                          ? address?.toLowerCase() === project.freelancer_wallet.toLowerCase()
                            ? "You"
                            : displayNameForUser(
                                usersByWallet.get(project.freelancer_wallet.toLowerCase()),
                                project.freelancer_wallet,
                              )
                          : "Not assigned"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-mono">{project.onchain_address ? "Deployed" : "Draft"}</span>
                        <span>{format(new Date(project.created_at), "MMM d, yyyy")}</span>
                      </div>
                    </Card>
                  </Link>
                ))
            )}
          </div>
          <div className="hidden md:block rounded-xl border border-slate-200 bg-white/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[600px]">
                <thead className="bg-muted/30 text-muted-foreground font-medium">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 font-normal">Project Name</th>
                    <th className="px-4 lg:px-6 py-3 font-normal">Client</th>
                    <th className="px-4 lg:px-6 py-3 font-normal">Locked Value</th>
                    <th className="px-4 lg:px-6 py-3 font-normal">Status</th>
                    <th className="px-4 lg:px-6 py-3 font-normal text-right">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading projects...
                        </div>
                      </td>
                    </tr>
                  ) : projects.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-muted-foreground"
                      >
                        No projects found.{" "}
                        <Link
                          href="/dashboard/projects/new"
                          className="text-accent hover:underline"
                        >
                          Create your first project
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    projects
                      .filter(
                        (project) =>
                          !searchQuery ||
                          project.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          (project.description?.toLowerCase() ?? "").includes(
                            searchQuery.toLowerCase(),
                          ),
                      )
                      .map((project) => (
                        <tr
                          key={project.id}
                          className="hover:bg-white/40 transition-colors group cursor-pointer"
                          onClick={() =>
                            (window.location.href = `/dashboard/projects/${project.id}?fromView=${view}`)
                          }
                        >
                          <td className="px-4 lg:px-6 py-3 font-medium text-foreground">
                            {project.title}
                          </td>
                          <td className="px-4 lg:px-6 py-3 text-muted-foreground text-sm">
                            {project.freelancer_wallet
                              ? address?.toLowerCase() === project.freelancer_wallet.toLowerCase()
                                ? "You"
                                : displayNameForUser(
                                    usersByWallet.get(project.freelancer_wallet.toLowerCase()),
                                    project.freelancer_wallet,
                                  )
                              : "Not assigned"}
                          </td>
                          <td className="px-4 lg:px-6 py-3 font-mono text-sm">
                            {project.onchain_address ? "Deployed" : "Draft"}
                          </td>
                          <td className="px-4 lg:px-6 py-3">
                            <Badge
                              variant={getProjectStatusBadgeVariant(project.status)}
                            >
                              {formatProjectStatus(project.status)}
                            </Badge>
                          </td>
                          <td className="px-4 lg:px-6 py-3 text-right text-muted-foreground text-sm">
                            {format(new Date(project.created_at), "MMM d, yyyy")}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-3 flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading projects...
              </div>
            </div>
          ) : (
            [
              "draft",
              "pending_approval",
              "approved",
              "active",
              "in_dispute",
              "completed",
              "cancelled",
            ].map((col) => {
              const filteredProjects = projects.filter(
                (project) =>
                  !searchQuery ||
                  project.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  (project.description?.toLowerCase() ?? "").includes(
                    searchQuery.toLowerCase(),
                  ),
              );
              const colProjects = filteredProjects.filter(
                (p) => p.status === col,
              );
              return (
                <div key={col} className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="font-medium text-sm text-muted-foreground capitalize">
                      {col.replace("_", " ")}
                    </h3>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {colProjects.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {colProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/dashboard/projects/${project.id}?fromView=${view}`}
                      >
                        <Card className=" hover:border-accent/50 cursor-pointer transition-all p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5"
                            >
                              {project.freelancer_wallet
                                ? address?.toLowerCase() === project.freelancer_wallet.toLowerCase()
                                  ? "You"
                                  : displayNameForUser(
                                      usersByWallet.get(project.freelancer_wallet.toLowerCase()),
                                      project.freelancer_wallet,
                                    )
                                : "Unassigned"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(project.created_at), "MMM d")}
                            </span>
                          </div>
                          <h4 className="font-semibold mb-2">
                            {project.title}
                          </h4>
                          <div className="flex items-center justify-between mt-4">
                            <div className="font-mono text-xs text-muted-foreground">
                              {project.onchain_address ? "Deployed" : "Draft"}
                            </div>
                            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400" />
                          </div>
                        </Card>
                      </Link>
                    ))}
                    {colProjects.length === 0 && (
                      <div className="h-24 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-muted-foreground">
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
