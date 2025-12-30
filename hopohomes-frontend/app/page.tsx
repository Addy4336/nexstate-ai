'use client'

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { Services } from "@/components/Services";
import { HowItWorks } from "@/components/HowItWorks";
import { ROICalculator } from "@/components/ROICalculator";
import { Locations } from "@/components/Locations";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Stats />
        <FeaturedProperties />
        <HowItWorks />
        <Services />
        <Locations />
        <ROICalculator />
        <CTA />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
