"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
        title: "Exploring The Wonders of \n Hiking True Journey",
        description: "An iconic Landmarks, this post unveils of secrets that make the destination a traveler's paradise"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
        title: "Mountain Peaks & \n Hidden Valleys",
        description: "Discover the untouched beauty of the high mountains and specific valleys."
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop",
        title: "Into the Wild: \n Nature's Serenity",
        description: "A journey through dense forests and calm rivers finding peace in nature."
    }
];

export default function BlogHero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full h-[500px] md:h-[600px] lg:h-[750px] overflow-hidden group font-sans bg-background">
            {/* Background Image Carousel */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-black/30 md:bg-black/20" />
                    <div className="absolute inset-x-0 bottom-0 h-3/4 md:h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between px-2 md:px-8 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="p-1 md:p-2 text-white/80 hover:text-white transition-transform hover:scale-110 pointer-events-auto"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" strokeWidth={1.5} />
                </button>

                <button
                    onClick={nextSlide}
                    className="p-1 md:p-2 text-white/80 hover:text-white transition-transform hover:scale-110 pointer-events-auto"
                    aria-label="Next Slide"
                >
                    <ChevronRight className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" strokeWidth={1.5} />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="absolute bottom-0 w-full pb-8 md:pb-16 z-10">
                <div className="container mx-auto px-4 md:px-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-10">

                    {/* Left Section: Title & Details */}
                    <div className="max-w-3xl w-full space-y-4 md:space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                                    {slides[currentSlide].title}
                                </h1>

                                <p className="mt-2 md:mt-4 text-white/90 text-sm md:text-xl font-light max-w-xl leading-relaxed drop-shadow-md line-clamp-2 md:line-clamp-none">
                                    {slides[currentSlide].description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 md:gap-3 pt-1 md:pt-2">
                            <button className="px-4 py-1.5 md:px-5 md:py-1.5 rounded-full border border-white/40 text-xs md:text-sm text-white hover:bg-white hover:text-foreground transition-colors backdrop-blur-sm">
                                Design
                            </button>
                            <button className="px-4 py-1.5 md:px-5 md:py-1.5 rounded-full border border-white/40 text-xs md:text-sm text-white hover:bg-white hover:text-foreground transition-colors backdrop-blur-sm">
                                Design
                            </button>
                        </div>
                    </div>

                    {/* Right Section: Author & Indicators */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-6">
                        {/* Author Info */}
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-white/20">
                                <Image
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    alt="Roger Philips"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col text-white drop-shadow-md">
                                <span className="font-medium text-sm md:text-base">Roger Philips</span>
                                <span className="text-xs md:text-sm text-white/80">5 Aug 2024 • 5 mins</span>
                            </div>
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex items-center gap-2 md:gap-3">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`rounded-full transition-all border border-transparent ${currentSlide === index ? 'w-2 h-2 md:w-2.5 md:h-2.5 bg-white' : 'w-1.5 h-1.5 md:w-2 md:h-2 bg-white/50 hover:bg-white hover:scale-110'}`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
