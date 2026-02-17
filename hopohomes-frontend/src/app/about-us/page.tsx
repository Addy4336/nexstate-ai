import Hero from "@/components/about-us/Hero";
import WhatWeDo from "@/components/about-us/WhatWeDo";
import HowWereDifferent from "@/components/about-us/HowWereDifferent";
import OurVision from "@/components/about-us/OurVision";
import AboutCTA from "@/components/about-us/AboutCTA";
import { Metadata } from "next";
import TeamSection from "@/components/about-us/TeamSection";

export const metadata: Metadata = {
    title: "About Us | Hopo Homes",
    description: "Hopo Homes is a tech-enabled co-living and rental management platform designed for modern urban living.",
};

export default function AboutUs() {
    return (
        <main>
            <Hero />
            <WhatWeDo />
            <HowWereDifferent />
            <OurVision />
             <TeamSection />
            <AboutCTA />
        </main>
    );
}
