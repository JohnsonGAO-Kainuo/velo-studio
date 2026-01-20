import { Button } from "../ui/button";
import {
  Monitor,
  Play,
  Scissors,
  Sparkles,
  Zap,
  Shield,
  Download,
  Check,
} from "lucide-react";
import { FaApple, FaWindows, FaGithub } from "react-icons/fa";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      {/* Navigation - Clean, minimal like Cap */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fcfcfc]/90 backdrop-blur-md border-b border-[#e3e3e3]">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#202020] rounded-lg flex items-center justify-center">
              <Monitor className="w-4 h-4 text-[#cfcfcf]" />
            </div>
            <span className="text-lg font-medium text-[#3a3a3a]">Velo Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/JohnsonGAO-Kainuo/velo-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#5c5c5c] hover:text-[#3a3a3a] transition-colors"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <Button className="bg-[#202020] hover:bg-[#3a3a3a] text-[#cfcfcf] rounded-xl px-4">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fcfcfc] border border-[#e3e3e3] rounded-full text-sm text-[#5c5c5c] mb-8">
            <Sparkles className="w-4 h-4" />
            Open Source Screen Recording
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-semibold text-[#202020] mb-6 leading-tight tracking-tight">
            Record. Edit. Share.
            <br />
            <span className="text-[#737373]">Beautifully.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-[#5c5c5c] max-w-xl mx-auto mb-10 leading-relaxed">
            Velo Studio is a free, open-source screen recording app with powerful 
            editing features. Create stunning screencasts effortlessly.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Button className="bg-[#202020] hover:bg-[#3a3a3a] text-white px-6 py-5 rounded-xl text-base">
              <FaApple className="w-5 h-5 mr-2" />
              Download for macOS
            </Button>
            <Button variant="outline" className="border-[#d0d0d0] text-[#3a3a3a] hover:bg-[#f0f0f0] px-6 py-5 rounded-xl text-base">
              <FaWindows className="w-4 h-4 mr-2" />
              Download for Windows
            </Button>
          </div>

          {/* App Preview */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#fcfcfc] rounded-2xl border border-[#e3e3e3] shadow-sm overflow-hidden">
              {/* Window Header */}
              <div className="bg-[#f7f7f7] px-4 py-3 flex items-center gap-2 border-b border-[#e3e3e3]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                </div>
                <span className="text-xs text-[#737373] ml-2">Velo Studio</span>
              </div>
              {/* Preview Content */}
              <div className="aspect-[16/9] bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#3a3a3a] flex items-center justify-center">
                    <Play className="w-8 h-8 text-[#a0a0a0]" />
                  </div>
                  <p className="text-[#737373] text-sm">Screen Recording Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#fcfcfc] border-t border-[#e3e3e3]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold text-[#202020] mb-4">
              Everything you need
            </h2>
            <p className="text-[#5c5c5c] max-w-lg mx-auto">
              Professional screen recording tools in a clean, intuitive interface
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#f7f7f7] rounded-2xl p-6 border border-[#e3e3e3]">
              <div className="w-10 h-10 bg-[#202020] rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-[#cfcfcf]" />
              </div>
              <h3 className="text-lg font-medium text-[#202020] mb-2">
                Auto Zoom
              </h3>
              <p className="text-sm text-[#5c5c5c] leading-relaxed">
                Automatically zoom in on important areas and follow cursor movements.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#f7f7f7] rounded-2xl p-6 border border-[#e3e3e3]">
              <div className="w-10 h-10 bg-[#202020] rounded-xl flex items-center justify-center mb-4">
                <Scissors className="w-5 h-5 text-[#cfcfcf]" />
              </div>
              <h3 className="text-lg font-medium text-[#202020] mb-2">
                Timeline Editor
              </h3>
              <p className="text-sm text-[#5c5c5c] leading-relaxed">
                Trim, cut and arrange your recordings with a powerful timeline editor.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#f7f7f7] rounded-2xl p-6 border border-[#e3e3e3]">
              <div className="w-10 h-10 bg-[#202020] rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-[#cfcfcf]" />
              </div>
              <h3 className="text-lg font-medium text-[#202020] mb-2">
                Privacy Protection
              </h3>
              <p className="text-sm text-[#5c5c5c] leading-relaxed">
                Automatically blur sensitive information like passwords and notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-[#202020] mb-6">
                Powerful editing, <br />zero complexity
              </h2>
              <ul className="space-y-4">
                {[
                  { title: "Beautiful Backgrounds", desc: "Gradient wallpapers and custom backgrounds" },
                  { title: "Annotations", desc: "Add arrows, shapes, and text overlays" },
                  { title: "Multiple Formats", desc: "Export to MP4, GIF, or WebM" },
                  { title: "Aspect Ratio Presets", desc: "Ready for Twitter, YouTube, Instagram" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#202020] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[#202020]">{item.title}</p>
                      <p className="text-sm text-[#5c5c5c]">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#fcfcfc] rounded-2xl border border-[#e3e3e3] p-1">
              <div className="bg-[#1a1a1a] rounded-xl aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <Scissors className="w-12 h-12 text-[#5c5c5c] mx-auto mb-2" />
                  <p className="text-[#737373] text-sm">Editor Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#202020]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-[#a0a0a0] mb-8">
            Download Velo Studio for free and start creating.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button className="bg-white text-[#202020] hover:bg-[#f0f0f0] px-6 py-5 rounded-xl text-base">
              <FaApple className="w-5 h-5 mr-2" />
              Download for macOS
            </Button>
            <Button variant="outline" className="border-[#5c5c5c] text-white hover:bg-[#3a3a3a] px-6 py-5 rounded-xl text-base">
              <FaWindows className="w-4 h-4 mr-2" />
              Download for Windows
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#1a1a1a] border-t border-[#2d2d2d]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[#737373] text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#3a3a3a] rounded-md flex items-center justify-center">
              <Monitor className="w-3 h-3 text-[#a0a0a0]" />
            </div>
            <span className="text-[#a0a0a0]">Velo Studio</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/JohnsonGAO-Kainuo/velo-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#a0a0a0] transition-colors"
            >
              GitHub
            </a>
            <span className="text-[#5c5c5c]">•</span>
            <span>Open Source</span>
            <span className="text-[#5c5c5c]">•</span>
            <span>MIT License</span>
          </div>
          <p>
            Based on{" "}
            <a
              href="https://github.com/siddharthvaddem/openscreen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a0a0a0] hover:text-white"
            >
              OpenScreen
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
