import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

// GET: List all notices (public)
export async function GET() {
    try {
        const db = await getDb();
        const { rows: notices } = await db.query(
            "SELECT id, title, title_html, content, content_html, image_path, link_url, is_pinned, sort_order, author, created_at, updated_at FROM notices ORDER BY is_pinned DESC, sort_order ASC, created_at DESC"
        );

        // Get settings
        const { rows: settingsRows } = await db.query("SELECT value FROM notice_settings WHERE key = 'items_per_page'");
        const settingsRow = settingsRows[0] as { value: string } | undefined;
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
                const buffer = Buffer.from(await file.arrayBuffer());
                const base64Data = buffer.toString("base64");
                const mimeType = file.type || 'image/jpeg';
                imagePath = `data:${mimeType};base64,${base64Data}`;
            }

            if (!title) {
                return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
            }

            const db = await getDb();
            // Get next sort_order
            const { rows: maxRows } = await db.query("SELECT MAX(sort_order) as max_order FROM notices");
            const maxOrder = maxRows[0] as { max_order: number | null };
            const sortOrder = (maxOrder?.max_order ?? 0) + 1;

            const result = await db.query(
                "INSERT INTO notices (title, title_html, content, content_html, image_path, link_url, is_pinned, sort_order, author) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
                [title, titleHtml, content, contentHtml, imagePath, linkUrl, isPinned, sortOrder, user.username]
            );

            return NextResponse.json({
                success: true,
                notice: { id: result.rows[0].id, title, content, author: user.username },
            });
        } else {
            // JSON legacy support
            const { title, content } = await request.json();

            if (!title || !content) {
                return NextResponse.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 });
            }

            const db = await getDb();
            const { rows: maxRows } = await db.query("SELECT MAX(sort_order) as max_order FROM notices");
            const maxOrder = maxRows[0] as { max_order: number | null };
            const sortOrder = (maxOrder?.max_order ?? 0) + 1;

            const result = await db.query(
                "INSERT INTO notices (title, title_html, content, content_html, sort_order, author) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
                [title, title, content, `<p>${content}</p>`, sortOrder, user.username]
            );

            return NextResponse.json({
                success: true,
                notice: { id: result.rows[0].id, title, content, author: user.username },
            });
        }
    } catch (error) {
        console.error("Notices POST error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
