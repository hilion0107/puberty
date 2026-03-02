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

        const db = await getDb();
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            for (let i = 0; i < orderedIds.length; i++) {
                const id = orderedIds[i];
                await client.query("UPDATE notices SET sort_order = $1 WHERE id = $2", [i, id]);
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reorder POST error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
