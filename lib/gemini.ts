import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export interface ScheduleDayData {
    date: number;
    dayOfWeek: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
    am: string; // doctor abbreviations separated by /
    pm: string;
    isHoliday: boolean;
    holidayName?: string;
    isClosed?: boolean;
}

export interface OCRResult {
    year: number;
    month: number;
    days: ScheduleDayData[];
    doctors: { abbr: string; name: string; color: string }[];
}

export async function analyzeScheduleImage(
    base64Image: string,
    mimeType: string,
    year: number,
    month: number
): Promise<OCRResult> {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `이 이미지는 ${year}년 ${month}월의 병원 진료 시간표입니다.

이미지를 분석하여 다음 JSON 형식으로 정확하게 데이터를 추출해주세요:

{
  "doctors": [
    { "abbr": "약자", "name": "전체이름", "color": "hex색상코드" }
  ],
  "days": [
    {
      "date": 날짜(숫자),
      "dayOfWeek": 요일(0=월,1=화,2=수,3=목,4=금,5=토,6=일),
      "am": "오전 진료 원장 약자들(슬래시로 구분, 예: 김/환/세)",
      "pm": "오후 진료 원장 약자들(슬래시로 구분)",
      "isHoliday": 공휴일여부(boolean),
      "holidayName": "공휴일이름(있으면)",
      "isClosed": 휴진여부(boolean)
    }
  ]
}

중요 규칙:
1. 각 원장의 약자, 이름, 글자색(hex)을 정확히 추출하세요.
2. 이미지 하단의 범례(최: XXX원장님 / 김: XXX원장님 등)를 참고하세요.
3. 각 날짜의 오전(AM)/오후(PM) 진료 원장을 정확히 기입하세요.
4. 휴진(휴 진)인 날은 "isClosed": true로 설정하세요.
5. 공휴일(빨간색 날짜, 대체 휴일 등)은 "isHoliday": true, "holidayName"에 이름을 넣어주세요.
6. ${year}년 ${month}월의 모든 날짜(1일~마지막날)를 포함해주세요. 이미지에 없는 일요일도 dayOfWeek: 6으로 추가하고 isClosed: true로 설정하세요.
7. JSON만 반환하세요. 다른 텍스트는 포함하지 마세요.`;

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                mimeType,
                data: base64Image,
            },
        },
    ]);

    const text = result.response.text();

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
    }

    try {
        const parsed = JSON.parse(jsonStr);
        return {
            year,
            month,
            doctors: parsed.doctors || [],
            days: parsed.days || [],
        };
    } catch {
        console.error("Failed to parse Gemini response:", text);
        throw new Error("Gemini 응답을 파싱하는 데 실패했습니다. 이미지를 다시 확인해주세요.");
    }
}
