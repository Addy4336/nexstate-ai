'use client';

import Image from 'next/image';
import { ArrowDown, ArrowUpRight, FileText, BarChart3, Star } from 'lucide-react';

export default function ServicesSection() {
    return (
        <section className="bg-white dark:bg-neutral-950 py-12 px-6 md:px-12 relative z-10">
            <div className="max-w-7xl mx-auto">

                {/* SVG Clip Path Definition for Card Images */}
                <svg className="absolute w-0 h-0" aria-hidden="true">
                    <defs>
                        <clipPath id="card-mask" clipPathUnits="objectBoundingBox">
                            <path d="M 0 0.28 Q 0.28 0.28 0.28 0 H 0.88 Q 1 0 1 0.12 V 0.72 Q 0.72 0.72 0.72 1 H 0.12 Q 0 1 0 0.88 Z" />
                        </clipPath>
                    </defs>
                </svg>

                {/* Main Dark Card Container */}
                <div className="bg-[#151515] rounded-[2.5rem] p-8 md:p-12 lg:p-14 relative text-white overflow-visible">

                    {/* Top Circular Button with Arrow */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-1.5">
                            <div className="w-full h-full rounded-full bg-[#8B5CF6] flex items-center justify-center text-white">
                                <ArrowDown size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Header Content */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-14 pt-4">
                        <div className="max-w-xl space-y-4">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-[#8B5CF6] text-white text-sm font-medium">
                                Service
                            </span>
                            <h2 className="text-4xl md:text-5xl font-medium leading-tight">
                                Beyond Budgets,<br />
                                Toward Prosperity
                            </h2>
                        </div>

                        <p className="text-gray-400 max-w-xs text-right hidden lg:block self-end">
                            Innovative financial planning to take your business beyond the balance sheet.
                        </p>
                    </div>

                    {/* Cards Grid - Responsive: 1 col on mobile/tablet, 3 cols on desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-end">

                        {/* Card 1: Financial Planning */}
                        <div className="bg-[#000000] rounded-2xl p-4 flex flex-col gap-4 group cursor-pointer transition-transform hover:-translate-y-1 duration-300 w-full h-full">
                            {/* Image Container */}
                            <div className="relative aspect-square w-full">

                                {/* Icon Top Left */}
                                <div className="absolute top-0 left-0 z-20 w-16 h-16 flex items-center justify-center border border-white/10 rounded-[1.2rem] text-white bg-[#1A1A1A]">
                                    <FileText size={22} strokeWidth={1.5} />
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
                                            src="/hero-spiral.png"
                                            alt="Financial Planning"
                                            fill
                                            className="object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                                        />
                                        {/* Purple Overlay */}
                                        <div className="absolute inset-0 bg-[#8B5CF6]/30 mix-blend-overlay"></div>
                                    </div>
                                </div>

                                {/* Button Bottom Right */}
                                <div className="absolute bottom-0 right-0 z-20 w-16 h-16 rounded-[1.2rem] bg-[#8B5CF6] flex items-center justify-center text-white shadow-lg group-hover:bg-[#7c4dff] transition-colors">
                                    <ArrowUpRight size={24} strokeWidth={1.5} />
                                </div>
                            </div>

                            <h3 className="text-xl font-medium text-white px-2 pb-2">Financial Planning <br /> & Strategy</h3>
                        </div>

                        {/* Card 2: Cash Flow (Center) - Natural height, centered */}
                        <div className="bg-[#000000] rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center text-center space-y-6 hover:bg-[#050505] transition-colors duration-300 w-full h-full lg:h-auto">
                            <h3 className="text-xl font-medium text-white leading-tight">
                                Cash Flow <br /> Management
                            </h3>

                            <button className="w-full py-3 rounded-xl bg-[#8B5CF6] text-white font-medium flex items-center justify-center gap-1 hover:bg-[#7c4dff] transition-colors text-sm whitespace-nowrap">
                                Get Started <ArrowUpRight size={14} />
                            </button>

                            <p className="text-gray-500 text-xs leading-relaxed max-w-[160px]">
                                Optimize cash flow to ensure stability and liquidity.
                            </p>
                        </div>

                        {/* Card 3: Business Valuation */}
                        <div className="bg-[#000000] rounded-2xl p-4 flex flex-col gap-4 group cursor-pointer transition-transform hover:-translate-y-1 duration-300 w-full h-full">
                            {/* Image Container */}
                            <div className="relative aspect-square w-full">
                                {/* Icon Top Left */}
                                <div className="absolute top-0 left-0 z-20 w-16 h-16 flex items-center justify-center border border-white/10 rounded-[1.2rem] text-white bg-[#1A1A1A]">
                                    <BarChart3 size={22} strokeWidth={1.5} />
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
                                            src="/hero-spiral.png"
                                            alt="Business Valuation"
                                            fill
                                            className="object-cover scale-150 translate-x-4 group-hover:scale-125 transition-transform duration-700"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-[#8B5CF6]/20 mix-blend-overlay"></div>
                                    </div>
                                </div>

                                {/* Button Bottom Right */}
                                <div className="absolute bottom-0 right-0 z-20 w-16 h-16 rounded-[1.2rem] bg-[#8B5CF6] flex items-center justify-center text-white shadow-lg group-hover:bg-[#7c4dff] transition-colors">
                                    <ArrowUpRight size={24} strokeWidth={1.5} />
                                </div>
                            </div>
                            <h3 className="text-xl font-medium text-white px-2 pb-2">Business Valuation <br /> Services</h3>
                        </div>

                    </div>

                </div>

                {/* Logos Section */}
                <div className="mt-16 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-2xl font-bold text-gray-300">Niscala.io</span>
                    <span className="text-2xl font-bold text-gray-300">SAMTIV</span>
                    <span className="text-2xl font-bold text-gray-300 flex items-center gap-1"><StarIcon /> IEA.</span>
                    <span className="text-2xl font-bold text-gray-300 flex items-center gap-1"><DiamondIcon /> UNICA</span>
                    <span className="text-2xl font-bold text-gray-300 flex items-center gap-1"><BarIcon /> BOKING</span>
                </div>

            </div>
        </section>
    );
}

// Simple Icon Components for the logos
const StarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
);
const DiamondIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 12l10 10 10-10L12 2z" /></svg>
);
const BarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-6" /></svg>
);
