"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { CheckCircle2, Briefcase, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<"client" | "freelancer" | null>(null);

    const handleContinue = () => {
        if (step === 1 && role) {
            setStep(2);
        } else if (step === 2) {
            // Mock save implementation
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-lg">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-center gap-2">
                    <div className={cn("h-1 w-12 rounded-full transition-colors", step >= 1 ? "bg-accent" : "bg-muted")} />
                    <div className={cn("h-1 w-12 rounded-full transition-colors", step >= 2 ? "bg-accent" : "bg-muted")} />
                </div>

                <Card className="glass-card">
                    {step === 1 ? (
                        <>
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">Choose your primary role</CardTitle>
                                <CardDescription>Don't worry, you can switch or do both later.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 pt-4">
                                <div
                                    onClick={() => setRole("client")}
                                    className={cn(
                                        "cursor-pointer rounded-xl border p-4 transition-all hover:bg-muted/50 flex items-center gap-4",
                                        role === "client" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-glass-border hover:border-foreground/20"
                                    )}
                                >
                                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">I&apos;m a Client</div>
                                        <div className="text-sm text-muted-foreground">Hire talent & manage escrows</div>
                                    </div>
                                    {role === "client" && <CheckCircle2 className="h-5 w-5 text-accent" />}
                                </div>

                                <div
                                    onClick={() => setRole("freelancer")}
                                    className={cn(
                                        "cursor-pointer rounded-xl border p-4 transition-all hover:bg-muted/50 flex items-center gap-4",
                                        role === "freelancer" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-glass-border hover:border-foreground/20"
                                    )}
                                >
                                    <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                        <Briefcase className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">I&apos;m a Freelancer</div>
                                        <div className="text-sm text-muted-foreground">Find work & get paid securely</div>
                                    </div>
                                    {role === "freelancer" && <CheckCircle2 className="h-5 w-5 text-accent" />}
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <>
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">Create your profile</CardTitle>
                                <CardDescription>This is how others will see you onchain.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-center mb-6">
                                    <div className="h-24 w-24 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 hover:border-solid hover:border-accent">
                                        <span className="text-xs">Upload</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Display Name</label>
                                    <Input placeholder="e.g. Alice Studio" className="bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Bio / Tagline</label>
                                    <Input placeholder="e.g. Senior Solidity Engineer" className="bg-background/50" />
                                </div>
                            </CardContent>
                        </>
                    )}

                    <div className="p-6 pt-0">
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleContinue}
                            disabled={step === 1 && !role}
                        >
                            {step === 1 ? "Continue" : "Complete Setup"}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
