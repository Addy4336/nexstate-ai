import React from 'react';
import Image from 'next/image';

const AboutStatistics = () => {
    return (
        <section className="bg-surface py-[120px] overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-[1280px]">
                {/* Header Section - Stacked Layout */}
                <div className="flex flex-col mb-6">
                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                            About Us
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-medium leading-[1.15] text-foreground mb-4 tracking-[-0.02em]">
                        Leading the market with a client first focus
                    </h2>

                    {/* Description */}
                    <p className="text-muted-foreground text-[15px] md:text-[17px] leading-[1.7] max-w-[800px]">
                        At Real State we specialize in connecting buyers, sellers, and renters with exceptional properties. With years of expertise and a customer-first approach, we make real estate simple and stress-free.
                    </p>
                </div>

                {/* Statistics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 border-t border-border pt-6">
                    <div className="flex flex-col">
                        <span className="text-[40px] md:text-[56px] font-medium leading-[1.1] text-foreground mb-2 tracking-[-0.02em]">300+</span>
                        <span className="text-muted-foreground text-[14px] md:text-[15px]">Families served</span>
                    </div>
                    <div className="flex flex-col md:items-center">
                        <span className="text-[40px] md:text-[56px] font-medium leading-[1.1] text-foreground mb-2 tracking-[-0.02em]">100M+</span>
                        <span className="text-muted-foreground text-[14px] md:text-[15px]">Closed sales</span>
                    </div>
                    <div className="flex flex-col md:items-end">
                        <span className="text-[40px] md:text-[56px] font-medium leading-[1.1] text-foreground mb-2 tracking-[-0.02em]">600+</span>
                        <span className="text-muted-foreground text-[14px] md:text-[15px]">Homes Sold</span>
                    </div>
                </div>

                {/* Visual Images Split */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Left Large Image */}
                    <div className="w-full md:w-[75%]">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b1686b7d-0a11-4bb4-944b-fa2e2afc6783-bienes-temlis-webflow-io/assets/images/677fc42a41448c17b36848eb_darmau-gKEiDaAtK4o-unspla-3.webp"
                                alt="Real estate agents professional portrait"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 65vw"
                            />
                        </div>
                    </div>
                    {/* Right Small Image - Positioned at top with space below */}
                    <div className="w-full md:w-[25%]">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b1686b7d-0a11-4bb4-944b-fa2e2afc6783-bienes-temlis-webflow-io/assets/images/677fc4281c954f93ecfdd0d3_darmau-gKEiDaAtK4o-unspla-4.webp"
                                alt="Professional real estate team"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 35vw"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutStatistics;
