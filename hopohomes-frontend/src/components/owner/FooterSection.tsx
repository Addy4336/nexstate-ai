'use client';

import { ArrowRight, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function FooterSection() {
    return (
        <div className='px-8 py-12 '>
        <footer className="rounded-[2.5rem] bg-foreground text-white py-10 relative overflow-hidden">
            {/* Huge Fog Effect Background Text */}
            <div className="absolute inset-0 top-72 flex items-center justify-center pointer-events-none overflow-hidden">
                <h1 className="text-[12rem] sm:text-[4rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] font-bold tracking-tighter leading-none text-card/20 select-none whitespace-nowrap scale-y-130">
                    HOPO HOMES
                </h1>
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-foreground/50 to-foreground pointer-events-none" />
            </div>

            <div className="max-w-360 mx-auto px-6 lg:px-8 relative z-10">

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24">

                    {/* Brand & Newsletter (Col 5) */}
                    <div className="lg:col-span-5 flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-3xl font-bold font-sans tracking-tighter">HOPO HOMES.</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed max-w-md font-light">
                                Refining the art of living. We curate exclusive properties for those who seek the exceptional.
                            </p>
                        </div>

                        {/* Minimalist Newsletter */}
                        <div className="flex flex-col gap-6 mt-2">
                            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Newsletter</h4>
                            <div className="flex gap-4 items-center border-b border-zinc-800 pb-4 focus-within:border-white transition-colors duration-500 group max-w-md">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="bg-transparent border-none outline-none text-white placeholder-zinc-600 grow text-lg"
                                />
                                <button className="text-zinc-400 group-hover:text-white transition-colors">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links (Col 7) */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-8">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-6">
                            <h4 className="font-medium text-white text-lg">Real Estate</h4>
                            <div className="flex flex-col gap-4 text-zinc-400 font-light">
                                <Link href="#" className="hover:text-white transition-colors duration-300">Buy Property</Link>
                                <Link href="#" className="hover:text-white transition-colors duration-300">Sell Property</Link>
                                <Link href="#" className="hover:text-white transition-colors duration-300">Rent Property</Link>
                                <Link href="#" className="hover:text-white transition-colors duration-300">New Developments</Link>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-6">
                            <h4 className="font-medium text-white text-lg">Company</h4>
                            <div className="flex flex-col gap-4 text-zinc-400 font-light">
                                <Link href="#" className="hover:text-white transition-colors duration-300">Who We Are</Link>
                                <Link href="#" className="hover:text-white transition-colors duration-300">Our Team</Link>
                                <Link href="#" className="hover:text-white transition-colors duration-300">Careers</Link>
                                <Link href="#" className="hover:text-white transition-colors duration-300">Contact</Link>
                            </div>
                        </div>

                        {/* Column 3 */}
                        <div className="flex flex-col gap-6">
                            <h4 className="font-medium text-white text-lg">Support</h4>
                            <div className="flex flex-col gap-4 text-zinc-400 font-light">
                                <Link href="#" className="hover:text-white transition-colors duration-300">Help Center</Link>
                                <Link href="#" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
                                <Link href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
                                <Link href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className=" border-zinc-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">

                    <p className="text-zinc-600 text-sm">© 2024 HopoHomes Global. All rights reserved.</p>

                    <div className="flex items-center gap-8">
                        <Link href="#" className="text-zinc-500 hover:text-white transition-colors duration-300"><Instagram className="w-5 h-5 stroke-1" /></Link>
                        <Link href="#" className="text-zinc-500 hover:text-white transition-colors duration-300"><Twitter className="w-5 h-5 stroke-1" /></Link>
                        <Link href="#" className="text-zinc-500 hover:text-white transition-colors duration-300"><Linkedin className="w-5 h-5 stroke-1" /></Link>
                        <Link href="#" className="text-zinc-500 hover:text-white transition-colors duration-300"><Facebook className="w-5 h-5 stroke-1" /></Link>
                    </div>
                </div>

            </div>
        </footer>
        </div>
    );
}
