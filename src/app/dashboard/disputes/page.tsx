"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Gavel, FileText } from "lucide-react";

// Mock Data
const disputes = [
    { id: 1, pId: "PROJ-104", title: "Marketing Website Redesign", reason: "Missed Deadline & Poor Quality", amount: "1.2 ETH", status: "Voting", timeLeft: "12h" },
    { id: 2, pId: "PROJ-108", title: "Mobile App MVP", reason: "Scope Creep Disagreement", amount: "5.0 ETH", status: "Resolved", outcome: "Refunded to Client" },
];

export default function DisputesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-light tracking-tight">Dispute Resolution</h1>
                <p className="text-muted-foreground">Fair, decentralized arbitration for conflicted milestones.</p>
            </div>

            <div className="grid gap-6">
                {disputes.map((dispute) => (
                    <Card key={dispute.id} className="glass-card hover:border-accent/30 transition-all">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline">{dispute.pId}</Badge>
                                            {dispute.status === "Voting" ? (
                                                <Badge variant="destructive" className="animate-pulse">Voting Open</Badge>
                                            ) : (
                                                <Badge variant="secondary">Resolved</Badge>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-semibold">{dispute.title}</h3>
                                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                            Reason: {dispute.reason}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono text-lg font-medium">{dispute.amount}</div>
                                        <div className="text-sm text-muted-foreground">Locked</div>
                                    </div>
                                </div>

                                <div className="bg-muted/30 p-4 rounded-lg text-sm border border-glass-border">
                                    <h4 className="font-medium mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Evidence & Context</h4>
                                    <p className="text-muted-foreground">
                                        Client claims the final delivery was 2 weeks late and did not match the Figma designs provided in Milestone 1.
                                        Freelancer argues that client changed requirements mid-sprint.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full md:w-64 flex flex-col justify-center border-l border-glass-border pl-0 md:pl-6 space-y-3">
                                {dispute.status === "Voting" ? (
                                    <>
                                        <div className="text-center mb-2">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Time Remaining</div>
                                            <div className="font-mono text-xl font-bold text-accent">{dispute.timeLeft}</div>
                                        </div>
                                        <Button className="w-full gap-2">
                                            <Gavel className="h-4 w-4" /> Vote Now
                                        </Button>
                                        <Button variant="ghost" className="w-full">View Details</Button>
                                    </>
                                ) : (
                                    <div className="text-center py-4 bg-muted/20 rounded-lg">
                                        <div className="text-sm font-medium">Outcome</div>
                                        <div className="text-muted-foreground">{dispute.outcome}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
