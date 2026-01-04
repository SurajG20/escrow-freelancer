import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-light tracking-tight text-foreground">Overview</h1>
                <div className="flex gap-2">
                    <Badge variant="outline" className="glass bg-white/50">Updated just now</Badge>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Locked", value: "$12,450.00", change: "+12%" },
                    { title: "Active Projects", value: "7", change: "+2" },
                    { title: "Pending Actions", value: "3", change: "Urgent" },
                    { title: "Reputation", value: "98/100", change: "Elite" },
                ].map((stat, i) => (
                    <Card key={i} className="glass-card hover:bg-white/60 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 text-emerald-600">
                                {stat.change} from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* More sections to come */}
            <div className="h-96 rounded-2xl border border-glass-border bg-glass/30 flex items-center justify-center text-muted-foreground">
                Activity Chart Placeholder
            </div>
        </div>
    );
}
