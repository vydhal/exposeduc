"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard/stats")
            .then(res => res.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold">Bem-vindo, Administrador</h1>
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all border border-white/5"
                >
                    <ExternalLink size={14} />
                    Ver Site Aberto
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {(data?.stats || []).map((stat: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                            <div className="w-6 h-6 border-2 border-white/30 rounded" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Projetos Recentes</h2>
                    <Link href="/admin/projects" className="text-blue-600 font-semibold hover:underline">Ver todos</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-sm uppercase tracking-wider border-bottom">
                                <th className="pb-4 font-semibold text-[10px]">Projeto</th>
                                <th className="pb-4 font-semibold text-[10px]">Categoria</th>
                                <th className="pb-4 font-semibold text-[10px]">Status</th>
                                <th className="pb-4 font-semibold text-[10px]">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(data?.recentProjects || []).map((project: any) => (
                                <tr key={project.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 font-medium">{project.title}</td>
                                    <td className="py-4 text-xs font-semibold text-zinc-500 uppercase">{project.category?.name}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${project.status === 'PUBLISHED'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-zinc-100 text-zinc-600'
                                            }`}>
                                            {project.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <Link
                                            href={`/admin/projects/${project.id}`}
                                            className="text-gray-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase"
                                        >
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
