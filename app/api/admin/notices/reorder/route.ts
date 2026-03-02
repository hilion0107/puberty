import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

// POST: Reorder notices
export async function POST(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const { orderedIds } = await request.json();

        if (!Array.isArray(orderedIds)) {
            return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
        }

        const db = getDb();
        const stmt = db.prepare("UPDATE notices SET sort_order = ? WHERE id = ?");
        const transaction = db.transaction(() => {
            orderedIds.forEach((id: number, index: number) => {
                stmt.run(index, id);
            });
        });
        transaction();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reorder POST error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
