import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { put } from "@vercel/blob";

export const dynamic = 'force-dynamic';

// GET: Get single notice (public)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await getDb();
        const { rows } = await db.query("SELECT * FROM notices WHERE id = $1", [id]);
        const notice = rows[0];

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
                const blob = await put(file.name, file, { access: 'public' });
                imagePath = blob.url;
            }

            const db = await getDb();
            await db.query(
                "UPDATE notices SET title = $1, title_html = $2, content = $3, content_html = $4, image_path = $5, link_url = $6, is_pinned = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8",
                [title, titleHtml, content, contentHtml, imagePath, linkUrl, isPinned, id]
            );
        } else {
            const body = await request.json();
            const db = await getDb();

            if (body.is_pinned !== undefined) {
                // Toggle pin only
                await db.query("UPDATE notices SET is_pinned = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [body.is_pinned ? 1 : 0, id]);
            } else {
                const { title, content, content_html, title_html, link_url, image_path } = body;
                await db.query(
                    "UPDATE notices SET title = $1, title_html = COALESCE($2, title_html), content = $3, content_html = COALESCE($4, content_html), image_path = COALESCE($5, image_path), link_url = COALESCE($6, link_url), updated_at = CURRENT_TIMESTAMP WHERE id = $7",
                    [title, title_html || null, content, content_html || null, image_path || null, link_url || null, id]
                );
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
        const db = await getDb();
        await db.query("DELETE FROM notices WHERE id = $1", [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Notice DELETE error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
