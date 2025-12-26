"use client";

import { motion } from "framer-motion";
import {
    Building2,
    Users,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
    {
        title: "Total Properties",
        value: "248",
        change: "+12%",
        trend: "up",
        icon: Building2,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        title: "Active Tenants",
        value: "1,842",
        change: "+8%",
        trend: "up",
        icon: Users,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
    },
    {
        title: "Monthly Revenue",
        value: "AED 1.2M",
        change: "+23%",
        trend: "up",
        icon: DollarSign,
        color: "text-accent",
        bgColor: "bg-accent/10",
    },
    {
        title: "Occupancy Rate",
        value: "94%",
        change: "-2%",
        trend: "down",
        icon: TrendingUp,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
];

const recentProperties = [
    { id: 1, name: "Marina Heights 1204", location: "Dubai Marina", status: "Occupied", rent: "8,500" },
    { id: 2, name: "JLT Cluster D Studio", location: "JLT", status: "Available", rent: "4,200" },
    { id: 3, name: "Downtown Loft 803", location: "Downtown Dubai", status: "Pending", rent: "12,000" },
    { id: 4, name: "Business Bay Tower", location: "Business Bay", status: "Occupied", rent: "6,800" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="flex items-center gap-1 mt-1">
                                    {stat.trend === "up" ? (
                                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                                    )}
                                    <span
                                        className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-muted-foreground">vs last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions & Recent Properties */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start gap-2" variant="outline">
                                <Building2 className="w-4 h-4" />
                                Add New Property
                            </Button>
                            <Button className="w-full justify-start gap-2" variant="outline">
                                <Users className="w-4 h-4" />
                                Add New Tenant
                            </Button>
                            <Button className="w-full justify-start gap-2" variant="outline">
                                <Calendar className="w-4 h-4" />
                                Schedule Viewing
                            </Button>
                            <Button className="w-full justify-start gap-2" variant="outline">
                                <Eye className="w-4 h-4" />
                                View Reports
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Properties */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2"
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Properties</CardTitle>
                            <Button variant="ghost" size="sm">
                                View All
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentProperties.map((property) => (
                                    <div
                                        key={property.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                                    >
                                        <div>
                                            <p className="font-medium">{property.name}</p>
                                            <p className="text-sm text-muted-foreground">{property.location}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">AED {property.rent}/mo</p>
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${property.status === "Occupied"
                                                        ? "bg-green-500/10 text-green-500"
                                                        : property.status === "Available"
                                                            ? "bg-blue-500/10 text-blue-500"
                                                            : "bg-yellow-500/10 text-yellow-500"
                                                    }`}
                                            >
                                                {property.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
