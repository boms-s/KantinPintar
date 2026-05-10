import HeroSection from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import AppPromoSection from "@/components/AppPromoSection";
import {FeaturesSection} from "@/components/FeaturesSection";
import FooterSection from "@/components/FooterSection";
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 selection:bg-blue-500/30">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col items-center">
        <HeroSection />
        <HowItWorksSection />
        <AppPromoSection />
        <FeaturesSection />
        <FooterSection />
      </div>
    </main>
  );
}

