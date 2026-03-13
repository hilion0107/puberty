import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

// 관리자 인증 확인 헬퍼
async function isAuthenticated(): Promise<boolean> {
    const user = await getAuthUser();
    return !!user;
}

// POST: 문진표 제출 (환자용 - 인증 불필요)
export async function POST(req: NextRequest) {
    try {
        const { name, gender, birth_date, privacy_consent, category, responses } = await req.json();

        if (!name || !gender || !birth_date || !category) {
            return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
        }

        if (!privacy_consent) {
            return NextResponse.json({ error: "개인정보 활용에 동의해주세요." }, { status: 400 });
        }

        const db = await getDb();

        // 테이블 존재 여부 보장 (Vercel 서버리스 환경 대응)
        await db.query(`
            CREATE TABLE IF NOT EXISTS questionnaires (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                gender VARCHAR(10) NOT NULL,
                birth_date VARCHAR(20) NOT NULL,
                privacy_consent BOOLEAN DEFAULT false,
                category VARCHAR(50) NOT NULL,
                responses JSONB NOT NULL DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const result = await db.query(
            `INSERT INTO questionnaires (name, gender, birth_date, privacy_consent, category, responses)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [name, gender, birth_date, privacy_consent, category, JSON.stringify(responses)]
        );

        return NextResponse.json({ success: true, message: "문진표가 제출되었습니다.", id: result.rows[0].id });
    } catch (error) {
        console.error("문진표 제출 오류:", error);
        return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}

// GET: 문진표 목록 조회 (관리자용)
export async function GET() {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
        }

        const db = await getDb();
        const result = await db.query(
            `SELECT id, name, gender, birth_date, privacy_consent, category, responses, created_at
             FROM questionnaires ORDER BY created_at DESC`
        );

        return NextResponse.json({ questionnaires: result.rows });
    } catch (error) {
        console.error("문진표 조회 오류:", error);
        return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}

// DELETE: 문진표 삭제 (관리자용)
export async function DELETE(req: NextRequest) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
        }

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "삭제할 문진표 ID가 필요합니다." }, { status: 400 });
        }

        const db = await getDb();
        await db.query("DELETE FROM questionnaires WHERE id = $1", [id]);

        return NextResponse.json({ success: true, message: "문진표가 삭제되었습니다." });
    } catch (error) {
        console.error("문진표 삭제 오류:", error);
        return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}

// PUT: 문진표 수정 (관리자 또는 환자 본인)
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, responses, name, gender, birth_date, category, privacy_consent } = body;

        if (!id) {
            return NextResponse.json({ error: "수정할 문진표 ID가 필요합니다." }, { status: 400 });
        }

        // 보안 패치: 환자의 수정 권리(privacy_consent 파라미터 기반 우회 로직) 제거
        // 오직 인증된 관리자만 문진표 데이터를 수정/업데이트할 수 있음
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
        }

        const db = await getDb();

        // 기본 정보 + 응답 모두 업데이트
        await db.query(
            `UPDATE questionnaires 
             SET responses = $1, name = COALESCE($2, name), gender = COALESCE($3, gender), 
                 birth_date = COALESCE($4, birth_date), category = COALESCE($5, category)
             WHERE id = $6`,
            [JSON.stringify(responses), name, gender, birth_date, category, id]
        );

        return NextResponse.json({ success: true, message: "문진표가 수정되었습니다." });
    } catch (error) {
        console.error("문진표 수정 오류:", error);
        return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
