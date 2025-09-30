import { Star, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

const featuredProducts = [
  {
    id: 1,
    name: "Luminous Home Diffuser",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1757774636743-e5235c608fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGhvbWUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NTkyMDk5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Smart Kitchen Organizer",
    price: 64.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1631677640738-65373fbd1f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBraXRjaGVuJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzU5MjA5OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "New"
  },
  {
    id: 3,
    name: "Minimalist Desk Set",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU5MjA5OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Limited"
  },
  {
    id: 4,
    name: "Wellness Essential Kit",
    price: 94.99,
    originalPrice: null,
    rating: 5.0,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1596773544141-798fc586f31e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NTkxNjk5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Top Rated"
  }
];

interface FeaturedProductsProps {
  onNavigate: (page: string) => void;
}

export function FeaturedProducts({ onNavigate }: FeaturedProductsProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Featured <span className="text-orange-500">Products</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked items that bring joy and functionality to your daily routine
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <ImageWithFallback 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge 
                  variant="secondary" 
                  className="absolute top-3 left-3 bg-white/90 text-orange-600 border-orange-200"
                >
                  {product.badge}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white h-8 w-8"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-orange-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
            onClick={() => onNavigate('products')}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}