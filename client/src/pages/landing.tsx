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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="px-6 py-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sage rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 5.5c1 0 2-.5 2-1.5s-1-1.5-2-1.5-2 .5-2 1.5 1 1.5 2 1.5zm4.5 4.5c0-1-1-2-2-2h-1l-1.5-3c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2.5 1.5L9 7H8c-1 0-2 1-2 2s1 2 2 2h1l1 2v6h2v-4l2-2 2 2v4h2v-6l1-2h1c1 0 2-1 2-2z"/>
              </svg>
            </div>
            <span className="font-bold text-2xl text-charcoal">GroupRideApp</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleSignIn}
              className="text-warm-gray hover:text-charcoal"
              data-testid="button-sign-in"
            >
              Sign In
            </Button>
            <Button 
              onClick={handleSignUp}
              className="bg-sage hover:bg-sage text-white px-6 py-2 rounded-xl font-medium"
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
        <section className="px-6 py-20 bg-gradient-to-br from-cream/30 via-white to-sage/5">
          <div className="max-w-6xl mx-auto text-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl font-bold text-charcoal leading-tight">
                  <span className="bg-gradient-to-r from-sage to-orange bg-clip-text text-transparent">Discover</span>
                  <br />
                  Your Perfect Ride
                </h1>
                <p className="text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
                  Connect with local cyclists, discover amazing routes, and join group rides 
                  that match your style and skill level. Your cycling community awaits.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={handleSignUp}
                  className="bg-sage hover:bg-sage text-white text-lg px-10 py-4 rounded-xl font-medium shadow-lg"
                  data-testid="button-get-started"
                >
                  Start Riding Today
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={handleSignIn}
                  className="text-lg px-10 py-4 rounded-xl border-2 border-gray-200 hover:border-sage"
                  data-testid="button-explore-rides"
                >
                  Explore Rides
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex justify-center items-center space-x-8 pt-8 text-sm text-warm-gray">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow rounded-full"></div>
                  <span>Free to join</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange rounded-full"></div>
                  <span>15+ active rides</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red rounded-full"></div>
                  <span>8 cities</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Preview */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-charcoal">
                    Discover rides near you
                  </h2>
                  <p className="text-lg text-warm-gray leading-relaxed">
                    Interactive maps show you exactly where rides start, difficulty levels, 
                    and who's joining. Find your perfect match in seconds.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow/20 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-yellow rounded-full"></div>
                    </div>
                    <span className="text-charcoal font-medium">Real-time ride updates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange/20 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-orange rounded-full"></div>
                    </div>
                    <span className="text-charcoal font-medium">Skill-based matching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red/20 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-red rounded-full"></div>
                    </div>
                    <span className="text-charcoal font-medium">Safe group riding</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-sage/10 to-orange/10 rounded-3xl p-8 aspect-square flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-sage/20 rounded-2xl mx-auto flex items-center justify-center">
                      <svg className="w-12 h-12 text-sage" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-charcoal">Interactive Map</h3>
                    <p className="text-warm-gray text-sm">See all rides at a glance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 py-20 bg-gradient-to-r from-sage to-orange text-white">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">
                Ready to join the ride?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Connect with local cyclists, discover new routes, and make every ride an adventure. 
                Your cycling community is waiting.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={handleSignUp}
                className="bg-white text-sage hover:bg-gray-100 text-lg px-10 py-4 rounded-xl font-medium shadow-lg"
                data-testid="button-join-now"
              >
                Get Started Free
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={handleSignIn}
                className="text-white border-2 border-white/30 hover:border-white hover:bg-white/10 text-lg px-10 py-4 rounded-xl"
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