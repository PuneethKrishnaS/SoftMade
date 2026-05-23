import { Link } from "react-router-dom";
import { ArrowRight, Code, Terminal, CheckSquare, MessageSquare, Briefcase, Zap, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex gap-2 items-center">
            <img src="/logo.avif" alt="Softmake Logo" className="h-8 w-auto" width="120" height="32" />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">
              Student Login
            </Link>
            <a href="mailto:softmadeitsolutions@gmail.com" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto space-y-32">

        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-16 min-h-[50vh]">
          <div className="flex-1 space-y-8 max-w-xl">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-black">
              Your academic project workspace.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Write, plan, and collaborate with your team and assigned developers.
              One workspace for your synopsis, code, and reports.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/login" className="inline-flex h-11 items-center justify-center rounded-md bg-black px-6 text-sm font-medium text-white transition-colors hover:bg-gray-800">
                Student Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a href="mailto:contact@softmade.com" className="inline-flex h-11 items-center justify-center rounded-md border border-gray-200 px-6 text-sm font-medium text-black transition-colors hover:bg-gray-50">
                Contact Us
              </a>
            </div>

            <p className="text-sm text-gray-500 font-medium pt-2">
              Trusted by thousands of engineering students.
            </p>
          </div>

          <div className="flex-1 w-full max-w-lg">
            <div className="w-full aspect-square relative flex items-center justify-center">
              <img
                src="/notion-hero.png"
                alt="Student working on laptop illustration"
                className="w-full h-auto object-contain mix-blend-multiply"
                width="512"
                height="512"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="pt-12">
          <div className="space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-black">How it works.</h2>
            <p className="text-lg text-gray-600 max-w-2xl">From initial idea to final deployment, we guide your academic group through a structured, transparent process.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-6 left-12 right-12 h-[1px] bg-gray-200 -z-10" />

            {[
              { step: "01", title: "Idea & Requirements", desc: "You provide a base idea or abstract. We finalize the scope and technology stack." },
              { step: "02", title: "Assignment", desc: "We assign a dedicated professional developer who will act as your project guide." },
              { step: "03", title: "Live Tracking", desc: "Use this portal to track progress, raise support tickets, and review milestones." },
              { step: "04", title: "Delivery & Setup", desc: "We deliver the complete source code, reports, and help you deploy it locally or to the cloud." }
            ].map((item) => (
              <div key={item.step} className="space-y-4 bg-white">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Showcase Section */}
        <section id="projects" className="pt-12">
          <div className="space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-black">What we can build.</h2>
            <p className="text-lg text-gray-600 max-w-2xl">Explore some of the production-grade academic projects we offer. We build robust systems tailored to university standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { domain: "Artificial Intelligence", title: "AI Medical Diagnostic Assistant", tech: "Python, TensorFlow, React", desc: "An intelligent system that predicts early-stage diseases from X-Ray images using CNNs." },
              { domain: "Internet of Things", title: "Smart Crop Monitoring IoT", tech: "Arduino, NodeMCU, Firebase", desc: "Hardware integration for live soil moisture tracking, accessible via a web dashboard." },
              { domain: "Web App / Blockchain", title: "Decentralized Voting System", tech: "Solidity, Web3.js, Node.js", desc: "A tamper-proof electoral system utilizing Ethereum smart contracts for secure voting." },
              { domain: "E-Commerce", title: "Microservices Retail Platform", tech: "Spring Boot, React, Docker", desc: "A scalable online shopping backend built with a microservices architecture." },
              { domain: "Machine Learning", title: "Fake News Detection Engine", tech: "NLP, Scikit-learn, Django", desc: "A text-classification engine that scrapes articles and determines factual validity." },
              { domain: "Cybersecurity", title: "Intrusion Detection System", tech: "Python, Snort, React", desc: "A network monitoring tool that visualizes malicious packet payloads in real-time." },
            ].map((proj, i) => (
              <div key={i} className="p-6 border border-gray-200 rounded-xl hover:border-black transition-colors group cursor-pointer">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{proj.domain}</div>
                <h3 className="font-semibold text-xl mb-3 text-black">{proj.title}</h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">{proj.desc}</p>
                <div className="text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded inline-block">
                  {proj.tech}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Company Section */}
        <section id="company" className="pt-12">
          <div className="p-12 border border-gray-200 rounded-2xl bg-gray-50/50">
            <div className="max-w-3xl space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-black">About Softmake IT Solutions.</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We are a specialized development agency dedicated to bridging the gap between academic requirements and industry-level software engineering.
                Our mission is to help students overcome technical hurdles by delivering robust, scalable, and well-documented projects.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                <div className="space-y-2">
                  <Briefcase className="w-5 h-5 text-black" />
                  <h3 className="font-semibold text-lg">Industry Experts</h3>
                  <p className="text-sm text-gray-600">Your projects are handled by professional developers, not interns.</p>
                </div>
                <div className="space-y-2">
                  <Zap className="w-5 h-5 text-black" />
                  <h3 className="font-semibold text-lg">Fast Turnaround</h3>
                  <p className="text-sm text-gray-600">We respect academic deadlines and guarantee timely deliveries.</p>
                </div>
                <div className="space-y-2">
                  <ShieldCheck className="w-5 h-5 text-black" />
                  <h3 className="font-semibold text-lg">Plagiarism Free</h3>
                  <p className="text-sm text-gray-600">Every project is built from scratch ensuring zero academic violations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Services Section */}
        <section id="services" className="pt-12">
          <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-black">Everything you need.</h2>
            <p className="text-lg text-gray-600">A connected workspace that adapts to your final year project requirements. From idea to deployment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3 p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-black">Tracking</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Real-time milestone tracking for your synopsis, frontend, and backend phases.
              </p>
            </div>

            <div className="space-y-3 p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-black">Source Code</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Download your project's source code, PPTs, and reports directly from the cloud.
              </p>
            </div>

            <div className="space-y-3 p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-black">Support</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Raise tickets and communicate directly with your assigned project guide.
              </p>
            </div>

            <div className="space-y-3 p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-black">Deployment</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get your project live on the internet with our cloud hosting assistance.
              </p>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-gray-200 py-12 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.avif" alt="Softmake Logo" className="h-6 w-auto grayscale opacity-80" width="90" height="24" />
            <span className="text-sm font-medium text-gray-900">Softmake IT Solutions</span>
          </div>
          <div className="text-sm text-gray-500">© 2026 All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
