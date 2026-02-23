"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderPlus, LogOut, Settings, Menu, X, ExternalLink } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [siteName, setSiteName] = useState("EXPOEDUC");
    const pathname = usePathname();
    const isLoginPage = pathname?.includes("login");

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.siteName) setSiteName(data.siteName);
            });
    }, []);

    if (isLoginPage) {
        return <main>{children}</main>;
    }

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
                <div className="p-6 flex items-center justify-between">
                    {sidebarOpen && <span className="text-xl font-bold text-blue-600 truncate">{siteName}</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 mt-6">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/" target="_blank" className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900 hover:text-white text-zinc-500 transition-all font-semibold border border-transparent hover:border-white/10 group">
                                <ExternalLink size={20} className="group-hover:rotate-45 transition-transform" />
                                {sidebarOpen && <span className="text-[10px] uppercase tracking-widest">Visualizar Site</span>}
                            </Link>
                        </li>
                        <div className="h-px bg-gray-100 my-4 mx-2" />
                        <li>
                            <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors">
                                <LayoutDashboard size={20} />
                                {sidebarOpen && <span>Dashboard</span>}
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/projects" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors">
                                <FolderPlus size={20} />
                                {sidebarOpen && <span>Projetos</span>}
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors">
                                <Settings size={20} />
                                {sidebarOpen && <span>Configurações</span>}
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => {
                            // Se houvesse cookies, removeríamos document.cookie = "...; max-age=0";
                            window.location.href = "/admin/login";
                        }}
                        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Sair</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-10">
                {children}
            </main>
        </div>
    );
}
