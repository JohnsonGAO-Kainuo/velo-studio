import { Button } from "../ui/button";
import {
  Video,
  Sparkles,
  Zap,
  Shield,
  Download,
  Github,
  Monitor,
  Apple,
} from "lucide-react";

export function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-800">Velo Studio</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/JohnsonGAO-Kainuo/velo-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Open Source Screen Recording Studio
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Record. Edit. Share.
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Beautifully.
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Velo Studio is a free, open-source screen recording application with
            powerful editing capabilities. Create stunning screencasts with
            automatic zoom, annotations, and beautiful backgrounds.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-lg px-8 py-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
            >
              <Apple className="w-5 h-5 mr-2" />
              Download for macOS
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-xl border-2"
            >
              <Monitor className="w-5 h-5 mr-2" />
              Download for Windows
            </Button>
          </div>

          {/* Preview Image */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-sm text-slate-500 ml-2">Velo Studio</span>
              </div>
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-20 h-20 text-blue-400 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-400 text-lg">Screen Recording Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need for professional screencasts
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features wrapped in a beautiful, intuitive interface
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Auto Zoom & Focus
              </h3>
              <p className="text-slate-600">
                Automatically zoom in on important areas and follow cursor
                movements for engaging presentations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 border border-slate-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Beautiful Backgrounds
              </h3>
              <p className="text-slate-600">
                Choose from stunning gradient backgrounds or custom wallpapers
                to make your recordings stand out.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-8 border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Privacy Protection
              </h3>
              <p className="text-slate-600">
                Automatically blur sensitive information like passwords,
                notifications, and personal data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Powerful editing, zero complexity
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Timeline Editor</p>
                    <p className="text-slate-600 text-sm">
                      Trim, cut, and arrange your recordings with precision
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Annotations</p>
                    <p className="text-slate-600 text-sm">
                      Add arrows, shapes, and text to highlight important areas
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Multiple Export Formats</p>
                    <p className="text-slate-600 text-sm">
                      Export to MP4, GIF, or WebM with customizable quality
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Aspect Ratio Presets</p>
                    <p className="text-slate-600 text-sm">
                      Ready-to-use presets for Twitter, YouTube, Instagram, and more
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-1">
              <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-blue-400 mx-auto mb-3 opacity-50" />
                  <p className="text-slate-400">Editor Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to create amazing screencasts?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Download Velo Studio for free and start recording today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl"
            >
              <Apple className="w-5 h-5 mr-2" />
              Download for macOS
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
            >
              <Monitor className="w-5 h-5 mr-2" />
              Download for Windows
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Velo Studio</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/JohnsonGAO-Kainuo/velo-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <span>Open Source</span>
            <span>•</span>
            <span>MIT License</span>
          </div>
          <p className="text-sm">
            Built with ❤️ based on{" "}
            <a
              href="https://github.com/siddharthvaddem/openscreen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              OpenScreen
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
