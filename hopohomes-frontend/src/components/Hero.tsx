'use client';

import Image from 'next/image';
import { ArrowUpRight, Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-white dark:bg-neutral-950 pt-6 pb-12 lg:pt-10 lg:pb-20 px-6">

            {/* SVG Clip Path Definition - Refined for smoother curves */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
                        <path d="M 0.08 0 L 0.72 0 Q 0.77 0 0.77 0.05 L 0.77 0.15 Q 0.77 0.20 0.82 0.20 L 0.93 0.20 Q 0.98 0.20 0.98 0.25 L 0.98 0.62 Q 0.98 0.67 0.93 0.67 L 0.82 0.67 Q 0.77 0.67 0.77 0.72 L 0.77 0.92 Q 0.77 0.97 0.72 0.97 L 0.08 0.97 Q 0.03 0.97 0.03 0.92 L 0.03 0.05 Q 0.03 0 0.08 0 Z" />
                    </clipPath>
                </defs>
            </svg>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                {/* Left Content */}
                <div className="flex flex-col gap-6 lg:gap-8 max-w-2xl relative z-10 mx-auto lg:mx-0 text-center lg:text-left">
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight text-gray-900 dark:text-white">
                            <span className="text-[#8B5CF6]">Unlocking</span> Potential, <br />
                            Maximizing Profit.
                        </h1>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                            <span className="px-4 py-1.5 rounded-full bg-purple-50 text-[#8B5CF6] text-sm font-medium border border-purple-100">Business</span>
                            <span className="px-4 py-1.5 rounded-full bg-purple-50 text-[#8B5CF6] text-sm font-medium border border-purple-100">Finance</span>
                            <span className="px-4 py-1.5 rounded-full bg-[#8B5CF6] text-white text-sm font-medium flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
                                Growth
                            </span>
                        </div>

                        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed pt-2 mx-auto lg:mx-0">
                            Strategic financial services designed to maximize your business's earning potential.
                        </p>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-6 pt-2">
                        <button className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                            Get Started
                        </button>
                        <button className="text-gray-900 font-medium underline decoration-1 underline-offset-4 hover:text-gray-600 dark:text-gray-200">
                            How it works
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between max-w-md pt-8 border-t border-gray-100 dark:border-gray-800 mt-4 mx-auto lg:mx-0 gap-6 sm:gap-0 lg:mr-10">
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-sm text-gray-500 font-medium mb-1">Trusted by_</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900 dark:text-white">320</span>
                                <span className="text-4xl font-bold text-[#8B5CF6]">K+</span>
                            </div>
                            <span className="text-sm text-gray-500">Happy customers</span>
                        </div>

                        <div className="flex flex-col gap-2 items-center sm:items-start">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">5.0</span>
                                <div className="flex gap-0.5 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>
                            </div>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                                        <Image
                                            src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 40}.jpg`}
                                            alt="User"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#8B5CF6] flex items-center justify-center text-white z-10">
                                    <Plus size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="relative h-[450px] sm:h-[550px] lg:h-[650px] w-full flex items-center justify-center perspective-1000">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {/* Custom Clipped Image Container */}
                        <div
                            className="relative w-full h-full bg-purple-50 transition-all duration-500"
                            style={{
                                clipPath: 'url(#hero-clip)',
                                WebkitClipPath: 'url(#hero-clip)',
                            }}
                        >
                            <Image
                                src="/hero-spiral.png"
                                alt="Abstract 3D Shape"
                                fill
                                className="object-cover scale-110"
                                priority
                            />

                            {/* Overlay Text inside the Image */}
                            <div className="absolute bottom-[28%] sm:bottom-[32%] lg:bottom-[35%] left-[8%] lg:left-[10%] text-white z-10 w-full max-w-xs">
                                <h3 className="text-2xl sm:text-3xl font-medium leading-tight mb-2 drop-shadow-md">
                                    Your Partner in <br /> Progress
                                </h3>
                            </div>
                        </div>

                        {/* Floating Action Button */}
                        <div className="absolute bottom-[4%] right-[8%] sm:right-[15%] lg:right-[5%] z-20">
                            <button className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-900 hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                                <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 font-light text-gray-600 group-hover:text-[#8B5CF6] transition-colors" strokeWidth={1.5} />
                            </button>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
