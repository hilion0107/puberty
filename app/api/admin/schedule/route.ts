import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

// GET: Retrieve schedule for given year/month (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = parseInt(searchParams.get("year") || "0");
        const month = parseInt(searchParams.get("month") || "0");
        const all = searchParams.get("all") === "true";

        const db = getDb();

        if (all) {
            // Return all schedules
            const schedules = db.prepare("SELECT * FROM schedule ORDER BY year DESC, month DESC").all() as { id: number; year: number; month: number; data_json: string; updated_at: string }[];
            return NextResponse.json({
                data: schedules.map((s) => ({
                    ...JSON.parse(s.data_json),
                    updatedAt: s.updated_at,
                })),
            });
        } else if (year && month) {
            // Specific month
            const schedule = db
                .prepare("SELECT * FROM schedule WHERE year = ? AND month = ?")
                .get(year, month) as { id: number; year: number; month: number; data_json: string; updated_at: string } | undefined;

            if (!schedule) {
                return NextResponse.json({ data: null });
            }

            return NextResponse.json({
                data: JSON.parse(schedule.data_json),
                updatedAt: schedule.updated_at,
            });
        } else {
            // Latest schedule
            const schedule = db
                .prepare("SELECT * FROM schedule ORDER BY year DESC, month DESC LIMIT 1")
                .get() as { id: number; year: number; month: number; data_json: string; updated_at: string } | undefined;

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
        const db = getDb();

        // Upsert
        const existing = db
            .prepare("SELECT id FROM schedule WHERE year = ? AND month = ?")
            .get(year, month);

        if (existing) {
            db.prepare("UPDATE schedule SET data_json = ?, updated_at = datetime('now') WHERE year = ? AND month = ?")
                .run(dataJson, year, month);
        } else {
            db.prepare("INSERT INTO schedule (year, month, data_json) VALUES (?, ?, ?)")
                .run(year, month, dataJson);
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

        const db = getDb();
        db.prepare("DELETE FROM schedule WHERE year = ? AND month = ?").run(year, month);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Schedule DELETE error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
