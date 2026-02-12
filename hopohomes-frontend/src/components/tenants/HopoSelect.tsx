"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase, Building2, Users, Plane,
    Check, X, Sparkles, Diamond, ShieldCheck,
    ArrowUpRight, Star, Quote, Gem
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HopoSelect() {
    return (
        <section className="relative w-full bg-background border-t border-border/40 py-12 md:py-24 font-sans selection:bg-orange-100 selection:text-orange-900 overflow-hidden">

            {/* Background Texture - Vertical Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '10% 100%' }}>
            </div>

            <div className="container px-4 md:px-6 lg:px-12 mx-auto relative z-10">

                {/* --- 1. HERO: Magazine Masthead --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-32 border-b border-primary/20 pb-8 md:pb-12">
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-2 mb-4 md:mb-6 text-[10px] md:text-xs font-bold tracking-[0.25em] text-foreground uppercase">
                            <Star className="w-3 h-3 text-secondary fill-secondary" />
                            Affordable Luxury Collection
                        </div>
                        <h2 className="text-5xl md:text-7xl lg:text-9xl font-serif text-primary leading-[0.9] tracking-tight mb-6 md:mb-8">
                            Hopo <br />
                            <span className="italic pl-8 md:pl-16 text-foreground">Select</span>
                        </h2>
                    </div>
                    <div className="lg:col-span-4 flex flex-col justify-end pb-2 md:pb-4">
                        <p className="text-lg md:text-xl font-light text-muted-foreground leading-relaxed border-l-2 border-primary pl-4 md:pl-6">
                            "Designed for the structured professional who values time, consistency, and peace of mind."
                            <strong className="block mt-2 text-primary font-medium">No ultra-luxury markup.</strong>
                        </p>
                    </div>
                </div>

                {/* --- 2. PERSONAS: Accordion / Strip Layout --- */}
                <div className="mb-16 md:mb-32">
                    <div className="flex items-baseline justify-between mb-6 md:mb-8">
                        <h3 className="text-xl md:text-2xl font-serif text-primary">Ideal Residents</h3>
                        <span className="text-xs md:text-sm font-mono text-primary">01 — 04</span>
                    </div>

                    <div className="divide-y divide-primary/20 border-t border-b border-primary/20">
                        <PersonaStrip
                            number="01"
                            title="Corporate Professionals"
                            subtitle="Mid-Senior Level"
                            desc="Consultants & Leads. AED 18k-45k salaries."
                            tag="Fixed Terms"
                        />
                        <PersonaStrip
                            number="02"
                            title="Business Founders"
                            subtitle="SME Entrepreneurs"
                            desc="Privacy & stability without complex lock-ins."
                            tag="Flexible"
                        />
                        <PersonaStrip
                            number="03"
                            title="Relocating Families"
                            subtitle="Transition Phase"
                            desc="3-12 months for testing schools & areas."
                            tag="Family Ready"
                        />
                        <PersonaStrip
                            number="04"
                            title="Business Travelers"
                            subtitle="Long-Stay"
                            desc="1-6 months. Hotel-grade, zero chaos."
                            tag="Company Pay"
                        />
                    </div>
                </div>

                {/* --- 3. THE SPLIT: "Magazine Spread" Layout --- */}
                <div className="bg-primary/5 -mx-4 md:-mx-6 lg:-mx-12 px-4 md:px-6 lg:px-12 py-16 md:py-32 mb-16 md:mb-32">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                            {/* Left: The Promise - Typography Focused */}
                            <div>
                                <h3 className="text-3xl md:text-4xl font-serif mb-8 md:mb-12 text-primary">
                                    The <span className="italic text-foreground decoration-primary decoration-2 underline underline-offset-4">Anti-Chaos</span> <br /> Promise.
                                </h3>

                                <div className="space-y-8 md:space-y-12">
                                    <PromiseItem
                                        title="Management."
                                        desc="Professional teams only. No individual landlord drama."
                                    />
                                    <PromiseItem
                                        title="Consistency."
                                        desc="Calm, neutral interiors. Hotel-grade sleep experience."
                                    />
                                    <PromiseItem
                                        title="Transparency."
                                        desc="Digitized process. No hidden fees. No broker chase."
                                    />
                                </div>
                            </div>

                            {/* Right: The Filter - Visual "Cross-out" */}
                            <div className="relative pt-4 md:pt-0">
                                <div className="absolute top-0 left-0 text-7xl md:text-9xl text-primary/10 font-serif -z-10 -translate-x-6 -translate-y-6 md:-translate-x-10 md:-translate-y-10">
                                    NO
                                </div>
                                <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8 border-b border-primary/20 pb-4 text-primary">We actively eliminate</h4>

                                <ul className="space-y-4 md:space-y-6">
                                    {["Negotiation Drama", "Surprise Move-in Charges", "Overcrowded Units", "Unresponsive Support", "Hostel Vibes"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 md:gap-6 group hover:pl-4 transition-all duration-300 cursor-default">
                                            <span className="text-[10px] md:text-xs font-mono text-primary/50">0{i + 1}</span>
                                            <span className="text-lg md:text-2xl font-light text-foreground/50 group-hover:text-primary group-hover:line-through transition-colors">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>

                {/* --- 4. PRICING: Minimal Data Table --- */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10 md:mb-16">
                        <h3 className="text-2xl md:text-3xl font-serif mb-3 md:mb-4 text-primary">Transparent Monthly Investment</h3>
                        <p className="text-sm md:text-base text-muted-foreground">All-inclusive rates. No surprises.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary/20 border border-primary/20 bg-background">
                        <PricingTab title="Studio" price="4.5k – 8k" />
                        <PricingTab title="1 Bedroom" price="8k – 13k" highlight />
                        <PricingTab title="2 Bedroom" price="12k – 30k" />
                    </div>

                    <div className="mt-8 md:mt-12 text-center">
                        <a href="/properties" className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-primary/70 hover:border-primary/70 transition-colors">
                            View Standard Rooms <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}

// --- Minimalist Sub Components ---

const PersonaStrip = ({ number, title, subtitle, desc, tag }: any) => (
    <div className="group flex flex-col md:flex-row md:items-center py-6 md:py-8 gap-4 md:gap-6 hover:bg-primary/5 hover:scale-[1.01] transition-all duration-300 -mx-4 px-4 rounded-xl cursor-default">
        <div className="text-[10px] md:text-xs font-mono text-primary/50 w-8">{number}</div>
        <div className="md:w-1/4">
            <h4 className="text-lg md:text-xl font-medium text-foreground group-hover:text-primary transition-colors">{title}</h4>
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground mt-1 group-hover:text-primary/70">{subtitle}</p>
        </div>
        <div className="flex-1 md:border-l border-primary/20 md:pl-8">
            <p className="text-sm md:text-base font-light text-muted-foreground">{desc}</p>
        </div>
        <div className="md:w-32 text-right">
            <span className="inline-block px-3 py-1 bg-background border border-primary/30 rounded text-[10px] md:text-xs font-bold uppercase text-primary">
                {tag}
            </span>
        </div>
    </div>
);

const PromiseItem = ({ title, desc }: { title: string, desc: string }) => (
    <div className="flex gap-4 md:gap-6 items-baseline">
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full shrink-0" />
        <div>
            <h5 className="text-xl md:text-2xl font-serif text-foreground mb-1 md:mb-2 group-hover:text-primary transition-colors">{title}</h5>
            <p className="text-base md:text-lg font-light text-muted-foreground">{desc}</p>
        </div>
    </div>
);

const PricingTab = ({ title, price, highlight }: any) => (
    <div className={cn("p-6 md:p-10 text-center relative overflow-hidden group hover:bg-secondary/5 transition-colors", highlight && "bg-secondary/5")}>
        {highlight && <div className="absolute top-0 left-0 w-full h-1 bg-primary" />}
        <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 md:mb-4">{title}</div>
        <div className="text-2xl md:text-3xl font-serif font-medium text-foreground group-hover:scale-110 transition-transform duration-500">{price}</div>
        <div className="text-[10px] text-muted-foreground mt-2">AED / Month</div>
    </div>
);
