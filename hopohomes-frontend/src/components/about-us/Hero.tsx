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
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                                About Us
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-foreground text-[32px] md:text-[48px] lg:text-[56px] leading-[1.15] font-medium tracking-[-0.02em]">
                            A real estate team that takes care of everything{' '}
                            <span className="italic font-serif block">for you</span>
                        </h1>
                    </div>

                    {/* Description Paragraph */}
                    <div className="md:self-center max-w-[380px] md:pt-8">
                        <p className="text-muted-foreground text-[15px] md:text-[16px] leading-[1.7]">
                            We handle every detail of your buying or selling journey, making the process seamless and stress-free
                        </p>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden">
                    <Image
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b1686b7d-0a11-4bb4-944b-fa2e2afc6783-bienes-temlis-webflow-io/assets/images/677faea5299c43b10a63a15b_Frame_201321316125_20_1_-2.webp"
                        alt="Real estate team presenting a modern villa"
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

