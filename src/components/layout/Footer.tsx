import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Home className="h-6 w-6" />
              <span className="font-bold text-xl">RealReview</span>
            </Link>
            <p className="text-indigo-200 text-sm mb-4">
              Find your perfect home with authentic reviews and property insights from real people.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-indigo-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-indigo-200 hover:text-white transition-colors">
                  Upload Property
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-indigo-200 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Property Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Property Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                  Apartments
                </a>
              </li>
              <li>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                  Houses
                </a>
              </li>
              <li>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                  Commercial
                </a>
              </li>
              <li>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                  New Developments
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-indigo-300 mt-0.5" />
                <span className="text-indigo-200">(123) 456-7890</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-indigo-300 mt-0.5" />
                <span className="text-indigo-200">contact@realreview.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-800 mt-8 pt-6 text-center text-indigo-300 text-sm">
          <p>&copy; {new Date().getFullYear()} RealReview. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;