'use client';

import React, { useState } from 'react';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section className="bg-background py-20 md:py-28 overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    {/* Left - Content */}
                    <div className="w-full lg:w-[45%] flex flex-col">
                        {/* Tag */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                                For Sellers
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-medium leading-[1.15] text-foreground mb-6 tracking-[-0.02em]">
                            Get in <span className="font-serif italic">touch</span>
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground text-[15px] md:text-[17px] leading-[1.7] mb-12 max-w-[400px]">
                            Receive expert guidance to maximize your next purchase, sale, or investment.
                        </p>

                        {/* Contact Info */}
                        <div className="flex flex-col gap-6 mt-auto">
                            {/* Address */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <span className="text-foreground text-[15px] md:text-[16px]">
                                    123 Example Road, New York, NY 12345
                                </span>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <span className="text-foreground text-[15px] md:text-[16px]">
                                    email@example.com
                                </span>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <span className="text-foreground text-[15px] md:text-[16px]">
                                    (555) 555-5555
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right - Form Card */}
                    <div className="w-full lg:w-[55%]">
                        <div className="bg-secondary rounded-[24px] p-8 md:p-10">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {/* Name */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="name" className="text-secondary-foreground text-[14px] font-medium">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        className="w-full bg-[#1a1a1a] border border-[#333333] rounded-[12px] px-4 py-3 text-secondary-foreground text-[15px] placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="text-secondary-foreground text-[14px] font-medium">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Your email address"
                                        className="w-full bg-[#1a1a1a] border border-[#333333] rounded-[12px] px-4 py-3 text-secondary-foreground text-[15px] placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="phone" className="text-secondary-foreground text-[14px] font-medium">
                                        Phone number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Your phone number"
                                        className="w-full bg-[#1a1a1a] border border-[#333333] rounded-[12px] px-4 py-3 text-secondary-foreground text-[15px] placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                {/* Message */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="message" className="text-secondary-foreground text-[14px] font-medium">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Type something here"
                                        rows={5}
                                        className="w-full bg-[#1a1a1a] border border-[#333333] rounded-[12px] px-4 py-3 text-secondary-foreground text-[15px] placeholder:text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-fit px-8 py-4 bg-background text-foreground text-[14px] font-medium rounded-full hover:opacity-90 transition-colors duration-300"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;

