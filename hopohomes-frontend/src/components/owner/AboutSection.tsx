'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function AboutSection() {
    return (
        <section className="bg-[#F8F9FB] dark:bg-neutral-950 py-20 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Top Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="space-y-6 max-w-3xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#EEEBFF] text-[#7C3AED] text-sm font-medium">
                            About
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#1A1A1A] dark:text-white leading-[1.1]">
                            Profit Crafted,<br />
                            Goals Achieved
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-4 pb-2">
                        <button className="px-6 py-3 rounded-xl bg-[#8B5CF6] text-white font-medium flex items-center gap-2 hover:bg-[#7c4dff] transition-colors shadow-lg shadow-purple-200 dark:shadow-none">
                            Get Started <ArrowUpRight size={18} />
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-white text-[#1A1A1A] font-medium border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
                            Learn more
                        </button>
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Content (Description usage) */}
                    <div className="flex-1 space-y-10">

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-[#1A1A1A] dark:text-white">Your Growth, Our Business</h3>
                            <p className="text-gray-500 leading-relaxed max-w-md">
                                Empowering your financial journey with tailored solutions that ensure sustainable growth.
                            </p>
                        </div>

                        <div className="flex gap-8 sm:gap-24 pt-8">
                            <div>
                                <div className="text-4xl md:text-6xl font-medium text-[#1A1A1A] dark:text-white flex items-start leading-none tracking-tight">
                                    798
                                    <span className="text-[#8B5CF6] text-2xl md:text-4xl mt-1 font-normal">M+</span>
                                </div>
                                <p className="text-gray-500 text-sm mt-3 ml-1 font-medium">Happy client</p>
                            </div>
                            <div className="pt-12 md:pt-16">
                                <div className="text-4xl md:text-6xl font-medium text-[#1A1A1A] dark:text-white flex items-start leading-none tracking-tight">
                                    99.9
                                    <span className="text-[#8B5CF6] text-2xl md:text-4xl mt-1 font-normal">%</span>
                                </div>
                                <p className="text-gray-500 text-sm mt-3 ml-1 font-medium">Growth Financial</p>
                            </div>
                        </div>

                    </div>

                    {/* Right Image with Custom Shape */}
                    <div className="flex-1 w-full relative">
                        {/* Shape Definition */}
                        <svg className="absolute w-0 h-0" aria-hidden="true">
                            <defs>
                                <clipPath id="about-mask-precise" clipPathUnits="objectBoundingBox">
                                    {/* Top Left Cutout */}
                                    <path d="
                                        M 0.08 0 
                                        L 0.92 0 Q 1 0 1 0.08 
                                        L 1 0.55 Q 1 0.65 0.9 0.65
                                        L 0.8 0.65 Q 0.75 0.65 0.75 0.7
                                        L 0.75 0.92 Q 0.75 1 0.67 1
                                        L 0.08 1 Q 0 1 0 0.92
                                        L 0 0.15 Q 0 0.05 0.05 0.02
                                        L 0.08 0
                                        Z
                                    " />
                                </clipPath>
                            </defs>
                        </svg>

                        <div className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3]">
                            {/* Main Image with Clip Path */}
                            <div className="absolute inset-0 z-10 w-full h-full">
                                <div
                                    className="w-full h-full relative overflow-hidden bg-purple-100"
                                    style={{
                                        clipPath: 'url(#about-mask-precise)',
                                        WebkitClipPath: 'url(#about-mask-precise)',
                                    }}
                                >
                                    <Image
                                        src="/hero-spiral.png"
                                        alt="Growth Chart"
                                        fill
                                        className="object-cover scale-110"
                                    />
                                    {/* Purple Overlay to match the aesthetic */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/40 to-transparent mix-blend-multiply"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
