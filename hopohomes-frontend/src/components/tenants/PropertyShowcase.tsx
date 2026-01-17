'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, ArrowRight, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { NumberTicker } from '@/components/ui/number-ticker';

const PROPERTY_SLIDES = [
    {
        images: [
            "https://images.unsplash.com/photo-1726533765829-67f0313ab064?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=60"
        ],
        middleCard: {
            title: "Big things can\nhappen in small\nspaces.",
            description: "With thoughtful design and smart organization, you can maximize every inch, making room for creativity",
            footerText: "Whether it's creating a cozy corner for relaxation or transforming a small area into a workspace"
        },
        rightCard: {
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80",
            price: "$256K"
        }
    },
    {
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop&q=60"
        ],
        middleCard: {
            title: "Luxury meets\ncomfort in every\ncorner.",
            description: "Experience the perfect blend of elegance and functionality in our carefully curated properties",
            footerText: "From stunning architectural details to premium amenities that elevate everyday living"
        },
        rightCard: {
            image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=80",
            price: "$385K"
        }
    },
    {
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop&q=60"
        ],
        middleCard: {
            title: "Your dream home\nawaits just around\nthe corner.",
            description: "Discover properties that match your lifestyle and exceed your expectations in every way",
            footerText: "Let us guide you to the perfect space where memories are made and dreams come true"
        },
        rightCard: {
            image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&auto=format&fit=crop&q=60",
            price: "$420K"
        }
    }
];

export default function PropertyShowcase() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const currentData = PROPERTY_SLIDES[currentSlide];
    const activeImage = currentData.images[activeImageIndex];

    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide === PROPERTY_SLIDES.length - 1;

    const handlePrevious = () => {
        if (!isFirstSlide) {
            setCurrentSlide(prev => prev - 1);
            setActiveImageIndex(0);
        }
    };

    const handleNext = () => {
        if (!isLastSlide) {
            setCurrentSlide(prev => prev + 1);
            setActiveImageIndex(0);
        }
    };

    return (
        <section className="py-20 lg:py-28 bg-background px-6 lg:px-8">
            <div className="max-w-350 mx-auto">

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6 lg:gap-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground max-w-3xl leading-[1.1]">
                        Your primary home might begin to feel left out.
                    </h2>
                    <div className="flex items-center  gap-3 sm:gap-4">
                        {/* <div className="relative w-28 h-14 sm:w-30 sm:h-16 rounded-full overflow-hidden flex-shrink-0 cursor-pointer hover:scale-105 transition-transform shadow-md">
                            <Image
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format"
                                alt="Video Thumbnail"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center pl-0.5 shadow-sm">
                                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-foreground fill-current" />
                                </div>
                            </div>
                        </div> */}
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-[200px] sm:max-w-[250px] leading-relaxed">
                            Each listing offers unique features, exceptional quality, and prime locations
                        </p>
                    </div>
                </div>

                {/* 3-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-16 items-stretch lg:min-h-[300px]">

                    {/* Left Column - Large Image (50%) */}
                    <div className="md:col-span-2 lg:col-span-6 relative h-[300px] lg:h-full rounded-[2.5rem] overflow-hidden group">
                        <Image
                            src={activeImage}
                            alt="Luxury Home"
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                        />
                        {/* Floating Thumbnails */}
                        <div className="absolute bottom-6 right-6 bg-background/90 backdrop-blur-md p-1.5 rounded-full flex items-center shadow-lg transform transition-transform hover:scale-105 z-10">
                            <div className="flex gap-2 px-1">
                                {currentData.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 ${activeImageIndex === idx
                                                ? 'border-primary scale-105 ring-2 ring-primary/20'
                                                : 'border-background hover:scale-105'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            fill
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column (25%) */}
                    <div className="lg:col-span-3 flex flex-col gap-6 h-full min-h-75 lg:min-h-full">
                        {/* Text Card */}
                        <div className="flex-1 bg-secondary/10 rounded-[2.5rem] p-4 flex flex-col justify-center items-center text-center border border-border/10">
                            <h3 className="text-3xl font-medium text-foreground mb-6 leading-tight ">
                                {currentData.middleCard.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4 sm:mb-8 max-w-60">
                                {currentData.middleCard.description}
                            </p>
                            <button className="px-8 py-3 rounded-full border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors shadow-sm">
                                Details
                            </button>
                        </div>
                        {/* Footer Text aligned under Middle Col */}
                        <div className="flex-1 max-h-[3.5rem] flex items-end">
                            <p className="text-sm text-muted-foreground leading-relaxed px-2 pb-2">
                                {currentData.middleCard.footerText}
                            </p>
                        </div>
                    </div>

                    {/* Right Column (25%) */}
                    <div className="lg:col-span-3 flex flex-col gap-6 h-full min-h-[300px] lg:min-h-full justify-between">
                        {/* Top Content: Image + Pricing */}
                        <div className="flex-1 flex flex-col gap-3 p-2 bg-foreground/5 rounded-[2.5rem]">
                            {/* Square Image - Constrained width */}
                            <div className="relative aspect-square w-full mb-2 rounded-[2rem] overflow-hidden group px-3">
                                <Image
                                    src={currentData.rightCard.image}
                                    alt="Modern Property"
                                    fill
                                    className="object-cover rounded-[1.5rem] transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Pricing & Button */}
                            <div className="text-center flex flex-col items-center gap-2 pb-1">
                                <p className="text-lg font-medium text-foreground">Pricing Start at {currentData.rightCard.price}</p>
                                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-xs font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-md group">
                                    Explore Properties <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Bottom Content: Arrows */}
                        <div className="flex gap-3 justify-center lg:justify-end px-2 pb-2 min-h-14 items-end">
                            <button 
                                onClick={handlePrevious}
                                disabled={isFirstSlide}
                                className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-colors bg-background ${
                                    isFirstSlide 
                                        ? 'opacity-40 cursor-not-allowed' 
                                        : 'hover:bg-muted cursor-pointer'
                                }`}
                            >
                                <ArrowLeft className="w-5 h-5 text-foreground" />
                            </button>
                            <button 
                                onClick={handleNext}
                                disabled={isLastSlide}
                                className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-colors bg-background ${
                                    isLastSlide 
                                        ? 'opacity-40 cursor-not-allowed' 
                                        : 'hover:bg-muted cursor-pointer'
                                }`}
                            >
                                <ArrowRight className="w-5 h-5 text-foreground" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Stats Section */}
                <div className="bg-muted/30 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14">
                    <div className="flex flex-wrap lg:flex-nowrap justify-between gap-y-8">
                        {[
                            { value: 100, suffix: "%", label: "Satisfactions Clients" },
                            { value: 500, suffix: "+", label: "Property sells" },
                            { value: 150, suffix: "+", label: "Countries & Cities" },
                            { value: 200, suffix: "+", label: "Positive reviews" }
                        ].map((stat, idx) => (
                            <div key={idx} className="flex items-center w-1/2 lg:w-auto">
                                {idx !== 0 && (
                                    <Separator orientation="vertical" className="h-16 sm:h-20 lg:h-24 mr-4 sm:mr-6 lg:mr-10 hidden lg:block" />
                                )}
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-foreground tracking-tight">
                                        <NumberTicker value={stat.value} />{stat.suffix}
                                    </h4>
                                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
