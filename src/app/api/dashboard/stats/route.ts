import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [activeProjects, drafts, categories, totalMetrics] = await Promise.all([
            prisma.project.count({ where: { status: "PUBLISHED" } }),
            prisma.project.count({ where: { status: "DRAFT" } }),
            prisma.category.count(),
            prisma.metric.count(), // Usaremos total de métricas como um "proxy" para impacto por enquanto
        ]);

        // Projetos recentes
        const recentProjects = await prisma.project.findMany({
            take: 5,
            orderBy: { updatedAt: "desc" },
            include: { category: true }
        });

        return NextResponse.json({
            stats: [
                { label: "Projetos Ativos", value: activeProjects.toString(), color: "bg-blue-500" },
                { label: "Categorias", value: categories.toString(), color: "bg-purple-500" },
                { label: "Impacto Registrado", value: totalMetrics.toString(), color: "bg-green-500" },
                { label: "Rascunhos", value: drafts.toString(), color: "bg-orange-500" },
            ],
            recentProjects
        });
    } catch (error) {
        console.error("Erro dashboard stats:", error);
        return NextResponse.json({ error: "Erro ao buscar dados do dashboard" }, { status: 500 });
    }
}
