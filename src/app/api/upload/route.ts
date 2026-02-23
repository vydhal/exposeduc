import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Criar nome único para o arquivo
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const uploadPath = path.join(process.cwd(), "public", "uploads", filename);

        await writeFile(uploadPath, buffer);

        const url = `/uploads/${filename}`;
        return NextResponse.json({ url });
    } catch (error) {
        console.error("Erro no upload:", error);
        return NextResponse.json({ error: "Falha ao processar upload" }, { status: 500 });
    }
}
