"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { User, Shield, Star, Award, Code2, MapPin, Link as LinkIcon } from "lucide-react";
import Image from "next/image"; // Often used but I'll use div placeholder to avoid static image issues

export default function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <Card className="glass-card overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 -m-6 mb-6" />
                <div className="relative px-6">
                    <div className="absolute -top-16 left-6 h-24 w-24 rounded-full border-4 border-background bg-zinc-900 shadow-xl flex items-center justify-center text-white text-3xl font-bold">
                        AS
                    </div>
                    <div className="pt-10 flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                Alice Studio
                                <Badge variant="glass" className="text-xs font-normal bg-accent/10 border-accent/20 text-accent">Verified</Badge>
                            </h1>
                            <p className="text-muted-foreground">Senior Solidity Engineer & UI Designer</p>
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Paris, France</span>
                                <span className="flex items-center gap-1"><LinkIcon className="h-3 w-3" /> alice.eth</span>
                            </div>
                        </div>
                        <Button>Edit Profile</Button>
                    </div>
                </div>
                <div className="p-6 mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-glass-border">
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground uppercase">Reputation Score</div>
                        <div className="text-2xl font-bold text-accent flex items-center gap-2">98 <Star className="h-4 w-4 fill-accent text-accent" /></div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground uppercase">Jobs Completed</div>
                        <div className="text-2xl font-bold">42</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground uppercase">Total Volume</div>
                        <div className="text-2xl font-bold font-mono">145 ETH</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground uppercase">Dispute Rate</div>
                        <div className="text-2xl font-bold text-emerald-500">0%</div>
                    </div>
                </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Skills & Badges */}
                <Card className="glass-card md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {["Solidity", "React", "Next.js", "Rust", "UI/UX", "DeFi"].map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-muted/50">{tag}</Badge>
                            ))}
                        </div>

                        <h3 className="text-lg font-semibold mt-6 mb-3">Badges</h3>
                        <div className="flex gap-2">
                            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500" title="Top Rated">       <Award className="h-5 w-5" />
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500" title="Code Auditor">
                                <Shield className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reviews List */}
                <Card className="glass-card md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="pb-6 border-b border-glass-border last:border-0 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-muted" />
                                        <div>
                                            <div className="text-sm font-semibold">CryptoCorp Inc.</div>
                                            <div className="text-xs text-muted-foreground">Dec 12, 2025</div>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-500">
                                        <Star className="h-3 w-3 fill-current" />
                                        <Star className="h-3 w-3 fill-current" />
                                        <Star className="h-3 w-3 fill-current" />
                                        <Star className="h-3 w-3 fill-current" />
                                        <Star className="h-3 w-3 fill-current" />
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Alice delivered the smart contracts ahead of schedule and the documentation was perfect. Highly recommended for any DeFi/Escrow work.
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
