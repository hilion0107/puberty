import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { analyzeScheduleImage } from "@/lib/gemini";

// POST: Upload image and analyze with Gemini OCR
export async function POST(request: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("image") as File | null;
        const year = parseInt(formData.get("year") as string || "0");
        const month = parseInt(formData.get("month") as string || "0");

        if (!file) {
            return NextResponse.json({ error: "이미지 파일을 업로드해주세요." }, { status: 400 });
        }

        if (!year || !month) {
            return NextResponse.json({ error: "년/월을 지정해주세요." }, { status: 400 });
        }

        // Read the image buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = buffer.toString("base64");
        const mimeType = file.type || 'image/jpeg';

        // Analyze with Gemini directly using base64
        const result = await analyzeScheduleImage(base64Image, mimeType, year, month);

        return NextResponse.json({
            success: true,
            data: result,
            imagePath: `data:${mimeType};base64,${base64Image}`,
        });
    } catch (error) {
        console.error("Schedule OCR error:", error);
        const message = error instanceof Error ? error.message : "서버 오류";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
