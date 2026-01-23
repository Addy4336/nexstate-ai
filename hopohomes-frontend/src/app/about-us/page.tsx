import AboutStatistics from "@/components/about-us/AboutStatistic";
import ContactSection from "@/components/about-us/ContactSection";
import Hero from "@/components/about-us/Hero";
import Mission from "@/components/about-us/Mission";
import TeamSection from "@/components/about-us/TeamSection";
import Testimonials from "@/components/about-us/Testimonials";
import WorkWithUs from "@/components/about-us/WorkWithUs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "About Us",
};

export default function AboutUs() {
    return (
        <main>
            <Hero />
            <AboutStatistics />
            <Mission />
            <TeamSection />
            <WorkWithUs />
            <Testimonials />
            <ContactSection />
        </main>
    );
}


