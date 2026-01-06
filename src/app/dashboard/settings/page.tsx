"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Wallet, Mail, Smartphone } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-3xl space-y-6">
            <h1 className="text-3xl font-light tracking-tight">Settings</h1>

            {/* Account Info */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your profile details and linked accounts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Display Name</label>
                        <Input defaultValue="Alice Studio" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <div className="flex gap-2">
                            <Input defaultValue="alice@example.com" />
                            <Button variant="outline">Verify</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Connected Wallets */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Connected Wallets</CardTitle>
                    <CardDescription>Manage wallets used for signing transactions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-glass-border bg-white/40">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <Wallet className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <div className="font-mono text-sm">0x71C...9B21</div>
                                <Badge variant="glass" className="text-[10px] ml-2">Primary</Badge>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Disconnect</Button>
                    </div>
                    <Button variant="outline" className="w-full">Link another wallet</Button>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how you receive updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { title: "Email Notifications", desc: "Receive daily digests and major alerts", icon: Mail, on: true },
                        { title: "Push Notifications", desc: "Real-time updates on milestones", icon: Smartphone, on: false },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex gap-3">
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">{item.title}</div>
                                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                                </div>
                            </div>
                            <div className={`h-6 w-11 rounded-full p-1 cursor-pointer transition-colors ${item.on ? "bg-accent" : "bg-muted"}`}>
                                <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.on ? "translate-x-5" : "translate-x-0"}`} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
