"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function Hero() {
    return (
        <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute w-full h-full object-cover"
                >
                    <source src="/video/bg_video.mp4" type="video/mp4" />
                </video>
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-black/30" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1 pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 md:pb-8">

                {/* Hero Text Section */}
                <div className="flex-1 flex flex-col relative top-4 sm:top-8  justify-center">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                        {['House', 'Apartment', 'Residential'].map((tag) => (
                            <span key={tag} className="bg-background/95 backdrop-blur-sm text-foreground px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-background transition-colors cursor-pointer shadow-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 lg:gap-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.15] sm:leading-[1.1]">
                            Build Your Future, One <br className="hidden xs:block" /> Property at a Time.
                        </h1>

                        <p className="max-w-xs text-white/80 text-xs sm:text-sm leading-relaxed lg:text-right lg:pb-2">
                            Own Your World, One Property at a Time. Own Your World, One Property at a Time. Own Your World, One Property at a Time.
                        </p>
                    </div>
                </div>

                {/* Search Card Section */}
                <div className="bg-background rounded-xl sm:rounded-2xl md:rounded-[2rem] p-4 sm:p-5 md:p-6 shadow-2xl w-full mt-6 sm:mt-8">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6">Find the best place</h2>

                    {/* Search Fields Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-5 md:mb-6">

                        {/* Looking For */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-foreground block">Looking for</label>
                            <Select>
                                <SelectTrigger className="w-full bg-muted border-border rounded-lg sm:rounded-xl h-10 sm:h-11">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="house">House</SelectItem>
                                    <SelectItem value="apartment">Apartment</SelectItem>
                                    <SelectItem value="villa">Villa</SelectItem>
                                    <SelectItem value="penthouse">Penthouse</SelectItem>
                                    <SelectItem value="studio">Studio</SelectItem>
                                    <SelectItem value="townhouse">Townhouse</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-foreground block">Price</label>
                            <Select>
                                <SelectTrigger className="w-full bg-muted border-border rounded-lg sm:rounded-xl h-10 sm:h-11">
                                    <SelectValue placeholder="Select Price" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0-5000">Under AED 5,000</SelectItem>
                                    <SelectItem value="5000-10000">AED 5,000 - 10,000</SelectItem>
                                    <SelectItem value="10000-20000">AED 10,000 - 20,000</SelectItem>
                                    <SelectItem value="20000-50000">AED 20,000 - 50,000</SelectItem>
                                    <SelectItem value="50000+">AED 50,000+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Locations */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-foreground block">Locations</label>
                            <Select>
                                <SelectTrigger className="w-full bg-muted border-border rounded-lg sm:rounded-xl h-10 sm:h-11">
                                    <SelectValue placeholder="Select Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dubai-marina">Dubai Marina</SelectItem>
                                    <SelectItem value="downtown">Downtown Dubai</SelectItem>
                                    <SelectItem value="palm-jumeirah">Palm Jumeirah</SelectItem>
                                    <SelectItem value="jbr">JBR</SelectItem>
                                    <SelectItem value="business-bay">Business Bay</SelectItem>
                                    <SelectItem value="jlt">JLT</SelectItem>
                                    <SelectItem value="dubai-hills">Dubai Hills</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Number of rooms */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-foreground block">Number of rooms</label>
                            <Select>
                                <SelectTrigger className="w-full bg-muted border-border rounded-lg sm:rounded-xl h-10 sm:h-11">
                                    <SelectValue placeholder="Select Bedrooms" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="studio">Studio</SelectItem>
                                    <SelectItem value="1">1 Bedroom</SelectItem>
                                    <SelectItem value="2">2 Bedrooms</SelectItem>
                                    <SelectItem value="3">3 Bedrooms</SelectItem>
                                    <SelectItem value="4">4 Bedrooms</SelectItem>
                                    <SelectItem value="5+">5+ Bedrooms</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>

                    {/* Footer with Filters and Search Button */}
                    <div className="flex justify-between gap-4 pt-3 sm:pt-4 border-t border-border">

                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span className="font-semibold text-foreground text-xs sm:text-sm mr-0.5 sm:mr-1">Filter:</span>
                            <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-[10px] sm:text-xs font-medium transition-colors">City</button>
                            <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-background border border-border hover:bg-muted text-muted-foreground text-[10px] sm:text-xs font-medium transition-colors">House</button>
                            <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-background border border-border hover:bg-muted text-muted-foreground text-[10px] sm:text-xs font-medium transition-colors">Residential</button>
                            <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-background border border-border hover:bg-muted text-muted-foreground text-[10px] sm:text-xs font-medium transition-colors">Apartment</button>
                        </div>

                        <button className="bg-primary text-primary-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg w-full sm:w-auto sm:self-end">
                            Search Properties
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
