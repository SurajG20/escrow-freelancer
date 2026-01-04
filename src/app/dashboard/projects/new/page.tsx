"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, CheckCircle2, ChevronRight, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewProjectPage() {
    const [step, setStep] = useState(1);
    const [milestones, setMilestones] = useState([{ id: 1, title: "", amount: "", deadline: "" }]);

    const addMilestone = () => {
        setMilestones([...milestones, { id: milestones.length + 1, title: "", amount: "", deadline: "" }]);
    };

    const removeMilestone = (id: number) => {
        if (milestones.length > 1) {
            setMilestones(milestones.filter(m => m.id !== id));
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */} // Added comment to restart highlighting
            <div className="flex items-center gap-4">
                <Link href="/dashboard/projects">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-light tracking-tight">Create New Escrow</h1>
                    <p className="text-sm text-muted-foreground">Secure your next engagement in 3 simple steps.</p>
                </div>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center justify-between px-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2 z-10">
                        <div className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300",
                            step >= s ? "bg-accent border-accent text-white" : "bg-background border-muted text-muted-foreground"
                        )}>
                            {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                        </div>
                        <span className={cn("text-xs font-medium", step >= s ? "text-foreground" : "text-muted-foreground")}>
                            {s === 1 ? "Basics" : s === 2 ? "Milestones" : "Review"}
                        </span>
                    </div>
                ))}
                {/* Progress Bar Background - simplistic version */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[138px] w-[60%] h-0.5 bg-muted -z-0 hidden md:block" />
            </div>

            {/* Step Content */}
            <Card className="glass-card min-h-[400px] flex flex-col">
                <div className="flex-1 p-2">
                    {step === 1 && (
                        <div className="space-y-4 max-w-lg mx-auto py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project Title</label>
                                <Input placeholder="e.g. Website Redesign for CryptoStartup" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Counterparty Wallet / Email</label>
                                <Input placeholder="0x... or email@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1 border-accent bg-accent/5">Client (Depositor)</Button>
                                    <Button variant="outline" className="flex-1">Freelancer</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            {milestones.map((ms, index) => (
                                <div key={ms.id} className="flex gap-4 items-end bg-white/40 p-3 rounded-lg border border-glass-border">
                                    <span className="pb-3 text-sm font-bold text-muted-foreground w-6">{index + 1}.</span>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs font-medium">Description</label>
                                        <Input placeholder="Deliverable name" value={ms.title} onChange={() => { }} />
                                    </div>
                                    <div className="w-24 space-y-1">
                                        <label className="text-xs font-medium">Amount</label>
                                        <Input placeholder="ETH" value={ms.amount} onChange={() => { }} />
                                    </div>
                                    <div className="w-32 space-y-1">
                                        <label className="text-xs font-medium">Deadline</label>
                                        <Input type="date" value={ms.deadline} onChange={() => { }} />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeMilestone(ms.id)} className="text-muted-foreground hover:text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addMilestone} className="w-full border-dashed border-muted-foreground/30 hover:border-accent hover:text-accent">
                                <Plus className="h-4 w-4 mr-2" /> Add Milestone
                            </Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 max-w-lg mx-auto py-4 text-center">
                            <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold">Ready to deploy?</h3>
                            <p className="text-muted-foreground">
                                You are about to create a smart contract escrow with <strong>{milestones.length} milestones</strong> totaling <strong>3.5 ETH</strong>.
                            </p>
                            <div className="bg-muted/30 p-4 rounded-lg text-sm text-left space-y-2 border border-glass-border">
                                <div className="flex justify-between">
                                    <span>Network Fee (Est.)</span>
                                    <span>0.002 ETH</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Platform Fee (0%)</span>
                                    <span>0 ETH</span>
                                </div>
                                <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold">
                                    <span>Total Deposit</span>
                                    <span>3.502 ETH</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-glass-border flex justify-between">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button onClick={() => setStep(step + 1)} className="gap-2">
                            Next Step <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button className="gap-2 shadow-lg shadow-accent/25">
                            Create & Deposit <Plus className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
