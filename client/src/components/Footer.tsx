import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay in the Loop</h3>
              <p className="text-slate-300">
                Get the latest updates on new products, exclusive offers, and lifestyle tips that make every day shine brighter.
              </p>
            </div>
            <div className="flex gap-4">
              <Input 
                placeholder="Enter your email" 
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 flex-1"
              />
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-2xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                suni
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Making everyday shining with carefully curated products that bring joy, functionality, and beauty to your daily life.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-slate-800 text-slate-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-slate-800 text-slate-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-slate-800 text-slate-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-slate-800 text-slate-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Products', 'Categories', 'New Arrivals', 'Best Sellers', 'Sale'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Customer Service</h4>
            <ul className="space-y-3">
              {['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'FAQ', 'Track Your Order'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400" />
                <span className="text-slate-300">hello@suni.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <span className="text-slate-300">1-800-SUNI-HELP</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-400" />
                <span className="text-slate-300">123 Sunshine Blvd<br />San Francisco, CA 94102</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-800 rounded-lg">
              <h5 className="font-semibold mb-2">Customer Support Hours</h5>
              <p className="text-sm text-slate-300">
                Monday - Friday: 9AM - 8PM PST<br />
                Saturday - Sunday: 10AM - 6PM PST
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 Suni. All rights reserved. Making everyday shining since 2020.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}