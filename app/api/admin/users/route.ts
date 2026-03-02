import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser, hashPassword } from "@/lib/auth";

// GET: List all admins (admin only)
export async function GET() {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const db = getDb();
        const admins = db
            .prepare("SELECT id, username, created_at FROM admins ORDER BY created_at ASC")
            .all();
        return NextResponse.json({ admins });
    } catch (error) {
        console.error("Users GET error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}

// POST: Add new admin (admin only)
export async function POST(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
        }

        if (password.length < 4) {
            return NextResponse.json({ error: "비밀번호는 4자 이상이어야 합니다." }, { status: 400 });
        }

        const db = getDb();
        const existing = db.prepare("SELECT id FROM admins WHERE username = ?").get(username);
        if (existing) {
            return NextResponse.json({ error: "이미 존재하는 아이디입니다." }, { status: 409 });
        }

        const passwordHash = hashPassword(password);
        db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run(username, passwordHash);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Users POST error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}

// DELETE: Remove admin (admin only)
export async function DELETE(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "삭제할 관리자 ID가 필요합니다." }, { status: 400 });
        }

        const db = getDb();
        const countResult = db.prepare("SELECT COUNT(*) as count FROM admins").get() as { count: number };

        if (countResult.count <= 1) {
            return NextResponse.json({ error: "최소 1명의 관리자 계정이 필요합니다. 마지막 계정은 삭제할 수 없습니다." }, { status: 400 });
        }

        db.prepare("DELETE FROM admins WHERE id = ?").run(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Users DELETE error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
