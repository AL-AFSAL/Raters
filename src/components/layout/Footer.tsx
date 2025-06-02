import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <Film className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight text-text-primary">
                Raters
              </span>
            </Link>
            <p className="mt-4 text-text-secondary max-w-md">
              Your go-to platform for rating and discovering movies. Share your opinions and find new favorites with our community of movie enthusiasts.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-text-secondary hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rate" className="text-text-secondary hover:text-primary transition-colors">
                  Rate Movies
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-text-secondary hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-text-secondary hover:text-primary transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/about"
                  className="text-text-secondary hover:text-primary transition-colors"
                  aria-label="Learn more about Raters"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy"
                  className="text-text-secondary hover:text-primary transition-colors"
                  aria-label="Read our Privacy Policy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms"
                  className="text-text-secondary hover:text-primary transition-colors"
                  aria-label="Read our Terms of Service"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:contact@raters.com" className="text-text-secondary hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-text-secondary">
          <p>&copy; {currentYear} Raters. All rights reserved.</p>
          <p className="mt-1 text-sm">
            Movie data provided by{' '}
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;