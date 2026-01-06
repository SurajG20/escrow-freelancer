"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Shield, Star, Award, Loader2, Wallet } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProjects } from "@/lib/hooks/useProjects";
import { useDisputes } from "@/lib/hooks/useDisputes";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
    const { user, address, isLoading: authLoading } = useAuth();
    const { data: projects = [] } = useProjects(
        address ? { client_wallet: address.toLowerCase() } : undefined
    );
    const { data: disputes = [] } = useDisputes();

    const stats = useMemo(() => {
        const completedProjects = projects.filter(p => p.status === "completed").length;
        const totalProjects = projects.length;
        const disputeCount = disputes.length;
        const disputeRate = totalProjects > 0 ? ((disputeCount / totalProjects) * 100).toFixed(1) : "0";

        return {
            reputation: "N/A",
            jobsCompleted: completedProjects,
            totalVolume: "0 ETH",
            disputeRate: `${disputeRate}%`,
        };
    }, [projects, disputes]);

    const displayName = user?.display_name || 
        (address ? `${address.substring(0, 6)}...${address.substring(38)}` : "User");
    const initials = displayName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2) || "U";

    if (authLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card className="glass-card overflow-hidden">
                <div className="h-32 bg-linear-to-r from-blue-500/20 to-purple-500/20 -m-6 mb-6" />
                <div className="relative px-6">
                    <div className="absolute -top-16 left-6 h-24 w-24 rounded-full border-4 border-background bg-zinc-900 shadow-xl flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                        {user?.avatar_url ? (
                            <Image src={user.avatar_url} alt={displayName} width={96} height={96} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <div className="pt-10 flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                {displayName}
                                {user && <Badge variant="glass" className="text-xs font-normal bg-accent/10 border-accent/20 text-accent">Verified</Badge>}
                            </h1>
                            <p className="text-muted-foreground">{user?.bio || "No bio available"}</p>
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                {address && (
                                    <span className="flex items-center gap-1">
                                        <Wallet className="h-3 w-3" /> {address.substring(0, 6)}...{address.substring(38)}
                                    </span>
                                )}
                                {user?.roles && user.roles.length > 0 && (
                                    <span className="flex items-center gap-1">
                                        Roles: {user.roles.join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Link href="/dashboard/settings">
                            <Button>Edit Profile</Button>
                        </Link>
                    </div>
                </div>
                <div className="p-6 mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-glass-border">
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground uppercase">Reputation Score</div>
                        <div className="text-2xl font-bold text-accent flex items-center gap-2">
                            {stats.reputation} <Star className="h-4 w-4 fill-accent text-accent" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground uppercase">Jobs Completed</div>
                        <div className="text-2xl font-bold">{stats.jobsCompleted}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground uppercase">Total Volume</div>
                        <div className="text-2xl font-bold font-mono">{stats.totalVolume}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground uppercase">Dispute Rate</div>
                        <div className="text-2xl font-bold text-emerald-500">{stats.disputeRate}</div>
                    </div>
                </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {user?.roles && user.roles.length > 0 ? (
                                user.roles.map(role => (
                                    <Badge key={role} variant="secondary" className="bg-muted/50 capitalize">{role}</Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No roles assigned</p>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold mt-6 mb-3">Badges</h3>
                        <div className="flex gap-2">
                            {stats.jobsCompleted > 10 && (
                                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500" title="Top Rated">
                                    <Award className="h-5 w-5" />
                                </div>
                            )}
                            {stats.disputeRate === "0%" && (
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500" title="Code Auditor">
                                    <Shield className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {projects.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No projects yet.</p>
                                <Link href="/dashboard/projects/new" className="text-accent hover:underline mt-2 inline-block">
                                    Create your first project
                                </Link>
                            </div>
                        ) : (
                            projects.slice(0, 5).map((project) => (
                                <div key={project.id} className="pb-6 border-b border-glass-border last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <Link href={`/dashboard/projects/${project.id}`}>
                                                <div className="text-sm font-semibold hover:text-accent transition-colors cursor-pointer">
                                                    {project.title}
                                                </div>
                                            </Link>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(project.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {project.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {project.description}
                                    </p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
