/**
 * 한국 소아청소년 성장도표 2017 기준 백분위수 계산 유틸리티
 * 
 * 데이터 출처: 질병관리청 & 대한소아청소년과학회 - 2017 소아청소년 성장도표
 * LMS 방법(Box-Cox 변환)을 사용하여 Z-score를 구하고 정규분포 CDF로 백분위수를 계산합니다.
 * 
 * 0~35개월: WHO 2006 Child Growth Standards 기반
 * 3~18세: 한국 1997/2005 실측 데이터 기반
 */

// LMS 파라미터 타입: [L(Box-Cox power), M(Median), S(CV)]
type LMSEntry = [number, number, number];

// 월령(months)을 키로 하는 LMS 테이블
type LMSTable = Record<number, LMSEntry>;

// ═══════════════════════════════════════════
// 남아 키(cm) - 연령별 LMS 파라미터
// ═══════════════════════════════════════════
const HEIGHT_BOYS: LMSTable = {
    // 0~35개월 (WHO 2006 기준)
    0: [-0.3521, 49.88, 0.03795],
    1: [-0.3521, 54.72, 0.03557],
    2: [-0.3521, 58.42, 0.03424],
    3: [-0.3521, 61.42, 0.03328],
    4: [-0.3521, 63.89, 0.03257],
    5: [-0.3521, 65.90, 0.03204],
    6: [-0.3521, 67.62, 0.03165],
    7: [-0.3521, 69.16, 0.03139],
    8: [-0.3521, 70.60, 0.03124],
    9: [-0.3521, 71.96, 0.03117],
    10: [-0.3521, 73.28, 0.03118],
    11: [-0.3521, 74.55, 0.03126],
    12: [-0.3521, 75.75, 0.03137],
    13: [-0.3521, 76.90, 0.03150],
    14: [-0.3521, 77.98, 0.03162],
    15: [-0.3521, 79.01, 0.03174],
    16: [-0.3521, 79.99, 0.03183],
    17: [-0.3521, 80.92, 0.03192],
    18: [-0.3521, 81.80, 0.03199],
    19: [-0.3521, 82.66, 0.03208],
    20: [-0.3521, 83.48, 0.03218],
    21: [-0.3521, 84.27, 0.03229],
    22: [-0.3521, 85.03, 0.03241],
    23: [-0.3521, 85.76, 0.03254],
    24: [-0.3521, 86.45, 0.03270],
    25: [-0.3521, 87.62, 0.03251],
    26: [-0.3521, 88.30, 0.03267],
    27: [-0.3521, 88.96, 0.03283],
    28: [-0.3521, 89.60, 0.03298],
    29: [-0.3521, 90.23, 0.03314],
    30: [-0.3521, 90.84, 0.03329],
    31: [-0.3521, 91.43, 0.03344],
    32: [-0.3521, 92.01, 0.03359],
    33: [-0.3521, 92.58, 0.03374],
    34: [-0.3521, 93.14, 0.03389],
    35: [-0.3521, 93.69, 0.03403],
    // 3~18세 (한국 2017 성장도표, 12개월 간격으로 데이터 제공, 중간값은 보간)
    36: [-0.3521, 95.97, 0.03817],
    48: [-0.3521, 102.91, 0.03904],
    60: [-0.3521, 109.59, 0.03981],
    72: [-0.3521, 115.72, 0.04070],
    84: [-0.3521, 121.74, 0.04170],
    96: [-0.3521, 127.30, 0.04280],
    108: [-0.3521, 132.61, 0.04390],
    120: [-0.3521, 137.85, 0.04510],
    132: [-0.3521, 143.53, 0.04560],
    144: [-0.3521, 150.78, 0.04430],
    156: [-0.3521, 158.28, 0.04160],
    168: [-0.3521, 164.64, 0.03870],
    180: [-0.3521, 168.56, 0.03650],
    192: [-0.3521, 170.68, 0.03530],
    204: [-0.3521, 171.63, 0.03480],
    216: [-0.3521, 172.02, 0.03460],
};

// ═══════════════════════════════════════════
// 여아 키(cm) - 연령별 LMS 파라미터
// ═══════════════════════════════════════════
const HEIGHT_GIRLS: LMSTable = {
    0: [-0.3521, 49.15, 0.03790],
    1: [-0.3521, 53.69, 0.03561],
    2: [-0.3521, 57.07, 0.03444],
    3: [-0.3521, 59.80, 0.03328],
    4: [-0.3521, 62.08, 0.03243],
    5: [-0.3521, 63.98, 0.03169],
    6: [-0.3521, 65.73, 0.03119],
    7: [-0.3521, 67.29, 0.03083],
    8: [-0.3521, 68.74, 0.03058],
    9: [-0.3521, 70.11, 0.03044],
    10: [-0.3521, 71.43, 0.03039],
    11: [-0.3521, 72.69, 0.03042],
    12: [-0.3521, 73.90, 0.03051],
    13: [-0.3521, 75.05, 0.03063],
    14: [-0.3521, 76.14, 0.03076],
    15: [-0.3521, 77.18, 0.03089],
    16: [-0.3521, 78.18, 0.03100],
    17: [-0.3521, 79.13, 0.03108],
    18: [-0.3521, 80.04, 0.03114],
    19: [-0.3521, 80.91, 0.03121],
    20: [-0.3521, 81.74, 0.03129],
    21: [-0.3521, 82.53, 0.03139],
    22: [-0.3521, 83.29, 0.03150],
    23: [-0.3521, 84.03, 0.03162],
    24: [-0.3521, 84.73, 0.03177],
    25: [-0.3521, 85.73, 0.03203],
    26: [-0.3521, 86.41, 0.03220],
    27: [-0.3521, 87.07, 0.03237],
    28: [-0.3521, 87.72, 0.03254],
    29: [-0.3521, 88.35, 0.03271],
    30: [-0.3521, 88.97, 0.03288],
    31: [-0.3521, 89.57, 0.03304],
    32: [-0.3521, 90.16, 0.03321],
    33: [-0.3521, 90.73, 0.03337],
    34: [-0.3521, 91.29, 0.03353],
    35: [-0.3521, 91.85, 0.03369],
    36: [-0.3521, 95.08, 0.03900],
    48: [-0.3521, 102.24, 0.03990],
    60: [-0.3521, 108.84, 0.04090],
    72: [-0.3521, 114.94, 0.04200],
    84: [-0.3521, 120.86, 0.04330],
    96: [-0.3521, 126.72, 0.04470],
    108: [-0.3521, 132.71, 0.04590],
    120: [-0.3521, 139.47, 0.04580],
    132: [-0.3521, 146.65, 0.04400],
    144: [-0.3521, 152.72, 0.04100],
    156: [-0.3521, 156.69, 0.03810],
    168: [-0.3521, 158.72, 0.03600],
    180: [-0.3521, 159.67, 0.03490],
    192: [-0.3521, 160.02, 0.03440],
    204: [-0.3521, 160.18, 0.03420],
    216: [-0.3521, 160.23, 0.03410],
};

// ═══════════════════════════════════════════
// 남아 몸무게(kg) - 연령별 LMS 파라미터
// ═══════════════════════════════════════════
const WEIGHT_BOYS: LMSTable = {
    0: [-0.3521, 3.35, 0.14602],
    1: [-0.3521, 4.47, 0.13395],
    2: [-0.3521, 5.57, 0.12385],
    3: [-0.3521, 6.38, 0.11727],
    4: [-0.3521, 7.00, 0.11316],
    5: [-0.3521, 7.51, 0.10980],
    6: [-0.3521, 7.93, 0.10652],
    7: [-0.3521, 8.30, 0.10358],
    8: [-0.3521, 8.62, 0.10087],
    9: [-0.3521, 8.90, 0.09834],
    10: [-0.3521, 9.16, 0.09596],
    11: [-0.3521, 9.41, 0.09371],
    12: [-0.3521, 9.65, 0.09160],
    13: [-0.3521, 9.87, 0.08964],
    14: [-0.3521, 10.08, 0.08788],
    15: [-0.3521, 10.29, 0.08629],
    16: [-0.3521, 10.49, 0.08487],
    17: [-0.3521, 10.68, 0.08362],
    18: [-0.3521, 10.87, 0.08254],
    19: [-0.3521, 11.05, 0.08161],
    20: [-0.3521, 11.23, 0.08080],
    21: [-0.3521, 11.40, 0.08011],
    22: [-0.3521, 11.57, 0.07950],
    23: [-0.3521, 11.74, 0.07896],
    24: [-0.3521, 11.91, 0.07848],
    25: [-0.3521, 12.23, 0.08580],
    26: [-0.3521, 12.42, 0.08580],
    27: [-0.3521, 12.61, 0.08590],
    28: [-0.3521, 12.80, 0.08610],
    29: [-0.3521, 12.99, 0.08640],
    30: [-0.3521, 13.17, 0.08680],
    31: [-0.3521, 13.35, 0.08730],
    32: [-0.3521, 13.53, 0.08780],
    33: [-0.3521, 13.71, 0.08840],
    34: [-0.3521, 13.89, 0.08910],
    35: [-0.3521, 14.07, 0.08980],
    36: [-0.3521, 14.55, 0.09720],
    48: [-0.3521, 16.70, 0.10510],
    60: [-0.3521, 19.09, 0.11420],
    72: [-0.3521, 21.65, 0.12420],
    84: [-0.3521, 24.54, 0.13500],
    96: [-0.3521, 27.76, 0.14620],
    108: [-0.3521, 31.41, 0.15670],
    120: [-0.3521, 35.58, 0.16560],
    132: [-0.3521, 40.32, 0.17150],
    144: [-0.3521, 45.89, 0.17340],
    156: [-0.3521, 51.72, 0.17070],
    168: [-0.3521, 57.06, 0.16480],
    180: [-0.3521, 61.17, 0.15820],
    192: [-0.3521, 63.89, 0.15280],
    204: [-0.3521, 65.55, 0.14880],
    216: [-0.3521, 66.53, 0.14620],
};

// ═══════════════════════════════════════════
// 여아 몸무게(kg) - 연령별 LMS 파라미터
// ═══════════════════════════════════════════
const WEIGHT_GIRLS: LMSTable = {
    0: [-0.3521, 3.23, 0.14171],
    1: [-0.3521, 4.18, 0.13724],
    2: [-0.3521, 5.13, 0.12756],
    3: [-0.3521, 5.85, 0.11865],
    4: [-0.3521, 6.42, 0.11276],
    5: [-0.3521, 6.90, 0.10798],
    6: [-0.3521, 7.30, 0.10395],
    7: [-0.3521, 7.64, 0.10060],
    8: [-0.3521, 7.95, 0.09770],
    9: [-0.3521, 8.23, 0.09508],
    10: [-0.3521, 8.48, 0.09261],
    11: [-0.3521, 8.73, 0.09029],
    12: [-0.3521, 8.95, 0.08812],
    13: [-0.3521, 9.17, 0.08614],
    14: [-0.3521, 9.37, 0.08433],
    15: [-0.3521, 9.57, 0.08270],
    16: [-0.3521, 9.76, 0.08124],
    17: [-0.3521, 9.95, 0.07993],
    18: [-0.3521, 10.13, 0.07878],
    19: [-0.3521, 10.31, 0.07778],
    20: [-0.3521, 10.49, 0.07691],
    21: [-0.3521, 10.66, 0.07615],
    22: [-0.3521, 10.83, 0.07549],
    23: [-0.3521, 11.00, 0.07491],
    24: [-0.3521, 11.17, 0.07440],
    25: [-0.3521, 11.58, 0.08730],
    26: [-0.3521, 11.78, 0.08760],
    27: [-0.3521, 11.97, 0.08800],
    28: [-0.3521, 12.17, 0.08850],
    29: [-0.3521, 12.36, 0.08910],
    30: [-0.3521, 12.55, 0.08980],
    31: [-0.3521, 12.74, 0.09050],
    32: [-0.3521, 12.93, 0.09130],
    33: [-0.3521, 13.12, 0.09220],
    34: [-0.3521, 13.31, 0.09310],
    35: [-0.3521, 13.50, 0.09410],
    36: [-0.3521, 14.04, 0.10240],
    48: [-0.3521, 16.18, 0.11350],
    60: [-0.3521, 18.50, 0.12590],
    72: [-0.3521, 20.99, 0.13890],
    84: [-0.3521, 23.74, 0.15180],
    96: [-0.3521, 26.92, 0.16390],
    108: [-0.3521, 30.72, 0.17350],
    120: [-0.3521, 35.07, 0.17930],
    132: [-0.3521, 39.70, 0.18070],
    144: [-0.3521, 44.66, 0.17720],
    156: [-0.3521, 49.01, 0.17050],
    168: [-0.3521, 52.20, 0.16250],
    180: [-0.3521, 54.18, 0.15500],
    192: [-0.3521, 55.34, 0.14920],
    204: [-0.3521, 55.93, 0.14530],
    216: [-0.3521, 56.22, 0.14300],
};

/**
 * 표준정규분포 CDF 근사 (Abramowitz & Stegun)
 * z-score를 입력하면 0~1 사이의 확률값을 반환
 */
function normalCDF(z: number): number {
    if (z < -6) return 0;
    if (z > 6) return 1;

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    const x = Math.abs(z) / Math.sqrt(2);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1.0 + sign * y);
}

/**
 * LMS 방법으로 Z-score 계산
 * Z = ((value / M)^L - 1) / (L * S)  (L ≠ 0)
 * Z = ln(value / M) / S              (L = 0)
 */
function calculateZScore(value: number, L: number, M: number, S: number): number {
    if (Math.abs(L) < 0.0001) {
        return Math.log(value / M) / S;
    }
    return (Math.pow(value / M, L) - 1) / (L * S);
}

/**
 * LMS 테이블에서 해당 월령의 LMS 값을 보간하여 반환
 * 정확한 월령 데이터가 없으면 가장 가까운 두 월령 사이에서 선형 보간
 */
function interpolateLMS(table: LMSTable, ageMonths: number): LMSEntry | null {
    // 정확히 있으면 그대로 반환
    if (table[ageMonths]) return table[ageMonths];

    // 테이블의 모든 월령을 숫자 배열로 정리
    const months = Object.keys(table).map(Number).sort((a, b) => a - b);

    // 범위 밖이면 가장 가까운 값 사용
    if (ageMonths <= months[0]) return table[months[0]];
    if (ageMonths >= months[months.length - 1]) return table[months[months.length - 1]];

    // 선형 보간
    let lower = months[0];
    let upper = months[months.length - 1];
    for (let i = 0; i < months.length - 1; i++) {
        if (months[i] <= ageMonths && months[i + 1] >= ageMonths) {
            lower = months[i];
            upper = months[i + 1];
            break;
        }
    }

    const ratio = (ageMonths - lower) / (upper - lower);
    const lmsLower = table[lower];
    const lmsUpper = table[upper];

    return [
        lmsLower[0] + ratio * (lmsUpper[0] - lmsLower[0]),
        lmsLower[1] + ratio * (lmsUpper[1] - lmsLower[1]),
        lmsLower[2] + ratio * (lmsUpper[2] - lmsLower[2]),
    ];
}

/**
 * 키 백분위수 계산
 * @param heightCm 키 (cm)
 * @param ageMonths 만나이 (개월)
 * @param gender "남자" | "여자"
 * @returns 백분위수 (0~100) 또는 null (계산 불가)
 */
export function getHeightPercentile(
    heightCm: number,
    ageMonths: number,
    gender: string
): number | null {
    if (!heightCm || heightCm <= 0 || ageMonths < 0) return null;

    const table = gender === "여자" ? HEIGHT_GIRLS : HEIGHT_BOYS;
    const lms = interpolateLMS(table, ageMonths);
    if (!lms) return null;

    const [L, M, S] = lms;
    const z = calculateZScore(heightCm, L, M, S);
    const percentile = normalCDF(z) * 100;

    return Math.round(percentile);
}

/**
 * 몸무게 백분위수 계산
 * @param weightKg 몸무게 (kg)
 * @param ageMonths 만나이 (개월)
 * @param gender "남자" | "여자"
 * @returns 백분위수 (0~100) 또는 null (계산 불가)
 */
export function getWeightPercentile(
    weightKg: number,
    ageMonths: number,
    gender: string
): number | null {
    if (!weightKg || weightKg <= 0 || ageMonths < 0) return null;

    const table = gender === "여자" ? WEIGHT_GIRLS : WEIGHT_BOYS;
    const lms = interpolateLMS(table, ageMonths);
    if (!lms) return null;

    const [L, M, S] = lms;
    const z = calculateZScore(weightKg, L, M, S);
    const percentile = normalCDF(z) * 100;

    return Math.round(percentile);
}

/**
 * 만나이를 총 개월 수로 계산
 * @param birthDate 생년월일 문자열 (예: "2023-02-15")
 * @param submitDate 제출일 문자열 (예: "2026-03-11T09:00:00Z")
 * @returns 총 개월 수
 */
export function getAgeInMonths(birthDate: string, submitDate: string): number {
    const birth = new Date(birthDate);
    const submit = new Date(submitDate);

    let months = (submit.getFullYear() - birth.getFullYear()) * 12 + (submit.getMonth() - birth.getMonth());
    if (submit.getDate() < birth.getDate()) {
        months--;
    }

    return Math.max(0, months);
}

/**
 * 표준정규분포 역함수 (Inverse CDF / Probit function)
 * 백분위수(0~1)를 Z-score로 변환
 * Rational approximation (Abramowitz & Stegun 26.2.23)
 */
function normalInverseCDF(p: number): number {
    if (p <= 0) return -6;
    if (p >= 1) return 6;

    if (p < 0.5) {
        return -rationalApprox(Math.sqrt(-2.0 * Math.log(p)));
    } else {
        return rationalApprox(Math.sqrt(-2.0 * Math.log(1.0 - p)));
    }
}

function rationalApprox(t: number): number {
    const c0 = 2.515517;
    const c1 = 0.802853;
    const c2 = 0.010328;
    const d1 = 1.432788;
    const d2 = 0.189269;
    const d3 = 0.001308;
    return t - (c0 + c1 * t + c2 * t * t) / (1.0 + d1 * t + d2 * t * t + d3 * t * t * t);
}

/**
 * Z-score와 LMS 파라미터로 실제 값(키 등)을 역산
 * value = M * (1 + L * S * Z)^(1/L)  (L ≠ 0)
 * value = M * exp(S * Z)             (L = 0)
 */
function zScoreToValue(z: number, L: number, M: number, S: number): number {
    if (Math.abs(L) < 0.0001) {
        return M * Math.exp(S * z);
    }
    return M * Math.pow(1 + L * S * z, 1 / L);
}

/**
 * 특정 월령, 성별에서 주어진 백분위수에 해당하는 키(cm) 반환
 * @param percentile 백분위수 (0~100)
 * @param ageMonths 월령
 * @param gender "남자" | "여자"
 * @returns 키 (cm) 또는 null
 */
export function getHeightFromPercentile(
    percentile: number,
    ageMonths: number,
    gender: string
): number | null {
    if (percentile <= 0 || percentile >= 100) return null;

    const table = gender === "여자" ? HEIGHT_GIRLS : HEIGHT_BOYS;
    const lms = interpolateLMS(table, ageMonths);
    if (!lms) return null;

    const [L, M, S] = lms;
    const z = normalInverseCDF(percentile / 100);
    const value = zScoreToValue(z, L, M, S);

    return Math.round(value * 10) / 10; // 소수점 1자리
}

/**
 * MPH (Mid-Parental Height, 중간부모키) 계산
 * 남자: (엄마키 + 아빠키) / 2 + 6.5
 * 여자: (엄마키 + 아빠키) / 2 - 6.5
 * @returns { mph: 중간부모키, percentile: 18세 기준 백분위수 } 또는 null
 */
export function calculateMPH(
    motherHeight: number,
    fatherHeight: number,
    gender: string
): { mph: number; percentile: number | null } | null {
    if (!motherHeight || !fatherHeight || motherHeight <= 0 || fatherHeight <= 0) return null;

    const mph = gender === "여자"
        ? (motherHeight + fatherHeight) / 2 - 6.5
        : (motherHeight + fatherHeight) / 2 + 6.5;

    const mphRounded = Math.round(mph * 10) / 10;
    // 성인(18세 = 216개월) 기준 백분위수
    const percentile = getHeightPercentile(mphRounded, 216, gender);

    return { mph: mphRounded, percentile };
}

/**
 * PAH (Predicted Adult Height, 예측 성인키) 계산
 * 1. 현재 키를 골연령 기준으로 백분위수 계산
 * 2. 그 백분위수에 해당하는 성인(18세) 키를 반환
 * @param heightCm 현재 키 (cm)
 * @param boneAgeMonths 골연령 (개월)
 * @param gender "남자" | "여자"
 * @returns { pah: 예측 성인키, percentile: 골연령 기준 백분위수 } 또는 null
 */
export function calculatePAH(
    heightCm: number,
    boneAgeMonths: number,
    gender: string
): { pah: number; percentile: number } | null {
    if (!heightCm || heightCm <= 0 || boneAgeMonths < 0) return null;

    // 골연령 기준으로 현재 키의 백분위수 계산
    const baPercentile = getHeightPercentile(heightCm, boneAgeMonths, gender);
    if (baPercentile === null || baPercentile <= 0 || baPercentile >= 100) return null;

    // 해당 백분위수의 성인(18세) 키
    const adultHeight = getHeightFromPercentile(baPercentile, 216, gender);
    if (adultHeight === null) return null;

    return { pah: adultHeight, percentile: baPercentile };
}

/**
 * 성장 그래프용 백분위 곡선 데이터 생성
 * 3~18세 구간에서 2개월 간격으로 각 백분위수에 해당하는 키를 계산
 * @param gender "남자" | "여자"
 * @returns 각 백분위수별 { ageMonths, height }[] 배열
 */
export function generatePercentileCurves(gender: string): Record<number, { ageMonths: number; height: number }[]> {
    const percentiles = [3, 10, 25, 50, 75, 90, 97];
    const result: Record<number, { ageMonths: number; height: number }[]> = {};

    for (const p of percentiles) {
        result[p] = [];
        // 36개월(3세)부터 216개월(18세)까지 2개월 간격
        for (let m = 36; m <= 216; m += 2) {
            const h = getHeightFromPercentile(p, m, gender);
            if (h !== null) {
                result[p].push({ ageMonths: m, height: h });
            }
        }
    }

    return result;
}
