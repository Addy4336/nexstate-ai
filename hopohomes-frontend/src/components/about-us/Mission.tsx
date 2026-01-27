import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Mission = () => {
    return (
        <section className="bg-background px-4 md:px-6 overflow-hidden">
            <div className="container mx-auto bg-primary/10 py-10 md:py-20 rounded-3xl px-5 md:px-10 max-w-7xl">
                {/* Content Grid */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
                    {/* Left Column - Tag & Image */}
                    <div className="w-full md:w-[25%] flex flex-col shrink-0">
                        {/* Tag */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                                Mission
                            </span>
                        </div>

                        {/* Image */}
                        <div className="relative w-full max-w-[295px] aspect-[4/3] overflow-hidden rounded-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1556912172-45b7abe8d7e1?q=80&w=1000&auto=format&fit=crop"
                                alt="Happy residents using technology"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 220px"
                            />
                        </div>
                    </div>

                    {/* Right Column - Mission Text */}
                    <div className="w-full md:flex-1 md:pt-10">
                        <p className="text-foreground text-[28px] md:text-[32px] lg:text-[40px] leading-[1.3] font-medium tracking-[-0.01em]">
                            We are committed to helping buyers find their dream homes, sellers achieve the best value for their properties, and renters discover spaces that perfectly match their needs.
                        </p>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center mt-10 md:mt-16">
                    <Link
                        href="/team"
                        className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-secondary-foreground text-[14px] font-medium rounded-full hover:opacity-90 transition-opacity duration-300 w-full md:w-auto"
                    >
                        Meet all team
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Mission;

