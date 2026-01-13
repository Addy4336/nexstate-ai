import Navbar from "@/components/owner/Navbar";
import Hero from "@/components/owner/Hero";
import ServicesSection from "@/components/owner/ServicesSection";
import AboutSection from "@/components/owner/AboutSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white selection:bg-purple-100 selection:text-purple-900">
      <Navbar />
      <Hero />
      <ServicesSection />
      <AboutSection />
    </main>
  );
}
