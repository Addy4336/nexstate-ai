
import Hero from "@/components/owner/Hero";
import ServicesSection from "@/components/owner/ServicesSection";
import AboutSection from "@/components/owner/AboutSection";
import ProcessSection from "@/components/owner/ProcessSection";
import GrowthSection from "@/components/owner/GrowthSection";
import TeamSection from "@/components/owner/TeamSection";
import FooterSection from "@/components/owner/FooterSection";

export default function Home() {
  return (
    <main className="min-h-screen pt-20 bg-white text-black dark:bg-neutral-950 dark:text-white selection:bg-purple-100 selection:text-purple-900">

      <Hero />
      <ServicesSection />
      <AboutSection />
      <ProcessSection />
      <GrowthSection />
      <TeamSection />
      <FooterSection />
    </main>
  );
}
