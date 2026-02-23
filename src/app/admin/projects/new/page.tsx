"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon, Upload, X, Plus } from "lucide-react";
import Link from "next/link";

export default function NewProject() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        summary: "",
        content: "",
        coverImage: "",
        categoryId: "",
        status: "PUBLISHED",
        featured: false,
        executionMonth: "Janeiro",
        executionYear: new Date().getFullYear(),
        gallery: [] as string[],
        metrics: [] as any[]
    });

    useEffect(() => {
        fetch("/api/categories")
            .then(res => res.json())
            .then(cats => {
                setCategories(cats);
                if (cats.length > 0) setFormData(prev => ({ ...prev, categoryId: cats[0].id }));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(type);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data
            });
            const result = await res.json();

            if (result.url) {
                if (type === 'cover') {
                    setFormData(prev => ({ ...prev, coverImage: result.url }));
                } else {
                    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, result.url] }));
                }
            }
        } catch (err) {
            console.error("Erro no upload:", err);
            alert("Erro ao subir imagem");
        } finally {
            setUploading(null);
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/admin/projects");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 font-bold animate-pulse text-zinc-500">Preparando formulário...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-32">
            <div className="flex items-center gap-4">
                <Link href="/admin/projects" className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">Novo Projeto</h1>
                    <p className="text-gray-500 font-medium">Lance uma nova iniciativa na plataforma</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Título do Projeto</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                className="w-full px-6 py-4 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-lg"
                                placeholder="Nome da iniciativa"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Categoria</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white font-bold"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Status Inicial</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white font-bold"
                                >
                                    <option value="PUBLISHED">Publicado</option>
                                    <option value="DRAFT">Rascunho</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Mês de Execução</label>
                                <select
                                    value={formData.executionMonth}
                                    onChange={e => setFormData({ ...formData, executionMonth: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white font-bold"
                                >
                                    {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Ano de Execução</label>
                                <input
                                    type="number"
                                    value={formData.executionYear}
                                    onChange={e => setFormData({ ...formData, executionYear: parseInt(e.target.value) })}
                                    className="w-full px-6 py-4 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold"
                                    placeholder="Ex: 2024"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Imagem de Capa</label>
                            <div className="flex gap-6 items-start">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-zinc-100 border-2 border-dashed border-zinc-300 flex-shrink-0 relative group">
                                    {formData.coverImage ? (
                                        <img src={formData.coverImage} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                    {uploading === 'cover' && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[10px] font-black uppercase">Subindo...</div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <label className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-zinc-900 text-white font-black uppercase text-xs cursor-pointer hover:bg-blue-600 transition-colors">
                                        <Upload size={16} /> Carregar Capa
                                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'cover')} />
                                    </label>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">JPG, PNG ou WebP. Sugerido: 1200x800px</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Destaque na Home</label>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs border-2 transition-all ${formData.featured ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-transparent border-zinc-100 text-zinc-300'}`}
                            >
                                {formData.featured ? 'Projeto em Destaque' : 'Normal'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* GALERIA */}
                <div className="pt-10 border-t border-zinc-100">
                    <div className="flex justify-between items-center mb-6">
                        <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Galeria de Fotos do Projeto</label>
                        <label className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 text-blue-600 font-black uppercase text-[10px] cursor-pointer hover:bg-blue-100 transition-colors">
                            <Plus size={14} /> Adicionar Foto
                            <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'gallery')} />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {formData.gallery.map((img, i) => (
                            <div key={i} className="aspect-square rounded-[2rem] overflow-hidden bg-zinc-100 relative group border border-zinc-100">
                                <img src={img} className="w-full h-full object-cover" alt="" />
                                <button
                                    type="button"
                                    onClick={() => removeGalleryImage(i)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        {uploading === 'gallery' && (
                            <div className="aspect-square rounded-[2rem] border-4 border-dashed border-zinc-100 flex items-center justify-center animate-pulse bg-zinc-50 font-black uppercase text-[10px] text-zinc-300">
                                Subindo...
                            </div>
                        )}
                    </div>
                </div>

                {/* MÉTRICAS */}
                <div className="pt-10 border-t border-zinc-100">
                    <div className="flex justify-between items-center mb-6">
                        <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Métricas de Impacto (Resultados)</label>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, metrics: [...prev.metrics, { label: "", value: "", icon: "Users" }] }))}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-black uppercase text-[10px] hover:bg-zinc-900 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <Plus size={14} /> Adicionar Métrica
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {formData.metrics.map((metric, i) => (
                            <div key={i} className="flex gap-4 items-end bg-zinc-50 p-6 rounded-3xl border border-zinc-100 relative group">
                                <div className="flex-1 space-y-3">
                                    <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-400">Rótulo (ex: Alunos)</label>
                                    <input
                                        type="text"
                                        value={metric.label}
                                        onChange={e => {
                                            const newMetrics = [...formData.metrics];
                                            newMetrics[i].label = e.target.value;
                                            setFormData({ ...formData, metrics: newMetrics });
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-4 focus:ring-blue-500/10 font-bold"
                                        placeholder="Ex: Alunos Beneficiados"
                                    />
                                </div>
                                <div className="w-40 space-y-3">
                                    <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-400">Valor (ex: 1.500+)</label>
                                    <input
                                        type="text"
                                        value={metric.value}
                                        onChange={e => {
                                            const newMetrics = [...formData.metrics];
                                            newMetrics[i].value = e.target.value;
                                            setFormData({ ...formData, metrics: newMetrics });
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-4 focus:ring-blue-500/10 font-bold"
                                        placeholder="Ex: 5.000+"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newMetrics = formData.metrics.filter((_, idx) => idx !== i);
                                        setFormData({ ...formData, metrics: newMetrics });
                                    }}
                                    className="p-3 rounded-xl bg-white border border-zinc-200 text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-zinc-100">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Resumo Executivo</label>
                        <textarea
                            required
                            value={formData.summary}
                            onChange={e => setFormData({ ...formData, summary: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none h-28 resize-none font-medium leading-relaxed"
                            placeholder="Breve descrição do projeto..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Narrativa Detalhada</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none h-60 font-medium leading-relaxed"
                            placeholder="Conte a história completa do projeto..."
                        />
                    </div>
                </div>

                <div className="pt-10 border-t border-zinc-100 text-right">
                    <button
                        disabled={saving || !!uploading}
                        className="flex items-center gap-4 bg-zinc-900 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 inline-flex"
                    >
                        <Save size={20} /> {saving ? "Processando..." : "Criar Projeto"}
                    </button>
                </div>
            </form >
        </div >
    );
}
