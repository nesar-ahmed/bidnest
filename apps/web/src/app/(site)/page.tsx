import { Hero } from '@/components/landing/hero';
import {
  CategoryMarquee,
  EndingSoon,
  Faq,
  FeaturedAuctions,
  HowItWorks,
  SellerCta,
  Stats,
  Testimonials,
} from '@/components/landing/sections';

export default function HomePage() {
  return (
    <>
      <span id="top" className="absolute" aria-hidden />
      <Hero />
      <CategoryMarquee />
      <FeaturedAuctions />
      <EndingSoon />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <SellerCta />
    </>
  );
}
