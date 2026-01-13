'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

const FAQS = [
    {
        id: 1,
        question: "What types of properties do you sell?",
        answer: "We specialize in residential, commercial, and luxury properties, offering a wide range of options to suit every buyer's needs and preferences. We connect you with trusted lenders offering competitive mortgage options and financial advice. We arrange private showings for you to visit and evaluate properties before making a decision. Properties range across different price points, catering to various budgets and investment goals.",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        question: "How do I know if a property is a good investment?",
        answer: "Our experts analyze market trends, property appreciation rates, and rental yield potential to help you identify high-value investments. We provide detailed reports and comparable market analysis for every listing.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        question: "Do I need to hire a real estate agent?",
        answer: "While it's possible to buy or sell on your own, a real estate agent provides valuable expertise in negotiation, legal paperwork, and market valuation, potentially saving you time and money and avoiding costly legal pitfalls.",
        image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&auto=format&fit=crop&q=60"
    },
    {
        id: 4,
        question: "What's the process for buying a property?",
        answer: "The process involves getting pre-approved for a mortgage, searching for properties, making an offer, conducting inspections, and closing the deal. We guide you through every step to ensure a smooth transaction.",
        image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&auto=format&fit=crop&q=60"
    },
    {
        id: 5,
        question: "Can I tour a property before purchasing?",
        answer: "Absolutely! We highly recommend touring properties. We can arrange both in-person private viewings and high-quality virtual tours to help you get a true feel for the space before making any commitments.",
        image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=600&auto=format&fit=crop&q=60"
    }
];

export default function FAQSection() {
    const [openId, setOpenId] = useState<number | null>(1);

    const toggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="py-20  bg-background px-6 lg:px-8">
            <div className="max-w-350 mx-auto">

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground max-w-xl">
                        Frequently asked questions
                    </h2>
                    <p className="text-muted-foreground leading-relaxed max-w-lg lg:text-right">
                        Our experts guide you in making informed investment decisions based on market insights. We offer residential, commercial, and luxury properties tailored to different preferences and budgets.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="flex flex-col gap-4">
                    {FAQS.map((item) => (
                        <div
                            key={item.id}
                            className={`border transition-colors duration-300 rounded-[1.5rem] overflow-hidden ${openId === item.id
                                ? 'border-border bg-background shadow-sm'
                                : 'border-border/60 bg-card/50 hover:border-border'
                                }`}
                        >
                            <button
                                onClick={() => toggle(item.id)}
                                className="w-full flex items-center justify-between p-6  text-left outline-none"
                            >
                                <span className="text-xl md:text-2xl font-medium text-foreground pr-8">
                                    {item.question}
                                </span>
                                <div className={`shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center transition-transform duration-300 ${openId === item.id ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </button>

                            <AnimatePresence>
                                {openId === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 md:px-8 pb-3 pt-0 flex flex-col md:flex-row gap-8 items-start">
                                            <p className="text-muted-foreground leading-relaxed flex-1 text-base md:text-lg">
                                                {item.answer}
                                            </p>
                                            {item.image && (
                                                <div className="relative w-full md:w-[240px] h-[140px] flex-shrink-0 rounded-xl overflow-hidden hidden md:block border border-border/10">
                                                    <Image
                                                        src={item.image}
                                                        alt="FAQ Context"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
