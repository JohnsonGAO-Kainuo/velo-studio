import { 
  Hero, 
  Features, 
  Pricing, 
  Footer, 
  NavBar,
  FAQ
} from './LandingPage';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
    </>
  );
}

function ProductPage() {
    // Re-using Hero as the main "Product" view for now, or could be a specific separate view
    return (
        <div className="pt-20">
             <Hero />
        </div>
    )
}

function FeaturesPage() {
    return (
        <div className="pt-20">
            <Features />
        </div>
    )
}

function PricingPage() {
    return (
        <div className="pt-20">
            <Pricing />
            <FAQ />
        </div>
    )
}

export function WebRoutes() {
  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#5c5c5c] font-sans selection:bg-[#202020] selection:text-white">
      <ScrollToTop />
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
