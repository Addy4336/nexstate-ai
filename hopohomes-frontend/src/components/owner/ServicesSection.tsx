'use client';

import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Home, Key, Wallet } from 'lucide-react';

export default function ServicesSection() {
    return (
        <section className="bg-background py-12 md:py-16 px-4 sm:px-6 md:px-12 relative z-10">
            <div className="max-w-7xl mx-auto">

                {/* SVG Clip Path Definition for Card Images */}
                <svg className="absolute w-0 h-0" aria-hidden="true">
                    <defs>
                        <clipPath id="card-mask" clipPathUnits="objectBoundingBox">
                            <path d="M 0 0.28 Q 0.28 0.28 0.28 0 H 0.88 Q 1 0 1 0.12 V 0.72 Q 0.72 0.72 0.72 1 H 0.12 Q 0 1 0 0.88 Z" />
                        </clipPath>
                    </defs>
                </svg>

                {/* Main Card Container */}
                <div className="bg-secondary/50 dark:bg-card rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 lg:p-14 relative text-foreground overflow-visible border border-border/50">

                    {/* Top Circular Button with Arrow */}
                    <div className="absolute -top-10 md:-top-14 left-1/2 -translate-x-1/2">
                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-background flex items-center justify-center p-1.5 shadow-xl">
                            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                <ArrowDown size={30} className="md:w-10 md:h-10" />
                            </div>
                        </div>
                    </div>

                    {/* Header Content */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-6 md:gap-8 mb-10 md:mb-14 pt-8 md:pt-6">
                        <div className="max-w-xl space-y-4">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium border border-primary/20">
                                Our Services
                            </span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-tight text-foreground">
                                Expert Property<br />
                                Management Solutions
                            </h2>
                        </div>

                        <p className="text-muted-foreground max-w-xs text-left lg:text-right hidden lg:block self-end leading-relaxed text-sm md:text-base">
                            From Palm Jumeirah to Downtown Dubai, we manage exceptional properties with excellence and care.
                        </p>
                    </div>

                    {/* Cards Grid - Responsive: 1 col on mobile/tablet, 3 cols on desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-end">

                        {/* Card 1: Property Listing */}
                        <div className="bg-card rounded-2xl p-4 flex flex-col gap-4 group cursor-pointer transition-transform hover:-translate-y-1 duration-300 w-full h-full shadow-sm border border-border">
                            {/* Image Container */}
                            <div className="relative aspect-square w-full">

                                {/* Icon Top Left */}
                                <div className="absolute top-0 left-0 z-20 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border border-white/10 rounded-[1rem] md:rounded-[1.2rem] text-primary-foreground bg-primary/90 backdrop-blur-sm">
                                    <Home size={20} strokeWidth={1.5} className="md:w-[22px] md:h-[22px]" />
                                </div>

                                {/* Main Image with Clip Path */}
                                <div className="absolute inset-0 z-10 w-full h-full">
                                    <div
                                        className="w-full h-full relative transition-all duration-500 overflow-hidden"
                                        style={{
                                            clipPath: 'url(#card-mask)',
                                            WebkitClipPath: 'url(#card-mask)',
                                        }}
                                    >
                                        <Image
                                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop"
                                            alt="Property Listing"
                                            fill
                                            className="object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
                                    </div>
                                </div>

                                {/* Button Bottom Right */}
                                <div className="absolute bottom-0 right-0 z-20 w-14 h-14 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.2rem] bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:bg-primary/90 transition-colors">
                                    <ArrowUpRight size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />
                                </div>
                            </div>

                            <h3 className="text-lg md:text-xl font-medium text-card-foreground px-2 pb-2">Property Listing <br /> & Marketing</h3>
                        </div>

                        {/* Card 2: Tenant Management (Center) */}
                        <div className="bg-card rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center text-center space-y-6 hover:bg-muted/50 transition-colors duration-300 w-full h-full lg:h-auto shadow-sm border border-border min-h-[280px]">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Key size={20} className="text-primary md:w-6 md:h-6" />
                            </div>

                            <h3 className="text-lg md:text-xl font-medium text-card-foreground leading-tight">
                                Tenant Screening <br /> & Management
                            </h3>

                            <button className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors text-sm shadow-md">
                                Get Started <ArrowUpRight size={16} />
                            </button>

                            <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">
                                Quality tenant screening ensuring the best occupants for your Dubai property.
                            </p>
                        </div>

                        {/* Card 3: Rent Collection */}
                        <div className="bg-card rounded-2xl p-4 flex flex-col gap-4 group cursor-pointer transition-transform hover:-translate-y-1 duration-300 w-full h-full shadow-sm border border-border">
                            {/* Image Container */}
                            <div className="relative aspect-square w-full">
                                {/* Icon Top Left */}
                                <div className="absolute top-0 left-0 z-20 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border border-white/10 rounded-[1rem] md:rounded-[1.2rem] text-primary-foreground bg-primary/90 backdrop-blur-sm">
                                    <Wallet size={20} strokeWidth={1.5} className="md:w-[22px] md:h-[22px]" />
                                </div>

                                {/* Main Image with Clip Path */}
                                <div className="absolute inset-0 z-10 w-full h-full">
                                    <div
                                        className="w-full h-full relative transition-all duration-500 overflow-hidden"
                                        style={{
                                            clipPath: 'url(#card-mask)',
                                            WebkitClipPath: 'url(#card-mask)',
                                        }}
                                    >
                                        <Image
                                            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop"
                                            alt="Rent Collection"
                                            fill
                                            className="object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
                                    </div>
                                </div>

                                {/* Button Bottom Right */}
                                <div className="absolute bottom-0 right-0 z-20 w-14 h-14 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.2rem] bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:bg-primary/90 transition-colors">
                                    <ArrowUpRight size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />
                                </div>
                            </div>
                            <h3 className="text-lg md:text-xl font-medium text-card-foreground px-2 pb-2">Rent Collection <br /> & Reporting</h3>
                        </div>

                    </div>

                </div>

                {/* Partner Logos Section */}
                <div className="mt-12 md:mt-20 flex flex-wrap justify-center md:justify-between items-center gap-x-8 gap-y-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 px-4">
                    <span className="text-base md:text-xl font-semibold text-muted-foreground tracking-wide">Emaar</span>
                    <span className="text-base md:text-xl font-semibold text-muted-foreground tracking-wide">DAMAC</span>
                    <span className="text-base md:text-xl font-semibold text-muted-foreground tracking-wide">Nakheel</span>
                    <span className="text-base md:text-xl font-semibold text-muted-foreground tracking-wide">Meraas</span>
                    <span className="text-base md:text-xl font-semibold text-muted-foreground tracking-wide">Dubai Properties</span>
                </div>

            </div>
        </section>
    );
}
