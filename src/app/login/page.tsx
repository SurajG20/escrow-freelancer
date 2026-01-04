"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowLeft, Wallet } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Link href="/" className="absolute left-8 top-8 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>

            <Card className="w-full max-w-md glass-card text-center">
                <CardHeader className="pb-8">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                        <Wallet className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">Connect your wallet</CardTitle>
                    <CardDescription>
                        No password required. Your wallet is your identity.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Link href="/onboarding">
                        <Button variant="outline" className="w-full h-14 justify-start px-6 gap-4 text-left font-normal text-base hover:border-accent hover:bg-accent/5">
                            <div className="h-8 w-8 rounded-full bg-purple-500/20" /> {/* Phantom-ish icon placeholder */}
                            Phantom
                        </Button>
                    </Link>
                    <Link href="/onboarding">
                        <Button variant="outline" className="w-full h-14 justify-start px-6 gap-4 text-left font-normal text-base hover:border-accent hover:bg-accent/5">
                            <div className="h-8 w-8 rounded-full bg-orange-500/20" /> {/* MetaMask-ish icon placeholder */}
                            MetaMask
                        </Button>
                    </Link>
                    <div className="pt-4 text-xs text-muted-foreground">
                        New to crypto? <a href="#" className="underline hover:text-foreground">Learn how to create a wallet</a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
