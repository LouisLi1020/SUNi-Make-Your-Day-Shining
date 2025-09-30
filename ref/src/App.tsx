import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Categories } from './components/Categories';
import { ValueProposition } from './components/ValueProposition';
import { Footer } from './components/Footer';
import { ProductCatalog } from './components/ProductCatalog';
import { CategoryPage } from './components/CategoryPage';
import { AdminDashboard } from './components/AdminDashboard';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderPage } from './components/OrderPage';
import { ProfilePage } from './components/ProfilePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogin = (email: string, admin = false) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
    setUserEmail(email);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserEmail('');
    setCurrentPage('home');
  };

  const getCategoryFromPage = (page: string) => {
    const categoryMap: { [key: string]: string } = {
      'category-home-living': 'Home & Living',
      'category-kitchen-essentials': 'Kitchen Essentials', 
      'category-work-productivity': 'Work & Productivity',
      'category-wellness-self-care': 'Wellness & Self-Care',
      'category-garden-outdoor': 'Garden & Outdoor'
    };
    return categoryMap[page] || 'All Products';
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <main>
            <HeroSection onNavigate={handleNavigate} />
            <FeaturedProducts onNavigate={handleNavigate} />
            <Categories onNavigate={handleNavigate} />
            <ValueProposition />
          </main>
        );
      
      case 'products':
        return <ProductCatalog selectedCategory="All Products" />;
      
      case 'category-home-living':
      case 'category-kitchen-essentials':
      case 'category-work-productivity':
      case 'category-wellness-self-care':
      case 'category-garden-outdoor':
        return <CategoryPage category={getCategoryFromPage(currentPage)} />;
      
      case 'categories':
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
              <Categories onNavigate={handleNavigate} />
            </div>
          </div>
        );
      
      case 'about':
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
      
      case 'contact':
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-16">
                  <h1 className="text-4xl font-bold mb-4">
                    Get in <span className="text-orange-500">Touch</span>
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    We'd love to hear from you
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Email Us</h3>
                      <p className="text-muted-foreground">hello@suni.com</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Call Us</h3>
                      <p className="text-muted-foreground">1-800-SUNI-HELP</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Visit Our Store</h3>
                    <p className="text-muted-foreground">
                      123 Sunshine Blvd<br />
                      San Francisco, CA 94102
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Customer Support Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9AM - 8PM PST<br />
                      Saturday - Sunday: 10AM - 6PM PST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // Admin
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;

      // Checkout & Orders
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} userEmail={userEmail} />;
      
      case 'order-confirmation':
        return <OrderPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} orderType="confirmation" />;
      
      case 'order-history':
        return <OrderPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} orderType="history" />;
      
      case 'order-tracking':
        return <OrderPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} orderType="tracking" />;

      // Profile & Account
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} profileType="account" />;
      
      case 'guest-lookup':
        return <ProfilePage onNavigate={handleNavigate} isLoggedIn={false} profileType="guest-lookup" />;

      // Login/Demo
      case 'login':
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
              <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                  <p className="text-muted-foreground">Sign in to your Suni account</p>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => handleLogin('john.doe@email.com', false)}
                    className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium">Login as Customer</div>
                    <div className="text-sm text-muted-foreground">john.doe@email.com</div>
                  </button>
                  <button
                    onClick={() => handleLogin('admin@suni.com', true)}
                    className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium">Login as Admin</div>
                    <div className="text-sm text-muted-foreground">admin@suni.com</div>
                  </button>
                  <button
                    onClick={() => handleNavigate('guest-lookup')}
                    className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium">Guest Order Lookup</div>
                    <div className="text-sm text-muted-foreground">Find your orders without an account</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <main>
            <HeroSection onNavigate={handleNavigate} />
            <FeaturedProducts onNavigate={handleNavigate} />
            <Categories onNavigate={handleNavigate} />
            <ValueProposition />
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {currentPage !== 'login' && currentPage !== 'admin' && (
        <Header 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          userEmail={userEmail}
          onLogin={() => handleNavigate('login')}
          onLogout={handleLogout}
        />
      )}
      {renderPage()}
      {currentPage !== 'login' && currentPage !== 'admin' && <Footer />}
    </div>
  );
}