'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const steps = [
    {
        id: "01",
        category: "Submit Property",
        title: <>Submit Property <br /> Detail</>,
        description: "List your property and get it inspected by our team members to understand its potential.",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "02",
        category: "Agreement",
        title: <>Signing <br /> Agreement</>,
        description: "Sign contract for long term and let HOPO Homes take over the responsibility for your property.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "03",
        category: "Returns",
        title: <>Hassle-Free <br /> Higher Returns</>,
        description: "Get- Set - Go to get best rental returns in market from your properties with our expert management.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop"
    }
];

export default function ProcessSection() {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
    };

    const handlePrev = () => {
        setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
    };

    const activeStep = steps[currentStep];
    const nextStepIndex = (currentStep + 1) % steps.length;
    const nextStep = steps[nextStepIndex];

    return (
        <section className="bg-muted/30 dark:bg-neutral-950 py-12 md:py-20 px-4 sm:px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.1] max-w-xl">
                        How HOPO Homes works?
                    </h2>

                    <div className="flex flex-col items-start lg:items-end space-y-4 md:space-y-6 max-w-sm">
                        <span className="inline-block px-5 py-2 rounded-full bg-secondary border border-border shadow-sm text-secondary-foreground text-sm font-medium">
                            3 Simple Steps
                        </span>
                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed lg:text-right">
                            Get high income from rent in few steps
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center">

                    {/* Step Indicator & Navigation (Left) */}
                    <div className="md:col-span-2 lg:col-span-2 flex flex-row lg:flex-col justify-between items-center lg:items-start h-auto lg:h-[400px] py-4 w-full order-1">
                        <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-background border border-border shadow-sm text-primary text-xs sm:text-sm font-medium">
                            Step {activeStep.id}
                        </span>

                        <div className="flex gap-3 sm:gap-4">
                            <button
                                onClick={handlePrev}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-primary/30 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border text-muted-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Active Step Cards (Middle) */}
                    <div className="md:col-span-2 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center order-2 lg:order-2">

                        {/* Visual Card - Shifted Up on Desktop */}
                        <div key={activeStep.id + "-visual"} className="bg-background rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 shadow-xl shadow-black/5 dark:shadow-white/5 min-h-[320px] sm:min-h-[380px] md:min-h-[420px] h-auto flex flex-col md:-translate-y-12 transition-all duration-500 ease-in-out">
                            <div className="relative w-full h-40 sm:h-48 md:h-56 rounded-tl-[40px] md:rounded-tl-[50px] rounded-br-[40px] md:rounded-br-[50px] rounded-tr-[15px] rounded-bl-[15px] overflow-hidden mb-4 md:mb-6 bg-primary/10 flex-shrink-0">
                                <Image
                                    src={activeStep.image}
                                    alt={activeStep.category}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="px-1 sm:px-2 md:px-4 pb-0 md:pb-6 mt-auto">
                                <p className="text-primary font-medium mb-1 md:mb-2 text-sm sm:text-base">{activeStep.category}</p>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground leading-tight">
                                    {activeStep.title}
                                </h3>
                            </div>
                        </div>

                        {/* Description Card - Shifted Down on Desktop */}
                        <div key={activeStep.id + "-desc"} className="bg-background rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-6 md:p-10 shadow-xl shadow-black/5 dark:shadow-white/5 min-h-[auto] sm:min-h-[350px] md:min-h-[420px] h-auto flex flex-col justify-center md:translate-y-12 transition-all duration-500 ease-in-out">
                            <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed mb-6 md:mb-10">
                                {activeStep.description}
                            </p>
                            <button className="bg-primary hover:bg-primary/90 text-white px-5 sm:px-6 md:px-8 py-3.5 md:py-4 rounded-2xl font-medium transition-colors inline-flex items-center gap-2 w-fit shadow-lg shadow-primary/25 text-sm md:text-base">
                                List Your Property
                                <ArrowUpRight size={18} className="sm:w-5 sm:h-5" />
                            </button>
                        </div>

                    </div>

                    {/* Next Step Preview (Right) */}
                    <div className="md:col-span-2 lg:col-span-3 flex flex-row lg:flex-col justify-between lg:justify-end items-center lg:items-end space-y-0 lg:space-y-8 pl-0 lg:pl-8 h-auto lg:h-[350px] pt-6 sm:pt-8 lg:pt-0 border-t lg:border-t-0 border-border/50 lg:border-none order-3 lg:order-3">
                        <div className="space-y-1 md:space-y-4 text-left lg:text-right">
                            <p className="text-primary font-medium text-sm sm:text-base">Step {nextStep.id}</p>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-foreground/80 leading-tight max-w-[200px]">
                                {nextStep.title}
                            </h3>
                        </div>

                        <button
                            onClick={handleNext}
                            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-background border border-border shadow-sm text-primary font-medium hover:bg-primary hover:text-white transition-colors w-fit text-sm md:text-base"
                        >
                            Next
                            <ArrowRight size={16} />
                        </button>
                    </div>

                </div>

            </div>
        </section>
    );
}
