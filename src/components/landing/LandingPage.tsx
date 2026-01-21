import { Button } from "../ui/button";
import {
  Zap,
  Shield,
  Check,
  Menu,
  X,
  Monitor,
  Video,
  Mic,
  Settings,
  ArrowRight,
  Globe,
  Layers,
  Cpu,
  Plus,
  Minus
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import "./radio-inputs.css";
import "./uiverse-buttons.css";

import { Link, useLocation } from "react-router-dom";


export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 132 95" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M54.2871 83.816L55.3736 83.8112C55.9723 83.8112 58.4157 83.8643 60.8059 83.9319C66.2431 84.0864 70.7918 82.2712 74.5679 77.0574H75.0508L77.5859 73.316C78.9814 71.2595 80.1741 69.3043 80.3624 68.3678C84.38 62.1209 104.023 19.9905 104.023 18.7643C104.023 18.0498 103.203 18.074 100.523 18.8753L99.6775 19.1264L97.8667 19.7588C92.2798 21.7188 86.6205 25.5084 74.0851 37.4712C83.704 17.8229 97.7846 7.9119 112.739 7.1781C120.103 6.81603 120.04 6.21258 113.937 18.7933C111.131 24.5816 105.033 37.6547 100.392 47.836C87.1227 76.956 83.0376 82.9567 74.3893 86.0512C69.2997 87.8712 61.7234 87.5526 57.3051 85.3319L54.2871 83.816Z" fill="#89A389"/>
      <path d="M61.0469 63.0575C46.9179 31.0313 43.813 27.203 35.0923 25.0596L32.5571 24.4368C28.2547 19.223 26.7337 17.1616 26.4005 16.4858L25.7969 15.2644C47.1642 17.3596 55.064 25.2672 63.5482 47.4885L66.3585 54.8506L64.5043 58.592C63.4854 60.6485 62.2879 62.4975 61.0469 63.0575Z" fill="#89A389"/>
      <path d="M54.2877 83.8161C47.455 77.8202 42.293 68.6767 34.4318 50.9885C22.6834 24.5526 18.9701 19.0057 11.2006 16.3071C6.29456 14.6029 6 14.3133 6 11.2236C6 5.72984 10.5294 5.59467 19.2405 10.8229C21.9156 12.4305 24.4894 14.0864 24.9529 14.5016L25.7979 15.2643L26.4015 16.4857C26.7347 17.1616 28.2558 19.2229 32.5582 24.4367L32.6789 25.4891C32.9059 27.454 48.5801 61.334 52.1002 67.4698C57.5133 76.9029 61.8785 79.4085 74.5685 77.0574C70.7924 82.2712 66.2437 84.0864 60.8065 83.9319C58.4163 83.8643 55.9729 83.8112 55.3741 83.8112L54.2877 83.8161Z" fill="#595B60"/>
      <path d="M74.0861 37.4713C86.6216 25.5085 92.2809 21.7189 97.8678 19.7589L99.6786 19.1265C99.6786 19.8941 98.6452 20.734 97.3849 21.4823C91.3876 25.0596 84.5935 34.4299 79.4605 46.2237C75.6748 54.9182 74.4531 56.6175 72.3719 56.0961C70.875 55.7196 68.6972 51.2444 69.1173 49.4099C69.9092 45.9872 72.6857 38.4658 73.328 38.012L74.0861 37.4713Z" fill="#595B60"/>
      <path d="M75.0503 77.0575C74.6495 76.3092 73.8962 76.092 73.114 76.092C70.3761 76.092 66.8945 72.9733 63.8234 67.7644L61.0469 63.0575C62.2879 62.4975 63.4854 60.6485 64.5043 58.592L66.3585 54.8506C72.7132 66.4513 74.4708 68.0589 78.0683 68.2471L80.3619 68.3678C80.1736 69.3044 78.9809 71.2596 77.5854 73.3161L75.0503 77.0575Z" fill="#667266"/>
    </svg>
  );
}

// --- Components ---

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname.slice(1) || 'product';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#f2f2f2]/80 backdrop-blur-xl border-b border-black/5"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#202020] rounded-xl flex items-center justify-center shadow-lg shadow-black/5 border border-black/5 transition-transform group-hover:scale-105">
              <Logo className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#202020]">Velo</span>
          </Link>

          <div className="hidden md:flex items-center">
            <div className="radio-inputs" role="tablist" aria-label="Main nav">
                {[
                { key: "product", label: "Product", path: "/" },
                { key: "features", label: "Features", path: "/features" },
                { key: "pricing", label: "Pricing", path: "/pricing" },
              ].map((it) => (
                <div className="radio" key={it.key}>
                  <Link to={it.path}>
                  <input
                    id={`nav-${it.key}`}
                    name="nav"
                    type="radio"
                    checked={currentPath === it.key || (it.key === 'product' && location.pathname === '/')}
                    onChange={() => {}}
                  />
                  <label
                    htmlFor={`nav-${it.key}`}
                    className="name"
                  >
                    <span className="text-sm font-medium" style={{ color: (currentPath === it.key || (it.key === 'product' && location.pathname === '/')) ? '#202020' : '#5c5c5c' }}>{it.label}</span>
                  </label>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            className="github-btn"
            onClick={() => window.open('https://github.com', '_blank')}
            aria-label="Star on GitHub"
          >
            <span className="svgContainer">
              <svg fill="white" viewBox="0 0 496 512" height="1.2em" aria-hidden>
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"></path>
              </svg>
            </span>
            <span className="BG" />
          </button>

          <a href="#" className="text-sm font-medium text-[#5c5c5c] hover:text-[#202020]">Sign in</a>
          <a href="#" className="text-sm font-semibold text-[#202020] hover:text-[#202020]">Sign up</a>
        </div>

        <button
          className="md:hidden p-2 text-[#202020]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#f2f2f2] border-b border-black/5 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {["Product", "Features", "Pricing", "Changelog"].map((item) => (
                <a key={item} href="#" className="text-base font-medium text-[#5c5c5c]">
                  {item}
                </a>
              ))}
              <div className="h-px bg-black/5 my-2" />
              <Button className="w-full bg-[#202020] text-white rounded-xl">Get Started</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export function Hero() {
  return (
    <section className="relative pt-40 pb-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/5 shadow-sm mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-[#5c5c5c]">Velo Studio 2.0 is live</span>
          <ArrowRight className="w-4 h-4 text-[#5c5c5c] ml-1" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-[#202020]"
        >
          Create content, <br />
          <span className="text-[#5c5c5c]">not clutter.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-[#5c5c5c] max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          The most beautiful screen recorder for macOS and Windows. 
          Export in 4K, edit instantly, and share safely.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
        >
          <button className="uiverse-download" onClick={() => {
            // Auto-detect Mac chip (Apple Silicon vs Intel)
            const isAppleSilicon = navigator.userAgent.includes('Mac') && 
              (navigator.userAgent.includes('ARM') || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0);
            const downloadUrl = isAppleSilicon 
              ? 'https://github.com/JohnsonGAO-Kainuo/velo-studio/releases/download/v1.0.0/Velo.Studio-Mac-arm64-1.0.0-Installer.dmg'
              : 'https://github.com/JohnsonGAO-Kainuo/velo-studio/releases/download/v1.0.0/Velo.Studio-Mac-x64-1.0.0-Installer.dmg';
            window.open(downloadUrl, '_blank');
          }}>
            <div className="outline" />
            <div className="state state--default">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                   <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.55-.03 3.03 1.04 3.98 1.04.95 0 2.73-1.29 4.6-1.1 1.56.06 2.76.63 3.69 1.98-3.02 1.83-2.51 5.5.94 6.89-.69 1.74-1.63 3.51-3.32 3.81zM15.5 4.36c.83-1.03 1.4-2.45 1.24-3.86-1.22.05-2.69.83-3.56 1.87-.77.93-1.45 2.41-1.27 3.8 1.36.1 2.75-.77 3.59-1.81z"/>
                </svg>
              </div>
              <p>Download for macOS</p>
            </div>
          </button>
        </motion.div>

        {/* App Window Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-black/5 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden ring-1 ring-black/5">
            {/* Window Header */}
            <div className="h-12 bg-white border-b border-black/5 flex items-center px-5 justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/5" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/5" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] border border-black/5" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#f2f2f2]">
                <Shield className="w-3 h-3 text-[#5c5c5c]" />
                <span className="text-xs font-medium text-[#5c5c5c]">velo-recording-001.mp4</span>
              </div>
              <div className="w-12" />
            </div>

            {/* Window Content */}
            <div className="aspect-[16/10] bg-[#fafafa] relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
                
                {/* Simulated UI inside the window */}
                <div className="flex flex-col gap-6 items-center z-10 w-full max-w-md">
                     <div className="bg-white p-6 rounded-2xl shadow-xl border border-black/5 w-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-semibold text-[#202020]">Screen Recording</div>
                                    <div className="text-xs text-[#5c5c5c]">Ready to capture</div>
                                </div>
                            </div>
                            <div className="px-2 py-1 bg-gray-100 rounded-md text-xs font-mono font-medium text-gray-500">1080p</div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-[#202020] rounded-full"
                                    initial={{ width: "0%" }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-[#5c5c5c]">
                                <span>Mic Input</span>
                                <span><Mic className="w-3 h-3 inline mr-1"/>Active</span>
                            </div>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <Button size="icon" className="w-12 h-12 rounded-full bg-[#ff5f57] text-white hover:bg-[#ff5f57]/90 shadow-lg shadow-red-500/20">
                            <div className="w-4 h-4 bg-white rounded-sm" />
                        </Button>
                        <Button size="icon" variant="outline" className="w-12 h-12 rounded-full bg-white border-black/5 text-[#202020] hover:bg-gray-50">
                            <Settings className="w-4 h-4" />
                        </Button>
                     </div>
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      title: "Optimized Performance",
      desc: "Built with Rust bindings for close-to-metal performance.",
      icon: <Cpu className="w-6 h-6 text-[#202020]" />,
    },
    {
      title: "Private & Secure",
      desc: "Local-only processing. Your personal data stays personal.",
      icon: <Shield className="w-6 h-6 text-[#202020]" />,
    },
    {
      title: "Cloud Sync",
      desc: "Optional sync to your favorite cloud storage providers.",
      icon: <Globe className="w-6 h-6 text-[#202020]" />,
    },
    {
      title: "Powerful Editor",
      desc: "Edit, clip, and annotate without leaving the application.",
      icon: <Layers className="w-6 h-6 text-[#202020]" />,
    },
    {
      title: "Instant Export",
      desc: "Drag and drop to share files immediately after recording.",
      icon: <Zap className="w-6 h-6 text-[#202020]" />,
    },
    {
      title: "Customizable",
      desc: "Global hotkeys, custom frame rates, and more.",
      icon: <Settings className="w-6 h-6 text-[#202020]" />,
    },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
            <span className="text-sm font-semibold text-[#202020] uppercase tracking-widest mb-2 block">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#202020] mb-6">
              Everything you need. <br/> Nothing you don't.
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group p-8 rounded-3xl bg-white border border-black/5 hover:border-black/10 hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
            >
              <div className="mb-6 w-12 h-12 rounded-2xl bg-[#f5f5f5] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              
              <h3 className="text-lg font-bold text-[#202020] mb-3">{f.title}</h3>
              <p className="text-[#5c5c5c] leading-relaxed text-sm">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
    return (
        <section className="py-32 px-6 bg-white border-y border-black/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-bold text-[#202020] mb-4">Simple, transparent pricing</h2>
                    <p className="text-[#5c5c5c] text-lg">Choose the plan that's right for you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="p-8 rounded-3xl bg-[#f9f9f9] border border-black/5 flex flex-col card">
                        <div className="mb-4">
                            <span className="text-sm font-semibold text-[#5c5c5c] uppercase tracking-wider">Starter</span>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-[#202020]">$0</span>
                            <span className="text-[#5c5c5c]">/forever</span>
                        </div>
                        <p className="text-[#5c5c5c] text-sm mb-8">Perfect for hobbyists and occasional users.</p>
                        <button className="uiverse-download mb-8" data-tooltip="Price:-$0" onClick={() => window.open('#', '_blank')}>
                          <div className="outline" />
                          <div className="state state--default">
                            <div className="icon"><Monitor className="w-5 h-5" /></div>
                            <p>Download Free</p>
                          </div>
                        </button>
                        <ul className="space-y-4 flex-1">
                            {["720p Recording", "5 Minute limit", "Local only"].map(item => (
                                <li key={item} className="flex items-center gap-3 text-sm text-[#5c5c5c]">
                                    <Check className="w-4 h-4 text-[#202020]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 rounded-3xl bg-[#f9f9f9] text-[#202020] flex flex-col relative card">
                         <div className="absolute top-0 right-0 p-4">
                         <span className="bg-white text-[#202020] text-xs font-bold px-3 py-1 rounded-full">Popular</span>
                         </div>
                        <div className="mb-4">
                            <span className="text-sm font-semibold text-[#5c5c5c] uppercase tracking-wider">Pro</span>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-[#202020]">$12</span>
                            <span className="text-[#5c5c5c]">/month</span>
                        </div>
                        <p className="text-[#5c5c5c] text-sm mb-8">For professionals who need power and flexibility.</p>
                        <button className="uiverse-download mb-8" data-tooltip="Price:-$12" onClick={() => window.open('#', '_blank')}>
                          <div className="outline" />
                          <div className="state state--default">
                            <div className="icon"><Monitor className="w-5 h-5" /></div>
                            <p>Buy Now</p>
                          </div>
                        </button>
                        <ul className="space-y-4 flex-1">
                            {["4K Recording", "Unlimited time", "Cloud Sync", "Priority Support", "Advanced Editor"].map(item => (
                                <li key={item} className="flex items-center gap-3 text-sm text-[#5c5c5c]">
                                    <Check className="w-4 h-4 text-[#202020]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* (Removed Team Plan) */}
                </div>
            </div>
        </section>
    )
}

export function Footer() {
  return (
    <footer className="py-20 px-6 bg-[#f2f2f2] border-t border-black/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#202020] border border-black/5 rounded-lg flex items-center justify-center">
              <Logo className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-[#202020]">Velo Studio</span>
          </div>
          <p className="text-[#5c5c5c] text-sm leading-relaxed mb-6">
            Crafting the future of screen recording with pixel-perfect design and robust engineering.
          </p>
            <div className="flex gap-4">
      <a href="#" className="p-2 rounded-full bg-white border border-black/5 text-[#5c5c5c] hover:text-[#202020] hover:scale-110 transition-all">
        <Globe className="w-4 h-4" />
      </a>
      </div>
        </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
          <div>
            <h4 className="text-[#202020] font-bold text-sm mb-6">Product</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/features" className="text-[#5c5c5c] hover:text-[#202020] transition-colors text-sm font-medium">Features</Link></li>
              <li><Link to="/pricing" className="text-[#5c5c5c] hover:text-[#202020] transition-colors text-sm font-medium">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#202020] font-bold text-sm mb-6">Company</h4>
             <ul className="flex flex-col gap-3">
              <li><a href="mailto:contact@kainuotech.com" className="text-[#5c5c5c] hover:text-[#202020] transition-colors text-sm font-medium">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#202020] font-bold text-sm mb-6">Legal</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/privacy" className="text-[#5c5c5c] hover:text-[#202020] transition-colors text-sm font-medium">Privacy</Link></li>
              <li><Link to="/terms" className="text-[#5c5c5c] hover:text-[#202020] transition-colors text-sm font-medium">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#5c5c5c]">
        <p>© 2026 Kainuo Innovision Tech Co., Limited. All rights reserved.</p>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>All systems operational</span>
        </div>
      </div>
    </footer>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { question: "Does Velo Studio support 4K recording?", answer: "Yes, Velo Studio supports 4K recording at 60fps on supported hardware, ensuring your content looks crisp and professional." },
    { question: "Is my data safe?", answer: "Absolutely. All recording and processing happens locally on your machine. We never upload your video files to any server unless you explicitly choose a cloud sync option." },
    { question: "Can I edit videos within the app?", answer: "Yes, Velo Studio comes with a powerful built-in editor that lets you trim, cut, annotate, and add effects to your recordings instantly." },
    { question: "Is there a Windows version?", answer: "Currently, Velo Studio is optimized for macOS. A Windows version is in development and will be released soon." },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
           <span className="text-sm font-semibold text-[#202020] uppercase tracking-widest mb-2 block">Support</span>
          <h2 className="text-4xl font-bold text-[#202020] mb-6">Frequently Asked Questions</h2>
          <p className="text-[#5c5c5c]">Have a different question? <a href="#" className="underline hover:text-[#202020]">Contact support</a></p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-black/5 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-[#202020] text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-[#5c5c5c]" />
                ) : (
                  <Plus className="w-5 h-5 text-[#5c5c5c]" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-[#5c5c5c] leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#5c5c5c] font-sans selection:bg-[#202020] selection:text-white">
      <NavBar />
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
