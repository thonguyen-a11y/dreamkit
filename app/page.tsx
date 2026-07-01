import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/sections/hero";
import { ShopSection } from "@/components/sections/shop-section";
import { CustomDesign } from "@/components/sections/custom-design";
import { TeamOrder } from "@/components/sections/team-order";
import { Testimonials } from "@/components/sections/testimonials";
import { Journey } from "@/components/sections/journey";
import { FeaturedSpotlight } from "@/components/sections/featured-spotlight";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ShopSection />
        <CustomDesign />
        <TeamOrder />
        <Testimonials />
        <Journey />
        <FeaturedSpotlight />
      </main>
      <SiteFooter />
    </>
  );
}
