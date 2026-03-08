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
        const db = await getDb();
        const { rows: admins } = await db.query(
            "SELECT id, username, admin_type, created_at FROM admins ORDER BY created_at ASC"
        );
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
        const { username, password, admin_type = '대표' } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
        }

        if (password.length < 4) {
            return NextResponse.json({ error: "비밀번호는 4자 이상이어야 합니다." }, { status: 400 });
        }

        const db = await getDb();
        const existingResult = await db.query(
            "SELECT id FROM admins WHERE username = $1",
            [username]
        );
        if (existingResult.rows.length > 0) {
            return NextResponse.json({ error: "이미 존재하는 아이디입니다." }, { status: 409 });
        }

        const passwordHash = hashPassword(password);
        await db.query(
            "INSERT INTO admins (username, password_hash, admin_type) VALUES ($1, $2, $3)",
            [username, passwordHash, admin_type]
        );

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

        const db = await getDb();
        const countRes = await db.query("SELECT COUNT(*) as count FROM admins");
        const count = parseInt(countRes.rows[0].count, 10);

        if (count <= 1) {
            return NextResponse.json({ error: "최소 1명의 관리자 계정이 필요합니다. 마지막 계정은 삭제할 수 없습니다." }, { status: 400 });
        }

        await db.query("DELETE FROM admins WHERE id = $1", [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Users DELETE error:", error);
    }
}

// PUT: Update admin (admin only)
export async function PUT(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const { id, password, admin_type } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "수정할 관리자 ID가 필요합니다." }, { status: 400 });
        }

        const db = await getDb();

        if (password) {
            if (password.length < 4) {
                return NextResponse.json({ error: "비밀번호는 4자 이상이어야 합니다." }, { status: 400 });
            }
            const passwordHash = hashPassword(password);
            await db.query(
                "UPDATE admins SET password_hash = $1, admin_type = $2 WHERE id = $3",
                [passwordHash, admin_type || '대표', id]
            );
        } else {
            await db.query(
                "UPDATE admins SET admin_type = $1 WHERE id = $2",
                [admin_type || '대표', id]
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Users PUT error:", error);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
