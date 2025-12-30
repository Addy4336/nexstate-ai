import { requireStaff } from "@/lib/auth-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Calculator,
    Wallet,
    TrendingUp,
    SlidersHorizontal,
    Sparkles,
    ExternalLink,
    Eye,
} from "lucide-react";

const tools = [
    {
        title: "Owner ROI Calculator",
        description: "Help property owners estimate rental returns based on rent, expenses, and financing.",
        icon: TrendingUp,
        href: "/tools/roi-calculator",
        color: "from-amber-400 to-amber-600",
        stats: { label: "Investments analyzed", value: "—" },
    },
    {
        title: "Tenant Cost Calculator",
        description: "Enable tenants to compare rental costs across different stay durations.",
        icon: Wallet,
        href: "/tools/cost-calculator",
        color: "from-blue-400 to-blue-600",
        stats: { label: "Cost comparisons", value: "—" },
    },
    {
        title: "Advanced Property Search",
        description: "Location radius, property type, budget, sharing options, amenities, and more.",
        icon: SlidersHorizontal,
        href: "/properties",
        color: "from-green-400 to-green-600",
        stats: { label: "Search filters", value: "10+" },
    },
    {
        title: "Smart Recommendations",
        description: "Cross-sell and upsell suggestions based on user search behavior and preferences.",
        icon: Sparkles,
        href: "/properties",
        color: "from-purple-400 to-purple-600",
        stats: { label: "Recommendation types", value: "4" },
    },
];

export default async function ToolsPage() {
    await requireStaff();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ROI Tools</h1>
                <p className="text-muted-foreground">
                    Manage property calculators and search tools available to users.
                </p>
            </div>

            {/* Tools Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {tools.map((tool) => (
                    <Card key={tool.title} className="overflow-hidden">
                        <CardHeader className={`bg-gradient-to-r ${tool.color} text-white`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <tool.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-white">{tool.title}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <CardDescription className="text-base">
                                {tool.description}
                            </CardDescription>
                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <span className="text-muted-foreground">{tool.stats.label}: </span>
                                    <span className="font-semibold">{tool.stats.value}</span>
                                </div>
                                <Link href={tool.href} target="_blank">
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                        <ExternalLink className="w-3 h-3 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Links */}
            <Card>
                <CardHeader>
                    <CardTitle>Public Tool Pages</CardTitle>
                    <CardDescription>
                        These tools are available to all visitors on the public website.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/tools" target="_blank">
                            <Button variant="outline">
                                <Calculator className="w-4 h-4 mr-2" />
                                Tools Landing Page
                                <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/tools/roi-calculator" target="_blank">
                            <Button variant="outline">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Owner ROI Calculator
                                <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/tools/cost-calculator" target="_blank">
                            <Button variant="outline">
                                <Wallet className="w-4 h-4 mr-2" />
                                Tenant Cost Calculator
                                <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Features implemented */}
            <Card>
                <CardHeader>
                    <CardTitle>Feature Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-amber-500" />
                                Owner ROI Calculator
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                                <li>• Cap Rate calculation</li>
                                <li>• Cash-on-Cash return</li>
                                <li>• Break-even occupancy</li>
                                <li>• Payback period estimation</li>
                                <li>• Expense breakdown</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-blue-500" />
                                Tenant Cost Calculator
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                                <li>• Total stay cost breakdown</li>
                                <li>• Duration comparison (6, 12, 24, 36 mo)</li>
                                <li>• Upfront cost calculation</li>
                                <li>• Effective monthly rent</li>
                                <li>• Savings visualization</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-green-500" />
                                Advanced Filters
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                                <li>• Location with radius (1-20 km)</li>
                                <li>• Property type selection</li>
                                <li>• Budget range</li>
                                <li>• Sharing/Private options</li>
                                <li>• Furnishing level</li>
                                <li>• Gender preference</li>
                                <li>• Amenities checkboxes</li>
                                <li>• Availability date</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                Cross-sell & Upsell
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                                <li>• Similar properties (±20% price)</li>
                                <li>• Upgrade options (+10-30%)</li>
                                <li>• Budget alternatives (-10-30%)</li>
                                <li>• Popular in area</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
