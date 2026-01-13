'use client';

import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';

export default function GrowthSection() {
    return (
        <section className="bg-[#F8F9FB] dark:bg-neutral-950 py-12 md:py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Centered Heading */}
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-[#1A1A1A] dark:text-white leading-[1.2]">
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
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center pl-1 shadow-2xl">
                                <Play fill="white" className="text-white w-5 h-5 md:w-7 md:h-7" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Content Row */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-4">

                    {/* Left Description */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 max-w-2xl">
                        <span className="text-[#8B5CF6] font-medium text-lg whitespace-nowrap pt-1">
                            Growth
                        </span>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            We design financial solutions tailored to your goals, helping your business thrive.
                        </p>
                    </div>

                    {/* Right Buttons */}
                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        <button className="flex-1 sm:flex-none justify-center px-6 py-3 rounded-xl bg-[#8B5CF6] text-white font-medium flex items-center gap-2 hover:bg-[#7c4dff] transition-colors shadow-lg shadow-purple-200 dark:shadow-none whitespace-nowrap">
                            Get Started <ArrowUpRight size={18} />
                        </button>
                        <button className="flex-1 sm:flex-none justify-center px-6 py-3 rounded-xl bg-white text-[#1A1A1A] font-medium border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
                            Learn more
                        </button>
                    </div>

                </div>

            </div>
        </section>
    );
}
