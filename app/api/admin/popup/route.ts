import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export const revalidate = 3600;

interface PopupRow {
    id: number;
    title: string;
    image_path: string;
    size: string;
    position: string;
    duration_days: number;
    is_active: number;
    created_at: string;
    updated_at: string;
}

// GET: Get all active popups (public) or all popups (admin)
export async function GET(request: NextRequest) {
    try {
        const db = await getDb();
        const showAll = request.nextUrl.searchParams.get("all") === "true";

        if (showAll) {
            // Admin: return all popups
            const { rows: popups } = await db.query("SELECT * FROM popup ORDER BY created_at DESC");

            return NextResponse.json({
                popups: popups.map((p) => ({
                    id: p.id,
                    title: p.title || "",
                    imagePath: p.image_path,
                    size: p.size,
                    position: p.position,
                    durationDays: p.duration_days,
                    isActive: p.is_active === 1,
                    createdAt: p.created_at,
                })),
            });
        }

        // Public: return only active, non-expired popups
        const { rows: popups } = await db.query("SELECT * FROM popup WHERE is_active = 1 ORDER BY created_at DESC");

        const activePopups = popups.filter((popup) => {
            const createdDate = new Date(popup.created_at);
            const expiryDate = new Date(createdDate.getTime() + popup.duration_days * 24 * 60 * 60 * 1000);
            if (new Date() > expiryDate) {
                db.query("UPDATE popup SET is_active = 0 WHERE id = $1", [popup.id]).catch(console.error);
                return false;
            }
            return true;
        });

        return NextResponse.json({
            popups: activePopups.map((p) => ({
                id: p.id,
                title: p.title || "",
                imagePath: p.image_path,
                size: p.size,
                position: p.position,
                durationDays: p.duration_days,
                expiresAt: new Date(new Date(p.created_at).getTime() + p.duration_days * 24 * 60 * 60 * 1000).toISOString(),
            })),
            // Legacy: single popup for backward compatibility
            popup: activePopups.length > 0
                ? {
                    id: activePopups[0].id,
                    title: activePopups[0].title || "",
                    imagePath: activePopups[0].image_path,
                    size: activePopups[0].size,
                    position: activePopups[0].position,
                    durationDays: activePopups[0].duration_days,
                }
                : null,
        });
    } catch (error) {
        console.error("Popup GET error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}

// POST: Create new popup (admin only)
export async function POST(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("image") as File | null;
        const title = (formData.get("title") as string) || "";
        const size = (formData.get("size") as string) || "1/2";
        const position = (formData.get("position") as string) || "center";
        const durationDays = parseInt((formData.get("durationDays") as string) || "7");
        const isActive = formData.get("isActive") === "true" ? 1 : 0;
        const addToNotice = formData.get("addToNotice") === "true";
        const editId = formData.get("editId") as string | null;

        let imagePath = (formData.get("existingImagePath") as string) || "";

        if (file && file.size > 0) {
            const blob = await put(file.name, file, { access: 'public' });
            imagePath = blob.url;
        }

        const db = await getDb();

        if (editId) {
            // Update existing popup
            await db.query(
                "UPDATE popup SET title = $1, image_path = $2, size = $3, position = $4, duration_days = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7",
                [title, imagePath, size, position, durationDays, isActive, editId]
            );
        } else {
            // Insert new popup
            await db.query(
                "INSERT INTO popup (title, image_path, size, position, duration_days, is_active) VALUES ($1, $2, $3, $4, $5, $6)",
                [title, imagePath, size, position, durationDays, isActive]
            );
        }

        // Add to notices if requested
        if (addToNotice && imagePath && title) {
            await db.query(
                "INSERT INTO notices (title, content, content_html, image_path, author) VALUES ($1, $2, $3, $4, $5)",
                [title, title, `<p>${title}</p>`, imagePath, user.username]
            );
        }

        revalidatePath("/", "layout");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Popup POST error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}

// DELETE: Delete popup (admin only)
export async function DELETE(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const { id } = await request.json();
        const db = await getDb();
        await db.query("DELETE FROM popup WHERE id = $1", [id]);

        revalidatePath("/", "layout");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Popup DELETE error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
