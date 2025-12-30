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
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>HOPO Homes - Premium Furnished Rentals in Dubai | AI-Powered Rental Platform</title>
        <meta name="description" content="Find your perfect fully-furnished apartment, villa, or co-living space in Dubai. HOPO Homes offers ready-to-move-in properties with flexible leases and AI-powered property matching." />
        <meta name="keywords" content="Dubai rentals, furnished apartments Dubai, co-living Dubai, short-term rentals UAE, property management Dubai" />
        <link rel="canonical" href="https://hopohomes.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="HOPO Homes - Premium Furnished Rentals in Dubai" />
        <meta property="og:description" content="Find your perfect fully-furnished home in Dubai. Ready-to-move-in apartments, villas & co-living spaces." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hopohomes.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HOPO Homes - Premium Furnished Rentals in Dubai" />
        <meta name="twitter:description" content="Find your perfect fully-furnished home in Dubai. AI-powered rental platform." />
      </Helmet>

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
    </>
  );
};

export default Index;
