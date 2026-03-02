import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import path from "path";
import fs from "fs";

// GET: List all notices (public)
export async function GET() {
    try {
        const db = getDb();
        const notices = db
            .prepare("SELECT id, title, title_html, content, content_html, image_path, link_url, is_pinned, sort_order, author, created_at, updated_at FROM notices ORDER BY is_pinned DESC, sort_order ASC, created_at DESC")
            .all();

        // Get settings
        const settingsRow = db.prepare("SELECT value FROM notice_settings WHERE key = 'items_per_page'").get() as { value: string } | undefined;
        const itemsPerPage = settingsRow ? parseInt(settingsRow.value) : 7;

        return NextResponse.json({ notices, itemsPerPage });
    } catch (error) {
        console.error("Notices GET error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}

// POST: Create notice (admin only)
export async function POST(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const contentType = request.headers.get("content-type") || "";

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            const title = (formData.get("title") as string) || "";
            const titleHtml = (formData.get("title_html") as string) || "";
            const content = (formData.get("content") as string) || "";
            const contentHtml = (formData.get("content_html") as string) || "";
            const linkUrl = (formData.get("link_url") as string) || "";
            const isPinned = formData.get("is_pinned") === "true" ? 1 : 0;
            const file = formData.get("image") as File | null;

            let imagePath = (formData.get("existing_image_path") as string) || "";

            if (file && file.size > 0) {
                const uploadsDir = path.join(process.cwd(), "public", "uploads");
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                }
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = `notice_${Date.now()}${path.extname(file.name)}`;
                fs.writeFileSync(path.join(uploadsDir, filename), buffer);
                imagePath = `/uploads/${filename}`;
            }

            if (!title) {
                return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
            }

            const db = getDb();
            // Get next sort_order
            const maxOrder = db.prepare("SELECT MAX(sort_order) as max_order FROM notices").get() as { max_order: number | null };
            const sortOrder = (maxOrder?.max_order || 0) + 1;

            const result = db.prepare(
                "INSERT INTO notices (title, title_html, content, content_html, image_path, link_url, is_pinned, sort_order, author) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
            ).run(title, titleHtml, content, contentHtml, imagePath, linkUrl, isPinned, sortOrder, user.username);

            return NextResponse.json({
                success: true,
                notice: { id: result.lastInsertRowid, title, content, author: user.username },
            });
        } else {
            // JSON legacy support
            const { title, content } = await request.json();

            if (!title || !content) {
                return NextResponse.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 });
            }

            const db = getDb();
            const maxOrder = db.prepare("SELECT MAX(sort_order) as max_order FROM notices").get() as { max_order: number | null };
            const sortOrder = (maxOrder?.max_order || 0) + 1;

            const result = db.prepare(
                "INSERT INTO notices (title, title_html, content, content_html, sort_order, author) VALUES (?, ?, ?, ?, ?, ?)"
            ).run(title, title, content, `<p>${content}</p>`, sortOrder, user.username);

            return NextResponse.json({
                success: true,
                notice: { id: result.lastInsertRowid, title, content, author: user.username },
            });
        }
    } catch (error) {
        console.error("Notices POST error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
