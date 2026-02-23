"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "@/components/providers/SmoothScroll";
import ProjectModal from "@/components/ui/ProjectModal";
import CustomCursor from "@/components/ui/CustomCursor";
import { ArrowRight, ChevronDown, Instagram, Linkedin, Facebook, MessageCircle, Filter } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeYear, setActiveYear] = useState<string>("all");

  const [siteSettings, setSiteSettings] = useState<any>({
    heroSlogan: "Transformando o aprendizado através da tecnologia.",
    heroBackground: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000",
    primaryColor: "#2563eb",
    logoUrl: null
  });

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const sliderSectionRef = useRef<HTMLDivElement>(null);
  const sliderInnerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Buscar Configurações
    fetch("/api/settings")
      .then(res => res.json())
      .then(setSiteSettings);

    // Buscar Categorias
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(() => { });

    // Buscar Projetos em Destaque
    fetch("/api/projects?featured=true")
      .then(res => res.json())
      .then(res => setFeaturedProjects(res.data || []));

    // Buscar Todos os Projetos
    fetch("/api/projects")
      .then(res => res.json())
      .then(res => {
        setAllProjects(res.data || []);
        setFilteredProjects(res.data || []);
      });
  }, []);

  useEffect(() => {
    let filtered = allProjects;
    if (activeCategory !== "all") {
      filtered = filtered.filter(p => p.categoryId === activeCategory);
    }
    if (activeYear !== "all") {
      filtered = filtered.filter(p => p.executionYear?.toString() === activeYear);
    }
    setFilteredProjects(filtered);
  }, [activeCategory, activeYear, allProjects]);

  useEffect(() => {
    if (featuredProjects.length === 0) return;

    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.to(".hero-content", {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Horizontal Project Slider
      const totalWidth = (sliderInnerRef.current as any).scrollWidth;
      const scrollAmount = totalWidth - window.innerWidth;

      gsap.to(sliderInnerRef.current, {
        x: -scrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: sliderSectionRef.current,
          start: "top top",
          end: () => `+=${scrollAmount}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    });

    return () => ctx.revert();
  }, [featuredProjects]);

  return (
    <SmoothScroll>
      <CustomCursor />
      {/* Injeção Dinâmica de Brand Color para garantir que o Tailwind pegue a mudança */}
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --primary-color: ${siteSettings.primaryColor || '#2563eb'};
        }
      ` }} />

      <main
        className="relative bg-[#050505] text-white selection:bg-brand/30 overflow-x-hidden"
      >

        {/* HERO SECTION */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center p-6 bg-black">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              className="hero-bg absolute inset-0 bg-cover bg-center opacity-20 scale-110"
              style={{ backgroundImage: `url(${siteSettings.heroBackground})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
          </div>

          <div className="hero-content relative z-10 text-center">
            {siteSettings.logoUrl && (
              <img src={siteSettings.logoUrl} alt="Logo" className="h-20 mx-auto mb-8 object-contain" />
            )}
            <div className="overflow-hidden mb-4">
              <span className="reveal-item block text-brand font-bold tracking-[0.3em] uppercase text-sm">Educação do Futuro</span>
            </div>
            <h1 className="reveal-item text-5xl md:text-[8rem] font-black tracking-tighter leading-[0.85] mb-8 uppercase italic">
              {siteSettings.siteName || "EXPOEDUC"}
            </h1>
            <p className="reveal-item text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium italic">
              {siteSettings.heroSlogan}
            </p>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 animate-bounce">
            <ChevronDown size={32} />
          </div>
        </section>

        {/* FEATURED SLIDER */}
        <section ref={sliderSectionRef} className="slider-section h-screen bg-black overflow-hidden flex items-center">
          <div className="absolute top-24 left-12 md:left-24 z-10">
            <span className="text-brand font-bold uppercase tracking-widest text-sm mb-2 block italic">Portfólio de Destaque</span>
            <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter opacity-10 leading-none">Inovações que <br />impactam vidas</h2>
          </div>

          <div ref={sliderInnerRef} className="slider-inner flex gap-24 px-24 md:px-[25vw] items-center">
            {featuredProjects.map((project, i) => (
              <div
                key={project.id}
                onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}
                className="project-card flex-shrink-0 w-[85vw] md:w-[65vw] h-[65vh] md:h-[75vh] relative group cursor-pointer"
              >
                <div className="absolute -top-20 -left-12 text-[15rem] font-black text-white/5 italic select-none pointer-events-none">
                  0{i + 1}
                </div>
                <div className="w-full h-full rounded-[3rem] overflow-hidden border border-white/5 relative bg-zinc-900">
                  <img
                    src={project.coverImage}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-12 md:p-20 flex flex-col justify-end">
                    <div className="flex justify-between items-center mb-6 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-brand font-bold uppercase tracking-widest text-sm">
                        {project.category?.name}
                      </span>
                      {project.executionYear && (
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                          {project.executionMonth} {project.executionYear}
                        </span>
                      )}
                    </div>
                    <h3 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none mb-6">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mt-4 max-w-xl text-lg md:text-xl line-clamp-3 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      {project.summary}
                    </p>
                    <div className="mt-12 flex items-center gap-6 text-white font-bold group/btn">
                      <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-brand group-hover/btn:border-brand transition-all">
                        <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                      <span className="text-xl uppercase italic">Explorar Projeto</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex-shrink-0 w-[50vw] flex flex-col items-center justify-center text-center">
              <h3 className="text-4xl md:text-6xl font-black italic text-zinc-800 mb-8">QUER VER TUDO?</h3>
              <button
                onClick={() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="text-2xl font-bold text-brand hover:text-white transition-colors underline underline-offset-8"
              >
                EXPLORAR GALERIA COMPLETA
              </button>
            </div>
          </div>
        </section>

        {/* ALL PROJECTS SECTION (GALLERY) */}
        <section ref={galleryRef} className="py-40 px-6 md:px-24 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="flex flex-col gap-12">
              <div className="space-y-4">
                <span className="text-brand font-bold uppercase tracking-widest text-sm italic">Arquivo EXPOEDUC</span>
                <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">Todos os<br />Projetos</h2>
              </div>

              <div className="grid md:grid-cols-[1fr,auto] gap-10 items-center bg-white/[0.03] p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
                {/* CATEGORIAS */}
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mr-2">
                    <Filter size={18} />
                  </div>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeCategory === "all" ? 'bg-brand text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    Tudo
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeCategory === cat.id ? 'bg-brand text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* FILTRO POR ANO */}
                <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Filtrar por Ano:</span>
                  <div className="flex gap-2">
                    {["all", "2026", "2025", "2024", "2023"].map(year => (
                      <button
                        key={year}
                        onClick={() => setActiveYear(year)}
                        className={`w-14 h-14 rounded-2xl border font-black text-[10px] transition-all flex items-center justify-center ${activeYear === year ? 'bg-white text-black border-white shadow-xl' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
                      >
                        {year === "all" ? "⚡" : year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}
                  className="group cursor-pointer space-y-6"
                >
                  <div className="aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/5 relative bg-zinc-900">
                    <img
                      src={project.coverImage}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
                        <ArrowRight className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-brand font-bold uppercase tracking-widest">{project.category?.name}</span>
                      {project.executionYear && <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">{project.executionMonth} {project.executionYear}</span>}
                    </div>
                    <h4 className="text-2xl font-black italic uppercase tracking-tighter mt-1">{project.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="min-h-screen py-60 px-6 flex items-center justify-center bg-black relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative z-10 text-center max-w-6xl">
            <h2 className="text-7xl md:text-[12rem] font-black mb-16 tracking-tighter leading-[0.8] uppercase italic">
              {siteSettings.ctaTitle ? (
                siteSettings.ctaTitle.includes(' ') ? (
                  <>
                    {siteSettings.ctaTitle.split(' ').slice(0, -1).join(' ')}
                    <br />
                    <span className="text-brand">{siteSettings.ctaTitle.split(' ').slice(-1)}</span>
                  </>
                ) : (
                  <span className="text-brand">{siteSettings.ctaTitle}</span>
                )
              ) : (
                <>VAMOS<br /><span className="text-brand">INOVAR?</span></>
              )}
            </h2>

            <div className="flex flex-col gap-12 justify-center items-center mb-20">
              <a
                href={siteSettings.ctaButtonLink || "#"}
                className="px-16 py-8 bg-brand text-white rounded-full font-black text-2xl hover:bg-white hover:text-black transition-all hover:scale-105 shadow-2xl shadow-blue-600/30 text-decoration-none"
                style={{ boxShadow: `0 25px 50px -12px ${siteSettings.primaryColor}4d` }}
              >
                {siteSettings.ctaButtonText || "PROJETAR O FUTURO"}
              </a>
              <div className="flex gap-4 justify-center">
                {[
                  { icon: <Instagram />, url: siteSettings.instagramUrl },
                  { icon: <Linkedin />, url: siteSettings.linkedinUrl },
                  { icon: <Facebook />, url: siteSettings.facebookUrl },
                  { icon: <MessageCircle />, url: siteSettings.whatsappUrl }
                ].filter(s => s.url).map((social, i) => (
                  <a key={i} href={social.url} target="_blank" className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand hover:border-brand transition-all">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={selectedProject}
        />

        {/* FOOTER */}
        <footer className="py-20 px-12 border-t border-white/5 text-gray-500 font-medium text-xs flex flex-col md:flex-row justify-between items-center gap-8 bg-black">
          <p className="uppercase tracking-widest">© 2026 EXPOEDUC - Secretaria de Tecnologia e Educação Digital</p>
          <div className="flex gap-12 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-brand transition-colors">Institucional</a>
            <a href="#" className="hover:text-brand transition-colors">Transparência</a>
            <a href="#" className="hover:text-brand transition-colors">Privacidade</a>
          </div>
        </footer>
      </main>
    </SmoothScroll>
  );
}
