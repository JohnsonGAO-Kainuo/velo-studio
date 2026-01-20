import { Button } from "../ui/button";
import {
  Zap,
  Shield,
  Check,
  Menu,
  X,
  Github,
  Monitor,
  Video,
  Mic,
  Settings,
  ArrowRight,
  Globe,
  Layers,
  Cpu
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import "./radio-inputs.css";

// --- Components ---

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSelection, setNavSelection] = useState("Product");

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
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#202020] rounded-xl flex items-center justify-center shadow-lg shadow-black/5 transition-transform group-hover:scale-105">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#202020]">Velo</span>
          </a>

          <div className="hidden md:flex items-center">
            <div className="radio-inputs" role="tablist" aria-label="Main nav">
              {[
                { key: "Product", label: "Product" },
                { key: "Features", label: "Features" },
                { key: "Pricing", label: "Pricing" },
                { key: "Changelog", label: "Changelog" },
              ].map((it) => (
                <div className="radio" key={it.key}>
                  <input
                    id={`nav-${it.key}`}
                    name="nav"
                    type="radio"
                    checked={navSelection === it.key}
                    onChange={() => setNavSelection(it.key)}
                  />
                  <label
                    htmlFor={`nav-${it.key}`}
                    className="name"
                    onClick={() => setNavSelection(it.key)}
                  >
                    <span className="text-sm font-medium" style={{ color: navSelection === it.key ? '#202020' : '#5c5c5c' }}>{it.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-[#5c5c5c] hover:text-[#202020] transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
          <Button className="bg-[#202020] hover:bg-[#000000] text-white rounded-xl px-6 h-10 text-sm font-medium shadow-xl shadow-black/10 transition-all hover:shadow-2xl hover:scale-105 active:scale-95">
            Download Now
          </Button>
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

function Hero() {
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
          <Button className="h-14 px-8 rounded-2xl bg-[#202020] text-white hover:bg-[#000000] text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10">
            <Monitor className="w-5 h-5 mr-2" />
            Download for Free
          </Button>
          <Button
            variant="ghost"
            className="h-14 px-8 rounded-2xl text-[#5c5c5c] hover:bg-black/5 text-lg font-medium transition-all hover:scale-105 active:scale-95"
          >
            <Github className="w-5 h-5 mr-2" />
            View Source
          </Button>
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

function Features() {
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

function Pricing() {
    return (
        <section className="py-32 px-6 bg-white border-y border-black/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-bold text-[#202020] mb-4">Simple, transparent pricing</h2>
                    <p className="text-[#5c5c5c] text-lg">Choose the plan that's right for you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="p-8 rounded-3xl bg-[#f9f9f9] border border-black/5 flex flex-col">
                        <div className="mb-4">
                            <span className="text-sm font-semibold text-[#5c5c5c] uppercase tracking-wider">Starter</span>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-[#202020]">$0</span>
                            <span className="text-[#5c5c5c]">/forever</span>
                        </div>
                        <p className="text-[#5c5c5c] text-sm mb-8">Perfect for hobbyists and occasional users.</p>
                        <Button variant="outline" className="w-full rounded-xl border-black/10 hover:bg-white text-[#202020] mb-8">Download Free</Button>
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
                    <div className="p-8 rounded-3xl bg-[#202020] text-white flex flex-col relative shadow-2xl shadow-black/20 transform md:-translate-y-4">
                         <div className="absolute top-0 right-0 p-4">
                             <span className="bg-white text-[#202020] text-xs font-bold px-3 py-1 rounded-full">Popular</span>
                         </div>
                        <div className="mb-4">
                            <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">Pro</span>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-white">$12</span>
                            <span className="text-white/60">/month</span>
                        </div>
                        <p className="text-white/60 text-sm mb-8">For professionals who need power and flexibility.</p>
                        <Button className="w-full rounded-xl bg-white text-[#202020] hover:bg-gray-100 mb-8 font-semibold">Get Started</Button>
                        <ul className="space-y-4 flex-1">
                            {["4K Recording", "Unlimited time", "Cloud Sync", "Priority Support", "Advanced Editor"].map(item => (
                                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                                    <Check className="w-4 h-4 text-white" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Team Plan */}
                    <div className="p-8 rounded-3xl bg-[#f9f9f9] border border-black/5 flex flex-col">
                        <div className="mb-4">
                            <span className="text-sm font-semibold text-[#5c5c5c] uppercase tracking-wider">Team</span>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-[#202020]">$29</span>
                            <span className="text-[#5c5c5c]">/month</span>
                        </div>
                        <p className="text-[#5c5c5c] text-sm mb-8">Collaborative features for growing teams.</p>
                        <Button variant="outline" className="w-full rounded-xl border-black/10 hover:bg-white text-[#202020] mb-8">Contact Sales</Button>
                         <ul className="space-y-4 flex-1">
                            {["Everything in Pro", "Team Management", "SSO Integration", "Centralized Billing"].map(item => (
                                <li key={item} className="flex items-center gap-3 text-sm text-[#5c5c5c]">
                                    <Check className="w-4 h-4 text-[#202020]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

function Footer() {
  return (
    <footer className="py-20 px-6 bg-[#f2f2f2] border-t border-black/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#202020] rounded-lg flex items-center justify-center text-white">
              <Monitor className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-[#202020]">Velo Studio</span>
          </div>
          <p className="text-[#5c5c5c] text-sm leading-relaxed mb-6">
            Crafting the future of screen recording with pixel-perfect design and robust engineering.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-full bg-white border border-black/5 text-[#5c5c5c] hover:text-[#202020] hover:scale-110 transition-all">
                <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-white border border-black/5 text-[#5c5c5c] hover:text-[#202020] hover:scale-110 transition-all">
                <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full md:w-auto">
          {[
            { header: "Product", links: ["Features", "Pricing", "Changelog", "Docs"] },
            { header: "Company", links: ["About", "Careers", "Blog", "Contact"] },
            { header: "Resources", links: ["Community", "Help Center", "Partners", "Status"] },
            { header: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[#202020] font-bold text-sm mb-6">{col.header}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[#5c5c5c] hover:text-[#202020] transition-colors text-sm font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#5c5c5c]">
        <p>© 2026 Velo Studio Inc. All rights reserved.</p>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>All systems operational</span>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#5c5c5c] font-sans selection:bg-[#202020] selection:text-white">
      <NavBar />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
