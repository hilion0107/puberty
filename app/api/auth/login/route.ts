import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { comparePassword, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: "아이디와 비밀번호를 입력해주세요." },
                { status: 400 }
            );
        }

        const db = await getDb();
        const result = await db.query(
            "SELECT * FROM admins WHERE username = $1",
            [username]
        );
        const admin = result.rows[0] as { id: number; username: string; password_hash: string; auto_logout_minutes?: number } | undefined;

        if (!admin || !comparePassword(password, admin.password_hash)) {
            return NextResponse.json(
                { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
                { status: 401 }
            );
        }

        const autoLogoutMinutes = admin.auto_logout_minutes || 60;
        const token = signToken(admin.id, admin.username, autoLogoutMinutes);

        const response = NextResponse.json({
            success: true,
            user: { id: admin.id, username: admin.username, autoLogoutMinutes: autoLogoutMinutes },
        });

        response.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
