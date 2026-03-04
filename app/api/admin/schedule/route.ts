import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET: Retrieve schedule for given year/month (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = parseInt(searchParams.get("year") || "0");
        const month = parseInt(searchParams.get("month") || "0");
        const all = searchParams.get("all") === "true";

        const db = await getDb();

        if (all) {
            // Return all schedules
            const { rows: schedules } = await db.query("SELECT * FROM schedule ORDER BY year DESC, month DESC");
            return NextResponse.json({
                data: schedules.map((s) => ({
                    ...JSON.parse(s.data_json),
                    updatedAt: s.updated_at,
                })),
            });
        } else if (year && month) {
            // Specific month
            const { rows } = await db.query(
                "SELECT * FROM schedule WHERE year = $1 AND month = $2",
                [year, month]
            );
            const schedule = rows[0] as { id: number; year: number; month: number; data_json: string; updated_at: string } | undefined;

            if (!schedule) {
                return NextResponse.json({ data: null });
            }

            return NextResponse.json({
                data: JSON.parse(schedule.data_json),
                updatedAt: schedule.updated_at,
            });
        } else {
            // Latest schedule
            const { rows } = await db.query("SELECT * FROM schedule ORDER BY year DESC, month DESC LIMIT 1");
            const schedule = rows[0] as { id: number; year: number; month: number; data_json: string; updated_at: string } | undefined;

            if (!schedule) {
                return NextResponse.json({ data: null });
            }

            return NextResponse.json({
                data: JSON.parse(schedule.data_json),
                updatedAt: schedule.updated_at,
            });
        }
    } catch (error) {
        console.error("Schedule GET error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}

// POST: Save schedule data (admin only)
export async function POST(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { year, month, days, doctors, footerLines, businessHours } = body;

        if (!year || !month) {
            return NextResponse.json({ error: "년/월을 지정해주세요." }, { status: 400 });
        }

        const dataJson = JSON.stringify({ year, month, days, doctors, footerLines, businessHours });
        const db = await getDb();

        // Upsert
        const { rows: existingRows } = await db.query(
            "SELECT id FROM schedule WHERE year = $1 AND month = $2",
            [year, month]
        );
        const existing = existingRows[0];

        if (existing) {
            await db.query(
                "UPDATE schedule SET data_json = $1, updated_at = CURRENT_TIMESTAMP WHERE year = $2 AND month = $3",
                [dataJson, year, month]
            );
        } else {
            await db.query(
                "INSERT INTO schedule (year, month, data_json) VALUES ($1, $2, $3)",
                [year, month, dataJson]
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Schedule POST error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}

// DELETE: Clear schedule for given year/month (admin only)
export async function DELETE(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const year = parseInt(searchParams.get("year") || "0");
        const month = parseInt(searchParams.get("month") || "0");

        if (!year || !month) {
            return NextResponse.json({ error: "년/월을 지정해주세요." }, { status: 400 });
        }

        const db = await getDb();
        await db.query("DELETE FROM schedule WHERE year = $1 AND month = $2", [year, month]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Schedule DELETE error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
