import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const project = await prisma.project.findUnique({
            where: { id },
            include: { category: true, tags: true, metrics: true },
        });

        if (!project) {
            return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
        }

        return NextResponse.json({
            ...project,
            gallery: JSON.parse(project.gallery || "[]")
        });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar projeto" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Extrai as métricas do body se existirem
        const { metrics, ...projectData } = body;

        // Atualização atômica do projeto e suas métricas
        const project = await prisma.$transaction(async (tx) => {
            // Se as métricas foram enviadas, limpamos as antigas e criamos as novas
            if (metrics) {
                await tx.metric.deleteMany({
                    where: { projectId: id }
                });

                if (Array.isArray(metrics) && metrics.length > 0) {
                    await tx.metric.createMany({
                        data: metrics.map((m: any) => ({
                            label: m.label,
                            value: m.value,
                            icon: m.icon,
                            projectId: id
                        }))
                    });
                }
            }

            // Atualiza o projeto (garantindo que gallery seja string se for objeto)
            const updateData = { ...projectData };
            if (typeof updateData.gallery === 'object') {
                updateData.gallery = JSON.stringify(updateData.gallery);
            }

            return await tx.project.update({
                where: { id },
                data: updateData,
                include: { metrics: true }
            });
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error("Erro API Projects PATCH:", error);
        return NextResponse.json({ error: "Erro ao atualizar projeto" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.project.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Projeto excluído" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir projeto" }, { status: 500 });
    }
}
