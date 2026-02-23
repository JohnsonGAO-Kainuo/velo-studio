import { 
  Hero, 
  Features, 
  Pricing, 
  Footer, 
  NavBar,
  FAQ
} from './LandingPage';
import { PrivacyPolicy, TermsOfService } from './LegalPages';
import { AuthPage } from './AuthPage';
import { AuthCallback } from './AuthCallback';
import { DashboardPage } from './DashboardPage';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '@/hooks/useAuth';

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
    // Re-using Hero as the main "Product" view for now
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
    <AuthProvider>
      <div className="min-h-screen bg-[#f2f2f2] text-[#5c5c5c] font-sans selection:bg-[#202020] selection:text-white">
        <ScrollToTop />
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/auth" element={<div className="pt-20"><AuthPage /></div>} />
          <Route path="/auth/callback" element={<div className="pt-20"><AuthCallback /></div>} />
          <Route path="/dashboard" element={<div className="pt-20"><DashboardPage /></div>} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}
