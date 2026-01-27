import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const WorkWithUs = () => {
    return (
        <section className="bg-background py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-7xl">
                <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row">
                    {/* Left - Image */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop"
                                alt="Property owner analyzing ROI on tablet"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Right - Content Card */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center bg-secondary/20 rounded-3xl px-6 md:px-12 lg:px-16">
                        <div className="max-w-[480px] text-center">
                            {/* Tag */}
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                                    Work With Us
                                </span>
                            </div>

                            {/* Heading */}
                            <h2 className="text-[30px] md:text-[36px] lg:text-[40px] font-medium leading-[1.2] text-foreground mb-6 tracking-[-0.02em]">
                                Smart Management, <span className="font-serif italic">Higher Returns</span>
                            </h2>

                            {/* Description */}
                            <p className="text-muted-foreground text-[14px] md:text-[15px] leading-[1.7] mb-2">
                                Forget "old data" and quarterly reports. Our AI Calculator gives property owners live market insights and real-time ROI tracking.<br /><br />
                                Live Accuracy: See exactly how your property performs right now.<br />
                                24/7 Management: Our AI never takes a sick day, ensuring your asset is always working for you.<br />
                                Maximized Yields: AI-driven pricing ensures you never lose money on an empty unit.
                            </p>

                            {/* CTA Button */}
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center px-4 py-2 bg-secondary text-secondary-foreground text-[14px] font-medium rounded-full hover:opacity-90 transition-opacity duration-300"
                            >
                                Let&apos;s talk
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkWithUs;


