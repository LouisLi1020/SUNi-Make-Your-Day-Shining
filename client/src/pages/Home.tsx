import { HeroSection } from '../components/HeroSection';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { Categories } from '../components/Categories';
import { ValueProposition } from '../components/ValueProposition';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <main>
      <HeroSection onNavigate={onNavigate} />
      <FeaturedProducts onNavigate={onNavigate} />
      <Categories onNavigate={onNavigate} />
      <ValueProposition />
    </main>
  );
}

