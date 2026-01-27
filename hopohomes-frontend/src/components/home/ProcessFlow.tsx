import React from 'react';
import { Bot, ChevronRight, Plus } from 'lucide-react';

export default function ProcessFlow() {
    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-foreground">
                        Tools to build your vision
                    </h2>
                </div>

                {/* Steps Visualization */}
                <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-16 sm:mb-20 lg:mb-24">
                    {[
                        "Instant Response",
                        "Secure & Private",
                        "Always Available"
                    ].map((step, index) => (
                        <React.Fragment key={index}>
                            <div
                                className={`
                          px-4 sm:px-6 py-2 sm:py-3 rounded-xl border transition-all duration-300 relative
                          ${index === 0
                                        ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10'
                                        : 'bg-card border-border text-muted-foreground hover:border-primary/30'
                                    }
                        `}
                            >
                                <span className="font-medium whitespace-nowrap text-sm sm:text-base">{step}</span>

                                {/* Border Animation for Active Step */}
                                {index === 0 && (
                                    <span className="absolute inset-0 rounded-xl border-2 border-primary/20 animate-pulse"></span>
                                )}
                            </div>

                            {index < 2 && (
                                <div className="hidden sm:flex items-center px-2 relative">
                                    {/* Connecting Line */}
                                    <div className="w-8 sm:w-12 h-[1px] bg-border relative">
                                        {index === 0 && (
                                            <div className="absolute inset-0 bg-primary/50 origin-left animate-[width_1s_ease-in-out_infinite]"></div>
                                        )}
                                    </div>

                                    {/* Arrow Indicator */}
                                    <div className={`
                                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                w-5 h-5 sm:w-6 sm:h-6 rounded-full border bg-card flex items-center justify-center z-10
                                ${index === 0 ? 'border-primary/30 text-primary' : 'border-border text-muted-foreground'}
                           `}>
                                        <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="space-y-12 sm:space-y-16 lg:space-y-12">
                    {/* Feature 1: AI Engages */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-20 items-center">
                        {/* Left Side - UI Mockup (AI Engages) */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <div className="relative bg-secondary/10 border border-border rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 lg:p-8 shadow-2xl overflow-hidden min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] flex items-center justify-center">

                                {/* Search Icon */}
                                <div className="absolute top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:right-8 text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>

                                <div className="relative w-full max-w-md h-64 sm:h-72 lg:h-80">
                                    {/* Visitor Card */}
                                    <div className="absolute left-0 top-0 w-48 sm:w-56 lg:w-64 bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-xl border border-border z-20">
                                        <h4 className="text-xs sm:text-sm font-semibold text-foreground/80 mb-4 sm:mb-6">Visitor</h4>
                                        <div className="space-y-3 sm:space-y-4">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="flex items-center gap-2 sm:gap-3">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary"></div>
                                                    <div className="space-y-1 sm:space-y-1.5 flex-1">
                                                        <div className="h-1 sm:h-1.5 w-full bg-secondary rounded-full"></div>
                                                        <div className="h-1 sm:h-1.5 w-2/3 bg-secondary/70 rounded-full"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Primary Toggle */}
                                    <div className="absolute right-4 sm:right-8 lg:right-12 top-2 sm:top-4 bg-card rounded-full p-1 sm:p-1.5 shadow-lg border border-border z-10 flex w-16 sm:w-20 lg:w-24 items-center">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-primary shadow-md"></div>
                                        <div className="flex-1"></div>
                                    </div>

                                    {/* FAQs Card */}
                                    <div className="absolute right-0 top-12 sm:top-16 lg:top-20 w-40 sm:w-48 lg:w-56 bg-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 shadow-lg border border-border z-10">
                                        <h4 className="text-[10px] sm:text-xs font-semibold text-foreground/70 mb-2 sm:mb-3 lg:mb-4">Faqs</h4>
                                        <div className="space-y-2 sm:space-y-3">
                                            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-secondary/20 border border-secondary/20">
                                                <div className="flex justify-between items-center">
                                                    <div className="h-1 sm:h-1.5 w-2/3 bg-muted-foreground/30 rounded-full"></div>
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 text-muted-foreground flex items-center justify-center text-[10px] sm:text-xs">+</div>
                                                </div>
                                            </div>
                                            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-secondary/20 border border-secondary/20">
                                                <div className="flex justify-between items-center">
                                                    <div className="h-1 sm:h-1.5 w-1/2 bg-muted-foreground/30 rounded-full"></div>
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 text-muted-foreground flex items-center justify-center text-[10px] sm:text-xs">+</div>
                                                </div>
                                            </div>
                                            <div className="hidden sm:block p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-secondary/20 border border-secondary/20">
                                                <div className="flex justify-between items-center">
                                                    <div className="h-1 sm:h-1.5 w-3/4 bg-muted-foreground/30 rounded-full"></div>
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 text-muted-foreground flex items-center justify-center text-[10px] sm:text-xs">-</div>
                                                </div>
                                                <div className="mt-1.5 sm:mt-2 h-0.5 sm:h-1 w-full bg-muted-foreground/20 rounded-full"></div>
                                                <div className="mt-0.5 sm:mt-1 h-0.5 sm:h-1 w-2/3 bg-muted-foreground/20 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Feature Description */}
                        <div className="flex flex-col items-start space-y-4 sm:space-y-6 lg:pl-10">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-foreground leading-tight">
                                The Sales & Guide Agent
                            </h3>
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                Your 24/7 Personal Guide. Need a home? Our Sales Agent helps you explore listings and Instant Book your stay immediately. No waiting for human brokers.
                            </p>

                        </div>
                    </div>

                    {/* Feature 2: AI Assists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-20 items-center">
                        {/* Left Side - Feature Description */}
                        <div className="flex flex-col items-start space-y-4 sm:space-y-6 order-2 lg:order-1 lg:pr-10">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-foreground leading-tight">
                                The Maintenance Agent
                            </h3>
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                Zero Wait Time Repairs. Leaky tap? WiFi down? Report it to our Maintenance Agent and get solutions in minutes, not days. We solve problems instantly while other properties make you wait.
                            </p>

                        </div>

                        {/* Right Side - UI Mockup */}
                        <div className="relative group order-1 lg:order-2">
                            {/* Background Gradient */}
                            <div className="absolute -inset-4 bg-gradient-to-l from-primary/20 to-secondary/20 rounded-[2rem] blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                            <div className="relative bg-gradient-to-br from-primary/5 via-card to-secondary/5 border border-primary/10 rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 lg:p-8 shadow-2xl overflow-hidden min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] flex items-center justify-center">
                                {/* Abstract Chat UI */}
                                <div className="w-full max-w-sm relative z-10">
                                    {/* Chat Bubbles Background */}
                                    <div className="absolute top-0 left-0 right-0 flex justify-center gap-2 sm:gap-4 opacity-50">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-card border border-primary/10 flex items-center justify-center shadow-sm">
                                                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Main Card */}
                                    <div className="mt-12 sm:mt-16 bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-primary/10 backdrop-blur-sm relative">
                                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary"></div>
                                            <span className="text-xs sm:text-sm font-bold text-foreground/80">New Chat</span>
                                        </div>

                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex gap-2 sm:gap-4">
                                                <div className="w-1/2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary/5 border border-primary/10">
                                                    <div className="h-1.5 sm:h-2 bg-primary/20 rounded w-1/2 mb-1.5 sm:mb-2"></div>
                                                    <div className="h-1.5 sm:h-2 bg-primary/10 rounded w-3/4"></div>
                                                </div>
                                                <div className="w-1/2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary/5 border border-primary/10">
                                                    <div className="h-1.5 sm:h-2 bg-primary/20 rounded w-1/2 mb-1.5 sm:mb-2"></div>
                                                    <div className="h-1.5 sm:h-2 bg-primary/10 rounded w-3/4"></div>
                                                </div>
                                            </div>
                                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/50 border border-border">
                                                <div className="flex gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                                    <div className="w-1/2 h-14 sm:h-20 rounded-md sm:rounded-lg bg-primary/10"></div>
                                                    <div className="w-1/2 h-14 sm:h-20 rounded-md sm:rounded-lg bg-primary/10"></div>
                                                </div>
                                                <div className="h-1.5 sm:h-2 bg-muted-foreground/20 rounded w-full mt-2 sm:mt-3"></div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center shadow-lg text-primary-foreground">
                                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary shadow-lg"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: AI-Powered Conversations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-20 items-center">

                        {/* Left Side - UI Mockup */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <div className="relative bg-gradient-to-br from-secondary/5 via-card to-primary/5 border border-border rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 lg:p-8 shadow-2xl overflow-hidden min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] flex items-center justify-center">

                                {/* Floating Icons Background */}
                                <div className="absolute inset-0 overflow-hidden opacity-20">
                                    <div className="absolute top-10 left-10 w-12 sm:w-16 h-12 sm:h-16 bg-primary/10 rounded-full blur-2xl"></div>
                                    <div className="absolute bottom-10 right-10 w-16 sm:w-24 h-16 sm:h-24 bg-secondary/10 rounded-full blur-3xl"></div>
                                </div>

                                <div className="relative w-full max-w-sm z-10">
                                    {/* Messages Card */}
                                    <div className="bg-card rounded-xl sm:rounded-2xl shadow-xl border border-border overflow-hidden">
                                        {/* Header */}
                                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500"></div>
                                                <div className="h-3 sm:h-4 w-16 sm:w-24 bg-muted-foreground/20 rounded-full"></div>
                                            </div>
                                            <div className="flex gap-1 sm:gap-1.5">
                                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-muted-foreground/30"></div>
                                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-muted-foreground/30"></div>
                                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-muted-foreground/30"></div>
                                            </div>
                                        </div>

                                        {/* Message List */}
                                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                            {/* Received Message */}
                                            <div className="flex items-start gap-2 sm:gap-4">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary/50 flex-shrink-0"></div>
                                                <div className="bg-muted/50 rounded-xl sm:rounded-2xl rounded-tl-none p-3 sm:p-4 max-w-[80%]">
                                                    <div className="h-1.5 sm:h-2 w-24 sm:w-32 bg-muted-foreground/20 rounded-full mb-1.5 sm:mb-2"></div>
                                                    <div className="h-1.5 sm:h-2 w-32 sm:w-48 bg-muted-foreground/10 rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* Sent Message */}
                                            <div className="flex items-end justify-end gap-2 sm:gap-3">
                                                <div className="bg-primary text-primary-foreground rounded-xl sm:rounded-2xl rounded-tr-none p-3 sm:p-4 max-w-[80%] shadow-md shadow-primary/10">
                                                    <div className="h-1.5 sm:h-2 w-28 sm:w-40 bg-white/40 rounded-full mb-1.5 sm:mb-2"></div>
                                                    <div className="h-1.5 sm:h-2 w-16 sm:w-24 bg-white/20 rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* Received Message (Typing) */}
                                            <div className="flex items-start gap-2 sm:gap-4">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary/50 flex-shrink-0"></div>
                                                <div className="bg-muted/50 rounded-xl sm:rounded-2xl rounded-tl-none p-3 sm:p-4 w-12 sm:w-16 flex items-center gap-1 sm:gap-1.5">
                                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative Floating Elements - Hidden on mobile */}
                                    <div className="hidden sm:block absolute -right-6 top-1/3 bg-card p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg border border-border animate-bounce [animation-duration:3s]">
                                        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-primary/10 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Content */}
                        <div className="flex flex-col items-start space-y-4 sm:space-y-6 lg:pl-10">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-foreground leading-tight">
                                The Management Agent

                            </h3>
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                Flawless Business Operations. This agent works 24/7 so no task is ever delayed. For property owners, it ensures 100% uptime and efficiency.
                            </p>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
