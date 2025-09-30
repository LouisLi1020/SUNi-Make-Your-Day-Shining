import { Search, ShoppingCart, Menu, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Header() {
  const location = useLocation();
  const currentPage = location.pathname;
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                suni
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`hover:text-orange-600 transition-colors ${currentPage === '/' ? 'text-orange-600' : 'text-foreground'}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`hover:text-orange-600 transition-colors ${currentPage === '/products' ? 'text-orange-600' : 'text-foreground'}`}
            >
              Products
            </Link>
            <Link 
              to="/categories" 
              className={`hover:text-orange-600 transition-colors ${currentPage.startsWith('/category') ? 'text-orange-600' : 'text-foreground'}`}
            >
              Categories
            </Link>
            <Link 
              to="/about" 
              className={`hover:text-orange-600 transition-colors ${currentPage === '/about' ? 'text-orange-600' : 'text-foreground'}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`hover:text-orange-600 transition-colors ${currentPage === '/contact' ? 'text-orange-600' : 'text-foreground'}`}
            >
              Contact
            </Link>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:flex">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 w-64 bg-muted/50 border-0 focus:bg-white"
              />
            </div>

            {/* User Account */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                title="Profile"
              >
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="hidden md:flex border-orange-200"
              >
                Sign In
              </Button>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                2
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}