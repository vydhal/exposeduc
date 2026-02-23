import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        let settings = await prisma.siteSettings.findUnique({
            where: { id: "default" }
        });

        if (!settings) {
            console.log("Configurações não encontradas, criando padrão...");
            settings = await prisma.siteSettings.create({
                data: {
                    id: "default",
                    heroSlogan: "O futuro da educação pública reimaginado através da inovação, tecnologia e criatividade.",
                    heroBackground: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000",
                    ctaTitle: "VAMOS INOVAR?",
                    ctaButtonText: "PROJETAR O FUTURO"
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Erro no GET /api/settings:", error);
        return NextResponse.json({ error: "Erro ao buscar configurações" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Recebendo novas configurações:", body);

        // Remove campos que não devem ser atualizados manualmente
        const { id, updatedAt, ...updateData } = body;

        const settings = await prisma.siteSettings.upsert({
            where: { id: "default" },
            update: updateData,
            create: { id: "default", ...updateData }
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Erro no POST /api/settings:", error);
        return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 });
    }
}
