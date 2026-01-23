import React from 'react';
import Image from 'next/image';

const testimonials = [
    {
        quote: "The process of buying our home was as stress-free as we could have imagined.",
        name: "Janie Stewart",
        location: "Idaho, USA.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=janie",
        variant: "light"
    },
    {
        quote: "We have had two great experiences working with Realty Group, as they sold two of our homes. They were professional, attentive, and patient.",
        name: "Madison Wilson",
        location: "Idaho, USA.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=madison",
        variant: "light"
    },
    {
        quote: "Great experience working with Realty Group, especially as a first time buyer!",
        name: "Rosa Smith",
        location: "Idaho, USA.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rosa",
        variant: "dark"
    }
];

const Testimonials = () => {
    return (
        <section className="bg-background py-20 md:py-28 overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-12 md:mb-16">
                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                            Review
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-medium leading-[1.15] text-foreground mb-6 tracking-[-0.02em]">
                        Real State success <span className="font-serif italic">stories</span>
                    </h2>

                    {/* Description */}
                    <p className="text-muted-foreground text-[15px] md:text-[16px] leading-[1.7] max-w-[600px]">
                        Our goal is to provide clients with an exceptional real estate experience, offering top-tier service every step of the way.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`rounded-[24px] p-8 flex flex-col justify-between min-h-[320px] ${testimonial.variant === 'dark'
                                ? 'bg-secondary/10 text-secondary-foreground'
                                : 'bg-card text-foreground border border-border'
                                }`}
                        >
                            {/* Quote */}
                            <p className={`text-[18px] md:text-[20px] font-medium leading-[1.5] mb-8 ${testimonial.variant === 'dark' ? 'text-secondary-foreground' : 'text-foreground'
                                }`}>
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-[16px] font-medium ${testimonial.variant === 'dark' ? 'text-secondary-foreground' : 'text-foreground'
                                        }`}>
                                        {testimonial.name}
                                    </span>
                                    <span className={`text-[14px] ${testimonial.variant === 'dark' ? 'text-muted' : 'text-muted-foreground'
                                        }`}>
                                        {testimonial.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

