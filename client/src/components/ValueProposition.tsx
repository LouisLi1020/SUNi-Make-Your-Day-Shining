import { Truck, Shield, Heart, Sparkles, Users, Award } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const values = [
  {
    icon: Sparkles,
    title: "Curated Excellence",
    description: "Every product is carefully selected to bring joy and functionality to your daily life."
  },
  {
    icon: Truck,
    title: "Fast & Free Shipping",
    description: "Free shipping on orders over $50. Most orders arrive within 2-3 business days."
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "30-day return policy and lifetime customer support for peace of mind."
  },
  {
    icon: Heart,
    title: "Sustainable Choices",
    description: "We partner with eco-conscious brands committed to sustainable practices."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join thousands of customers sharing tips and inspiration in our community."
  },
  {
    icon: Award,
    title: "Award Winning Service",
    description: "Recognized for outstanding customer service and product curation."
  }
];

export function ValueProposition() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose <span className="text-orange-500">Suni?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're more than just a store. We're your partner in creating a life that shines brighter every day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 group-hover:from-yellow-200 group-hover:to-orange-200 transition-colors">
                    <Icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Customer Testimonials */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">What Our Customers Say</h3>
            <p className="text-lg text-muted-foreground">Real stories from people who've brightened their lives with Suni</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Interior Designer",
                quote: "Suni has completely transformed how I source products for my clients. The quality and curation are unmatched.",
                rating: 5
              },
              {
                name: "Marcus Johnson",
                role: "Busy Parent",
                quote: "Finally found a store that understands what makes daily life better. Every purchase has been a win for our family.",
                rating: 5
              },
              {
                name: "Emma Rodriguez",
                role: "Small Business Owner",
                quote: "The workspace products from Suni have boosted my productivity and made my home office a place I love to be.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}