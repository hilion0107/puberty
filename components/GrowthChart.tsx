"use client";

import { useMemo } from "react";
import { generatePercentileCurves } from "@/lib/growthPercentile";

interface DataPoint {
    ageMonths: number;
    height: number;
    label: string;
    color: string;
}

interface GrowthChartProps {
    gender: string;
    points: DataPoint[];
}

// 그래프 레이아웃 상수
const CHART_WIDTH = 700;
const CHART_HEIGHT = 572;
const PADDING = { top: 30, right: 30, bottom: 70, left: 55 };
const PLOT_W = CHART_WIDTH - PADDING.left - PADDING.right;
const PLOT_H = CHART_HEIGHT - PADDING.top - PADDING.bottom;

// 연령 범위: 3세(36개월) ~ 18세(216개월)
const AGE_MIN = 36;
const AGE_MAX = 216;

// 백분위 곡선 스타일 (무지개 색상, 흐리게)
const CURVE_STYLES: Record<number, { color: string; dash: string; width: number; label: boolean }> = {
    3: { color: "rgba(148, 103, 189, 0.45)", dash: "4,3", width: 1.2, label: true },   // 보라
    10: { color: "rgba(31, 119, 180, 0.45)", dash: "4,3", width: 1.2, label: true },   // 남
    25: { color: "rgba(44, 160, 44, 0.50)", dash: "2,2", width: 1.2, label: true },   // 초록
    50: { color: "rgba(214, 39, 40, 0.70)", dash: "", width: 2, label: true },      // 빨간 (중앙값, 더 진하게)
    75: { color: "rgba(255, 127, 14, 0.50)", dash: "2,2", width: 1.2, label: true },   // 주황
    90: { color: "rgba(188, 189, 34, 0.50)", dash: "4,3", width: 1.2, label: true },   // 노란
    97: { color: "rgba(227, 119, 194, 0.45)", dash: "4,3", width: 1.2, label: true },   // 분홍
};

export default function GrowthChart({ gender, points }: GrowthChartProps) {
    // 백분위 곡선 데이터 생성 (메모이제이션)
    const curves = useMemo(() => generatePercentileCurves(gender), [gender]);

    // Y축 범위 계산: 3백분위 최소값 ~ 97백분위 최대값에서 약간의 여유
    const yRange = useMemo(() => {
        const all3 = curves[3] || [];
        const all97 = curves[97] || [];
        let minH = all3.length > 0 ? all3[0].height : 80;
        let maxH = all97.length > 0 ? all97[all97.length - 1].height : 190;

        // 포인트도 범위에 포함
        for (const p of points) {
            if (p.height < minH) minH = p.height;
            if (p.height > maxH) maxH = p.height;
        }

        // 5cm 단위로 둥글게 조정
        const yMin = Math.floor((minH - 5) / 5) * 5;
        const yMax = Math.ceil((maxH + 5) / 5) * 5;
        return { yMin, yMax };
    }, [curves, points]);

    // 좌표 변환 함수
    const xScale = (ageMonths: number) =>
        PADDING.left + ((ageMonths - AGE_MIN) / (AGE_MAX - AGE_MIN)) * PLOT_W;
    const yScale = (height: number) =>
        PADDING.top + PLOT_H - ((height - yRange.yMin) / (yRange.yMax - yRange.yMin)) * PLOT_H;

    // 곡선을 SVG path로 변환
    const curvePath = (data: { ageMonths: number; height: number }[]) => {
        if (data.length === 0) return "";
        return data
            .map((d, i) => `${i === 0 ? "M" : "L"}${xScale(d.ageMonths).toFixed(1)},${yScale(d.height).toFixed(1)}`)
            .join(" ");
    };

    // Y축 눈금 생성 (10cm 간격 주 눈금, 5cm 간격 보조 눈금)
    const yTicks: { value: number; major: boolean }[] = [];
    for (let h = yRange.yMin; h <= yRange.yMax; h += 5) {
        yTicks.push({ value: h, major: h % 10 === 0 });
    }

    // X축 눈금 생성 (12개월 = 1세 간격 주 눈금, 2개월 간격 보조 눈금)
    const xTicksMajor: number[] = [];
    const xTicksMinor: number[] = [];
    for (let m = AGE_MIN; m <= AGE_MAX; m += 2) {
        if (m % 12 === 0) {
            xTicksMajor.push(m);
        } else {
            xTicksMinor.push(m);
        }
    }

    const chartTitle = gender === "여자" ? "여아 키 성장도표 (3~18세)" : "남아 키 성장도표 (3~18세)";
    const bgGradient = gender === "여자" ? ["#FFF7ED", "#FEF3C7"] : ["#EFF6FF", "#DBEAFE"];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-black text-emerald-600 mb-3">📈 성장 그래프</h3>
            <div className="overflow-x-auto">
                <svg
                    viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                    className="w-full max-w-[700px] mx-auto"
                    style={{ minWidth: "500px" }}
                >
                    {/* 배경 그라데이션 */}
                    <defs>
                        <linearGradient id="chartBg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={bgGradient[0]} />
                            <stop offset="100%" stopColor={bgGradient[1]} />
                        </linearGradient>
                    </defs>

                    {/* 차트 배경 */}
                    <rect
                        x={PADDING.left} y={PADDING.top}
                        width={PLOT_W} height={PLOT_H}
                        fill="url(#chartBg)"
                        rx="4"
                    />

                    {/* 제목 */}
                    <text
                        x={CHART_WIDTH / 2} y={18}
                        textAnchor="middle"
                        className="text-[13px] font-bold"
                        fill="#1E293B"
                    >
                        {chartTitle}
                    </text>

                    {/* Y축 그리드 + 라벨 */}
                    {yTicks.map(({ value, major }) => (
                        <g key={`y-${value}`}>
                            <line
                                x1={PADDING.left} y1={yScale(value)}
                                x2={PADDING.left + PLOT_W} y2={yScale(value)}
                                stroke={major ? "#E2E8F0" : "#F1F5F9"}
                                strokeWidth={major ? 1 : 0.5}
                            />
                            {major && (
                                <text
                                    x={PADDING.left - 8} y={yScale(value) + 4}
                                    textAnchor="end"
                                    fill="#94A3B8"
                                    className="text-[10px]"
                                >
                                    {value}
                                </text>
                            )}
                        </g>
                    ))}

                    {/* X축 그리드 + 라벨 */}
                    {xTicksMinor.map((m) => (
                        <line
                            key={`xm-${m}`}
                            x1={xScale(m)} y1={PADDING.top}
                            x2={xScale(m)} y2={PADDING.top + PLOT_H}
                            stroke="#F1F5F9"
                            strokeWidth={0.5}
                        />
                    ))}
                    {xTicksMajor.map((m) => (
                        <g key={`xM-${m}`}>
                            <line
                                x1={xScale(m)} y1={PADDING.top}
                                x2={xScale(m)} y2={PADDING.top + PLOT_H}
                                stroke="#E2E8F0"
                                strokeWidth={1}
                            />
                            <line
                                x1={xScale(m)} y1={PADDING.top + PLOT_H}
                                x2={xScale(m)} y2={PADDING.top + PLOT_H + 6}
                                stroke="#94A3B8"
                                strokeWidth={1}
                            />
                            <text
                                x={xScale(m)} y={PADDING.top + PLOT_H + 18}
                                textAnchor="middle"
                                fill="#64748B"
                                className="text-[10px]"
                            >
                                {m / 12}세
                            </text>
                        </g>
                    ))}

                    {/* 축 라벨 */}
                    <text
                        x={CHART_WIDTH / 2}
                        y={CHART_HEIGHT - 38}
                        textAnchor="middle"
                        fill="#64748B"
                        className="text-[11px] font-medium"
                    >
                        연령
                    </text>
                    <text
                        x={14}
                        y={PADDING.top + PLOT_H / 2}
                        textAnchor="middle"
                        fill="#64748B"
                        className="text-[11px] font-medium"
                        transform={`rotate(-90, 14, ${PADDING.top + PLOT_H / 2})`}
                    >
                        키 (cm)
                    </text>

                    {/* 백분위 곡선 */}
                    {Object.entries(CURVE_STYLES).map(([pStr, style]) => {
                        const p = Number(pStr);
                        const data = curves[p];
                        if (!data || data.length === 0) return null;
                        const d = curvePath(data);
                        const lastPt = data[data.length - 1];
                        return (
                            <g key={`curve-${p}`}>
                                <path
                                    d={d}
                                    fill="none"
                                    stroke={style.color}
                                    strokeWidth={style.width}
                                    strokeDasharray={style.dash}
                                />
                                {style.label && (
                                    <text
                                        x={xScale(lastPt.ageMonths) + 4}
                                        y={yScale(lastPt.height) + 3}
                                        fill={style.color}
                                        className="text-[8px] font-medium"
                                    >
                                        {p}%
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* 축 테두리 */}
                    <line
                        x1={PADDING.left} y1={PADDING.top}
                        x2={PADDING.left} y2={PADDING.top + PLOT_H}
                        stroke="#94A3B8" strokeWidth={1.5}
                    />
                    <line
                        x1={PADDING.left} y1={PADDING.top + PLOT_H}
                        x2={PADDING.left + PLOT_W} y2={PADDING.top + PLOT_H}
                        stroke="#94A3B8" strokeWidth={1.5}
                    />

                    {/* 데이터 포인트 */}
                    {points.map((pt, i) => {
                        const cx = xScale(pt.ageMonths);
                        const cy = yScale(pt.height);
                        // 범위 밖이면 표시 안 함
                        if (cx < PADDING.left || cx > PADDING.left + PLOT_W) return null;
                        if (cy < PADDING.top || cy > PADDING.top + PLOT_H) return null;
                        return (
                            <g key={`pt-${i}`}>
                                {/* 데이터 포인트 (테두리 없이 작은 점) */}
                                <circle cx={cx} cy={cy} r={3.2} fill={pt.color} />
                            </g>
                        );
                    })}

                    {/* 범례 */}
                    {points.length > 0 && (() => {
                        const legendY = CHART_HEIGHT - 18;
                        const totalItems = points.length;
                        const itemWidth = Math.min(160, PLOT_W / totalItems);
                        const startX = PADDING.left + (PLOT_W - itemWidth * totalItems) / 2;
                        return points.map((pt, i) => (
                            <g key={`legend-${i}`}>
                                <circle
                                    cx={startX + i * itemWidth + 6}
                                    cy={legendY}
                                    r={5}
                                    fill={pt.color}
                                    stroke="white"
                                    strokeWidth={1}
                                />
                                <text
                                    x={startX + i * itemWidth + 15}
                                    y={legendY + 3.5}
                                    fill="#475569"
                                    className="text-[9px]"
                                >
                                    {pt.label}
                                </text>
                            </g>
                        ));
                    })()}
                </svg>
            </div>
        </div>
    );
}
