import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
// import Features from '../components/Features';
// import HowItWorks from '../components/HowItWorks';
// import Screenshots from '../components/Screenshots';
// import CallToAction from '../components/CallToAction';
// import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Main Content - Add top padding for fixed nav */}
      <main className="pt-16">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Screenshots/Demo Section */}
        <Screenshots />

        {/* Call to Action & Social Proof */}
        <CallToAction />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Styles */}
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
