import { sha256 } from "oslo/crypto";
import { base32, encodeHex } from "oslo/encoding";
import { type Session, db } from "$lib/server/db";
import { users, userSessions } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = base32.encode(bytes);
	return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
	const sessionId = encodeHex(await sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
	};
	await db.insert(userSessions).values(session);
	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHex(await sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({ user: { id: users.id, email: users.email }, session: userSessions })
		.from(userSessions)
		.innerJoin(users, eq(userSessions.userId, users.id))
		.where(eq(userSessions.id, sessionId));
	if (result.length < 1) return { session: null, user: null };

	const { user, session } = result[0];
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(userSessions).where(eq(userSessions.id, session.id));
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(userSessions)
			.set({ expiresAt: session.expiresAt })
			.where(eq(userSessions.id, session.id));
	}

	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(userSessions).where(eq(userSessions.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set("auth_session", token, {
		httpOnly: true,
		sameSite: "lax",
		secure: env.ENVIRONMENT === "prod",
		expires: expiresAt,
		path: "/",
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set("auth_session", "", {
		httpOnly: true,
		sameSite: "lax",
		secure: env.ENVIRONMENT === "prod",
		maxAge: 0,
		path: "/",
	});
}

export type SessionValidationResult = {
	session: Session | null;
	user: { id: string; email: string } | null;
};
