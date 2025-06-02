import React from 'react';
import { Film, Star, Users, Code, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to Raters
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              A dynamic new web application designed for movie lovers and critics alike. Raters is a movie rating platform where users can discover, rate, and review films from all genres. Whether you're looking to share your opinions on the latest blockbuster, explore top-rated classics, or find hidden cinematic gems, Raters offers a user-friendly space to connect with a community that shares your passion for movies. Built with a focus on simplicity, interactivity, and real-time feedback, Raters aims to become your go-to destination for all things film.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      </section>

      {/* Developer Introduction */}
      <section className="py-16 bg-card">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Meet the Developer</h2>
            <div className="card p-8">
              <p className="text-lg text-text-secondary leading-relaxed mb-6">
                Hi, I'm MOHAMED AL AFSAL, developer of Raters, a modern web application built for movie enthusiasts to rate, review, and discover films. Raters offers an intuitive and interactive platform where users can engage with a wide range of movie content—whether it's sharing their thoughts on the latest releases, checking ratings, or browsing recommendations based on real user feedback.
              </p>
              <p className="text-lg text-text-secondary leading-relaxed mb-6">
                Raters is built using HTML, CSS, and JavaScript for the frontend, ensuring a clean and responsive user interface. On the backend, I'm using Python with the Django framework to manage data, handle user interactions, and serve content efficiently. For the database, I'm integrating Supabase, a scalable and real-time backend that supports smooth data storage and retrieval.
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                This project reflects my passion for both web development and cinema. My goal is to create a seamless experience where users feel part of a growing movie-loving community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Raters Special</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comprehensive Database</h3>
              <p className="text-text-secondary">
                Access a vast collection of movies with real-time ratings and detailed information.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Recommendations</h3>
              <p className="text-text-secondary">
                Get personalized movie suggestions based on your ratings and preferences.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Vibrant Community</h3>
              <p className="text-text-secondary">
                Connect with fellow movie enthusiasts and share your thoughts on films.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Excellence */}
      <section className="py-16 bg-card">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Built with Technical Excellence</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Modern Stack</h3>
              <p className="text-text-secondary">
                Built with React and TypeScript for a robust, type-safe frontend experience.
              </p>
            </div>
            <div className="card p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
              <p className="text-text-secondary">
                Powered by Supabase for instant data synchronization and live updates.
              </p>
            </div>
            <div className="card p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-text-secondary">
                Optimized performance with efficient caching and lazy loading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us in Celebrating Cinema</h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Whether you're a casual viewer or a dedicated critic, Raters is your home for authentic movie discussions and discoveries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Create Account
            </Link>
            <Link to="/rate" className="btn-secondary text-lg px-8 py-3">
              Start Rating
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;