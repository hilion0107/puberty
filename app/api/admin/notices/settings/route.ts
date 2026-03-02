import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

// GET: Get items_per_page setting
export async function GET() {
    try {
        const db = await getDb();
        const { rows } = await db.query("SELECT value FROM notice_settings WHERE key = 'items_per_page'");
        const row = rows[0] as { value: string } | undefined;
        return NextResponse.json({ itemsPerPage: row ? parseInt(row.value) : 7 });
    } catch (error) {
        console.error("Settings GET error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}

// POST: Save settings
export async function POST(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const { itemsPerPage } = await request.json();
        const value = Math.max(3, Math.min(10, parseInt(itemsPerPage) || 7));

        const db = await getDb();
        await db.query(
            "INSERT INTO notice_settings (key, value) VALUES ('items_per_page', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
            [String(value)]
        );

        return NextResponse.json({ success: true, itemsPerPage: value });
    } catch (error) {
        console.error("Settings POST error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
