// Legal pages are simple static pages; NavBar/Footer are provided by the route wrapper.

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#5c5c5c] font-sans selection:bg-[#202020] selection:text-white pt-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#202020] mb-8">Privacy Policy</h1>
        <div className="prose prose-stone max-w-none space-y-6">
          <p className="text-sm text-[#5c5c5c]">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-[#202020] mb-4">1. Introduction</h2>
            <p>
              Welcome to Velo Studio ("we," "our," or "us"). We are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you use our application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#202020] mb-4">2. Data Processing (Local-First)</h2>
            <p>
              <strong>Velo Studio is designed as a local-first application.</strong> 
              This means:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All screen recordings are captured and processed locally on your device.</li>
              <li>We do not upload your video files to our servers.</li>
              <li>Your content remains private and under your control at all times.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#202020] mb-4">3. Data We Collect</h2>
            <p>
               We collect minimal data to operate and improve our services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> We may collect anonymous analytical data about how you use the application (e.g., feature usage, crash reports) to help us improve stability and user experience.</li>
              <li><strong>Account Information:</strong> If you purchase a subscription, we process your payment information through our secure payment provider (Stripe). We do not store credit card details on our servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#202020] mb-4">4. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at: <br/>
              <strong className="text-[#202020]">contact@kainuotech.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#5c5c5c] font-sans selection:bg-[#202020] selection:text-white pt-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#202020] mb-8">Terms of Service</h1>
        <div className="prose prose-stone max-w-none space-y-6">
          <p className="text-sm text-[#5c5c5c]">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-2xl font-bold text-[#202020] mb-4">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or using Velo Studio, you agree to be bound by complying with these Terms of Service. 
              If you do not agree, please do not use our software.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#202020] mb-4">2. License</h2>
            <p>
              Velo Studio grants you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the Application strictly in accordance with the terms of this Agreement.
            </p>
          </section>

           <section>
            <h2 className="text-2xl font-bold text-[#202020] mb-4">3. Restrictions</h2>
            <p>
              You agree not to, and you will not permit others to:
            </p>
             <ul className="list-disc pl-6 space-y-2">
              <li>License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose, or otherwise commercially exploit the Application.</li>
              <li>Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the Application.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#202020] mb-4">4. Disclaimer</h2>
            <p>
              The Application is provided "AS IS" and "AS AVAILABLE" with all faults and defects without warranty of any kind. 
              To the maximum extent permitted under applicable law, Velo Studio and Kainuo Innovision Tech Co., Limited expressly disclaims all warranties, whether express, implied, statutory, or otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#202020] mb-4">5. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at <strong className="text-[#202020]">contact@kainuotech.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function ChangelogPage() {
    return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#5c5c5c] font-sans selection:bg-[#202020] selection:text-white pt-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#202020] mb-8">Changelog</h1>
        <div className="relative border-l border-black/10 ml-3 space-y-12">
            <div className="pl-8 relative">
                <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[#202020] ring-4 ring-[#f2f2f2]"></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-[#202020]">v1.0.0</h2>
                    <span className="text-sm font-mono text-[#5c5c5c] bg-black/5 px-2 py-1 rounded">2026-01-20</span>
                </div>
                <div className="prose prose-stone max-w-none">
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Initial Release:</strong> Velo Studio 1.0 is officially live!</li>
                        <li>High-performance screen recording for macOS.</li>
                        <li>Local-first architecture for maximum privacy.</li>
                        <li>Built-in editor for quick trims and annotations.</li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
    )
}
