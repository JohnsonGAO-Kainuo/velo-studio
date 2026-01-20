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
  Cpu
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import "./radio-inputs.css";
import "./uiverse-buttons.css";

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
          <button className="button">
            <div className="dots_border"></div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="sparkle" aria-hidden>
              <path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="black" fill="black" d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z" />
              <path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="black" fill="black" d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z" />
              <path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="black" fill="black" d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z" />
            </svg>
            <span className="text_button">Download for macOS</span>
          </button>

          <button className="github-btn" onClick={() => window.open('https://github.com', '_blank')} aria-label="View source">
            <span className="svgContainer">
              <svg fill="white" viewBox="0 0 496 512" height="1.2em" aria-hidden>
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"></path>
              </svg>
            </span>
            <span className="BG" />
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
                    <div className="p-8 rounded-3xl bg-[#f9f9f9] border border-black/5 flex flex-col card">
                        <div className="mb-4">
                            <span className="text-sm font-semibold text-[#5c5c5c] uppercase tracking-wider">Starter</span>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-[#202020]">$0</span>
                            <span className="text-[#5c5c5c]">/forever</span>
                        </div>
                        <p className="text-[#5c5c5c] text-sm mb-8">Perfect for hobbyists and occasional users.</p>
                        <button className="Btn mb-8">
                          Download Free
                          <svg className="svgIcon" viewBox="0 0 576 512" aria-hidden="true"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
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
                    <div className="p-8 rounded-3xl bg-[#202020] text-white flex flex-col relative shadow-2xl shadow-black/20 transform md:-translate-y-4 card">
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
                        <button className="Btn mb-8">
                          Get Started
                          <svg className="svgIcon" viewBox="0 0 576 512" aria-hidden="true"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
                        </button>
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
                    <div className="p-8 rounded-3xl bg-[#f9f9f9] border border-black/5 flex flex-col card">
                        <div className="mb-4">
                            <span className="text-sm font-semibold text-[#5c5c5c] uppercase tracking-wider">Team</span>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-[#202020]">$29</span>
                            <span className="text-[#5c5c5c]">/month</span>
                        </div>
                        <p className="text-[#5c5c5c] text-sm mb-8">Collaborative features for growing teams.</p>
                        <button className="Btn mb-8">
                          Contact Sales
                          <svg className="svgIcon" viewBox="0 0 576 512" aria-hidden="true"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
                        </button>
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
