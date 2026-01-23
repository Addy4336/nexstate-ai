import React from 'react';

export default function ContactDetails() {
    return (
        <section className="bg-background py-12 md:py-24 relative overflow-hidden">
            {/* Pink Geometric Decor */}
            <div className="absolute right-0 bottom-0 w-32 h-32 md:w-64 md:h-64 bg-secondary opacity-30 -z-10 translate-y-1/4 translate-x-1/4" />
            <div className="absolute left-0 top-20 w-16 h-16 bg-muted opacity-50 -z-10" />

            <div className="container mx-auto px-4 md:px-12">

                {/* Top Header Section */}
                <div className="text-center max-w-4xl mx-auto mb-10 md:mb-24">
                    <span className="text-muted-foreground text-xs md:text-sm font-medium tracking-widest uppercase block mb-3">
                        Call To Find Your Luxury Home
                    </span>
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-normal text-primary leading-normal md:leading-snug">
                        Contact Us Directly For More Information <br className="hidden md:block" />
                        Or Leave A Message Below And We'll Get <br className="hidden md:block" />
                        Back To You ASAP
                    </h2>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-32 text-center md:text-left">

                    {/* Phone */}
                    <div className="space-y-3">
                        <h4 className="text-secondary font-medium text-lg">Phone</h4>
                        <div className="text-muted-foreground text-sm space-y-1">
                            <p>+1(456)657-887</p>
                            <p>+1(456)657-997</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-3">
                        <h4 className="text-secondary font-medium text-lg">Email Address</h4>
                        <div className="text-muted-foreground text-sm space-y-1">
                            <p>info@realet.com</p>
                            <p>sales@realet.com</p>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="space-y-3">
                        <h4 className="text-secondary font-medium text-lg">Opening Hours</h4>
                        <div className="text-muted-foreground text-sm space-y-1">
                            <p>Monday - Thursday: 10am - 6pm</p>
                            <p>Friday: 10am - 3am</p>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-3">
                        <h4 className="text-secondary font-medium text-lg">Address</h4>
                        <div className="text-muted-foreground text-sm space-y-1">
                            <p>3557 Derek Drive,</p>
                            <p>Orlando, Florida</p>
                        </div>
                    </div>

                </div>

                {/* Bottom Form & Map Section */}
                <div className="flex flex-col lg:flex-row shadow-[0_4px_30px_rgba(0,0,0,0.05)] bg-card rounded-xl overflow-hidden">

                    {/* Left Form */}
                    <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-16 bg-card">
                        <h3 className="text-2xl font-medium text-primary mb-8">Write Us And We'll Get Back To You</h3>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-none focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50 text-sm transition-colors"
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-none focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50 text-sm transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-none focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50 text-sm transition-colors"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-none focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50 text-sm transition-colors"
                                />
                            </div>

                            <textarea
                                placeholder="Your Message"
                                rows={6}
                                className="w-full px-4 py-3 bg-background border border-border rounded-none focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50 text-sm transition-colors resize-none"
                            ></textarea>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors w-full md:w-auto"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Map */}
                    <div className="w-full lg:w-1/2 min-h-[300px] lg:min-h-[400px] bg-muted relative grayscale opacity-90">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112173.53589998858!2d-81.44299884615374!3d28.5383354921936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e773d8fecdbc77%3A0xac3b2063ca5bf9e!2sOrlando%2C%20FL%2C%20USA!5e0!3m2!1sen!2sin!4v1709540000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 w-full h-full"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
