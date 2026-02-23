import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: filePathParams } = await params;

        if (!filePathParams || filePathParams.length === 0) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const filename = filePathParams.join("/");
        const filePath = path.join(process.cwd(), "public", "uploads", filename);

        if (!existsSync(filePath)) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const buffer = await readFile(filePath);

        const ext = path.extname(filename).toLowerCase();
        let contentType = "application/octet-stream";
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".svg") contentType = "image/svg+xml";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".ico") contentType = "image/x-icon";

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch (error) {
        console.error("Error serving file:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
