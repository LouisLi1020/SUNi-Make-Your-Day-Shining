import { HeroSection } from '../components/HeroSection';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { Categories } from '../components/Categories';
import { ValueProposition } from '../components/ValueProposition';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <Categories />
      <ValueProposition />
    </main>
  );
}
