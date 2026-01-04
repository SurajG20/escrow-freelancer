"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, ArrowDownLeft, Lock, History, Wallet } from "lucide-react";

const transactions = [
    { id: 1, type: "Deposit", project: "DeFi Dashboard", amount: "2.5 ETH", date: "Jan 2, 2026", status: "Confirmed" },
    { id: 2, type: "Release", project: "NFT Marketplace", amount: "1.0 ETH", date: "Dec 28, 2025", status: "Completed" },
    { id: 3, type: "Deposit", project: "Solana Smart Contract", amount: "15 SOL", date: "Dec 20, 2025", status: "Confirmed" },
];

export default function VaultsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-light tracking-tight">Escrow Vaults</h1>
                <p className="text-muted-foreground">Manage your locked funds and view transaction history.</p>
            </div>

            {/* Balance Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass-card bg-gradient-to-br from-accent/10 to-glass">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Value Locked</CardTitle>
                        <Lock className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450.00</div>
                        <p className="text-xs text-muted-foreground mt-1">Across 3 active projects</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Release</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$3,200.00</div>
                        <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Available to Withdraw</CardTitle>
                        <Wallet className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                        <Button variant="ghost" size="sm" className="mt-1 h-6 px-2 -ml-2 text-accent">Connect Wallet to view</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Vault List / History */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" /> Recent Transactions
                    </CardTitle>
                    <CardDescription>Onchain deposits and releases.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border border-glass-border bg-white/40 hover:bg-white/60 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === "Deposit" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"}`}>
                                        {tx.type === "Deposit" ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <div className="font-medium">{tx.type} - {tx.project}</div>
                                        <div className="text-xs text-muted-foreground">{tx.date}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-medium">{tx.amount}</div>
                                    <Badge variant="outline" className="text-xs text-muted-foreground border-transparent bg-muted/50">{tx.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
