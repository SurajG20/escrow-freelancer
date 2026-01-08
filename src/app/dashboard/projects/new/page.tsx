"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, CheckCircle2, ChevronRight, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { useWallet } from "@/lib/hooks/useWallet";
import { useCreateProject } from "@/lib/hooks/useProjects";
import { useCreateMilestones } from "@/lib/hooks/useMilestones";
import { getChainConfig } from "@/lib/config/chains";

type MilestoneForm = {
    id: number;
    title: string;
    amount: string;
    deadline: string;
    currency: "NATIVE" | "USDT";
};

export default function NewProjectPage() {
    const router = useRouter();
    const { address } = useAuth();
    const { chainId, chainConfig } = useWallet();
    const createProjectMutation = useCreateProject();
    const createMilestonesMutation = useCreateMilestones();

    const [step, setStep] = useState(1);
    const [role, setRole] = useState<"client" | "freelancer">("client");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [counterpartyWallet, setCounterpartyWallet] = useState("");
    const [milestones, setMilestones] = useState<MilestoneForm[]>([
        { id: 1, title: "", amount: "", deadline: "", currency: "NATIVE" }
    ]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addMilestone = () => {
        setMilestones([...milestones, { 
            id: milestones.length + 1, 
            title: "", 
            amount: "", 
            deadline: "", 
            currency: milestones[0]?.currency || "NATIVE" 
        }]);
    };

    const removeMilestone = (id: number) => {
        if (milestones.length > 1) {
            setMilestones(milestones.filter(m => m.id !== id));
        }
    };

    const updateMilestone = (id: number, updates: Partial<MilestoneForm>) => {
        setMilestones(milestones.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const validateStep1 = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!title.trim()) {
            newErrors.title = "Project title is required";
        }
        
        if (!description.trim()) {
            newErrors.description = "Description is required";
        }
        
        if (!counterpartyWallet.trim()) {
            newErrors.counterpartyWallet = "Counterparty wallet is required";
        } else if (!counterpartyWallet.match(/^0x[a-fA-F0-9]{40}$/i) && !counterpartyWallet.includes("@")) {
            newErrors.counterpartyWallet = "Invalid wallet address or email";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        milestones.forEach((m, index) => {
            if (!m.title.trim()) {
                newErrors[`milestone_${m.id}_title`] = `Milestone ${index + 1} title is required`;
            }
            if (!m.amount.trim() || parseFloat(m.amount) <= 0) {
                newErrors[`milestone_${m.id}_amount`] = `Milestone ${index + 1} amount must be greater than 0`;
            }
            if (!m.deadline) {
                newErrors[`milestone_${m.id}_deadline`] = `Milestone ${index + 1} deadline is required`;
            } else if (new Date(m.deadline) < new Date()) {
                newErrors[`milestone_${m.id}_deadline`] = `Milestone ${index + 1} deadline must be in the future`;
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotal = (): number => {
        return milestones.reduce((sum, m) => {
            const amount = parseFloat(m.amount) || 0;
            return sum + amount;
        }, 0);
    };

    const calculateTotalByCurrency = (currency: "NATIVE" | "USDT"): number => {
        return milestones
            .filter(m => m.currency === currency)
            .reduce((sum, m) => {
                const amount = parseFloat(m.amount) || 0;
                return sum + amount;
            }, 0);
    };

    const getPrimaryCurrency = (): { currency: "NATIVE" | "USDT" | "MIXED", symbol: string } => {
        const nativeTotal = calculateTotalByCurrency("NATIVE");
        const usdtTotal = calculateTotalByCurrency("USDT");
        
        if (nativeTotal > 0 && usdtTotal > 0) {
            return { currency: "MIXED", symbol: "" };
        } else if (usdtTotal > 0) {
            return { currency: "USDT", symbol: "USDT" };
        } else {
            return { currency: "NATIVE", symbol: chainConfig?.nativeSymbol || "NATIVE" };
        }
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handleSubmit = async () => {
        if (!address || !chainId) {
            setErrors({ submit: "Please connect your wallet first" });
            return;
        }

        if (!validateStep2()) {
            setStep(2);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const currentChain = getChainConfig(chainId);
            if (!currentChain) {
                throw new Error("Unsupported chain");
            }

            const clientWallet = role === "client" ? address.toLowerCase() : counterpartyWallet.toLowerCase();
            const freelancerWallet = role === "freelancer" ? address.toLowerCase() : counterpartyWallet.toLowerCase();

            const project = await createProjectMutation.mutateAsync({
                onchain_address: `0x${Math.random().toString(16).substring(2, 42)}`,
                client_wallet: clientWallet,
                freelancer_wallet: freelancerWallet,
                chain_id: typeof chainId === "string" ? 56 : chainId,
                title: title.trim(),
                description: description.trim(),
                status: "draft",
            });

            const milestonesData = milestones.map((m, index) => ({
                project_id: project.id,
                index: index,
                title: m.title.trim(),
                description: "",
                amount: m.amount,
                currency: m.currency,
                chain_id: typeof chainId === "string" ? 56 : chainId,
                deadline: new Date(m.deadline).toISOString(),
            }));

            await createMilestonesMutation.mutateAsync(milestonesData);

            router.push(`/dashboard/projects/${project.id}`);
        } catch (error) {
            setErrors({
                submit: error instanceof Error ? error.message : "Failed to create project",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
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
                                <label className="text-sm font-medium">Project Title *</label>
                                <Input 
                                    placeholder="e.g. Website Redesign for CryptoStartup" 
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (errors.title) setErrors({ ...errors, title: "" });
                                    }}
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.title}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description *</label>
                                <textarea
                                    className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-glass-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                                    placeholder="Describe the project scope and requirements..."
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        if (errors.description) setErrors({ ...errors, description: "" });
                                    }}
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.description}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Counterparty Wallet Address *</label>
                                <Input 
                                    placeholder="0x..." 
                                    value={counterpartyWallet}
                                    onChange={(e) => {
                                        setCounterpartyWallet(e.target.value);
                                        if (errors.counterpartyWallet) setErrors({ ...errors, counterpartyWallet: "" });
                                    }}
                                />
                                {errors.counterpartyWallet && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.counterpartyWallet}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Your Role *</label>
                                <div className="flex gap-4">
                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        className={cn("flex-1", role === "client" && "border-accent bg-accent/5")}
                                        onClick={() => setRole("client")}
                                    >
                                        Client (Depositor)
                                    </Button>
                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        className={cn("flex-1", role === "freelancer" && "border-accent bg-accent/5")}
                                        onClick={() => setRole("freelancer")}
                                    >
                                        Freelancer
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {role === "client" 
                                        ? "You will deposit funds and manage the escrow"
                                        : "You will receive payments upon milestone completion"}
                                </p>
                            </div>
                            {chainConfig && (
                                <div className="rounded-lg border border-glass-border bg-glass/50 p-3 text-sm">
                                    <div className="text-muted-foreground mb-1">Network</div>
                                    <div className="font-medium">{chainConfig.name}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            {milestones.map((ms, index) => (
                                <div key={ms.id} className="flex gap-4 items-start bg-white/40 p-3 rounded-lg border border-glass-border">
                                    <span className="pt-2 text-sm font-bold text-muted-foreground w-6">{index + 1}.</span>
                                    <div className="flex-1 space-y-2">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium">Description *</label>
                                            <Input 
                                                placeholder="Deliverable name" 
                                                value={ms.title} 
                                                onChange={(e) => {
                                                    updateMilestone(ms.id, { title: e.target.value });
                                                    if (errors[`milestone_${ms.id}_title`]) {
                                                        const newErrors = { ...errors };
                                                        delete newErrors[`milestone_${ms.id}_title`];
                                                        setErrors(newErrors);
                                                    }
                                                }}
                                            />
                                            {errors[`milestone_${ms.id}_title`] && (
                                                <p className="text-xs text-red-500">{errors[`milestone_${ms.id}_title`]}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1 space-y-1">
                                                <label className="text-xs font-medium">Amount *</label>
                                                <div className="flex gap-2">
                                                    <Input 
                                                        type="number"
                                                        step="0.001"
                                                        placeholder="0.0" 
                                                        value={ms.amount} 
                                                        onChange={(e) => {
                                                            updateMilestone(ms.id, { amount: e.target.value });
                                                            if (errors[`milestone_${ms.id}_amount`]) {
                                                                const newErrors = { ...errors };
                                                                delete newErrors[`milestone_${ms.id}_amount`];
                                                                setErrors(newErrors);
                                                            }
                                                        }}
                                                    />
                                                    <select
                                                        className="px-3 py-2 rounded-lg border border-glass-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm"
                                                        value={ms.currency}
                                                        onChange={(e) => updateMilestone(ms.id, { currency: e.target.value as "NATIVE" | "USDT" })}
                                                    >
                                                        <option value="NATIVE">{chainConfig?.nativeSymbol || "NATIVE"}</option>
                                                        {chainConfig?.supportedTokens.includes("USDT") && (
                                                            <option value="USDT">USDT</option>
                                                        )}
                                                    </select>
                                                </div>
                                                {errors[`milestone_${ms.id}_amount`] && (
                                                    <p className="text-xs text-red-500">{errors[`milestone_${ms.id}_amount`]}</p>
                                                )}
                                            </div>
                                            <div className="w-40 space-y-1">
                                                <label className="text-xs font-medium">Deadline *</label>
                                                <Input 
                                                    type="date" 
                                                    value={ms.deadline} 
                                                    onChange={(e) => {
                                                        updateMilestone(ms.id, { deadline: e.target.value });
                                                        if (errors[`milestone_${ms.id}_deadline`]) {
                                                            const newErrors = { ...errors };
                                                            delete newErrors[`milestone_${ms.id}_deadline`];
                                                            setErrors(newErrors);
                                                        }
                                                    }}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                                {errors[`milestone_${ms.id}_deadline`] && (
                                                    <p className="text-xs text-red-500">{errors[`milestone_${ms.id}_deadline`]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {milestones.length > 1 && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => removeMilestone(ms.id)} 
                                            className="text-muted-foreground hover:text-red-500 mt-6"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button 
                                variant="outline" 
                                onClick={addMilestone} 
                                className="w-full border-dashed border-muted-foreground/30 hover:border-accent hover:text-accent"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add Milestone
                            </Button>
                        </div>
                    )}

                    {step === 3 && (() => {
                        const primaryCurrency = getPrimaryCurrency();
                        const nativeTotal = calculateTotalByCurrency("NATIVE");
                        const usdtTotal = calculateTotalByCurrency("USDT");
                        const nativeSymbol = chainConfig?.nativeSymbol || "ETH";
                        
                        return (
                            <div className="space-y-6 max-w-lg mx-auto py-4 text-center">
                                <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold">Ready to deploy?</h3>
                                <div className="space-y-4 text-left">
                                    <div className="bg-glass/50 p-4 rounded-lg border border-glass-border">
                                        <div className="text-sm text-muted-foreground mb-2">Project Summary</div>
                                        <div className="font-medium">{title || "Untitled Project"}</div>
                                        <div className="text-sm text-muted-foreground mt-1">{description.substring(0, 100)}{description.length > 100 ? "..." : ""}</div>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-2 border border-glass-border">
                                        <div className="flex justify-between">
                                            <span>Number of Milestones</span>
                                            <span className="font-medium">{milestones.length}</span>
                                        </div>
                                        {primaryCurrency.currency === "MIXED" ? (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>Total Amount (NATIVE)</span>
                                                    <span className="font-medium font-mono">
                                                        {nativeTotal.toFixed(3)} {nativeSymbol}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Total Amount (USDT)</span>
                                                    <span className="font-medium font-mono">
                                                        {usdtTotal.toFixed(3)} USDT
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex justify-between">
                                                <span>Total Amount</span>
                                                <span className="font-medium font-mono">
                                                    {calculateTotal().toFixed(3)} {primaryCurrency.symbol}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Network Fee (Est.)</span>
                                            <span>~0.001 {nativeSymbol}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Platform Fee</span>
                                            <span>0% (Free)</span>
                                        </div>
                                        <div className="border-t border-border pt-2 mt-2 space-y-2">
                                            <div className="flex justify-between font-bold">
                                                <span>Total to Deposit</span>
                                                <div className="flex flex-col items-end gap-1">
                                                    {primaryCurrency.currency === "MIXED" ? (
                                                        <>
                                                            <span className="font-mono">
                                                                {nativeTotal.toFixed(3)} {nativeSymbol}
                                                            </span>
                                                            <span className="font-mono text-xs font-normal">
                                                                {usdtTotal.toFixed(3)} USDT
                                                            </span>
                                                        </>
                                                    ) : primaryCurrency.currency === "USDT" ? (
                                                        <span className="font-mono">
                                                            {calculateTotal().toFixed(3)} USDT
                                                        </span>
                                                    ) : (
                                                        <span className="font-mono">
                                                            {(calculateTotal() + 0.001).toFixed(3)} {nativeSymbol}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {primaryCurrency.currency === "USDT" && (
                                                <div className="text-xs text-muted-foreground pt-1">
                                                    + ~0.001 {nativeSymbol} for network fees
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {errors.submit && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span>{errors.submit}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>

                <div className="pt-6 border-t border-glass-border flex justify-between">
                    {step > 1 ? (
                        <Button 
                            variant="ghost" 
                            onClick={() => setStep(step - 1)}
                            disabled={isSubmitting}
                        >
                            Back
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button 
                            onClick={handleNext} 
                            className="gap-2"
                            disabled={isSubmitting}
                        >
                            Next Step <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleSubmit} 
                            className="gap-2 shadow-lg shadow-accent/25"
                            disabled={isSubmitting || !address}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    Create Project <Plus className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
