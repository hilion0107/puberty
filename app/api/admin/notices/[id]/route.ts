import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import path from "path";
import fs from "fs";

// GET: Get single notice (public)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = getDb();
        const notice = db
            .prepare("SELECT * FROM notices WHERE id = ?")
            .get(id);

        if (!notice) {
            return NextResponse.json({ error: "공지사항을 찾을 수 없습니다." }, { status: 404 });
        }

        return NextResponse.json({ notice });
    } catch (error) {
        console.error("Notice GET error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}

// PUT: Update notice (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const { id } = await params;
        const contentType = request.headers.get("content-type") || "";
        const db = getDb();

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

            db.prepare(
                "UPDATE notices SET title = ?, title_html = ?, content = ?, content_html = ?, image_path = ?, link_url = ?, is_pinned = ?, updated_at = datetime('now') WHERE id = ?"
            ).run(title, titleHtml, content, contentHtml, imagePath, linkUrl, isPinned, id);
        } else {
            const body = await request.json();

            if (body.is_pinned !== undefined) {
                // Toggle pin only
                db.prepare("UPDATE notices SET is_pinned = ?, updated_at = datetime('now') WHERE id = ?")
                    .run(body.is_pinned ? 1 : 0, id);
            } else {
                const { title, content, content_html, title_html, link_url, image_path } = body;
                db.prepare(
                    "UPDATE notices SET title = ?, title_html = COALESCE(?, title_html), content = ?, content_html = COALESCE(?, content_html), image_path = COALESCE(?, image_path), link_url = COALESCE(?, link_url), updated_at = datetime('now') WHERE id = ?"
                ).run(title, title_html || null, content, content_html || null, image_path || null, link_url || null, id);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Notice PUT error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}

// DELETE: Delete notice (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const { id } = await params;
        const db = getDb();
        db.prepare("DELETE FROM notices WHERE id = ?").run(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Notice DELETE error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
