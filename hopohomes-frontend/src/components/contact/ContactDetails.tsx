import React from 'react';
import { Phone, Mail, Clock, MapPin, Send } from 'lucide-react';

export default function ContactDetails() {
    return (
        <section className="bg-background py-20 md:py-32 relative overflow-hidden">
            {/* Subtle Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background -z-10" />

            <div className="container mx-auto px-4 md:px-12">

                {/* Top Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-secondary text-secondary-foreground text-xs md:text-sm font-semibold tracking-widest uppercase mb-6 hover:bg-secondary/80 transition-colors cursor-default">
                        Call To Find Your Luxury Home
                    </span>
                    <h2 className="text-3xl md:text-5xl font-semibold text-foreground leading-tight">
                        We'd love to hear from you
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                        Whether you have a question about properties, need assistance, or just want to talk, we are here to help.
                    </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {/* Phone */}
                    <div className="flex flex-col items-center text-center p-8 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-[#23527C] mb-6 group-hover:scale-110 transition-transform">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h4 className="text-foreground font-semibold text-lg mb-3">Phone Support</h4>
                        <div className="text-muted-foreground text-sm space-y-1">
                            <p>+971 4 451 1555</p>
                            <p>(24/7 AI Support Hotline)</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col items-center text-center p-8 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-[#23527C] mb-6 group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h4 className="text-foreground font-semibold text-lg mb-3">Email Us</h4>
                        <div className="text-muted-foreground text-sm space-y-1">
                            <p>info@hopohomes.com</p>
                            <p>We reply within 24 hours.</p>
                        </div>
                    </div>

                    {/* Address/Visit HQ */}
                    <div className="flex flex-col items-center text-center p-8 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-[#23527C] mb-6 group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h4 className="text-foreground font-semibold text-lg mb-3">Visit HQ</h4>
                        <div className="text-muted-foreground text-sm space-y-1">
                            <p>In5 Tech, Dubai Internet City</p>
                            <p>Dubai, UAE</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Form & Map Section */}
                <div className="flex flex-col lg:flex-row shadow-2xl shadow-black/5 rounded-3xl overflow-hidden border border-border/50">

                    {/* Left Form */}
                    <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 bg-card relative">
                        <h3 className="text-3xl font-bold text-foreground mb-2">Send a Message</h3>
                        <p className="text-muted-foreground mb-10">For specific inquiries about property management or partnerships.</p>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium text-foreground ml-1">First Name</label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground/40 text-sm transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium text-foreground ml-1">Last Name</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground/40 text-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium text-foreground ml-1">Phone Number</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground/40 text-sm transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground/40 text-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-foreground ml-1">Message</label>
                                <textarea
                                    id="message"
                                    placeholder="Tell us how we can help..."
                                    rows={5}
                                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground/40 text-sm transition-all resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="group w-full md:w-auto px-8 py-3.5 bg-[#23527C] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    SEND MESSAGE
                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Map */}
                    <div className="w-full lg:w-1/2 min-h-[400px] lg:min-h-full bg-muted relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112173.53589998858!2d-81.44299884615374!3d28.5383354921936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e773d8fecdbc77%3A0xac3b2063ca5bf9e!2sOrlando%2C%20FL%2C%20USA!5e0!3m2!1sen!2sin!4v1709540000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 w-full h-full grayscale-[0.8] contrast-[0.9] opacity-90 hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
