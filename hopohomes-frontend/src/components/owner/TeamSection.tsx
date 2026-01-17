'use client';

import Image from 'next/image';
import { ArrowUpRight, ChevronRight, Linkedin, Twitter } from 'lucide-react';

const teamMembers = [
    {
        name: "Ahmed Al-Rashid",
        role: "CEO & Founder",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
        isGrayscale: true,
        hasCardBackground: false
    },
    {
        name: "Sarah Mitchell",
        role: "Head of Property Management",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
        isGrayscale: false,
        hasCardBackground: true
    },
    {
        name: "Omar Hassan",
        role: "Senior Portfolio Manager",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
        isGrayscale: true,
        hasCardBackground: false
    }
];

export default function TeamSection() {
    return (
        <section className="bg-muted/30 dark:bg-neutral-950 py-12 md:py-24 px-4 sm:px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12">
                    <div className="max-w-2xl space-y-4 md:space-y-6">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs md:text-sm font-medium">
                            Expert Team
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.1]">
                            Meet Our Property <br className="hidden md:block" />
                            Management Experts
                        </h2>
                    </div>

                    <div className="max-w-md space-y-4 md:space-y-8 lg:pt-12">
                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                            A dedicated team of Dubai real estate professionals committed to maximizing your property's potential and returns.
                        </p>
                        <a href="#" className="inline-flex items-center gap-2 font-medium text-foreground border-b border-foreground/30 hover:border-foreground pb-0.5 transition-colors group text-sm md:text-base">
                            View All Team
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-foreground/30 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
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
                                ? 'bg-background p-4 sm:p-5 shadow-xl shadow-black/5 dark:shadow-white/5 border border-border'
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
                                {/* Hover overlay with social icons */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6 gap-3">
                                    <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-foreground transition-colors">
                                        <Linkedin size={16} />
                                    </button>
                                    <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-foreground transition-colors">
                                        <Twitter size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className={`flex items-end justify-between px-2 ${member.hasCardBackground ? 'pb-2' : ''}`}>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                                    <p className="text-primary font-medium text-sm">{member.role}</p>
                                </div>

                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors cursor-pointer">
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
