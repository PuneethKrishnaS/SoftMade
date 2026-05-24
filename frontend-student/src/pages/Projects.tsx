import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Code, Terminal } from "lucide-react";
import projectsData from "../data/projects.json";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Extract unique domains for filters
  const domains = useMemo(() => {
    const allDomains = projectsData.map(p => p.domain);
    return ["All", ...Array.from(new Set(allDomains))];
  }, []);

  // Filter logic
  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            project.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = activeFilter === "All" || project.domain === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans scroll-smooth overflow-x-hidden selection:bg-black selection:text-white">
      
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none -z-50 bg-grid-pattern opacity-[0.03]"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="max-w-[1440px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <Link to="/">
                <img src="/logo.avif" alt="Softmake Logo" className="h-8 w-auto mix-blend-multiply dark:mix-blend-normal" />
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
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

      <main className="pt-[160px] pb-[120px] px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto min-h-screen flex flex-col">
        
        {/* Header Section */}
        <section className="max-w-4xl mb-16 text-center sm:text-left">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-tight mb-6">
                Explore our <br className="hidden sm:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">Production Portfolio.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
                Browse our curated list of academic projects. Built with modern stacks, ready for submission.
            </p>
        </section>

        {/* Controls: Search & Filters */}
        <section className="mb-12 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                {/* Search Bar */}
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search projects or technologies..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 rounded-full border border-border bg-background/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all text-sm font-medium"
                    />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-end">
                    {domains.map((domain) => (
                        <button
                            key={domain}
                            onClick={() => setActiveFilter(domain)}
                            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                                activeFilter === domain 
                                ? 'bg-foreground text-background shadow-md scale-105' 
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border hover:text-foreground'
                            }`}
                        >
                            {domain}
                        </button>
                    ))}
                </div>
            </div>
        </section>

        {/* Project Grid */}
        <motion.section layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
            <AnimatePresence>
                {filteredProjects.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="col-span-full py-20 text-center text-muted-foreground"
                    >
                        <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-medium">No projects found.</h3>
                        <p className="mt-2">Try adjusting your search or filters.</p>
                    </motion.div>
                ) : (
                    filteredProjects.map((proj) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            key={proj.id} 
                            onClick={() => setSelectedProject(proj)}
                            className="group cursor-pointer glass-card rounded-[24px] overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-border/50"
                        >
                            <div className="w-full aspect-[4/3] bg-muted overflow-hidden relative">
                                <img src={proj.img} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300"></div>
                            </div>
                            <div className="p-6 sm:p-8 flex flex-col flex-1">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">{proj.domain}</div>
                                <h3 className="text-xl sm:text-2xl font-bold leading-tight mb-3 pr-4 group-hover:text-blue-500 transition-colors">{proj.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{proj.shortDesc}</p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {proj.tech.map(t => (
                                        <span key={t} className="text-xs font-mono text-foreground/70 bg-muted px-2 py-1 rounded-md border border-border/50">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/10 py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <img src="/logo.avif" alt="Softmake Logo" className="h-8 w-auto mix-blend-multiply dark:mix-blend-normal" />
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
             <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
             <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
             <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
          </div>
          <div className="text-xs text-muted-foreground font-light">© 2026 Softmake IT Solutions.</div>
        </div>
      </footer>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            >
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    onClick={() => setSelectedProject(null)}
                ></div>

                {/* Modal Content */}
                <motion.div 
                    initial={{ y: 50, scale: 0.95 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 20, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-[32px] shadow-2xl flex flex-col md:flex-row"
                >
                    <button 
                        onClick={() => setSelectedProject(null)}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/50 backdrop-blur-md rounded-full flex items-center justify-center border border-border hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Image Side (Desktop) / Top (Mobile) */}
                    <div className="w-full md:w-2/5 h-64 md:h-auto bg-muted relative">
                        <img src={selectedProject.img} alt={selectedProject.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 md:bg-gradient-to-r md:from-transparent to-transparent"></div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full md:w-3/5 p-8 sm:p-12 flex flex-col">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">{selectedProject.domain}</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-6">{selectedProject.title}</h2>
                        
                        <div className="space-y-6 flex-1">
                            <div>
                                <h4 className="text-sm font-semibold mb-3">Technologies Used</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.tech.map((t: string) => (
                                        <span key={t} className="text-xs font-mono text-foreground/80 bg-muted px-3 py-1.5 rounded-md border border-border/50 flex items-center gap-2">
                                            <Code className="w-3 h-3" /> {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold mb-3">Project Overview</h4>
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    {selectedProject.longDesc}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Ready to start this project?</span>
                            <a href={`mailto:softmadeitsolutions@gmail.com?subject=Inquiry about ${selectedProject.title}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-full font-medium hover:scale-105 transition-transform">
                                Request Project <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
