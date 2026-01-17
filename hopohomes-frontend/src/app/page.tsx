
import Hero from "@/components/tenants/Hero";
import PropertyShowcase from "@/components/tenants/PropertyShowcase";
import MapFeatures from "@/components/tenants/MapFeatures";
import PremierHouses from "@/components/tenants/PremierHouses";
import ClientTestimonials from "@/components/tenants/ClientTestimonials";
import FAQSection from "@/components/tenants/FAQSection";
import CTASection from "@/components/tenants/CTASection";
import LocationSection from "@/components/tenants/LocationSection";
import CalculatorsSection from "@/components/CalculatorsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative font-sans">
      {/* <Navbar /> */}
      <Hero />
      <PropertyShowcase />
      <LocationSection />
      <MapFeatures />
      <PremierHouses />
      <CalculatorsSection />

      <FAQSection />
      <ClientTestimonials />
      <CTASection />
    </main>
  );
}
