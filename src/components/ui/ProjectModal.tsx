"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any;
}

export default function ProjectModal({ isOpen, onClose, project }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const lenis = useLenis();

    // Combinar capa + galeria para o slider
    const images = project ? [project.coverImage, ...(project.gallery || [])].filter(Boolean) : [];

    useEffect(() => {
        if (isOpen) {
            setCurrentImageIndex(0);
            lenis?.stop();
            const ctx = gsap.context(() => {
                gsap.fromTo(overlayRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.4, ease: "power2.out" }
                );
                gsap.fromTo(modalRef.current,
                    { y: 50, opacity: 0, scale: 0.9 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power4.out", delay: 0.1 }
                );
            });
            return () => {
                ctx.revert();
                lenis?.start();
            };
        } else {
            lenis?.start();
        }
    }, [isOpen, project, lenis]);

    if (!isOpen || !project) return null;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 pointer-events-auto">
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-pointer"
                onClick={onClose}
            />

            <div
                ref={modalRef}
                data-lenis-prevent
                className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="fixed top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all z-[210] hover:rotate-90 lg:absolute lg:top-8 lg:right-8"
                >
                    <X size={28} />
                </button>

                <div className="grid lg:grid-cols-2 min-h-full">
                    {/* GALLERY SLIDER */}
                    <div className="relative h-[50vh] lg:h-auto overflow-hidden bg-zinc-900 group">
                        <div className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                            {images.map((img, i) => (
                                <div key={i} className="w-full h-full flex-shrink-0">
                                    <img
                                        src={img}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-brand transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-brand transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronRight size={24} />
                                </button>

                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                                    {images.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 rounded-full transition-all duration-500 ${currentImageIndex === i ? 'w-8 bg-brand' : 'w-2 bg-white/20'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent lg:hidden" />
                    </div>

                    <div className="p-8 md:p-16 lg:p-20 space-y-10">
                        <div>
                            <span className="text-brand font-bold uppercase tracking-[0.2em] text-xs mb-4 block italic">
                                {project.category?.name || "Projeto Estratégico"}
                            </span>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter text-white leading-none uppercase">
                                {project.title}
                            </h2>
                        </div>

                        <p className="text-2xl md:text-3xl text-zinc-400 leading-tight font-black italic tracking-tighter uppercase opacity-80">
                            {project.summary}
                        </p>

                        <div className="prose prose-invert max-w-none text-zinc-300 text-lg leading-relaxed font-medium">
                            {project.content.split('\n').map((paragraph: string, i: number) => (
                                <p key={i} className="mb-4">{paragraph}</p>
                            ))}
                        </div>

                        {project.metrics && project.metrics.length > 0 && (
                            <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/5">
                                {project.metrics.map((m: any, i: number) => (
                                    <div key={i} className="group/metric">
                                        <span className="block text-5xl font-black italic text-brand mb-2 group-hover/metric:translate-x-2 transition-transform">{m.value}</span>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{m.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-10">
                            <button className="w-full py-8 bg-zinc-900 text-white rounded-[2rem] font-black uppercase italic tracking-widest hover:bg-brand transition-all shadow-xl hover:shadow-brand/20 border border-white/5">
                                Detalhes Técnicos e Impacto
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
