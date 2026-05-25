import { Link } from "react-router-dom";
import { ArrowRight, Code, Database, Smartphone, Cloud, CheckCircle2, LayoutDashboard, FolderKanban, Users, Shield, Zap, MessageSquare, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const PROBLEM_IMG = "/images/problem.png";
const SHOWCASE_IMG1 = "/images/showcase.png";
const CTA_IMG = "/images/cta.png";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans scroll-smooth overflow-x-hidden selection:bg-black selection:text-white">
      
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none -z-50 bg-grid-pattern opacity-[0.03]"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="max-w-[1440px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <img src="/logo.avif" alt="Softmake Logo" className="h-8 w-auto mix-blend-multiply dark:mix-blend-normal" />
          </div>
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/projects" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Portfolio
            </Link>
            <Link to="/login" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <a href="mailto:softmadeitsolutions@gmail.com" className="text-xs sm:text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition-all shadow-sm">
              Start Project
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto w-full">

        {/* 1. Hero Section - Ultra Minimal */}
        <section className="pt-[160px] pb-[80px] px-4 sm:px-6 lg:px-12 text-center max-w-6xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground bg-muted/30 backdrop-blur-sm mb-8">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-foreground" />
                Modern Academic Project Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.1] sm:leading-[1.05] text-foreground mb-8 px-2">
                Transforming Ideas Into <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">Production-Grade</span> Projects
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl font-light leading-relaxed mb-10 px-4">
                Softmake IT Solutions helps tech students build, track, and manage academic projects across any year with complete technical guidance and modern project support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4">
                <Link to="/login" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-foreground px-8 text-base font-medium text-background transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                    Get Started
                </Link>
                <Link to="/projects" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full border border-border bg-background px-8 text-base font-medium hover:bg-muted transition-colors">
                    View Projects
                </Link>
            </div>
        </section>

        {/* 2. Trusted By */}
        <section className="py-[40px] sm:py-[60px] border-y border-border/50 bg-muted/20 mt-10">
            <div className="px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 opacity-80 sm:opacity-60 sm:grayscale hover:grayscale-0 transition-all duration-500 text-center md:text-left">
                <span className="text-xs sm:text-sm font-medium">Built with industry-standard technologies for modern academic development.</span>
                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 font-semibold tracking-widest text-[10px] sm:text-xs uppercase">
                    <span className="flex items-center gap-2"><Code className="w-4 h-4"/> React</span>
                    <span className="flex items-center gap-2"><Database className="w-4 h-4"/> Django</span>
                    <span className="flex items-center gap-2"><Zap className="w-4 h-4"/> AI/ML</span>
                    <span className="flex items-center gap-2"><Smartphone className="w-4 h-4"/> Android</span>
                    <span className="flex items-center gap-2"><Cloud className="w-4 h-4"/> Cloud</span>
                </div>
            </div>
        </section>
        {/* 2.5 About Us Section */}
        <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-20">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1 w-full"
                >
                    <div className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground bg-muted/30 backdrop-blur-sm mb-6">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-foreground" />
                        About Softmake
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-8">
                        Bridging the gap between <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">academia and industry.</span>
                    </h2>
                    <div className="space-y-6 text-muted-foreground text-base sm:text-lg leading-relaxed">
                        <p>
                            Softmake IT Solutions was founded by a team of passionate software engineers and industry veterans who saw a critical flaw in how academic projects are handled. We realized that students were spending months on theoretical concepts but lacked the exposure to production-grade development standards.
                        </p>
                        <p>
                            We are not just a consultancy. We are a full-scale digital ecosystem. Our mission is to empower engineering students by providing them with the architecture, source code, and professional mentorship they need to succeed in their final presentations and their future careers.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                            <div className="border-l-2 border-foreground pl-4">
                                <h4 className="font-bold text-foreground mb-2">Our Mission</h4>
                                <p className="text-sm">To elevate academic standards by providing transparent, industry-level tech guidance.</p>
                            </div>
                            <div className="border-l-2 border-foreground pl-4">
                                <h4 className="font-bold text-foreground mb-2">Our Vision</h4>
                                <p className="text-sm">To be the trusted technical partner for every engineering student globally.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1 w-full aspect-square md:aspect-[4/3] relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-foreground/10 to-transparent rounded-[32px] transform -rotate-3 scale-105 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-100"></div>
                    <div className="glass-card w-full h-full rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-end border border-border/50">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-foreground opacity-5 blur-3xl rounded-full"></div>
                        <img src="/logo.avif" alt="Softmake Team" className="w-24 h-24 sm:w-32 sm:h-32 object-contain mix-blend-multiply dark:mix-blend-normal mb-auto" />
                        
                        <div className="relative z-10">
                            <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">500+</div>
                            <p className="text-muted-foreground font-medium">Projects successfully delivered to engineering students nationwide.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
        {/* 3. Problem Section */}
        <section id="problem" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-20">
                <div className="flex-1 space-y-6 sm:space-y-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">Academic Projects Shouldn’t Feel Overwhelming.</h2>
                    <div className="space-y-6 text-muted-foreground text-base sm:text-lg leading-relaxed">
                        <p>Students constantly struggle with tight deadlines, immense project complexity, outdated guidance, and poor technical support.</p>
                        <ul className="space-y-4">
                            {['Unrealistic Deadlines', 'Complex Architecture', 'Lack of Tracking Systems', 'Outdated Methodologies'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0"></div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1 w-full aspect-square md:aspect-[4/3] rounded-[24px] overflow-hidden glass-card p-2"
                >
                    <img src={PROBLEM_IMG} alt="Stressed student" className="w-full h-full object-cover rounded-[16px] filter contrast-125 grayscale-[20%]" />
                </motion.div>
            </div>
        </section>

        {/* 4. Solution Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 text-center bg-foreground text-background rounded-[32px] sm:rounded-[40px] mx-4 lg:mx-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
            <div className="relative z-10 max-w-4xl mx-auto space-y-12 sm:space-y-16">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">A Complete Digital Ecosystem <br className="hidden md:block"/>For Academic Projects</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-left">
                    {[
                        { title: 'Project Development', icon: Code },
                        { title: 'Tracking Dashboard', icon: LayoutDashboard },
                        { title: 'Report Support', icon: FolderKanban },
                        { title: 'Technical Mentorship', icon: Users },
                        { title: 'Live Support', icon: MessageSquare },
                        { title: 'File Management', icon: Cloud }
                    ].map((feature, i) => (
                        <div key={i} className="bg-background/5 border border-background/10 p-6 rounded-[24px] hover:bg-background/10 transition-colors">
                            <feature.icon className="w-6 h-6 mb-4 text-background/70" />
                            <h3 className="font-semibold text-lg">{feature.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 5. Platform Showcase (Bento Style) */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Everything you need, built in.</h2>
                <p className="text-base sm:text-lg text-muted-foreground">This is not a normal consultancy. Softmake provides a full-scale digital ecosystem to track, manage, and download your project artifacts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 auto-rows-auto md:auto-rows-[300px]">
                {/* Large Feature */}
                <div className="md:col-span-8 glass-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 overflow-hidden relative group min-h-[300px]">
                    <div className="flex-1 space-y-4 relative z-10">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-foreground text-background rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-md">
                            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Student Dashboard</h3>
                        <p className="text-muted-foreground text-base sm:text-lg">A centralized command center for your entire project lifecycle.</p>
                    </div>
                    <div className="flex-1 relative h-48 md:h-auto mt-4 md:mt-0">
                        <img src={SHOWCASE_IMG1} className="absolute md:right-[-40%] top-0 w-[120%] md:w-[150%] max-w-none rounded-[16px] shadow-2xl group-hover:scale-[1.02] transition-transform duration-700" alt="Dashboard" />
                    </div>
                </div>

                {/* Medium Feature */}
                <div className="md:col-span-4 glass-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group min-h-[200px] md:min-h-[300px]">
                    <div className="space-y-4 relative z-10">
                        <FolderKanban className="w-8 h-8 text-foreground" />
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Live Tracking</h3>
                        <p className="text-muted-foreground">Monitor milestones and commits in real-time.</p>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-foreground opacity-5 blur-2xl group-hover:opacity-10 transition-opacity"></div>
                </div>

                {/* Medium Feature */}
                <div className="md:col-span-4 glass-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 flex flex-col justify-between group min-h-[200px] md:min-h-[300px]">
                    <div className="space-y-4">
                        <Shield className="w-8 h-8 text-foreground" />
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Admin Controls</h3>
                        <p className="text-muted-foreground">Secure access and role-based permissions.</p>
                    </div>
                </div>

                {/* Large Feature */}
                <div className="md:col-span-8 glass-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row-reverse gap-6 sm:gap-8 overflow-hidden relative group min-h-[300px]">
                    <div className="flex-1 space-y-4 relative z-10">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-foreground text-background rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-md">
                            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Support Tickets</h3>
                        <p className="text-muted-foreground text-base sm:text-lg">Direct communication channels with your assigned developer.</p>
                    </div>
                    <div className="flex-1 relative h-48 md:h-auto mt-4 md:mt-0">
                        <img src={SHOWCASE_IMG1} className="absolute md:left-[-40%] top-0 w-[100%] md:w-[135%] scale-[1.05] max-w-none rounded-[16px] shadow-2xl filter hue-rotate-15 group-hover:scale-[1.1] transition-transform duration-700" alt="Tickets" />
                    </div>
                </div>
            </div>
        </section>

        {/* 6. Features Grid */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">Core Platform Features</h2>
                <p className="text-muted-foreground text-base sm:text-lg">Designed specifically for the modern student developer.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="glass-card rounded-[32px] p-8 sm:p-10 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] group overflow-hidden relative border border-border/50 hover:border-foreground/30 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <LayoutDashboard className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Real-time tracking</h3>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">Monitor your project milestones live as our developers commit code and update statuses in real-time.</p>
                    </div>
                </div>
                <div className="glass-card rounded-[32px] p-8 sm:p-10 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] group overflow-hidden relative border border-border/50 hover:border-foreground/30 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Push notifications</h3>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">Get instant alerts and updates on your mobile device whenever significant progress is made.</p>
                    </div>
                </div>
                <div className="glass-card rounded-[32px] p-8 sm:p-10 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] group overflow-hidden relative border border-border/50 hover:border-foreground/30 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Cloud className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">File management</h3>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">A centralized repository for all your documents, diagrams, and codebase, available for download anytime.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* 7. Workflow - Vertical Timeline */}
        <section id="workflow" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-muted/30 border-y border-border">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How it works</h2>
                    <p className="text-muted-foreground mt-4">A streamlined process from concept to delivery.</p>
                </div>
                <div className="relative border-l-2 border-border ml-4 sm:ml-6 md:ml-8 space-y-10 sm:space-y-12">
                    {[
                        { title: 'Registration & Onboarding', desc: 'Sign up and outline your academic requirements in our secure portal.' },
                        { title: 'Developer Assignment', desc: 'We instantly match you with a specialized developer for your tech stack.' },
                        { title: 'Requirements Gathering', desc: 'Finalize architecture, features, and university documentation standards.' },
                        { title: 'Live Development', desc: 'Track code commits and project milestones via your dashboard in real-time.' },
                        { title: 'Final Delivery', desc: 'Receive your complete source code, reports, and a 1-on-1 walkthrough.' }
                    ].map((step, i) => (
                        <div key={i} className="relative pl-6 sm:pl-8">
                            <div className="absolute -left-[17px] sm:-left-[17px] top-1 w-8 h-8 rounded-full border-2 border-foreground bg-background flex items-center justify-center font-bold text-sm shadow-sm text-foreground">
                                {i+1}
                            </div>
                            <div className="glass-card p-6 sm:p-8 rounded-[24px] hover:-translate-y-1 transition-transform border border-border/50">
                                <h3 className="font-bold text-lg sm:text-xl mb-2">{step.title}</h3>
                                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 8. Services */}
        <section id="services" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Capabilities</h2>
                <p className="text-muted-foreground mt-4">Expertise across all modern technology domains.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {['AI/ML Projects', 'Full Stack Development', 'Android Apps', 'IoT Projects', 'Cloud Solutions', 'Cybersecurity'].map((service, i) => (
                    <div key={i} className="glass-card rounded-[24px] p-6 sm:p-8 hover:-translate-y-1 transition-transform cursor-pointer group">
                        <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{service}</h3>
                        <p className="text-muted-foreground text-sm">Industry-standard implementation tailored to academic requirements.</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 10. Portfolio (Compact Layout) */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 sm:mb-16 gap-6 text-center sm:text-left">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Recent Work</h2>
                    <p className="text-muted-foreground">Explore our latest academic projects.</p>
                </div>
                <Link to="/projects" className="text-sm font-medium border-b border-border pb-1 hover:border-foreground transition-colors flex items-center gap-2">
                    View Complete Portfolio <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                    { title: 'Decentralized Voting System', tags: ['Solidity', 'React'], type: 'Web3' },
                    { title: 'AI Disease Prediction', tags: ['Python', 'TensorFlow'], type: 'Machine Learning' },
                    { title: 'Smart City IoT Dashboard', tags: ['Node.js', 'React'], type: 'IoT' },
                    { title: 'E-Commerce Microservices', tags: ['Java', 'Spring Boot'], type: 'Cloud' },
                    { title: 'Secure Chat App', tags: ['Flutter', 'Firebase'], type: 'Mobile' },
                    { title: 'Network Intrusion Detection', tags: ['Python', 'Scikit-learn'], type: 'Cybersecurity' }
                ].map((project, i) => (
                    <Link to="/projects" key={i} className="group glass-card p-6 rounded-[24px] flex flex-col justify-between min-h-[160px] hover:-translate-y-1 hover:border-foreground/30 transition-all cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2 block">{project.type}</span>
                            <h3 className="text-lg font-bold leading-tight mb-4 pr-6">{project.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-auto">
                            {project.tags.map(tag => (
                                <span key={tag} className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-foreground/70">{tag}</span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </section>

        {/* 11. Testimonials */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-muted/10 border-t border-border">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12 sm:mb-16">What Students Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {[
                    { name: "Rahul S.", college: "MIT Engineering", text: "The tracking dashboard is incredible. I knew exactly where my backend development stood every single day. Highly professional." },
                    { name: "Priya M.", college: "SRM University", text: "They didn't just write code; the developer explained the architecture so I could present my project with absolute confidence." },
                    { name: "Anand K.", college: "VIT Vellore", text: "The cloud deployment service saved our group. Our IoT dashboard was live in hours. Softmake feels like a tech startup, not a project center." }
                ].map((testimonial, i) => (
                    <div key={i} className="glass-card rounded-[24px] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                        <p className="text-muted-foreground italic text-sm sm:text-base">"{testimonial.text}"</p>
                        <div className="flex items-center gap-4 mt-auto">
                            <div className="w-10 h-10 bg-foreground/10 rounded-full flex items-center justify-center font-bold text-foreground shrink-0">
                                {testimonial.name[0]}
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                                <span className="text-xs text-muted-foreground">{testimonial.college}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 12. Pricing */}
        <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-muted/20 border-y border-border">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12 sm:mb-16">Simple Pricing</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
                <div className="flex-1 w-full glass-card rounded-[32px] p-8 sm:p-10 relative">
                    <h3 className="text-lg sm:text-xl font-medium text-muted-foreground mb-2">Standard</h3>
                    <div className="text-4xl sm:text-5xl font-bold mb-4">Code Only</div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-8">Perfect for students who just need the technical foundation.</p>
                    <ul className="space-y-4 sm:space-y-5 mb-10 text-xs sm:text-sm">
                        <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" /> Complete Source Code</li>
                        <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" /> Local Setup Guide</li>
                        <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" /> Database Scripts</li>
                        <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" /> 1 Week Bug Support</li>
                    </ul>
                    <a href="mailto:softmadeitsolutions@gmail.com" className="w-full py-3 sm:py-4 rounded-full border border-border font-medium hover:bg-muted transition-colors flex justify-center text-sm sm:text-base">Select Standard</a>
                </div>
                <div className="flex-1 w-full bg-foreground text-background rounded-[32px] p-8 sm:p-12 transform md:scale-105 shadow-2xl relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full tracking-wider whitespace-nowrap">RECOMMENDED</div>
                    <h3 className="text-lg sm:text-xl font-medium text-background/70 mb-2">Premium</h3>
                    <div className="text-4xl sm:text-5xl font-bold mb-4">Full Package</div>
                    <p className="text-background/80 text-xs sm:text-sm mb-8">The complete solution for submission-ready academic projects.</p>
                    <ul className="space-y-4 sm:space-y-5 mb-10 text-xs sm:text-sm">
                        <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" /> Everything in Standard</li>
                        <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Comprehensive Plagiarism-free Report</li>
                        <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Live Cloud Deployment</li>
                        <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Presentation PPT & Diagrams</li>
                        <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> 1-on-1 Code Explanation Session</li>
                    </ul>
                    <a href="mailto:softmadeitsolutions@gmail.com" className="w-full py-3 sm:py-4 rounded-full bg-background text-foreground font-medium hover:bg-background/90 transition-colors flex justify-center text-sm sm:text-base">Select Premium</a>
                </div>
            </div>
        </section>

        {/* 13. FAQ */}
        <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10 sm:mb-12 text-center">Frequently Asked</h2>
            <div className="space-y-4">
                {[
                    { q: "How does project tracking work?", a: "Our dashboard provides a real-time view of your project's milestones, latest commits, and developer notes." },
                    { q: "Are reports and documentation included?", a: "Yes, our Premium tier includes comprehensive, plagiarism-free documentation formatted to university standards." },
                    { q: "Can my entire group access the platform?", a: "Absolutely. You can invite your entire project group to the dashboard." }
                ].map((faq, i) => (
                    <div key={i} className="border border-border rounded-[24px] overflow-hidden bg-background">
                        <button 
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full flex justify-between items-center p-5 sm:p-6 text-left font-medium hover:bg-muted/50 transition-colors text-sm sm:text-base"
                        >
                            {faq.q}
                            <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === i && (
                            <div className="p-5 sm:p-6 pt-0 text-muted-foreground text-sm sm:text-base">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>

        {/* 14. CTA Section */}
        <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
            <div className="glass-card rounded-[32px] sm:rounded-[40px] overflow-hidden relative border border-border">
                <img src={CTA_IMG} alt="Futuristic Dashboard" className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-40" />
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
                <div className="relative z-10 py-20 sm:py-32 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-8 sm:space-y-10">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight">Start Building Your Project With Confidence</h2>
                    <p className="text-lg sm:text-xl text-muted-foreground">Experience the new standard of technical guidance and project execution.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="mailto:softmadeitsolutions@gmail.com" className="inline-flex h-12 sm:h-14 items-center justify-center px-8 rounded-full bg-foreground text-background font-medium text-base sm:text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,0,0,0.15)]">
                            Book Consultation
                        </a>
                        <a href="mailto:softmadeitsolutions@gmail.com" className="inline-flex h-12 sm:h-14 items-center justify-center px-8 rounded-full border border-border bg-background font-medium text-base sm:text-lg hover:bg-muted transition-colors">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </section>

      </main>

      {/* 16. Footer */}
      <footer className="border-t border-border bg-muted/10 py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 mb-12">
            <div className="space-y-4 md:col-span-1">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <img src="/logo.avif" alt="Softmake Logo" className="h-8 w-auto mix-blend-multiply dark:mix-blend-normal" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Transforming academic ideas into production-grade projects. Designed for all tech students.</p>
            </div>
            <div>
                <h4 className="font-semibold mb-4 text-sm sm:text-base">Platform</h4>
                <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                    <li><Link to="/login" className="hover:text-foreground transition-colors">Student Portal</Link></li>
                    <li><Link to="/projects" className="hover:text-foreground transition-colors">Portfolio</Link></li>
                    <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-4 text-sm sm:text-base">Company</h4>
                <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                    <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
                    <li><a href="#services" className="hover:text-foreground transition-colors">Services</a></li>
                    <li><a href="mailto:softmadeitsolutions@gmail.com" className="hover:text-foreground transition-colors">Contact</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-4 text-sm sm:text-base">Legal</h4>
                <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                    <li><Link to="/terms" target="_blank" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/terms" target="_blank" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                </ul>
            </div>
        </div>
        <div className="max-w-[1440px] mx-auto border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">
            <p>© 2026 Softmake IT Solutions. All rights reserved.</p>
            <div className="flex gap-4">
                <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
                <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
                <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
            </div>
        </div>
      </footer>
    </div>
  );
}
