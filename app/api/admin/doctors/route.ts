import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const revalidate = 3600;

// GET: List all doctors (public)
export async function GET() {
    try {
        const db = await getDb();
        const { rows: doctors } = await db.query(
            "SELECT * FROM doctors ORDER BY sort_order ASC, id ASC"
        );
        return NextResponse.json({ doctors });
    } catch (error) {
        console.error("Doctors GET error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}

// POST: Save doctors (admin only)
export async function POST(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const { doctors } = await request.json();
        const db = await getDb();

        // Clear existing and insert new
        await db.query("DELETE FROM doctors");

        for (let i = 0; i < doctors.length; i++) {
            const d = doctors[i];
            await db.query(
                "INSERT INTO doctors (abbreviation, name, color, sort_order) VALUES ($1, $2, $3, $4)",
                [d.abbr || d.abbreviation, d.name, d.color || "#3B82F6", i]
            );
        }

        revalidatePath("/", "layout");
        revalidatePath("/clinic", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Doctors POST error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
