"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Gavel, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDisputes } from "@/lib/hooks/useDisputes";
import { useProjects } from "@/lib/hooks/useProjects";
import { format } from "date-fns";
import Link from "next/link";

export default function DisputesPage() {
  const { address } = useAuth();
  const { data: projects = [] } = useProjects(
    address ? { wallet_address: address.toLowerCase() } : undefined,
  );
  const { data: disputes = [], isLoading } = useDisputes();

  const disputesWithProjects = disputes
    .filter((dispute) => {
      const project = projects.find((p) => p.id === dispute.project_id);
      return (
        project &&
        (project.client_wallet.toLowerCase() === address?.toLowerCase() ||
          project.freelancer_wallet?.toLowerCase() === address?.toLowerCase())
      );
    })
    .map((dispute) => {
      const project = projects.find((p) => p.id === dispute.project_id);
      return { ...dispute, project };
    });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-light tracking-tight">
            Dispute Resolution
          </h1>
          <p className="text-muted-foreground">
            Fair, decentralized arbitration for conflicted milestones.
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
        <h1 className="text-3xl font-light tracking-tight">
          Dispute Resolution
        </h1>
        <p className="text-muted-foreground">
          Fair, decentralized arbitration for conflicted milestones.
        </p>
      </div>

      {disputesWithProjects.length === 0 ? (
        <Card className="">
          <div className="p-12 text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">No disputes found</p>
            <p className="text-sm">
              You don&apos;t have any active disputes at the moment.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {disputesWithProjects.map((dispute) => (
            <Card
              key={dispute.id}
              className=" hover:border-accent/30 transition-all"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {dispute.project?.title || "Unknown Project"}
                        </Badge>
                        {dispute.status === "voting" ? (
                          <Badge
                            variant="destructive"
                            className="animate-pulse"
                          >
                            Voting Open
                          </Badge>
                        ) : dispute.status === "resolved" ? (
                          <Badge variant="secondary">Resolved</Badge>
                        ) : (
                          <Badge variant="warning">Open</Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold">
                        {dispute.project?.title || "Dispute"}
                      </h3>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Opened by: {dispute.opened_by.substring(0, 6)}...
                        {dispute.opened_by.substring(38)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Created
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(dispute.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>

                  {dispute.resolution && (
                    <div className="bg-muted/30 p-4 rounded-lg text-sm border border-slate-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Resolution
                      </h4>
                      <p className="text-muted-foreground">
                        {dispute.resolution.decision ||
                          "Resolution details available"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-64 flex flex-col justify-center border-l border-slate-200 pl-0 md:pl-6 space-y-3">
                  {dispute.status === "voting" ? (
                    <>
                      <div className="text-center mb-2">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">
                          Status
                        </div>
                        <div className="font-mono text-xl font-bold text-accent">
                          Voting
                        </div>
                      </div>
                      <Button className="w-full gap-2">
                        <Gavel className="h-4 w-4" /> Vote Now
                      </Button>
                      <Link href={`/dashboard/projects/${dispute.project_id}`}>
                        <Button variant="ghost" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </>
                  ) : dispute.status === "resolved" ? (
                    <div className="text-center py-4 bg-muted/20 rounded-lg">
                      <div className="text-sm font-medium">Outcome</div>
                      <div className="text-muted-foreground">
                        {dispute.resolution?.decision || "Resolved"}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-muted/20 rounded-lg">
                      <div className="text-sm font-medium">Status</div>
                      <div className="text-muted-foreground">Open</div>
                      <Link href={`/dashboard/projects/${dispute.project_id}`}>
                        <Button variant="ghost" className="w-full mt-2">
                          View Project
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
