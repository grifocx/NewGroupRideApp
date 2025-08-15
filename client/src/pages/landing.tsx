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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <nav className="px-6 py-6 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 5.5c1 0 2-.5 2-1.5s-1-1.5-2-1.5-2 .5-2 1.5 1 1.5 2 1.5zm4.5 4.5c0-1-1-2-2-2h-1l-1.5-3c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2.5 1.5L9 7H8c-1 0-2 1-2 2s1 2 2 2h1l1 2v6h2v-4l2-2 2 2v4h2v-6l1-2h1c1 0 2-1 2-2z"/>
              </svg>
            </div>
            <span className="font-bold text-2xl text-white">GroupRideApp</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleSignIn}
              className="text-white/70 hover:text-white hover:bg-white/10"
              data-testid="button-sign-in"
            >
              Sign In
            </Button>
            <Button 
              onClick={handleSignUp}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg"
              data-testid="button-sign-up"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        {/* Primary Hero */}
        <section className="px-6 py-32 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/70 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>15+ rides happening this week</span>
                </div>
                
                <h1 className="text-7xl md:text-8xl font-bold text-white leading-tight tracking-tight">
                  Find Your
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Cycling Tribe
                  </span>
                </h1>
                
                <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                  Join the most vibrant cycling community. Discover epic group rides, 
                  connect with like-minded cyclists, and turn every pedal into an adventure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg"
                  onClick={handleSignUp}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white text-lg px-12 py-4 rounded-2xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200"
                  data-testid="button-get-started"
                >
                  Start Your Journey
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.75 2c-.414 0-.75.336-.75.75V11H4.81l1.97-1.97c.293-.293.293-.767 0-1.06-.293-.293-.767-.293-1.06 0L2.47 11.22c-.293.293-.293.767 0 1.06l3.25 3.25c.293.293.767.293 1.06 0 .293-.293.293-.767 0-1.06L4.81 13H13v8.25c0 .414.336.75.75.75s.75-.336.75-.75V13h8.19l-1.97 1.97c-.293.293-.293.767 0 1.06.293.293.767.293 1.06 0l3.25-3.25c.293-.293.293-.767 0-1.06l-3.25-3.25c-.293-.293-.767-.293-1.06 0-.293.293-.293.767 0 1.06L19.19 11H14.5V2.75c0-.414-.336-.75-.75-.75z"/>
                  </svg>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={handleSignIn}
                  className="text-white border-2 border-white/30 hover:border-white hover:bg-white/10 text-lg px-12 py-4 rounded-2xl backdrop-blur-sm"
                  data-testid="button-explore-rides"
                >
                  Explore Rides
                </Button>
              </div>

              {/* Social Proof */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">15+</div>
                  <div className="text-white/70">Active Rides Weekly</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">8</div>
                  <div className="text-white/70">Cities Connected</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                  <div className="text-white/70">Free Community</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Preview */}
        <section className="px-6 py-24 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-cyan-500/20 rounded-full px-4 py-2 text-cyan-300 text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>Interactive Maps</span>
                  </div>
                  
                  <h2 className="text-5xl font-bold text-white leading-tight">
                    Discover rides
                    <br />
                    <span className="text-cyan-400">near you</span>
                  </h2>
                  
                  <p className="text-xl text-white/70 leading-relaxed">
                    Our intelligent map shows you rides happening in real-time. 
                    Filter by skill level, distance, and vibe to find your perfect match.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Smart Matching</div>
                      <div className="text-white/60 text-sm">AI pairs you with compatible riders</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Verified Routes</div>
                      <div className="text-white/60 text-sm">Community-tested safe paths</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Live Updates</div>
                      <div className="text-white/60 text-sm">Real-time ride status and chat</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl mx-auto flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <svg className="w-16 h-16 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Live Map Interface</h3>
                      <p className="text-white/60">See every ride, rider, and route in real-time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-white leading-tight">
                Ready to 
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"> ride together</span>?
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Join thousands of cyclists who've found their perfect riding community. 
                Your next adventure starts with a single click.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg"
                onClick={handleSignUp}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white text-lg px-12 py-4 rounded-2xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200"
                data-testid="button-join-now"
              >
                Join the Community
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={handleSignIn}
                className="text-white border-2 border-white/30 hover:border-white hover:bg-white/10 text-lg px-12 py-4 rounded-2xl backdrop-blur-sm"
                data-testid="button-sign-in-cta"
              >
                Sign In
              </Button>
            </div>
          </div>
        </section>
      </main>

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