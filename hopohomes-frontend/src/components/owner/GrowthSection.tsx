'use client';

import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';

export default function GrowthSection() {
    return (
        <section className="bg-muted/30 dark:bg-neutral-950 py-12 md:py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Centered Heading */}
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.2]">
                        Crafting Financial Strategies for<br className="hidden md:block" />
                        Your Business Success
                    </h2>
                </div>

                {/* Video/Image Container */}
                <div className="w-full relative aspect-video md:aspect-[2.4/1] rounded-2xl md:rounded-[2rem] overflow-hidden group cursor-pointer">
                    {/* Background Image */}
                    <Image
                        src="/hero-spiral.png"
                        alt="Financial Strategies Video"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center border border-white/10 relative">
                            {/* Inner solid circle */}
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-foreground flex items-center justify-center pl-1 shadow-2xl">
                                <Play fill="white" className="text-white w-5 h-5 md:w-7 md:h-7" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Content Row */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-4">

                    {/* Left Description */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 max-w-2xl">
                        <span className="text-primary font-medium text-lg whitespace-nowrap pt-1">
                            Growth
                        </span>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            We design financial solutions tailored to your goals, helping your business thrive.
                        </p>
                    </div>

                    {/* Right Buttons */}
                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        <button className="flex-1 sm:flex-none justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 dark:shadow-none whitespace-nowrap">
                            Get Started <ArrowUpRight size={18} />
                        </button>
                        <button className="flex-1 sm:flex-none justify-center px-6 py-3 rounded-xl bg-background text-foreground font-medium border border-border shadow-sm hover:bg-muted transition-colors whitespace-nowrap">
                            Learn more
                        </button>
                    </div>

                </div>

                {/* Additional Partner & Services Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pt-12 md:pt-20 border-t border-border mt-12">

                    {/* Column 1: Service List (Span 5) */}
                    <div className="lg:col-span-5 flex flex-col justify-center space-y-8 order-2 lg:order-1">

                        {/* Item 1 */}
                        <div className="group cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-medium text-foreground">Tax Advisory & Compliance</h3>
                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                                    <ArrowUpRight size={18} />
                                </div>
                            </div>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                Minimize tax liabilities while staying compliant
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-border"></div>

                        {/* Item 2 */}
                        <div className="group cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-medium text-foreground">Risk Assessment & Management</h3>
                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                                    <ArrowUpRight size={18} />
                                </div>
                            </div>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                Identify, analyze, and mitigate potential risks to your business.
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Image with custom shape (Span 4) */}
                    <div className="lg:col-span-4 relative flex justify-center order-1 lg:order-2">
                        {/* SVG Clip Path */}
                        <svg className="absolute w-0 h-0" aria-hidden="true">
                            <defs>
                                <clipPath id="center-image-mask" clipPathUnits="objectBoundingBox">
                                    {/* 
                                        Shape: Rounded Rect with Bottom-Left cutout.
                                    */}
                                    <path d="
                                        M 0 0.15 
                                        Q 0 0 0.15 0 
                                        L 0.85 0 
                                        Q 1 0 1 0.15 
                                        L 1 0.85 
                                        Q 1 1 0.85 1 
                                        L 0.25 1 
                                        Q 0.15 1 0.15 0.9
                                        L 0.15 0.85
                                        Q 0.15 0.75 0.05 0.75
                                        L 0 0.75
                                        Z
                                    " />
                                </clipPath>
                            </defs>
                        </svg>

                        <div className="relative w-full aspect-square max-w-md">
                            <div className="absolute inset-0 w-full h-full transform transition-transform hover:scale-[1.02] duration-500">
                                <div
                                    className="w-full h-full relative overflow-hidden bg-primary/10"
                                    style={{
                                        clipPath: 'url(#center-image-mask)',
                                        WebkitClipPath: 'url(#center-image-mask)',
                                    }}
                                >
                                    <Image
                                        src="/hero-spiral.png"
                                        alt="Abstract Shape"
                                        fill
                                        className="object-cover scale-125"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Partner Text (Span 3) */}
                    <div className="lg:col-span-3 flex flex-col justify-center gap-6 lg:pl-4 order-3">
                        <h3 className="text-3xl md:text-5xl font-medium text-foreground leading-tight">
                            Your Partner <br /> in Progress
                        </h3>
                        <div>
                            <span className="inline-block px-5 py-2 rounded-full bg-background border border-border text-primary text-sm font-medium shadow-sm">
                                Growth
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
