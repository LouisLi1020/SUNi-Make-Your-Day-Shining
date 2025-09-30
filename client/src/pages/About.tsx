export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              About <span className="text-orange-500">Suni</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Making everyday shining since 2020
            </p>
          </div>
          
          <div className="prose prose-lg mx-auto text-muted-foreground space-y-6">
            <p>
              At Suni, we believe that the right products can transform ordinary moments into extraordinary experiences. 
              Our mission is simple: to curate beautiful, functional items that bring joy and efficiency to your daily life.
            </p>
            
            <p>
              Founded in 2020, we started with a vision to create a shopping experience that goes beyond transactions. 
              Every product in our collection is carefully selected based on quality, design, and its ability to genuinely 
              improve your everyday routine.
            </p>
            
            <p>
              From innovative home solutions to wellness essentials, from workspace productivity tools to kitchen organization – 
              we're here to help you discover products that don't just serve a purpose, but spark joy in the process.
            </p>
            
            <p>
              Join our community of over 10,000 happy customers who have discovered that with the right products, 
              every day can shine a little brighter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

