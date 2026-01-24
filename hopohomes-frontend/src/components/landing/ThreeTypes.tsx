"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Home, Key } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const types = [
    {
        id: "coliving",
        icon: <Users className="w-6 h-6" />,
        title: "Co-living homes",
        description: "Community-driven spaces with private rooms and shared common areas, ideal for young professionals and remote workers.",
        image: "/images/types/coliving.png",
        color: "from-primary/80 to-primary"
    },
    {
        id: "apartment",
        icon: <Home className="w-6 h-6" />,
        title: "Complete apartments",
        description: "Fully furnished 1–3 BHK units for couples, families, and long-stay residents wanting more privacy and space.",
        image: "/images/types/apartment.png",
        color: "from-primary/60 to-primary/90"
    },
    {
        id: "room",
        icon: <Key className="w-6 h-6" />,
        title: "Private rooms",
        description: "Secure, well-furnished rooms inside managed apartments or villas, balancing affordability and comfort.",
        image: "/images/types/room.png",
        color: "from-primary/70 to-primary"
    }
];

export default function ThreeTypes() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-foreground sm:text-5xl mb-4"
                    >
                        Find Your Perfect Space
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Serve different lifestyles with a single, AI-managed network of homes.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {types.map((type, index) => (
                        <motion.div
                            key={type.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group relative h-[400px] sm:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer"
                        >
                            {/* Background Image with Zoom Effect */}
                            <div className="absolute inset-0">
                                <Image
                                    src={type.image}
                                    alt={type.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Gradient Overlay */}
                                <div className={cn("absolute inset-0 bg-gradient-to-t opacity-80 transition-opacity duration-300", type.color, "from-black/80 via-black/40 to-transparent")} />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                                    <div className="inline-flex items-center justify-center p-3 rounded-xl bg-white/10 backdrop-blur-md mb-4 border border-white/20">
                                        {type.icon}
                                    </div>

                                    <h3 className="text-3xl font-bold mb-3 leading-tight">{type.title}</h3>

                                    <p className="text-white/80 leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-4 group-hover:translate-y-0">
                                        {type.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 translate-x-[-10px] group-hover:translate-x-0">
                                        <span>Explore {type.title}</span>
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
