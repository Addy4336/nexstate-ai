import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const WorkWithUs = () => {
    return (
        <section className="bg-background py-10 md:py-16 overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-7xl">
                <div className="flex flex-col gap-3 lg:flex-row">
                    {/* Left - Image */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative aspect-[4/3] lg:aspect-[4/3] min-h-[350px] lg:min-h-[430px] rounded-3xl overflow-hidden">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b1686b7d-0a11-4bb4-944b-fa2e2afc6783-bienes-temlis-webflow-io/assets/images/677fc4281c954f93ecfdd0d3_darmau-gKEiDaAtK4o-unspla-4.webp"
                                alt="Professional real estate team"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Right - Content Card */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center bg-secondary/20 rounded-3xl px-8 md:px-12 lg:px-16 py-12 lg:py-16">
                        <div className="max-w-[480px] text-center">
                            {/* Tag */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                                    Work With Us
                                </span>
                            </div>

                            {/* Heading */}
                            <h2 className="text-[26px] md:text-[32px] lg:text-[40px] font-medium leading-[1.2] text-foreground mb-6 tracking-[-0.02em]">
                                Driven by experience, committed to <span className="font-serif italic">excellence</span>
                            </h2>

                            {/* Description */}
                            <p className="text-muted-foreground text-[14px] md:text-[15px] leading-[1.7] mb-8">
                                Our goal each day is to provide the level of outstanding service we once wished we&apos;d found.
                            </p>

                            {/* CTA Button */}
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-secondary-foreground text-[14px] font-medium rounded-full hover:opacity-90 transition-opacity duration-300"
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


