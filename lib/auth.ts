import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "woori-admin-secret-key-2024";
const TOKEN_EXPIRY = "24h";
const COOKIE_NAME = "admin_token";

export interface TokenPayload {
    userId: number;
    username: string;
    autoLogoutMinutes: number;
}

export function signToken(userId: number, username: string, autoLogoutMinutes: number): string {
    return jwt.sign({ userId, username, autoLogoutMinutes } as TokenPayload, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
    });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
        return null;
    }
}

export function hashPassword(password: string): string {
    return bcryptjs.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
    return bcryptjs.compareSync(password, hash);
}

export async function getAuthUser(): Promise<TokenPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}

export { COOKIE_NAME };
