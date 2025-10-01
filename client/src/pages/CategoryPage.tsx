import { ProductCatalog } from '../components/ProductCatalog';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CategoryPageProps {
  category: string;
}

const categoryInfo = {
  "Home & Living": {
    title: "Home & Living",
    description: "Transform your space with beautiful, functional pieces that bring comfort and style to every room.",
    image: "https://images.unsplash.com/photo-1681557225327-e4e23744d667?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwaG9tZSUyMGRlY29yfGVufDF8fHx8MTc1OTIwOTkxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: [
      "Handpicked for quality and style",
      "Sustainable and eco-friendly options",
      "Perfect for any home aesthetic",
      "Transform any space instantly"
    ]
  },
  "Kitchen Essentials": {
    title: "Kitchen Essentials",
    description: "Make cooking a joyful, efficient experience with smart storage solutions and beautiful kitchen accessories.",
    image: "https://images.unsplash.com/photo-1665768976778-22ab017f915a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwb3JnYW5pemF0aW9uJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzU5MjE0ODI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: [
      "Smart organization solutions",
      "Premium materials and construction",
      "Space-saving designs",
      "Easy to clean and maintain"
    ]
  },
  "Work & Productivity": {
    title: "Work & Productivity", 
    description: "Create an inspiring workspace that motivates and enhances your daily productivity.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU5MjA5OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: [
      "Ergonomic and functional design",
      "Premium materials for durability",
      "Cable management solutions",
      "Wireless charging compatibility"
    ]
  },
  "Wellness & Self-Care": {
    title: "Wellness & Self-Care",
    description: "Nurture your mind, body, and spirit with carefully curated wellness products for daily self-care rituals.",
    image: "https://images.unsplash.com/photo-1596773544141-798fc586f31e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NTkxNjk5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: [
      "Natural and organic ingredients",
      "Aromatherapy and relaxation focused",
      "Sustainable packaging",
      "Complete wellness experience"
    ]
  },
  "Garden & Outdoor": {
    title: "Garden & Outdoor",
    description: "Bring nature into your life with beautiful planters, gardening tools, and outdoor accessories.",
    image: "https://images.unsplash.com/photo-1636039479790-be1d880e2b8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBwbGFudCUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc1OTIxNDgzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: [
      "Beginner-friendly tools and guides",
      "Weather-resistant materials",
      "Beautiful and functional designs",
      "Complete plant care solutions"
    ]
  }
};

export default function CategoryPage({ category }: CategoryPageProps) {
  const info = categoryInfo[category as keyof typeof categoryInfo];

  if (!info) {
    return <ProductCatalog selectedCategory={category} />;
  }

  return (
    <div className="min-h-screen">
      {/* Category Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <span>Home</span>
                  <ArrowRight className="h-4 w-4" />
                  <span>Categories</span>
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-orange-600">{info.title}</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold">
                  {info.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {info.description}
                </p>
              </div>
              
              {/* Highlights */}
              <div className="space-y-3">
                {info.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                    <span className="text-muted-foreground">{highlight}</span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3"
              >
                Shop {info.title}
              </Button>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback 
                  src={info.image}
                  alt={info.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-200 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Catalog */}
      <ProductCatalog selectedCategory={category} />
    </div>
  );
}

