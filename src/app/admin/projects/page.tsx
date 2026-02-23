"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

    // Filtros
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [page, setPage] = useState(1);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                q: search,
                categoryId: categoryFilter,
                status: statusFilter,
                executionYear: yearFilter,
                page: page.toString(),
                limit: "10"
            });
            const res = await fetch(`/api/projects?${params.toString()}`);
            const result = await res.json();
            setProjects(result.data || []);
            setMeta(result.meta || { total: 0, page: 1, limit: 10, totalPages: 1 });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch("/api/categories")
            .then(res => res.json())
            .then(setCategories);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProjects();
        }, 300); // Debounce
        return () => clearTimeout(timer);
    }, [search, categoryFilter, statusFilter, yearFilter, page]);

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">Projetos</h1>
                    <p className="text-gray-500 font-medium text-lg">Gerencie a vitrine de inovação {meta.total > 0 && `(${meta.total} iniciativas)`}</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="flex items-center gap-4 bg-blue-600 text-white px-8 py-5 rounded-[2rem] font-black uppercase italic tracking-widest text-sm hover:scale-105 transition-all shadow-2xl shadow-blue-600/30"
                >
                    <Plus size={20} /> Novo Projeto
                </Link>
            </div>

            {/* BARRA DE BUSCA E FILTROS */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 flex flex-wrap gap-6 items-center">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por título ou resumo..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-16 pr-8 py-5 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none font-bold text-lg transition-all"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <select
                            value={categoryFilter}
                            onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
                            className="pl-12 pr-8 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 font-black uppercase text-[10px] tracking-widest outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Todos os Setores</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-8 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 font-black uppercase text-[10px] tracking-widest outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Todos os Status</option>
                        <option value="PUBLISHED">Publicados</option>
                        <option value="DRAFT">Rascunhos</option>
                    </select>

                    <select
                        value={yearFilter}
                        onChange={e => { setYearFilter(e.target.value); setPage(1); }}
                        className="px-8 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 font-black uppercase text-[10px] tracking-widest outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Todos os Anos</option>
                        {[2023, 2024, 2025, 2026].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50/50 border-b border-zinc-100">
                        <tr>
                            <th className="px-10 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-zinc-400">Iniciativa</th>
                            <th className="px-10 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-zinc-400">Setor</th>
                            <th className="px-10 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-zinc-400 text-center">Status</th>
                            <th className="px-10 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-zinc-400 text-center">Impacto</th>
                            <th className="px-10 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-zinc-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-10 py-8 bg-zinc-50/20"></td>
                                </tr>
                            ))
                        ) : projects.length > 0 ? (
                            projects.map((project) => (
                                <tr key={project.id} className="group hover:bg-zinc-50 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-zinc-200 flex-shrink-0 shadow-sm relative">
                                                <img src={project.coverImage || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=200"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                            </div>
                                            <div>
                                                <span className="block font-black text-zinc-900 text-lg tracking-tight uppercase italic">{project.title}</span>
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(project.updatedAt).toLocaleDateString('pt-BR')}</span>
                                                    {project.executionYear && (
                                                        <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md italic">
                                                            {project.executionMonth} {project.executionYear}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="px-4 py-2 bg-zinc-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                                            {project.category?.name || "Geral"}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${project.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {project.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-blue-600 font-black text-lg italic">{project.metrics?.length || 0}</span>
                                            <span className="text-[8px] font-black uppercase text-zinc-400">Indicadores</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end gap-3 translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto">
                                            <Link href={`/admin/projects/${project.id}`} className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:text-blue-600 hover:border-blue-600 rounded-xl transition-all shadow-sm hover:shadow-lg">
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    if (confirm("Deseja realmente excluir este projeto?")) {
                                                        const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
                                                        if (res.ok) fetchProjects();
                                                    }
                                                }}
                                                className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-500 rounded-xl transition-all shadow-sm hover:shadow-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-10 py-32 text-center text-zinc-300">
                                    <div className="flex flex-col items-center gap-4">
                                        <Search size={48} className="opacity-20" />
                                        <span className="font-black uppercase tracking-widest text-xs">Nenhum projeto encontrado</span>
                                        <button onClick={() => { setSearch(""); setCategoryFilter(""); setStatusFilter(""); setYearFilter(""); }} className="text-blue-600 font-bold text-[10px] uppercase hover:underline">Limpar Filtros</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* PAGINAÇÃO */}
                {meta.totalPages > 1 && (
                    <div className="p-8 bg-zinc-50 flex justify-between items-center border-t border-zinc-100">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Página {meta.page} de {meta.totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-3 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-100 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages}
                                className="p-3 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-100 disabled:opacity-30 transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
