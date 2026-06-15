import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { Testimonials } from "@/components/landing/Testimonials";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="noise-overlay relative min-h-screen bg-background">
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <SocialProof />
        <Testimonials />
        <Features />
        <Pricing />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}
