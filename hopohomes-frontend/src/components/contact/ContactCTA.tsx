import React from 'react';

export default function ContactCTA() {
    return (
        <section className="bg-background pb-12 md:pb-24">
            <div className="container mx-auto px-4 md:px-12">
                <div className="bg-secondary/60 px-6 py-10 md:px-16 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 relative z-10">

                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-2xl md:text-3xl text-primary font-normal leading-snug">
                            Get Updates And Stay Connected - <br className="hidden md:block" />
                            Subscribe To Our Newsletter
                        </h2>
                    </div>

                    {/* Form */}
                    <div className="w-full lg:w-1/2">
                        <form className="flex flex-col md:flex-row gap-4 w-full">
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none placeholder:text-muted-foreground/70 text-foreground text-sm"
                            />
                            <button
                                type="submit"
                                className="px-8 py-3 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
