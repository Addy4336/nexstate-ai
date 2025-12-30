"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Property } from "@/types/property";

interface RecentPropertiesListProps {
    properties: Property[];
}

export function RecentPropertiesList({ properties }: RecentPropertiesListProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Properties</CardTitle>
                    <Link href="/admin/properties">
                        <Button variant="ghost" size="sm">
                            View All
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {properties.length > 0 ? (
                            properties.map((property) => (
                                <div
                                    key={property.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                                >
                                    <div>
                                        <p className="font-medium line-clamp-1">{property.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {property.location}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            AED {property.price.toLocaleString()}/mo
                                        </p>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${property.status === "rented"
                                                    ? "bg-green-500/10 text-green-500"
                                                    : property.status === "available"
                                                        ? "bg-blue-500/10 text-blue-500"
                                                        : "bg-yellow-500/10 text-yellow-500"
                                                }`}
                                        >
                                            {property.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-4">No recent properties</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
