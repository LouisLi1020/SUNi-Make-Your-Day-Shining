import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/ui/image-with-fallback';
import { Star, Heart, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data - will be replaced with API calls
  const product = {
    id: 1,
    name: "Luminous Home Diffuser",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviews: 156,
    images: [
      "https://images.unsplash.com/photo-1757774636743-e5235c608fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGhvbWUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NTkyMDk5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1631677640738-65373fbd1f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBraXRjaGVuJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzU5MjA5OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    category: "Home & Living",
    badge: "Best Seller",
    description: "Transform your living space with our premium home diffuser. Features advanced ultrasonic technology for optimal scent distribution and a sleek, modern design that complements any decor.",
    features: [
      "Ultrasonic technology for fine mist",
      "LED mood lighting with 7 colors",
      "Auto shut-off safety feature",
      "Quiet operation (< 30dB)",
      "Large 500ml water tank",
      "Remote control included"
    ],
    specifications: {
      "Power": "15W",
      "Water Tank": "500ml",
      "Coverage": "30-50 sq ft",
      "Timer": "1-12 hours",
      "Material": "BPA-free plastic",
      "Dimensions": "8.5 x 8.5 x 12 inches"
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button className="flex items-center gap-1 hover:text-orange-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </button>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white p-4">
              <ImageWithFallback 
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <ImageWithFallback 
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-600 border-orange-200">
                  {product.badge}
                </Badge>
                <span className="text-sm text-muted-foreground">{product.category}</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-orange-600">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white h-12">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 border-orange-200 text-orange-700 hover:bg-orange-50">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b">
              <div className="flex">
                <button className="px-6 py-4 font-medium text-orange-600 border-b-2 border-orange-600">
                  Specifications
                </button>
                <button className="px-6 py-4 font-medium text-muted-foreground hover:text-foreground">
                  Reviews
                </button>
                <button className="px-6 py-4 font-medium text-muted-foreground hover:text-foreground">
                  Shipping
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium">{key}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
