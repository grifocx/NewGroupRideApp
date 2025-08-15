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
                  onClick={handleSignIn}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 text-lg px-12 py-4 rounded-2xl backdrop-blur-sm font-medium"
                  data-testid="button-explore-rides"
                >
                  Explore Rides
                </Button>
              </div>

              {/* Social Proof */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">15+</div>
                  <div className="text-white/70">Available Rides</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">USA</div>
                  <div className="text-white/70">Coast to Coast</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">Free</div>
                  <div className="text-white/70">Always Free</div>
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
                    Find rides
                    <br />
                    <span className="text-cyan-400">everywhere</span>
                  </h2>
                  
                  <p className="text-xl text-white/70 leading-relaxed">
                    Browse group rides across major US cities. See starting locations, 
                    difficulty levels, and join rides that match your cycling goals.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Interactive Maps</div>
                      <div className="text-white/60 text-sm">See exact starting locations for every ride</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.997 2.997 0 0 0 17.09 7c-.8 0-1.54.37-2.01.99l-2.54 3.31c-.74.97-.74 2.31 0 3.28L15 18v4h1zm-8 0v-6h-2l2-7.63A2.997 2.997 0 0 1 14.91 7c.8 0 1.54.37 2.01.99l2.54 3.31c.74.97.74 2.31 0 3.28L17 18v4h-1z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Skill Levels</div>
                      <div className="text-white/60 text-sm">From beginner to advanced rides</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 4c2 0 4 1 4 4v8c0 3-2 4-4 4H8c-2 0-4-1-4-4V8c0-3 2-4 4-4h8m0-2H8C5 2 2 5 2 8v8c0 3 3 6 8 6h8c5 0 8-3 8-6V8c0-3-3-6-8-6z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">User Profiles</div>
                      <div className="text-white/60 text-sm">Connect with fellow cyclists</div>
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
                      <h3 className="text-2xl font-bold text-white mb-2">Interactive Maps</h3>
                      <p className="text-white/60">Browse rides and see starting locations</p>
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
                onClick={handleSignIn}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 text-lg px-12 py-4 rounded-2xl backdrop-blur-sm font-medium"
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