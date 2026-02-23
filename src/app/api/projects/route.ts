import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const executionYear = searchParams.get("executionYear");
    const skip = (page - 1) * limit;

    try {
        const where: any = {};

        // Se não for admin (ou se houver necessidade de filtro público), pode-se forçar PUBLISHED.
        // Como esta rota é compartilhada, vamos permitir filtros.
        if (status) where.status = status;
        if (categoryId) where.categoryId = categoryId;
        if (executionYear) where.executionYear = parseInt(executionYear);
        if (q) {
            where.OR = [
                { title: { contains: q } },
                { summary: { contains: q } }
            ];
        }

        // Se houver query param 'featured', aplica
        if (searchParams.has("featured")) {
            where.featured = searchParams.get("featured") === "true";
        }

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                include: { category: true, tags: true, metrics: true },
                orderBy: { order: 'asc' },
                skip,
                take: limit
            }),
            prisma.project.count({ where })
        ]);

        // Parse gallery JSON for each project
        const parsedProjects = projects.map(p => ({
            ...p,
            gallery: JSON.parse(p.gallery || "[]")
        }));

        return NextResponse.json({
            data: parsedProjects,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Erro API Projects GET:", error);
        return NextResponse.json({ error: 'Erro ao buscar projetos' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const project = await prisma.project.create({
            data: {
                title: body.title,
                slug: body.slug,
                summary: body.summary,
                content: body.content,
                coverImage: body.coverImage,
                gallery: JSON.stringify(body.gallery || []),
                categoryId: body.categoryId,
                featured: body.featured || false,
                status: body.status || 'DRAFT',
                order: body.order || 0,
                executionMonth: body.executionMonth,
                executionYear: body.executionYear ? parseInt(body.executionYear) : null,
                metrics: {
                    create: body.metrics?.map((m: any) => ({
                        label: m.label,
                        value: m.value,
                        icon: m.icon
                    })) || []
                }
            },
            include: { metrics: true }
        });
        return NextResponse.json(project);
    } catch (error) {
        console.error("Erro API Projects POST:", error);
        return NextResponse.json({ error: 'Erro ao criar projeto' }, { status: 500 });
    }
}
