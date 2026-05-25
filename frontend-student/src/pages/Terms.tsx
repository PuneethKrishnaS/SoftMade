import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="w-full z-50 glass-nav border-b border-border">
        <div className="max-w-[1440px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <Link to="/">
                <img src="/logo.avif" alt="Softmake Logo" className="h-8 w-auto mix-blend-multiply dark:mix-blend-normal" />
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 prose prose-neutral dark:prose-invert">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 text-foreground">Legal Information</h1>
        
        <p className="text-muted-foreground mb-12">
          Last updated: May 25, 2026
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Terms of Service</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Welcome to Softmake IT Solutions. By using our website and services, you agree to be bound by these Terms of Service.
            </p>
            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">1. Use of Services</h3>
            <p>
              Our academic project assistance and development services are intended to help students learn and understand software development concepts. We provide technical guidance, source code, and mentorship.
            </p>
            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2. Intellectual Property</h3>
            <p>
              All materials provided to you as part of our service remain our intellectual property until full payment is received. Upon completion, you are granted a license to use the code for academic purposes.
            </p>
            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">3. Refund Policy</h3>
            <p>
              Refunds are subject to our cancellation policy. If work has commenced on your project, partial refunds may be issued based on the milestones achieved.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Privacy Policy</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
            </p>
            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us when you create an account, request a project, or contact support. This includes your name, email address, university details, and project requirements.
            </p>
            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2. How We Use Your Information</h3>
            <p>
              We use the information we collect to provide, maintain, and improve our services, to process your requests, and to communicate with you about your projects.
            </p>
            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">3. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Softmake IT Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
