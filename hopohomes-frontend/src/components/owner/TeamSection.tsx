'use client';

import Image from 'next/image';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

const teamMembers = [
    {
        name: "Sarah Collins",
        role: "Chief Visionary Officer",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
        isGrayscale: true,
        hasCardBackground: false
    },
    {
        name: "David Turner",
        role: "Financial Strategist",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
        isGrayscale: false, // Center card is color
        hasCardBackground: true // Center card has white background
    },
    {
        name: "Rebecca Campbell",
        role: "Investment Advisor",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
        isGrayscale: true,
        hasCardBackground: false
    }
];

export default function TeamSection() {
    return (
        <section className="bg-muted/30 dark:bg-neutral-950 py-12 md:py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12">
                    <div className="max-w-2xl space-y-4 md:space-y-6">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            Our Best Team
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.1]">
                            Our experts blend <br className="hidden md:block" />
                            financial wisdom
                        </h2>
                    </div>

                    <div className="max-w-md space-y-6 md:space-y-8 lg:pt-12">
                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                            Meet the team that turns numbers into opportunities! Our experts blend financial wisdom with innovation.
                        </p>
                        <a href="#" className="inline-flex items-center gap-2 font-medium text-foreground border-b border-foreground/30 hover:border-foreground pb-0.5 transition-colors group">
                            View All Team
                            <div className="w-6 h-6 rounded-full border border-foreground/30 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                                <ChevronRight size={14} />
                            </div>
                        </a>
                    </div>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className={`group relative rounded-[2rem] transition-all duration-300 ${member.hasCardBackground
                                ? 'bg-background p-4 shadow-xl shadow-black/5 dark:shadow-white/5'
                                : 'p-0 sm:p-4'
                                }`}
                        >
                            {/* Image Container */}
                            <div
                                className={`relative w-full overflow-hidden rounded-3xl mb-6 ${member.hasCardBackground ? 'aspect-[4/3]' : 'aspect-[3/4]'
                                    } ${member.isGrayscale ? 'grayscale hover:grayscale-0 transition-all duration-500' : ''}`}
                            >
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>

                            {/* Info */}
                            <div className={`flex items-end justify-between px-2 ${member.hasCardBackground ? 'pb-2' : ''}`}>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                                    <p className="text-muted-foreground font-medium text-sm">{member.role}</p>
                                </div>

                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors cursor-pointer">
                                    <ArrowUpRight size={18} strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
