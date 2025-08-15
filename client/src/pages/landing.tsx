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
                  <div className="text-2xl font-bold text-sage">15+</div>
                  <div className="text-sm text-warm-gray">Active Rides</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage">8+</div>
                  <div className="text-sm text-warm-gray">Cities Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage">100%</div>
                  <div className="text-sm text-warm-gray">Free to Join</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-sage to-orange rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                
                {/* Cycling Scene Illustration */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Top section with cyclists */}
                  <div className="flex justify-between items-start pt-4">
                    <div className="flex flex-col items-center space-y-1">
                      <i className="fas fa-bicycle text-2xl opacity-70 transform -rotate-12"></i>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-xs"></i>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <i className="fas fa-bicycle text-3xl opacity-90"></i>
                      <div className="w-6 h-6 bg-yellow/30 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-xs"></i>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <i className="fas fa-bicycle text-2xl opacity-60 transform rotate-12"></i>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-xs"></i>
                      </div>
                    </div>
                  </div>

                  {/* Center content */}
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Join Your First Ride</h3>
                      <p className="text-sm opacity-90">
                        From coffee shop tours to mountain adventures - 
                        find rides that match your style and skill level.
                      </p>
                    </div>
                  </div>

                  {/* Bottom section with path/route */}
                  <div className="flex justify-center items-end pb-4">
                    <div className="flex items-center space-x-2 opacity-60">
                      <i className="fas fa-map-marker-alt text-lg"></i>
                      <div className="w-12 h-1 bg-white/40 rounded-full"></div>
                      <div className="w-8 h-1 bg-white/60 rounded-full"></div>
                      <div className="w-4 h-1 bg-white/40 rounded-full"></div>
                      <i className="fas fa-flag text-lg"></i>
                    </div>
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
              <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-map-marked-alt text-sage text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-charcoal">Interactive Maps</h3>
              <p className="text-warm-gray">
                Explore rides on our interactive map. See exact starting locations, 
                difficulty levels, and route details at a glance.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-users text-sage text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-charcoal">Find Your Community</h3>
              <p className="text-warm-gray">
                Connect with cyclists who share your passion. From beginners to experts, 
                there's a group for every rider.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-plus-circle text-sage text-2xl"></i>
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