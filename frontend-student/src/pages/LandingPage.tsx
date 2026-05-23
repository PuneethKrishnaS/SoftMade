import { Link } from "react-router-dom";
import { ArrowRight, Code, Terminal, CheckSquare, MessageSquare, Briefcase, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex gap-2 items-center">
            <img src="/logo.avif" alt="Softmade Logo" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">
              Student Login
            </Link>
            <a href="mailto:contact@softmade.com" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors shadow-lg shadow-black/10">
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto space-y-32">

        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-16 min-h-[50vh]">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="flex-1 space-y-8 max-w-xl"
          >
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-black">
              Your academic project workspace.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-gray-600 leading-relaxed">
              Write, plan, and collaborate with your team and assigned developers.
              One workspace for your synopsis, code, and reports.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/login" className="inline-flex h-11 items-center justify-center rounded-md bg-black px-6 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:-translate-y-0.5 shadow-xl shadow-black/20">
                Student Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a href="mailto:contact@softmade.com" className="inline-flex h-11 items-center justify-center rounded-md border border-gray-200 px-6 text-sm font-medium text-black transition-all hover:bg-gray-50 hover:-translate-y-0.5 shadow-sm">
                Contact Us
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-gray-400 font-medium pt-2">
              Trusted by thousands of engineering students.
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="w-full aspect-square relative flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
              <img
                src="/notion-hero.png"
                alt="Student working on laptop illustration"
                className="w-full h-auto object-contain mix-blend-multiply relative z-10 hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="pt-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="space-y-4 mb-16">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-black">How it works.</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 max-w-2xl">From initial idea to final deployment, we guide your academic group through a structured, transparent process.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-12 right-12 h-[1px] bg-gray-200 -z-10" />

            {[
              { step: "01", title: "Idea & Requirements", desc: "You provide a base idea or abstract. We finalize the scope and technology stack." },
              { step: "02", title: "Assignment", desc: "We assign a dedicated professional developer who will act as your project guide." },
              { step: "03", title: "Live Tracking", desc: "Use this portal to track progress, raise support tickets, and review milestones." },
              { step: "04", title: "Delivery & Setup", desc: "We deliver the complete source code, reports, and help you deploy it locally or to the cloud." }
            ].map((item) => (
              <motion.div variants={fadeUp} key={item.step} className="space-y-4 bg-white">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Projects Showcase Section */}
        <section id="projects" className="pt-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="space-y-4 mb-16">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-black">What we can build.</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 max-w-2xl">Explore some of the production-grade academic projects we offer. We build robust systems tailored to university standards.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { domain: "Artificial Intelligence", title: "AI Medical Diagnostic Assistant", tech: "Python, TensorFlow, React", desc: "An intelligent system that predicts early-stage diseases from X-Ray images using CNNs." },
              { domain: "Internet of Things", title: "Smart Crop Monitoring IoT", tech: "Arduino, NodeMCU, Firebase", desc: "Hardware integration for live soil moisture tracking, accessible via a web dashboard." },
              { domain: "Web App / Blockchain", title: "Decentralized Voting System", tech: "Solidity, Web3.js, Node.js", desc: "A tamper-proof electoral system utilizing Ethereum smart contracts for secure voting." },
              { domain: "E-Commerce", title: "Microservices Retail Platform", tech: "Spring Boot, React, Docker", desc: "A scalable online shopping backend built with a microservices architecture." },
              { domain: "Machine Learning", title: "Fake News Detection Engine", tech: "NLP, Scikit-learn, Django", desc: "A text-classification engine that scrapes articles and determines factual validity." },
              { domain: "Cybersecurity", title: "Intrusion Detection System", tech: "Python, Snort, React", desc: "A network monitoring tool that visualizes malicious packet payloads in real-time." },
            ].map((proj, i) => (
              <motion.div variants={fadeUp} key={i} className="p-6 border border-gray-200 rounded-2xl hover:border-black hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white hover:-translate-y-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{proj.domain}</div>
                <h3 className="font-semibold text-xl mb-3 text-black">{proj.title}</h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">{proj.desc}</p>
                <div className="text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded inline-block group-hover:bg-gray-100 transition-colors">
                  {proj.tech}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Features / Services Section */}
        <section id="services" className="pt-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-black">Everything you need.</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-600">A connected workspace that adapts to your final year project requirements. From idea to deployment.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CheckSquare, title: "Tracking", desc: "Real-time milestone tracking for your synopsis, frontend, and backend phases." },
              { icon: Code, title: "Source Code", desc: "Download your project's source code, PPTs, and reports directly from the cloud." },
              { icon: MessageSquare, title: "Support", desc: "Raise tickets and communicate directly with your assigned project guide." },
              { icon: Terminal, title: "Deployment", desc: "Get your project live on the internet with our cloud hosting assistance." }
            ].map((feature, i) => (
              <motion.div variants={fadeUp} key={i} className="space-y-3 p-6 border border-gray-100 rounded-2xl hover:shadow-xl hover:border-gray-200 transition-all duration-300 bg-white hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shadow-md">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-black pt-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

      </main>

      <footer className="border-t border-gray-200 py-12 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.avif" alt="Softmade Logo" className="h-6 w-auto grayscale opacity-80" />
            <span className="text-sm font-medium text-gray-900">Softmade IT Solutions</span>
          </div>
          <div className="text-sm text-gray-500">© 2026 All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
