import { Button } from "../ui/button";
import {
  Monitor,
  Zap,
  Shield,
  Download,
  Menu,
  X,
  Globe,
  Layers
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Components ---

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-white/10"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform group-hover:scale-105">
              <Monitor className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Velo</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {["Product", "Features", "Changelog", "Pricing"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com/JohnsonGAO-Kainuo/velo-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            <FaGithub className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
          <div className="w-px h-4 bg-white/10" />
          <a href="#" className="text-sm font-medium text-white/60 hover:text-white">
            Log in
          </a>
          <Button className="bg-white hover:bg-gray-200 text-black rounded-full px-6 h-9 text-sm font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
            Get Started
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-white"
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
            className="md:hidden bg-black border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {["Product", "Features", "Changelog", "Pricing"].map((item) => (
                <a key={item} href="#" className="text-sm font-medium text-white/80">
                  {item}
                </a>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <Button className="w-full bg-white text-black rounded-lg">Sign up</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/[0.03] blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/[0.05] blur-[120px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium text-white/80">Velo Studio v1.0 is now available</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40"
        >
          Screen recording <br />
          reimagined.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The open-source screen recorder that combines power with simplicity.
          Record, edit, and share in seconds. Built for developers, by developers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-gray-100 text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            <Download className="w-5 h-5 mr-2" />
            Download for Free
          </Button>
          <Button
            variant="ghost"
            className="h-14 px-8 rounded-full text-white border border-white/10 hover:bg-white/5 text-lg font-medium transition-all hover:scale-105 active:scale-95"
          >
            <FaGithub className="w-5 h-5 mr-2" />
            Open Source
          </Button>
        </motion.div>

        {/* App Window Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20 h-full w-full pointer-events-none" />
          
          <div className="rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden ring-1 ring-white/10">
            {/* Window Header */}
            <div className="h-10 bg-[#0A0A0A] border-b border-white/5 flex items-center px-4 justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="text-xs font-mono text-white/30">velo-preview.mp4</div>
              <div className="w-12" />
            </div>

            {/* Window Content */}
            <div className="aspect-video bg-grid-white/[0.02] relative group flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                </div>
              </div>

               {/* Mock UI Elements */}
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#111]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4">
                 <div className="text-sm font-mono text-white">00:04:23</div>
                 <div className="h-4 w-px bg-white/20"></div>
                 <div className="flex gap-1 items-end h-6">
                    {[40, 60, 30, 80, 50, 90, 40].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [h + "%", (h * 0.5) + "%", h + "%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                        className="w-1 bg-white rounded-full"
                        style={{ height: `${h}%` }}
                      />
                    ))}
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
      title: "Lightning Fast",
      desc: "Built with Rust and Electron for maximum performance and minimal battery usage.",
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      colSpan: "md:col-span-2",
    },
    {
      title: "Secure by Design",
      desc: "Local-first recording ensures your data never leaves your machine unless you want it to.",
      icon: <Shield className="w-6 h-6 text-green-400" />,
      colSpan: "md:col-span-1",
    },
    {
      title: "Cross Platform",
      desc: "Works perfectly on macOS, Windows, and Linux. One experience everywhere.",
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      colSpan: "md:col-span-1",
    },
    {
      title: "Advanced Editing",
      desc: "Trim, crop, and add annotations directly within the app. No external tools needed.",
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      colSpan: "md:col-span-2",
    },
  ];

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-6">
              Powerful features. <br/> Zero compromise.
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className={cn(
                "group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors overflow-hidden",
                f.colSpan
              )}
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
              
              <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/10">
                {f.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-white/60 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustedBy() {
  return (
    <div className="py-20 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-10">
          Trusted by engineers at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             {/* Simple Text Logos for minimalist feel if SVG not available or just cleaner */}
            <h4 className="text-xl font-bold text-white">ACME Corp</h4>
            <h4 className="text-xl font-bold text-white">Stark Ind.</h4>
            <h4 className="text-xl font-bold text-white">Umbrella</h4>
            <h4 className="text-xl font-bold text-white">Cyberdyne</h4>
            <h4 className="text-xl font-bold text-white">Massive</h4>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold text-white">Velo</span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed">
            The modern standard for screen recording. <br/> Open source and privacy focused.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { header: "Product", links: ["Features", "Changelog", "Roadmap", "Pricing"] },
            { header: "Company", links: ["About", "Careers", "Blog", "Contact"] },
            { header: "Resources", links: ["Community", "Help Center", "Status", "Terms"] },
            { header: "Social", links: ["Twitter", "GitHub", "Discord", "YouTube"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-semibold mb-6">{col.header}</h4>
              <ul className="flex flex-col gap-4">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
        <p>© 2026 Velo Studio Inc. All rights reserved.</p>
        <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 selection:text-white">
      <NavBar />
      <Hero />
      <TrustedBy />
      <Features />
      <Footer />
    </div>
  );
}
