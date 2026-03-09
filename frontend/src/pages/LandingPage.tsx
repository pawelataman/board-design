import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import StatsBar from "../components/landing/StatsBar";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Testimonials from "../components/landing/Testimonials";
import CallToAction from "../components/landing/CallToAction";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-[#04070d] text-white">
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}
