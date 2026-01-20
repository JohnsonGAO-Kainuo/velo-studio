import { Button } from "../ui/button";
import {
  Monitor,
  Play,
  Scissors,
  Zap,
  Shield,
  Download,
  Check,
  Menu,
  X 
} from "lucide-react";
import { FaGithub, FaAws, FaMicrosoft } from "react-icons/fa";
import { useState } from "react";

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1a1a1a] selection:bg-[#e0e0e0]">
      {/* Navigation - Figma Layout */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFDFD]/80 backdrop-blur-md border-b border-[#f0f0f0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center shadow-sm">
                <Monitor className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#1a1a1a]">Velo</span>
            </div>

            {/* Desktop Nav Links - Centered/Left aligned as in many SaaS */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-[#666] hover:text-[#1a1a1a] transition-colors">Product</a>
              <a href="#" className="text-sm font-medium text-[#666] hover:text-[#1a1a1a] transition-colors">Download</a>
              <a href="#" className="text-sm font-medium text-[#666] hover:text-[#1a1a1a] transition-colors">Testimonials</a>
              <a href="#" className="text-sm font-medium text-[#666] hover:text-[#1a1a1a] transition-colors">Pricing</a>
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
             <a
              href="https://github.com/JohnsonGAO-Kainuo/velo-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f5] border border-[#e5e5e5] hover:border-[#d4d4d4] transition-all"
            >
              <FaGithub className="w-4 h-4 text-[#666] group-hover:text-[#1a1a1a]" />
              <span className="text-xs font-medium text-[#666] group-hover:text-[#1a1a1a]">Star on GitHub</span>
            </a>
            <div className="w-px h-6 bg-[#eaeaea] mx-1"></div>
            <a href="#" className="text-sm font-medium text-[#666] hover:text-[#1a1a1a]">Log in</a>
            <Button className="bg-[#1a1a1a] hover:bg-[#333] text-white rounded-full px-5 h-9 text-sm font-medium shadow-sm transition-transform active:scale-95">
              Sign up
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5 text-[#333]" /> : <Menu className="w-5 h-5 text-[#333]" />}
          </button>
        </div>
      </nav>

      {/* Hero Section - Figma Style: Centered, clean typography */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          <h1 className="text-5xl md:text-7xl font-bold text-[#1a1a1a] mb-8 leading-[1.1] tracking-tight">
            Beautiful, shareable <br/>
            <span className="text-[#888]">screen recordings</span>
          </h1>

          <p className="text-lg md:text-xl text-[#666] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Velo is the open source alternative to Loom. Lightweight, powerful, and cross-platform. 
            Record and share securely in seconds with powerful editing tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button className="h-12 px-8 rounded-full bg-[#1a1a1a] hover:bg-[#333] text-white text-base font-medium shadow-lg shadow-gray-200/50 transition-transform active:scale-95">
              <Download className="w-4 h-4 mr-2" />
              Download for free
            </Button>
            <Button variant="outline" className="h-12 px-8 rounded-full border-[#e5e5e5] bg-white text-[#1a1a1a] hover:bg-[#f9f9f9] text-base font-medium transition-transform active:scale-95">
              <FaGithub className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>

          <p className="text-sm text-[#999] mb-12 flex items-center justify-center gap-2">
            <Check className="w-3 h-3" /> No credit card required. Free forever for individuals.
          </p>

          {/* Trusted By Section - Figma "Trusted by" */}
          <div className="border-t border-b border-[#f5f5f5] py-8 mb-16">
            <p className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-6">Trusted by 25,000+ creators at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2">
                <FaMicrosoft className="w-6 h-6 text-[#737373]" />
                <span className="font-semibold text-[#737373]">Microsoft</span>
              </div>
              <div className="flex items-center gap-2">
                <FaAws className="w-8 h-8 text-[#737373]" />
              </div>
              <div className="flex items-center gap-2">
                <FaGithub className="w-7 h-7 text-[#737373]" />
              </div>
              {/* Add more placeholder logos if needed */}
            </div>
          </div>

          {/* App Preview - Figma Window Style */}
          <div className="relative">
             {/* Abstract Background Blur */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-gray-100 via-gray-50 to-white rounded-full blur-3xl opacity-50 -z-10"></div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-2xl shadow-gray-200/50 overflow-hidden mx-auto max-w-5xl">
              {/* Window Controls */}
              <div className="bg-[#fcfcfc] px-4 py-3 flex items-center justify-between border-b border-[#f0f0f0]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#f0f0f0] rounded-md border border-[#e5e5e5]">
                   <span className="text-xs text-[#666] font-medium">velo-recording.mp4</span>
                </div>
                <div className="w-12"></div>
              </div>
              
              {/* Main Content Area */}
              <div className="aspect-[16/10] bg-[#111] relative group cursor-pointer">
                {/* Video Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </div>

                {/* UI Overlay Elements from Figma */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-full border border-white/10">
                   <span className="text-xs text-white/70 font-mono">00:00:14</span>
                   <div className="h-3 w-px bg-white/20 mx-1"></div>
                   <div className="flex gap-1">
                      <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
                      <div className="w-1 h-5 bg-white rounded-full animate-pulse delay-75"></div>
                      <div className="w-1 h-4 bg-white rounded-full animate-pulse delay-150"></div>
                      <div className="w-1 h-6 bg-white rounded-full animate-pulse delay-100"></div>
                   </div>
                </div>

                {/* Annotation Badges */}
                <div className="absolute top-10 left-20 bg-white shadow-lg rounded-lg px-3 py-1.5 flex items-center gap-2 animate-bounce duration-[3000ms]">
                   <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                   <span className="text-xs font-bold text-gray-800">Click here</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid - Clean Cards */}
      <section className="py-24 bg-[#fcfcfc] border-t border-[#f0f0f0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">Everything you need</h2>
            <p className="text-[#666] max-w-2xl mx-auto">
              Professional tools wrapped in a simple tailored interface.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Instant Export",
                desc: "Share links instantly. No waiting for uploads to finish processing."
              },
              {
                icon: <Scissors className="w-5 h-5" />,
                title: "Trimming & Editing",
                desc: "Cut out the fluff. Keep the good stuff. Simple timeline editing."
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: "Privacy First",
                desc: "Blur sensitive info automatically. Your data stays on your device."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-[#e5e5e5] hover:border-[#d4d4d4] hover:shadow-sm transition-all group">
                <div className="w-10 h-10 bg-[#f5f5f5] rounded-lg flex items-center justify-center mb-6 text-[#1a1a1a] group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-3">{feature.title}</h3>
                <p className="text-[#666] leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 bg-white border-t border-[#f0f0f0]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1a1a1a] rounded flex items-center justify-center">
              <Monitor className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-[#1a1a1a]">Velo</span>
          </div>
          
          <div className="flex gap-8 text-sm text-[#666]">
            <a href="#" className="hover:text-[#1a1a1a]">Twitter</a>
            <a href="#" className="hover:text-[#1a1a1a]">GitHub</a>
            <a href="#" className="hover:text-[#1a1a1a]">Discord</a>
          </div>

          <p className="text-sm text-[#999]">
            © 2026 Velo Studio. Open Source.
          </p>
        </div>
      </footer>
    </div>
  );
}
