import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const teamMembers = [
    {
        name: "Jonas Bone",
        role: "Sales representative",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b1686b7d-0a11-4bb4-944b-fa2e2afc6783-bienes-temlis-webflow-io/assets/images/677fc42a41448c17b36848eb_darmau-gKEiDaAtK4o-unspla-3.webp",
        slug: "jonas-bone"
    },
    {
        name: "Adam Cole",
        role: "Sales representative",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b1686b7d-0a11-4bb4-944b-fa2e2afc6783-bienes-temlis-webflow-io/assets/images/677fc4281c954f93ecfdd0d3_darmau-gKEiDaAtK4o-unspla-4.webp",
        slug: "adam-cole"
    },
    {
        name: "Robertson",
        role: "Broker and team trainer",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b1686b7d-0a11-4bb4-944b-fa2e2afc6783-bienes-temlis-webflow-io/assets/images/677fc42a41448c17b36848eb_darmau-gKEiDaAtK4o-unspla-3.webp",
        slug: "robertson"
    }
];

const TeamSection = () => {
    return (
        <section className="bg-surface py-20 md:py-28 overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col mb-12 md:mb-16">
                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                            For Sellers
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-medium leading-[1.15] text-foreground mb-6 tracking-[-0.02em]">
                        Agents who go further for <span className="font-serif italic">you</span>
                    </h2>

                    {/* Description */}
                    <p className="text-muted-foreground text-[15px] md:text-[17px] leading-[1.7] max-w-[600px]">
                        Our goal is to provide clients with an exceptional real estate experience, offering top-tier service every step of the way.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="group">
                            {/* Image */}
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>

                            {/* Info Card */}
                            <div className="flex items-center border border-border hover:bg-primary/10 justify-between bg-card rounded-2xl p-4 shadow-sm">
                                <div className="flex flex-col">
                                    <h3 className="text-foreground text-[18px] md:text-[20px] font-medium mb-1">
                                        {member.name}
                                    </h3>
                                    <span className="text-muted-foreground text-[14px]">
                                        {member.role}
                                    </span>
                                </div>

                                {/* Arrow Button */}
                                <Link
                                    href={`/team/${member.slug}`}
                                    className="w-12 h-12 flex items-center justify-center rounded-full border border-border hover:bg-secondary/20 hover:border-foreground hover:text-background transition-all duration-300 group/btn"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-foreground group-hover/btn:text-foreground transition-colors"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;

