import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Film, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'signIn' | 'signUp'>('signIn');
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when changing routes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const openAuthModal = (view: 'signIn' | 'signUp') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'bg-background shadow-md' : 'bg-background/80 backdrop-blur-sm'
        }`}
      >
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Film className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight text-text-primary">
                Raters
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-text-primary hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/rate" className="text-text-primary hover:text-primary transition-colors">
                Rate Movies
              </Link>
              <Link to="/about" className="text-text-primary hover:text-primary transition-colors">
                About Us
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-text-primary hover:text-primary transition-colors">Profile</span>
                  </Link>
                  <button 
                    onClick={() => logout()}
                    className="btn-secondary"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => openAuthModal('signIn')}
                    className="text-text-primary hover:text-primary transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signUp')}
                    className="btn-primary"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-card border-t border-border animate-fadeIn">
            <div className="container-custom py-4 flex flex-col space-y-4">
              <Link to="/" className="text-text-primary hover:text-primary transition-colors py-2">
                Home
              </Link>
              <Link to="/rate" className="text-text-primary hover:text-primary transition-colors py-2">
                Rate Movies
              </Link>
              <Link to="/about" className="text-text-primary hover:text-primary transition-colors py-2">
                About Us
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="text-text-primary hover:text-primary transition-colors py-2">
                    Profile
                  </Link>
                  <button 
                    onClick={() => logout()}
                    className="btn-secondary w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-4 pt-2">
                  <button
                    onClick={() => openAuthModal('signIn')}
                    className="text-text-primary hover:text-primary transition-colors py-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signUp')}
                    className="btn-primary text-center"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
      />
    </>
  );
};

export default Header;