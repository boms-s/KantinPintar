import HeroSection from "@/components/HeroSection";
import MenuFavoritSection from "@/components/MenuFavoritSection";
import AppPromoSection from "@/components/AppPromoSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main className="w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.14),_transparent_34%),linear-gradient(180deg,_rgba(248,250,252,1)_0%,_rgba(255,255,255,1)_42%,_rgba(241,245,249,1)_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_34%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]">
      <HeroSection />
      <MenuFavoritSection />
      <AppPromoSection />
      <FooterSection />
    </main>
  );
}

