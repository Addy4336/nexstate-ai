import { Hero } from "@/components/user/Hero";
import { Stats } from "@/components/user/Stats";
import { FeaturedProperties } from "@/components/user/FeaturedProperties";
import { HowItWorks } from "@/components/user/HowItWorks";
import { Services } from "@/components/user/Services";
import { Locations } from "@/components/user/Locations";
import { ROICalculator } from "@/components/user/ROICalculator";
import { CTA } from "@/components/user/CTA";

export default function HomePage() {
    return (
        <>
            <Hero />
            <Stats />
            <FeaturedProperties />
            <HowItWorks />
            <Services />
            <Locations />
            <ROICalculator />
            <CTA />
        </>
    );
}
