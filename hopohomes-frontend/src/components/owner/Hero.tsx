'use client';

import Image from 'next/image';
import { ArrowUpRight, Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-background pt-0 pb-12 lg:pt-4 lg:pb-24 px-6 md:px-12">

            {/* SVG Clip Path Definition - Tabbed Shape */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
                        <path d="M 0.05 0 H 0.65 Q 0.7 0 0.7 0.05 V 0.15 Q 0.7 0.2 0.75 0.2 H 0.95 Q 1 0.2 1 0.25 V 0.70 Q 1 0.75 0.95 0.75 H 0.75 Q 0.7 0.75 0.7 0.80 V 0.95 Q 0.7 1 0.65 1 H 0.05 Q 0 1 0 0.95 V 0.05 Q 0 0 0.05 0 Z" />
                    </clipPath>
                </defs>
            </svg>

            <div className="max-w-7xl mx-auto flex flex-col gap-12 lg:gap-16">

                {/* Header Section (Full Width) */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left mt-4 gap-2">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.1] tracking-tight text-foreground">
                        <span className="text-primary">Unlocking</span> Potential,
                    </h1>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 lg:gap-x-8 gap-y-4 w-full">
                        <div className="flex items-center gap-3">
                            <span className="px-5 lg:px-6 py-2 lg:py-2.5 rounded-full bg-primary/10 text-primary text-sm lg:text-base font-medium border border-primary/20">Business</span>
                            <span className="px-5 lg:px-6 py-2 lg:py-2.5 rounded-full bg-primary/10 text-primary text-sm lg:text-base font-medium border border-primary/20">Finance</span>
                            <span className="px-5 lg:px-6 py-2 lg:py-2.5 rounded-full bg-primary text-primary-foreground text-sm lg:text-base font-medium flex items-center gap-2 shadow-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
                                Growth
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.1] tracking-tight text-foreground">
                            Maximizing Profit<span className="text-yellow-400">.</span>
                        </h1>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end">

                    {/* Left Column: Description & CTAs */}
                    <div className="flex flex-col gap-8 lg:pb-8 relative z-10 text-center lg:text-left">
                        <p className="text-xl text-muted-foreground max-w-lg leading-relaxed mx-auto lg:mx-0">
                            Strategic financial services designed to maximize your business's earning potential.
                        </p>

                        <div className="flex items-center justify-center lg:justify-start gap-6">
                            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg hover:shadow-primary/25">
                                Get Started
                            </button>
                            <button className="text-foreground font-medium underline decoration-1 underline-offset-4 hover:text-primary transition-colors">
                                How it works
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between max-w-md pt-8 border-t border-border mt-2 mx-auto lg:mx-0 gap-8 sm:gap-0 lg:mr-10">
                            <div className="flex flex-col items-center sm:items-start">
                                <span className="text-sm text-muted-foreground font-medium mb-1">Trusted by_</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-foreground">320</span>
                                    <span className="text-4xl font-bold text-primary">K+</span>
                                </div>
                                <span className="text-sm text-muted-foreground">Happy customers</span>
                            </div>

                            <div className="flex flex-col gap-2 items-center sm:items-start">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-foreground">5.0</span>
                                    <div className="flex gap-0.5 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill="currentColor" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden relative">
                                            <Image
                                                src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 40}.jpg`}
                                                alt="User"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-primary-foreground z-10">
                                        <Plus size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="relative h-[400px] sm:h-[450px] lg:h-[420px] w-full flex items-center justify-center perspective-1000">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {/* Custom Clipped Image Container */}
                            <div
                                className="relative w-full h-full bg-primary/5 transition-all duration-500"
                                style={{
                                    clipPath: 'url(#hero-clip)',
                                    WebkitClipPath: 'url(#hero-clip)',
                                }}
                            >
                                <Image
                                    src="/hero-spiral.png"
                                    alt="Abstract 3D Shape"
                                    fill
                                    className="object-cover scale-125 translate-x-10"
                                    priority
                                />

                                {/* Overlay Text inside the Image */}
                                <div className="absolute bottom-[28%] sm:bottom-[32%] lg:bottom-[28%] left-[8%] lg:left-[10%] text-white z-10 w-full max-w-xs">
                                    <h3 className="text-2xl sm:text-3xl font-medium leading-tight mb-2 drop-shadow-md">
                                        Your Partner in <br /> Progress
                                    </h3>
                                </div>
                            </div>

                            {/* Floating Action Button - Positioned in the bottom-right cutout */}
                            <div className="absolute bottom-0 right-[2%] z-20">
                                <button className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                                    <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 font-light text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
