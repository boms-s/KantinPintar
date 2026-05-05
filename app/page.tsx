import HeroSection from "@/components/HeroSection";
import MenuFavoritSection from "@/components/MenuFavoritSection";
import AppPromoSection from "@/components/AppPromoSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <div className="w-full bg-white dark:bg-black">
      <HeroSection />
      <MenuFavoritSection />
      <AppPromoSection />
      <FooterSection />
    </div>
  );
}

