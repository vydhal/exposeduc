"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save, Image as ImageIcon, Link as LinkIcon, Globe, Upload } from "lucide-react";

export default function AdminSettings() {
    const [settings, setSettings] = useState<any>({
        siteName: "EXPOEDUC",
        heroSlogan: "",
        heroBackground: "",
        logoUrl: "",
        faviconUrl: "",
        primaryColor: "#2563eb",
        instagramUrl: "",
        linkedinUrl: "",
        facebookUrl: "",
        whatsappUrl: "",
        ctaTitle: "VAMOS INOVAR?",
        ctaButtonText: "PROJETAR O FUTURO",
        ctaButtonLink: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setSettings(data);
                } else {
                    console.error("Erro ao carregar configurações:", data.error);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Falha na rede:", err);
                setLoading(false);
            });
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(field);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data
            });
            const result = await res.json();

            if (result.url) {
                setSettings((prev: any) => ({ ...prev, [field]: result.url }));
            }
        } catch (err) {
            console.error("Erro no upload:", err);
            alert("Erro ao subir imagem");
        } finally {
            setUploading(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert("Configurações salvas com sucesso!");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 font-bold animate-pulse text-zinc-500">Carregando configurações...</div>;

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">Configurações do Site</h1>
                    <p className="text-gray-500 font-medium">Personalize a identidade visual e links da plataforma</p>
                </div>
            </div>

            <div className="grid gap-10">
                {/* HERO CONFIG */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-zinc-100">
                    <h2 className="text-xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <ImageIcon size={20} />
                        </div>
                        Hero & Identidade Visual
                    </h2>

                    <div className="space-y-10">
                        <div className="grid md:grid-cols-2 gap-10">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Nome da Plataforma (Título)</label>
                                <input
                                    type="text"
                                    value={settings.siteName || ""}
                                    onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full px-8 py-4 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-xl bg-zinc-50/50"
                                    placeholder="Ex: EXPOEDUC"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Slogan Principal (Hero)</label>
                                <input
                                    type="text"
                                    value={settings.heroSlogan || ""}
                                    onChange={e => setSettings({ ...settings, heroSlogan: e.target.value })}
                                    className="w-full px-8 py-4 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-lg bg-zinc-50/50"
                                    placeholder="Frase de impacto..."
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-10">
                            <div className="space-y-6">
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Logo da Plataforma</label>
                                <div className="flex flex-col gap-4 items-center p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                                    <div className="w-20 h-20 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center overflow-hidden p-2 relative">
                                        {settings.logoUrl ? (
                                            <img src={settings.logoUrl} className="w-full h-full object-contain" alt="Logo" />
                                        ) : (
                                            <ImageIcon size={24} className="text-zinc-200" />
                                        )}
                                        {uploading === 'logoUrl' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[8px] font-black uppercase">...</div>}
                                    </div>
                                    <label className="w-full text-center px-4 py-3 rounded-xl bg-zinc-900 text-white font-black uppercase text-[10px] tracking-widest cursor-pointer hover:bg-blue-600 transition-colors">
                                        LOGO
                                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'logoUrl')} />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Favicon (Ícone Aba)</label>
                                <div className="flex flex-col gap-4 items-center p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                                    <div className="w-20 h-20 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center overflow-hidden p-4 relative">
                                        {settings.faviconUrl ? (
                                            <img src={settings.faviconUrl} className="w-full h-full object-contain" alt="Favicon" />
                                        ) : (
                                            <ImageIcon size={24} className="text-zinc-200" />
                                        )}
                                        {uploading === 'faviconUrl' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[8px] font-black uppercase">...</div>}
                                    </div>
                                    <label className="w-full text-center px-4 py-3 rounded-xl bg-zinc-900 text-white font-black uppercase text-[10px] tracking-widest cursor-pointer hover:bg-blue-600 transition-colors">
                                        FAVICON
                                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'faviconUrl')} />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Fundo Hero</label>
                                <div className="flex flex-col gap-4 items-center p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                                    <div className="w-20 h-20 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center overflow-hidden relative">
                                        {settings.heroBackground ? (
                                            <img src={settings.heroBackground} className="w-full h-full object-cover" alt="BG" />
                                        ) : (
                                            <ImageIcon size={24} className="text-zinc-200" />
                                        )}
                                        {uploading === 'heroBackground' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[8px] font-black uppercase">...</div>}
                                    </div>
                                    <label className="w-full text-center px-4 py-3 rounded-xl bg-zinc-900 text-white font-black uppercase text-[10px] tracking-widest cursor-pointer hover:bg-blue-600 transition-colors">
                                        FUNDO
                                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'heroBackground')} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* CORES DA PLATAFORMA */}
                        <div className="space-y-6 pt-10 border-t border-zinc-100">
                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Identidade Visual (Cor Primária)</label>
                            <div className="flex gap-8 items-center p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                                <div className="flex flex-col gap-2">
                                    <div
                                        className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl"
                                        style={{ backgroundColor: settings.primaryColor || '#2563eb' }}
                                    />
                                    <span className="text-[10px] font-black uppercase text-center text-zinc-400">{settings.primaryColor || '#2563eb'}</span>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <p className="text-zinc-500 text-sm font-medium">Esta cor será aplicada em botões, destaques e elementos principais da Landing Page.</p>
                                    <input
                                        type="color"
                                        value={settings.primaryColor || '#2563eb'}
                                        onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                                        className="h-12 w-full cursor-pointer rounded-xl bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SOCIAL LINKS */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-zinc-100">
                    <h2 className="text-xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-lg">
                            <LinkIcon size={20} />
                        </div>
                        Presença Digital (Redes Sociais)
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { label: "Instagram", field: "instagramUrl", placeholder: "https://instagram.com/..." },
                            { label: "LinkedIn", field: "linkedinUrl", placeholder: "https://linkedin.com/in/..." },
                            { label: "WhatsApp", field: "whatsappUrl", placeholder: "https://wa.me/..." },
                            { label: "Facebook", field: "facebookUrl", placeholder: "https://facebook.com/..." }
                        ].map(social => (
                            <div key={social.field}>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">{social.label}</label>
                                <input
                                    type="text"
                                    value={settings[social.field] || ""}
                                    onChange={e => setSettings({ ...settings, [social.field]: e.target.value })}
                                    className="w-full px-6 py-4 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold"
                                    placeholder={social.placeholder}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA FINAL CONFIG */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-zinc-100">
                    <h2 className="text-xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Globe size={20} />
                        </div>
                        Seção Final (Chamada para Ação)
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Título Chamada Final</label>
                            <input
                                type="text"
                                value={settings.ctaTitle || ""}
                                onChange={e => setSettings({ ...settings, ctaTitle: e.target.value })}
                                className="w-full px-8 py-5 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black italic uppercase text-3xl bg-zinc-50/50 tracking-tighter"
                                placeholder="VAMOS INOVAR?"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-10">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Texto do Botão</label>
                                <input
                                    type="text"
                                    value={settings.ctaButtonText || ""}
                                    onChange={e => setSettings({ ...settings, ctaButtonText: e.target.value })}
                                    className="w-full px-6 py-4 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none font-bold"
                                    placeholder="PROJETAR O FUTURO"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Link do Botão (Opcional)</label>
                                <input
                                    type="text"
                                    value={settings.ctaButtonLink || ""}
                                    onChange={e => setSettings({ ...settings, ctaButtonLink: e.target.value })}
                                    className="w-full px-6 py-4 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none font-bold"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SAVE BUTTON */}
                <div className="fixed bottom-10 right-10 flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving || !!uploading}
                        className="flex items-center gap-4 bg-blue-600 text-white px-12 py-6 rounded-full font-black uppercase italic tracking-widest hover:scale-105 transition-all shadow-2xl shadow-blue-600/40 disabled:opacity-50"
                    >
                        <Save size={22} /> {saving ? "Processando..." : "Aplicar Mudanças"}
                    </button>
                </div>
            </div>
        </div>
    );
}
