import { ChevronDown } from 'lucide-react';

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
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/30" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col flex-1 pt-28 pb-8">

                {/* Hero Text Section */}
                <div className="flex-1 flex flex-col relative top-[3rem] justify-center">
                    {/* Tags */}
                    <div className="flex gap-3 mb-4">
                        {['House', 'Apartment', 'Residential'].map((tag) => (
                            <span key={tag} className="bg-background/95 backdrop-blur-sm text-foreground px-5 py-2 rounded-full text-sm font-medium hover:bg-background transition-colors cursor-pointer shadow-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.1]">
                            Build Your Future, One <br className="hidden sm:block" /> Property at a Time.
                        </h1>

                        <p className="max-w-xs text-white/80 text-sm leading-relaxed lg:text-right lg:pb-2">
                            Own Your World, One Property at a Time. Own Your World, One Property at a Time. Own Your World, One Property at a Time.
                        </p>
                    </div>
                </div>

                {/* Search Card Section */}
                <div className="bg-background rounded-[2rem] p-6 shadow-2xl w-full mt-8">
                    <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-6">Find the best place</h2>

                    {/* Search Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">

                        {/* Looking For */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground block">Looking for</label>
                            <div className="bg-muted border border-border rounded-xl px-4 py-3 flex items-center justify-between group hover:bg-muted/80 transition-colors cursor-pointer">
                                <span className="text-muted-foreground text-sm">Enter type</span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground block">Price</label>
                            <div className="bg-muted border border-border rounded-xl px-4 py-3 flex items-center justify-between group hover:bg-muted/80 transition-colors cursor-pointer">
                                <span className="text-muted-foreground text-sm">Price</span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Locations */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground block">Locations</label>
                            <div className="bg-muted border border-border rounded-xl px-4 py-3 flex items-center justify-between group hover:bg-muted/80 transition-colors cursor-pointer">
                                <span className="text-muted-foreground text-sm">Location</span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Number of rooms */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground block">Number of rooms</label>
                            <div className="bg-muted border border-border rounded-xl px-4 py-3 flex items-center justify-between group hover:bg-muted/80 transition-colors cursor-pointer">
                                <span className="text-muted-foreground text-sm">2 Bed rooms</span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>

                    </div>

                    {/* Footer with Filters and Search Button */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">

                         <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground text-sm mr-1">Filter:</span>
                            <button className="px-4 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium transition-colors">City</button>
                            <button className="px-4 py-1.5 rounded-full bg-background border border-border hover:bg-muted text-muted-foreground text-xs font-medium transition-colors">House</button>
                            <button className="px-4 py-1.5 rounded-full bg-background border border-border hover:bg-muted text-muted-foreground text-xs font-medium transition-colors">Residential</button>
                            <button className="px-4 py-1.5 rounded-full bg-background border border-border hover:bg-muted text-muted-foreground text-xs font-medium transition-colors">Apartment</button>
                         </div>

                         <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg w-full sm:w-auto">
                            Search Properties
                         </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
