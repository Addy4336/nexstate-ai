'use client';

import { ArrowRight } from 'lucide-react';

export default function FooterSection() {
    return (
        <section className="bg-muted/30 dark:bg-neutral-950 py-8 md:py-12 px-4 sm:px-6 md:px-12 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto bg-foreground text-background rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 md:p-16 relative overflow-hidden">

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">

                    {/* Left Column: CTA & Brand */}
                    <div className="space-y-10 md:space-y-12">
                        <div className="space-y-8">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-background">
                                Ready to Transform <br />
                                Your Finances?
                            </h2>

                            {/* Input Group */}
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md w-full">
                                <div className="flex-grow bg-background/10 rounded-2xl px-6 py-4 flex items-center">
                                    <input
                                        type="email"
                                        placeholder="Enter your email here"
                                        className="bg-transparent border-none outline-none text-background/80 placeholder-background/50 w-full text-sm"
                                    />
                                </div>
                                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-medium transition-colors whitespace-nowrap shadow-lg shadow-primary/20 w-full sm:w-auto">
                                    Contact us
                                </button>
                            </div>
                        </div>

                        {/* Brand Logo Area */}
                        <div className="pt-8 lg:pt-24">
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-background">HopoHomes</h3>
                        </div>
                    </div>

                    {/* Right Column: Navigation & Info */}
                    <div className="flex flex-col justify-between gap-10 md:gap-12">

                        {/* Top Navigation */}
                        <nav className="flex flex-wrap gap-x-8 gap-y-4 md:gap-12 text-background/70 text-sm md:text-base font-medium">
                            <a href="#" className="hover:text-background transition-colors">About.</a>
                            <a href="#" className="hover:text-background transition-colors">Testimonials.</a>
                            <a href="#" className="hover:text-background transition-colors">Pricing.</a>
                            <a href="#" className="hover:text-background transition-colors">Contacts.</a>
                        </nav>

                        {/* Info Sections Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">

                            {/* Contact Us */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-background">Contact Us</h4>
                                <div className="space-y-2 text-background/60 text-sm">
                                    <p>+1 (999) 888-77-66</p>
                                    <p>hello@hopohomes.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-10 sm:gap-12 mt-auto">
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-background">Location</h4>
                                <div className="space-y-2 text-background/60 text-sm max-w-xs">
                                    <p>483920, Moscow,</p>
                                    <p>Myasnitskaya 22/2/5, Office 4</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-left sm:text-right">
                                <h4 className="text-lg font-medium text-background">Languages</h4>
                                <div className="flex gap-4 text-background/60 text-sm font-medium">
                                    <span className="text-background">En</span>
                                    <span className="hover:text-background cursor-pointer transition-colors">Es</span>
                                    <span className="hover:text-background cursor-pointer transition-colors">Fr</span>
                                    <span className="hover:text-background cursor-pointer transition-colors">De</span>
                                    <span className="hover:text-background cursor-pointer transition-colors">Ru</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
