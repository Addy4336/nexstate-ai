import React from 'react';
import Image from 'next/image';

const Hero = () => {
    return (
        <section className="bg-background pt-28 pb-10 md:pt-36 overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-[1280px]">
                {/* Content Top */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-12 md:mb-20">
                    <div className="flex-1 max-w-[650px]">
                        {/* Tag */}
                        <div className="flex items-center gap-2 mb-4 md:mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            <span className="text-[11px] md:text-[13px] font-semibold uppercase tracking-[2px] text-muted-foreground">
                                About Hopo Homes
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-foreground text-[40px] md:text-[56px] lg:text-[64px] leading-[1.1] md:leading-[1.1] font-medium tracking-tight">
                            Smart Living. <br className="hidden md:block" />
                            <span className="text-muted-foreground">Made Simple.</span>
                        </h1>
                    </div>

                    {/* Description Paragraph */}
                    <div className="md:self-center max-w-[480px] md:pt-4">
                        <p className="text-muted-foreground text-[16px] md:text-[17px] leading-[1.6] mb-6">
                            Hopo Homes is a tech-enabled co-living and rental management platform designed for modern urban living. We make it easier for tenants to find well-managed homes and for property owners to unlock better returns — without the usual stress of renting.
                        </p>
                        <p className="text-foreground font-medium text-[16px] md:text-[17px] leading-[1.6]">
                            At Hopo, we believe renting should be simple, transparent, and hassle-free.
                        </p>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-[32px] overflow-hidden bg-muted">
                    <Image
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2600&auto=format&fit=crop"
                        alt="Smart Living at Hopo Homes"
                        fill
                        priority
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
