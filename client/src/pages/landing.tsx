import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const handleSignIn = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    setAuthMode("register");
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-sage/10">
      {/* Header */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center">
            <i className="fas fa-bicycle text-white text-sm"></i>
          </div>
          <span className="font-bold text-xl text-charcoal">GroupRideApp</span>
        </div>
        <div className="space-x-3">
          <Button 
            variant="outline" 
            onClick={handleSignIn}
            data-testid="button-sign-in"
          >
            Sign In
          </Button>
          <Button 
            onClick={handleSignUp}
            className="bg-sage hover:bg-sage"
            data-testid="button-sign-up"
          >
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-charcoal leading-tight">
                  Connect with cyclists.
                  <br />
                  <span className="text-sage">Discover group rides.</span>
                </h1>
                <p className="text-xl text-warm-gray max-w-lg">
                  Join a community of passionate cyclists. Find rides that match your pace, 
                  create memorable adventures, and explore your city on two wheels.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={handleSignUp}
                  className="bg-sage hover:bg-sage text-lg px-8 py-3"
                  data-testid="button-get-started"
                >
                  Get Started Free
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={handleSignIn}
                  className="text-lg px-8 py-3"
                  data-testid="button-explore-rides"
                >
                  Explore Rides
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow">15+</div>
                  <div className="text-sm text-warm-gray">Active Rides</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange">8+</div>
                  <div className="text-sm text-warm-gray">Cities Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red">100%</div>
                  <div className="text-sm text-warm-gray">Free to Join</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-sage to-orange rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                
                {/* Cycling Scene Illustration - SVG based */}
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center space-y-6">
                  {/* Cycling Scene SVG */}
                  <div className="w-32 h-32 relative">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Background hills */}
                      <path d="M0 120 C50 100, 100 110, 150 95 C170 90, 200 100, 200 110 L200 200 L0 200 Z" fill="rgba(255,255,255,0.1)"/>
                      
                      {/* Cyclists - simplified bike shapes */}
                      <g transform="translate(30, 80)">
                        {/* Bike 1 */}
                        <circle cx="10" cy="15" r="8" fill="none" stroke="white" strokeWidth="2" opacity="0.7"/>
                        <circle cx="35" cy="15" r="8" fill="none" stroke="white" strokeWidth="2" opacity="0.7"/>
                        <line x1="10" y1="15" x2="35" y2="15" stroke="white" strokeWidth="2" opacity="0.7"/>
                        <line x1="22.5" y1="15" x2="22.5" y2="5" stroke="white" strokeWidth="2" opacity="0.7"/>
                        {/* Rider */}
                        <circle cx="22.5" cy="0" r="3" fill="rgba(255,255,255,0.8)"/>
                      </g>
                      
                      <g transform="translate(80, 75)">
                        {/* Bike 2 - main cyclist */}
                        <circle cx="10" cy="15" r="8" fill="none" stroke="white" strokeWidth="3" opacity="0.9"/>
                        <circle cx="35" cy="15" r="8" fill="none" stroke="white" strokeWidth="3" opacity="0.9"/>
                        <line x1="10" y1="15" x2="35" y2="15" stroke="white" strokeWidth="3" opacity="0.9"/>
                        <line x1="22.5" y1="15" x2="22.5" y2="5" stroke="white" strokeWidth="3" opacity="0.9"/>
                        {/* Rider */}
                        <circle cx="22.5" cy="0" r="4" fill="rgba(255,255,0,0.6)"/>
                      </g>
                      
                      <g transform="translate(130, 85)">
                        {/* Bike 3 */}
                        <circle cx="10" cy="15" r="8" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
                        <circle cx="35" cy="15" r="8" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
                        <line x1="10" y1="15" x2="35" y2="15" stroke="white" strokeWidth="2" opacity="0.6"/>
                        <line x1="22.5" y1="15" x2="22.5" y2="5" stroke="white" strokeWidth="2" opacity="0.6"/>
                        {/* Rider */}
                        <circle cx="22.5" cy="0" r="3" fill="rgba(255,255,255,0.7)"/>
                      </g>
                      
                      {/* Route path */}
                      <path d="M20 160 Q100 150, 180 160" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeDasharray="5,5"/>
                      
                      {/* Start and end markers */}
                      <circle cx="20" cy="160" r="4" fill="rgba(255,255,255,0.8)"/>
                      <circle cx="180" cy="160" r="4" fill="rgba(255,255,255,0.8)"/>
                    </svg>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Join Your First Ride</h3>
                    <p className="text-sm opacity-90">
                      From coffee shop tours to mountain adventures - 
                      find rides that match your style and skill level.
                    </p>
                  </div>
                </div>

                {/* Background decorative elements */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-12 left-6 w-8 h-8 bg-white/10 rounded-full"></div>
                <div className="absolute top-1/3 left-8 w-4 h-4 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-1/3 right-8 w-6 h-6 bg-white/10 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Everything you need for group cycling
            </h2>
            <p className="text-warm-gray max-w-2xl mx-auto">
              Our platform makes it easy to discover rides, connect with cyclists, 
              and build lasting friendships in the cycling community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-charcoal">Interactive Maps</h3>
              <p className="text-warm-gray">
                Explore rides on our interactive map. See exact starting locations, 
                difficulty levels, and route details at a glance.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-orange" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.997 2.997 0 0 0 17.09 7c-.8 0-1.54.37-2.01.99l-2.54 3.31c-.74.97-.74 2.31 0 3.28L15 18v4h1zm-8 0v-6h-2l2-7.63A2.997 2.997 0 0 1 14.91 7c.8 0 1.54.37 2.01.99l2.54 3.31c.74.97.74 2.31 0 3.28L17 18v4h-1z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-charcoal">Find Your Community</h3>
              <p className="text-warm-gray">
                Connect with cyclists who share your passion. From beginners to experts, 
                there's a group for every rider.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-charcoal">Create & Organize</h3>
              <p className="text-warm-gray">
                Organize your own rides and become a community leader. 
                Set the pace, choose the route, and build your cycling network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-16 bg-sage text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Ready to start your cycling adventure?
          </h2>
          <p className="text-xl opacity-90">
            Join thousands of cyclists who've found their perfect riding community.
          </p>
          <Button 
            size="lg"
            onClick={handleSignUp}
            className="bg-white text-sage hover:bg-gray-100 text-lg px-8 py-3"
            data-testid="button-join-now"
          >
            Join GroupRideApp Today
            <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onModeChange={setAuthMode}
        />
      )}
    </div>
  );
}