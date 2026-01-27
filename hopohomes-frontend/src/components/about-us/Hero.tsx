import React from 'react';
import Image from 'next/image';

const Hero = () => {
    return (
        <section className="bg-background pt-24 pb-0 overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-[1280px]">
                {/* Content Top */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-12 md:mb-20">
                    <div className="flex-1 max-w-[600px]">
                        {/* Tag */}
                        <div className="flex items-center gap-2 mb-4 md:mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            <span className="text-[10px] md:text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                                About Us
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-foreground text-[36px] md:text-[48px] lg:text-[56px] leading-[1.1] md:leading-[1.15] font-medium tracking-[-0.02em]">
                            Redefining Rental Living with Artificial Intelligence
                        </h1>
                    </div>

                    {/* Description Paragraph */}
                    <div className="md:self-center max-w-[380px] md:pt-8">
                        <p className="text-muted-foreground text-[15px] md:text-[16px] leading-[1.7]">
                            We don’t just manage homes; we optimize them. HOPO Homes combines advanced AI agents with human expertise to create a seamless, instant, and transparent rental experience for everyone.
                        </p>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1512918760383-eda2723ad6e5?q=80&w=2600&auto=format&fit=crop"
                        alt="Modern luxury apartment with AI integration"
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;

