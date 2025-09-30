import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import CategoriesPage from './pages/Categories';
import CategoryPage from './pages/CategoryPage';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

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
        return <Home onNavigate={handleNavigate} />;
      
      case 'products':
        return <Products />;
      
      case 'category-home-living':
      case 'category-kitchen-essentials':
      case 'category-work-productivity':
      case 'category-wellness-self-care':
      case 'category-garden-outdoor':
        return <CategoryPage category={getCategoryFromPage(currentPage)} />;
      
      case 'categories':
        return <CategoriesPage onNavigate={handleNavigate} />;
      
      case 'about':
        return <About />;
      
      case 'contact':
        return <Contact />;

      // Admin
      case 'admin':
        return <Admin onNavigate={handleNavigate} />;

      // Checkout & Orders
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} isLoggedIn={isLoggedIn} userEmail={userEmail} />;
      
      case 'order-confirmation':
        return <Orders onNavigate={handleNavigate} isLoggedIn={isLoggedIn} orderType="confirmation" />;
      
      case 'order-history':
        return <Orders onNavigate={handleNavigate} isLoggedIn={isLoggedIn} orderType="history" />;
      
      case 'order-tracking':
        return <Orders onNavigate={handleNavigate} isLoggedIn={isLoggedIn} orderType="tracking" />;

      // Profile & Account
      case 'profile':
        return <Profile onNavigate={handleNavigate} isLoggedIn={isLoggedIn} profileType="account" />;
      
      case 'guest-lookup':
        return <Profile onNavigate={handleNavigate} isLoggedIn={false} profileType="guest-lookup" />;

      // Login/Demo
      case 'login':
        return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
      
      default:
        return <Home onNavigate={handleNavigate} />;
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