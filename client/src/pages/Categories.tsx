import { Categories as CategoriesComponent } from '../components/Categories';

interface CategoriesPageProps {
  onNavigate: (page: string) => void;
}

export default function CategoriesPage({ onNavigate }: CategoriesPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            All <span className="text-orange-500">Categories</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our complete range of carefully curated product categories
          </p>
        </div>
        <CategoriesComponent onNavigate={onNavigate} />
      </div>
    </div>
  );
}

